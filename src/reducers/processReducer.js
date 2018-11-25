import * as types from '../constants/actionTypes/process';

const initialState = {
  assessSection: null,
  assessSubSection: null,
  questionSet: null,
  question: null,
  crquestion: null,
  unAnsweredQuestionUrl: null,
  mediaStatus: null,
  media: null
};

export default function processReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_ASSESS_SECTION:
      return Object.assign({}, state, {
        assessSection: action.res
      });
    case types.SET_ASSESS_SUB_SECTION:
      return Object.assign({}, state, {
        assessSubSection: action.res
      });
    case types.SET_QUESTION_SET:
      return Object.assign({}, state, {
        questionSet: action.res
      });
    case types.SET_CR_QUESTION_SET:
      return Object.assign({}, state, {
        questionSet: action.res
      });
    case types.SET_QUESTION:
      return Object.assign({}, state, {
        question: action.res
      });
    case types.SET_CR_QUESTION:
      return Object.assign({}, state, {
        crquestion: action.res
      });
    case types.SET_LAST_UNANSWERED_QUESTION_URL:
      return Object.assign({}, state, {
        unAnsweredQuestionUrl: action.questionURL
      });
    case types.MEDIA_GET_SUCCESS:
      return Object.assign({}, state, {
        media: action.media
      });
    case types.MEDIA_UPLOAD_SUCCESS:
      return Object.assign({}, state, {
        mediaStatus: action.url
      });
    default:
      return state;
  }
}
