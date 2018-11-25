import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerStateReducer as router } from 'redux-router';
import authReducer from './authReducer';
import worklistReducer from './worklistReducer';
import processReducer from './processReducer';
import openSDReducer from './openSDReducer';
import notificationsReducer from './notificationsReducer';
import createSDReducer from './createSDReducer';
import CRinfoReducer from './CRinfoReducer';
import modalBlockReducer from './modalBlockReducer';


const rootReducer = combineReducers({
  router,
  authReducer,
  worklistReducer,
  CRinfoReducer,
  notificationsReducer,
  processReducer,
  openSDReducer,
  createSDReducer,
  modalBlockReducer,
  form: formReducer
});

export default rootReducer;
