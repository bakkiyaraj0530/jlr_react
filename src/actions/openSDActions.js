import * as types from '../constants/actionTypes/opensd';
import request from 'superagent';
import { config } from '../config/config';
import { turnOn, turnOff } from './modalBlockActions';

function updateSDSuccess(res) {
  return { type: types.UPDATE_SD_SUCCESS, res };
}

function onError(err) {
  return { type: types.SD_ERROR, err };
}

export function updateWorklist(sdId, sdDetails) {
  return (dispatch, getState) => {
    if (window.navigator.onLine) {
      dispatch(turnOn());
      const auth = getState().authReducer.userAuth;
      request.put(config().baseUrl + config().SDApi + '/' + sdId)
        .type('json')
        .set({ 'Accept': 'application/json' })
        .set({
          'Authorization': 'Bearer ' + auth.access_token
        })
        .send(sdDetails)
        .end((err, res) => {
          dispatch(turnOff());
          if (err) {
            dispatch(onError(err));
          }
          dispatch(updateSDSuccess(res));
        });
    }
  };
}

export function downloadCompleteReportsSummarySuccess(summaryReport) {
  return {
    type: types.DOWNLOAD_SUMMARY_REPORT_ONLINE_SUCCESS,
    summaryReport
  };
}

export function downloadCompleteReportsSummaryError(summaryReport) {
  return {
    type: types.DOWNLOAD_SUMMARY_REPORT_ONLINE_ERROR,
    summaryReport
  };
}

function getXMLReqObj(url, type, auth) {
  const req = new XMLHttpRequest();
  req.open('GET', url + '?type=summary', true);
  req.setRequestHeader('Authorization', 'Bearer ' + auth.access_token);
  req.responseType = type;
  return req;
}

export function downloadCompleteReportsSummary(sdid, callback) {
  return (dispatch, getState) => {
    const auth = getState().authReducer.userAuth;
    const url = config().baseUrl + config().SDApi + '/' + sdid + '/Report';
    const req = getXMLReqObj(url, 'blob', auth);
    req.onreadystatechange = () => {
      if (req.readyState !== 4) {
        return dispatch(downloadCompleteReportsSummaryError(req));
      }
      if (callback) {
        callback(req.response, sdid + '- STA_Summary_report.pdf');
      }
      dispatch(downloadCompleteReportsSummarySuccess(req));
    };
    req.send(null);
  };
}
