import { pushState } from 'redux-router';
import { config } from '../config/config';
import { renewToken } from '../actions/loginActions';
import { turnOfflineOn, turnOfflineOff } from '../actions/modalBlockActions';

const authToken = (store) => (next) => (action) => {
  const state = store.getState();
  const auth = state.authReducer.userAuth;
  const isFail = state.authReducer.tokenRefreshFail;
  const dispatch = store.dispatch;
  const actResErr = action.res || action.err;

  if (!auth.refresh_token) {
    return next(action);
  }


  // try to renegotiate the token
  if (!isFail && auth.refresh_token && action.type !== 'RENEW_TOKEN_ERROR' && action.type !== 'RENEW_TOKEN_SUCCESS' &&
      action.res && action.res.response &&
      (actResErr.response.status === 401 || actResErr.response.status === 403)) {
    auth.salt = config().salt;
    dispatch(renewToken(auth, config().salt));
  }

  if (actResErr && actResErr.response &&
    (actResErr.response.status === 401 || actResErr.response.status === 403)) {
    dispatch(pushState(false, config().logout));
  }

  return next(action);
};

const checkOnline = (store) => (next) => (action) => {
  const dispatch = store.dispatch;
  const state = store.getState();
  const currentOffLine = state.modalBlockReducer.offLine;

  if (action.type !== 'MODAL_OFFLINE_ON' && !navigator.onLine && !currentOffLine) {
    dispatch(turnOfflineOn());
  } else if (action.type !== 'MODAL_OFFLINE_OFF' && navigator.onLine && currentOffLine) {
    dispatch(turnOfflineOff());
  }
  return next(action);
};

const checkForServerError = (store) => (next) => (action) => {
  const dispatch = store.dispatch;
  if ((action.err && action.err.response && action.err.response.statusCode === 500) ||
      (action.res && action.res.status === 500)) {
    dispatch(pushState(false, '/errorpage'));
  }
  return next(action);
};


export { authToken, checkOnline, checkForServerError };
