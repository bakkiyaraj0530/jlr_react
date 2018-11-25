import * as types from '../constants/actionTypes/process.js';
import request from 'superagent';

import { config } from '../config/config';
import { insert, insertMultiRows } from './sqliteActions';
import { setCurrentWorkList } from './worklistActions';
import { getAssessmentReasons } from './createSDActions';
import { turnOn, turnOff } from './modalBlockActions';

function mediaGetSuccess(res) {
  return { type: types.MEDIA_GET_SUCCESS, media: res };
}

function mediaGetError() {
  return { type: types.MEDIA_GET_ERROR };
}

function getAssessSectionSuccess(res) {
  return { type: types.SET_ASSESS_SECTION, res };
}

function getAssessSubSectionSuccess(res) {
  return { type: types.SET_ASSESS_SUB_SECTION, res };
}

function getQuestionSetSuccess(res) {
  return { type: types.SET_QUESTION_SET, res };
}

function getCRQuestionSetSuccess(res) {
  return { type: types.SET_CR_QUESTION_SET, res };
}

function getQuestionSuccess(res) {
  return { type: types.SET_QUESTION, res };
}

function getCRQuestionSuccess(res) {
  return { type: types.SET_CR_QUESTION, res };
}

function doSuccess(action, result) {
  return (dispatch) => {
    switch (action) {
      case 'supplierdiagnosis':
      case 'getupdatedsd':
        dispatch(setCurrentWorkList(result));
        break;
      case 'assesssection':
        dispatch(getAssessSectionSuccess(result));
        break;
      case 'assesssubsection':
        dispatch(getAssessSubSectionSuccess(result));
        break;
      case 'questionset':
        dispatch(getQuestionSetSuccess(result));
        break;
      case 'question':
        dispatch(getQuestionSuccess(result));
        break;
      case 'crquestionset':
        dispatch(getCRQuestionSetSuccess(result));
        break;
      case 'crquestion':
        dispatch(getCRQuestionSuccess(result));
        break;
      default:
        break;
    }
  };
}

function getFromDB(url, action) {
  return (dispatch) => {
    document.addEventListener('deviceready', () => {
      window.db.transaction((tx) => {
        if (url === 'worklist') {
          tx.executeSql('SELECT * FROM worklist WHERE url LIKE \'%worklist%\'', [], (tx1, res) => {
            const data = [];
            for (let i = 0; i < res.rows.length; i++) {
              data[i] = JSON.parse(res.rows.item(i).json_response);
            }
            dispatch(doSuccess(action, data));
          }, (tx2, err) => {
            console.log(err);
          });
        } else {
          tx.executeSql('SELECT * FROM worklist WHERE url=?', [url], (tx1, res) => {
            let data = [];
            for (let i = 0; i < res.rows.length; i++) {
              data = res.rows.item(i).json_response;
            }
            data = JSON.parse(data);
            dispatch(doSuccess(action, data));
          });
        }
      });
    });
  };
}

export function get(url, action) {
  return (dispatch, getState) => {
    if (window.cordova) {
      dispatch(getFromDB(url, action));
    }
    if (window.navigator.onLine) {
      dispatch(turnOn());
      const auth = getState().authReducer.userAuth;
      request.get(config().baseUrl + config().SDApi + url)
      .type('json')
      .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .end((err, res) => {
        dispatch(turnOff());
        const response = JSON.parse(res.text);
        dispatch(doSuccess(action, response));
        dispatch(getAssessmentReasons(response.cmsAssessmentReasonVersion));
        if (window.cordova) {
          if (url === 'worklist') {
            dispatch(insertMultiRows('worklist', '(url, json_response)', url, response));
          } else {
            dispatch(insert('worklist', '(url, json_response)', url, [url, JSON.stringify(response)]));
          }
        }
      });
    }
  };
}

export function getMedia(url) {
  return (dispatch, getState) => {
    if (window.navigator.onLine) {
      dispatch(turnOn());
      const auth = getState().authReducer.userAuth;

      request.get(config().baseUrl + config().SDApi + url)
      .set({ 'Accept': 'application/json' })
      .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .set({ 'Content-Type': 'image/png;charset=UTF-8' })
      .end((err, res) => {
        dispatch(turnOff());
        if (err) {
          return dispatch(mediaGetError(err));
        }

        const mediaBase64 = 'data:image/png;base64,' + btoa(unescape(encodeURIComponent(res.text)));
        dispatch(mediaGetSuccess(mediaBase64));
      });
    }
  };
}

export function setLastUnAnsweredQuestionUrl(questionURL) {
  return { type: types.SET_LAST_UNANSWERED_QUESTION_URL, questionURL };
}

export function updateAnswerToWorklist(answerObj, sectionId, subSectionId) {
  return (dispatch, getState) => {
    if (!window.navigator.onLine && window.cordova) {
      const worklist = getState().worklistReducer.currentWorklist;
      let isAnswerExist = false;
      worklist.assessSections.map((assessSection) => {
        if (assessSection.subsectionNumber === subSectionId) {
          if (assessSection.answers && assessSection.answers.length > 0) {
            const answers = assessSection.answers;
            answers.map((answer) => {
              if (answer.questionNumber === answerObj.questionNumber) {
                answer.score = answerObj.score;
                answer.comments = answerObj.comments;
                isAnswerExist = true;
              }
            });
          } else {
            assessSection.answers = new Array();
          }
          if (!isAnswerExist) {
            assessSection.answers.push(answerObj);
          }
        }
      });
      const url = 'worklist/' + worklist.id;
      dispatch(insert('worklist', '(url, json_response)', '/worklist/', [url, JSON.stringify(worklist)]));
      dispatch(setCurrentWorkList(worklist));
    }
  };
}
