import * as types from '../constants/actionTypes/notifications';

const initialState = {
  IS_ERROR: false,
  MSG_TYPE: types.DONT_SHOW,
  MESSAGE: null,
  IS_CONFIRM: false,
  IS_SINGLE_CONFIRM: false,
  notificationsUser: '',
  downloadFile: '',
  userNotifictionsActiveState: 'TODAY'
};

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case types.TRIGGER_NOTIFICATION:
      return Object.assign({}, state, {
        MSG_TYPE: types.SHOW_MSG,
        MESSAGE: action.msg,
        IS_ERROR: action.status,
        IS_CONFIRM: action.isConfirm,
        IS_SINGLE_CONFIRM: action.isSingleConfirm
      });

    case types.DONT_SHOW:
      return Object.assign({}, state, {
        MSG_TYPE: types.DONT_SHOW,
        MESSAGE: '',
        IS_ERROR: false
      });
    case types.GET_USER_NOTIFICATIONS_UNREAD_COUNT_SUCCESS:
      return Object.assign({}, state, {
        notificationsUserUnreadCount: action.res
      });
    case types.GET_USER_NOTIFICATIONS_SUCCESS:
      return Object.assign({}, state, {
        notificationsUser: action.res
      });
    case types.GET_USER_NOTIFICATIONS_ERROR:
      return Object.assign({}, state, {
        notificationsUser: []
      });
    case types.GET_DOWNLOAD_ERROR:
      return Object.assign({}, state, {
        downloadFile: action.res
      });
    case types.GET_DOWNLOAD_SUCCESS:
      return Object.assign({}, state, {
        downloadFile: action.res
      });
    case types.GET_USER_NOTIFICATIONS_ACTIVE:
      return Object.assign({}, state, {
        userNotifictionsActiveState: action.res
      });
    case types.SET_INTERVAL_ID_WELCOME:
      return Object.assign({}, state, {
        refreshIntervalIdWelcome: action.id
      });

    default:
      return state;
  }
}
