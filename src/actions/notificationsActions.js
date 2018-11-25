import { TRIGGER_NOTIFICATION, DONT_SHOW } from '../constants/actionTypes/notifications';
import * as types from '../constants/actionTypes/notifications';
import { config } from '../config/config';
import orderBy from 'lodash/orderBy';

import request from 'superagent';

export function dontShowPopup() {
  return { type: DONT_SHOW };
}

export function showConfirmPopup(message, isSingleConfirm) {
  return { type: TRIGGER_NOTIFICATION, msg: message, isConfirm: true, status: false, isSingleConfirm: isSingleConfirm };
}

function downloadexlSuccess(res) {
  return { type: types.GET_DOWNLOAD_SUCCESS, res };
}

function downloadexlError(err) {
  return { type: types.GET_USER_DOWNLOAD_ERROR, err };
}

function getUserNotificationsUnreadCountSuccess(res) {
  return { type: types.GET_USER_NOTIFICATIONS_UNREAD_COUNT_SUCCESS, res };
}

export function getUserNotificationsActive(res) {
  return { type: types.GET_USER_NOTIFICATIONS_ACTIVE, res };
}

function getUserNotificationsUnreadCountError(err) {
  return { type: types.GET_USER_NOTIFICATIONS_UNREAD_COUNT_ERROR, err };
}

function getUserNotificationsSuccess(res) {
  return { type: types.GET_USER_NOTIFICATIONS_SUCCESS, res };
}

function getUserNotificationsError(err) {
  return { type: types.GET_USER_NOTIFICATIONS_ERROR, err };
}

function markAsReadNotificationsError(err) {
  return { type: types.MARK_AS_READ_NOTIFICATIONS_ERROR, err };
}

// set XMLHttpRequest
function getXMLReqObj(url, type, auth) {
  const req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.setRequestHeader('Authorization', 'Bearer ' + auth.access_token);
  req.responseType = type;
  return req;
}

export function downloadexl(re, callback) {
  return (dispatch, getState) => {
    const url = config().baseUrl + config().SDApi + '/' + re + '/Report';
    const auth = getState().authReducer.userAuth;
    const req = getXMLReqObj(url, 'blob', auth);
    req.onreadystatechange = () => {
      if (req.readyState !== 4) {
        return dispatch(downloadexlError(req));
      }
      if (callback) {
        callback(req, re + ' eSD Blank Template.xls');
      }
      dispatch(downloadexlSuccess(req));
    };
    req.send(null);
  };
}

export function getUserNotificationsUnreadCount() {
  return (dispatch, getState) => {
    const auth = getState().authReducer.userAuth;
    request.get(config().baseUrl + config().notificationsApiUrl + 'count?status=unread')
        .set({ 'Authorization': 'Bearer ' + auth.access_token })
        .end((err, res) => {
          if (err) {
            return dispatch(getUserNotificationsUnreadCountError(err));
          }
          dispatch(getUserNotificationsUnreadCountSuccess(res.text));
        });
  };
}

export function getUserNotifications(status, onOrAfter) {
  return (dispatch, getState) => {
    const auth = getState().authReducer.userAuth;
    const queryString = onOrAfter ? '?status=' + status + '&onorafter=' + onOrAfter : '?status=' + status;
    request.get(config().baseUrl + config().notificationsApiUrl + queryString)
      .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .end((err, res) => {
        if (err) {
          return dispatch(getUserNotificationsError(err));
        }
        const resData = JSON.parse(res.text);
        const dispatchData = orderBy(resData, (o) => {
          if (resData && o.dateSent) {
            const dateSplit = (o.dateSent).split('/');
            return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]);
          }
        }, 'desc');
        dispatch(getUserNotificationsSuccess(dispatchData));
      });
  };
}

export function markAsReadNotifications(id, callback) {
  return (dispatch, getState) => {
    const auth = getState().authReducer.userAuth;
    request.put(config().baseUrl + config().notificationsApiUrl + 'id/' + id + '?action=markasread')
      .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .end((err) => {
        if (err) {
          return dispatch(markAsReadNotificationsError(err));
        }
        if (callback) {
          callback();
        }
      });
  };
}

export function setRefreshIntervalIdWelcome(id) {
  return { type: types.SET_INTERVAL_ID_WELCOME, id };
}
