import * as types from '../constants/actionTypes/loginauth';
import request from 'superagent';
import cookie from 'react-cookie';
import { config } from '../config/config';

function loginSuccess(res) {
  return { type: types.LOGIN_USER_SUCCESS, res };
}

export function loginError(err) {
  return { type: types.LOGIN_USER_ERROR, err };
}

export function renewTokenError(err) {
  return { type: types.RENEW_TOKEN_ERROR, err };
}

export function renewTokenSuccess(err) {
  return { type: types.RENEW_TOKEN_SUCCESS, err };
}

function logoutSuccess(res) {
  return { type: types.LOGOUT_USER_SUCCESS, res };
}

export function setCleanMsg() {
  return { type: types.SET_CLEAN_MSG };
}

function setAuthToken(res) {
  return (dispatch) => {
    cookie.save('userAuth', res);
    dispatch(loginSuccess(res));
  };
}

function setUserProps(userData, resObj) {
  const date = new Date();
  const time = date.getTime();
  resObj.role = userData.staRole.toLowerCase();
  resObj.user = userData.userId;
  resObj.manufacturingSiteCode = userData.manufacturingSiteCode;
  resObj.emailAddress = userData.emailAddress;
  resObj.timeout = config().timeout + time;
  resObj.start = time;
  return resObj;
}

export function checkUser(callback) {
  return (dispatch, getState) => {
    const auth = getState().authReducer.userAuth || cookie.load('userAuth');
    if (auth) {
      dispatch(loginSuccess(auth));
      if (callback) {
        callback(auth);
      }
    } else {
      if (callback) {
        callback(false);
      }
    }
  };
}

export function unsetUser() {
  return (dispatch) => {
    const userAuth = false;
    cookie.remove('userAuth');
    dispatch(logoutSuccess(userAuth));
  };
}

export function getUserDetails(response) {
  return (dispatch) => {
    const resObj = JSON.parse(response.text);
    request.get(config().loginUrl + '/user/1/MyDetails')
    .set({ 'Authorization': 'Bearer ' + resObj.access_token })
    .end((err, res) => {
      if (err) {
        return dispatch(loginError(err));
      }
      const userData = JSON.parse(res.text);
      dispatch(setAuthToken(setUserProps(userData, resObj)));
    });
  };
}

export function renewToken(userData, salt) {
  return (dispatch) => {
    request.post(config().loginUrl + '/token')
    .type('form')
    .set({ 'Authorization': 'Basic ' + salt })
    .send({ 'grant_type': 'refresh_token', 'refresh_token': userData.refresh_token })
    .end((err, res) => {
      if (err) {
        return dispatch(renewTokenError(err));
      }
      dispatch(renewTokenSuccess());
      dispatch(getUserDetails(res));
    });
  };
}

// post username and password
export function authUser(username, password) {
  return (dispatch) => {
    request.post(config().loginUrl + '/token')
    .type('form')
    .set({ 'Authorization': 'Basic ' + config().salt })
    .send({ 'grant_type': 'password', 'username': username, 'password': password })
    .end((err, res) => {
      if (err) {
        return dispatch(loginError(err));
      }
      dispatch(getUserDetails(res));
    });
  };
}
