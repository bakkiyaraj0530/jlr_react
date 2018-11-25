import * as types from '../constants/actionTypes/loginauth';

const initialState = {
  userAuth: false,
};

export default function authReducer(state = initialState, action) {
  let data;
  switch (action.type) {
    case types.SET_CLEAN_MSG:
      return Object.assign({}, state, {
        message: {}
      });
    case types.LOGIN_USER_SUCCESS:
      data = action.res;
      return Object.assign({}, state, {
        userAuth: data
      });
    case types.LOGOUT_USER_SUCCESS:
      return Object.assign({}, state, {
        userAuth: {}
      });
    case types.LOGIN_USER_ERROR:
      data = action.err;
      return Object.assign({}, state, {
        message: {
          response: {
            text: 'Authentication error'
          },
          error: true
        }
      });
    case types.RENEW_TOKEN_ERROR:
      return Object.assign({}, state, {
        tokenRefreshFail: true
      });
    default:
      return state;
  }
}
