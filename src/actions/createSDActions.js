import * as types from '../constants/actionTypes/createSD';
import { config } from '../config/config';
import request from 'superagent';
import _ from 'lodash';
import { insert } from './sqliteActions';
import { turnOn, turnOff } from './modalBlockActions';
import { GET_MY_DELEGATE_URL, GET_REASONS_URL, GET_MANAGERDATA_URL } from '../constants/URLConfig';

export function onCreateSDSuccess(res) {
  return { type: types.CREATE_SUPPLIER_DIAGNOSIS, res };
}

export function onError(err) {
  return { type: types.GET_ASSIGNEE_LIST_ERROR, err };
}

export function createNewSd(sdDetails) {
  return (dispatch, getState) => {
    dispatch(turnOn());
    const auth = getState().authReducer.userAuth;
    request.post(config().baseUrl + config().SDApi)
    .type('json')
    .set({ 'Accept': 'application/json' })
    .set({ 'Authorization': 'Bearer ' + auth.access_token })
    .send(sdDetails)
    .end((err, res) => {
      dispatch(turnOff());
      if (err) {
        return dispatch(onError(err));
      }
      dispatch(onCreateSDSuccess(res));
    });
  };
}

export function onSupplierSuccess(res) {
  return { type: types.GET_SUPPLIER_DATA_BY_CODE_SUCCESS, res };
}

export function gotSupplierError(res) {
  return { type: types.GET_SUPPLIER_DATA_BY_CODE_ERROR, res };
}

export function getSupplierDataByCode(supplierCode) {
  return (dispatch) => {
    dispatch(turnOn());
    request.get(config().supplierDetailUrl + supplierCode)
    .set({ 'Accept': 'application/json' })
    .end((err, res) => {
      dispatch(turnOff());
      if (err) {
        return dispatch(gotSupplierError(err));
      }
      dispatch(onSupplierSuccess(res));
    });
  };
}
export function onReasonListSuccess(res) {
  return { type: types.GET_REASON_LIST_SUCCESS, res };
}
export function onAccessTypeSuccess(res) {
  return { type: types.GET_ASSESSMENT_TYPE_SUCCESS, res };
}
export function onAssigneeListSuccess(res) {
  return { type: types.GET_ASSIGNEE_LIST_SUCCESS, res };
}
export function onManagerDetailsSuccess(res) {
  return { type: types.GET_MANAGER_DATA_SUCCESS, res };
}
export function onListError(err) {
  return { type: types.GET_ASSIGNEE_LIST_ERROR, err };
}

function getListFromDB(URL) {
  return (dispatch) => {
    document.addEventListener('deviceready', () => {
      window.db.transaction((tx) => {
        tx.executeSql('SELECT * FROM worklist WHERE url=?', [URL], (tx1, res) => {
          let data = [];
          const listData = res.rows;
          _.forEach(listData, function getData(sqlData) {
            data = JSON.parse(sqlData.item().json_response);
            console.log('ListData from DB ' + data);
          });
          if (URL === GET_REASONS_URL) {
            dispatch(onReasonListSuccess(data));
          } else if (URL === GET_MANAGERDATA_URL) {
            dispatch(onManagerDetailsSuccess(data));
          } else {
            dispatch(onAssigneeListSuccess(data));
          }
        });
      });
    });
  };
}

export function getAssigneeList() {
  const engineersList = [];
  return (dispatch, getState) => {
    if (window.navigator.onLine) {
      dispatch(turnOn());
      const auth = getState().authReducer.userAuth;
      request.get(config().baseUrl + config().userDelegates)
      .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .set({ 'Accept': 'application/json' })
      .end((err, res) => {
        dispatch(turnOff());
        if (err) {
          return dispatch(onListError(err));
        }
        const userData = JSON.parse(res.text);
        _.forEach(userData, function getData(data) {
          const newObj = { 'key': data.cdsId, 'value': data.name };
          engineersList.push(newObj);
        });
        dispatch(onAssigneeListSuccess(engineersList));
        if (window.cordova) {
          dispatch(insert('worklist', '(url, json_response)', GET_MY_DELEGATE_URL, [GET_MY_DELEGATE_URL, JSON.stringify(res)]));
        }
      });
    } else {
      if (window.cordova) {
        dispatch(getListFromDB(GET_MY_DELEGATE_URL));
      }
    }
  };
}

export function getAssessmentType() {
  const assessmentTypes = [];
  return (dispatch, getState) => {
    if (window.navigator.onLine) {
      dispatch(turnOn());
      const auth = getState().authReducer.userAuth;
      request.get(config().baseUrl + config().getAssessmentType)
      .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .set({ 'Accept': 'application/json' })
      .end((err, res) => {
        dispatch(turnOff());
        if (err) {
          return dispatch(onListError(err));
        }
        const assessmentData = JSON.parse(res.text);
        _.forEach(assessmentData, function getData(data) {
          const newObj = { 'key': data.diagnosticTypeId, 'value': data.diagnosticTypeDescription };
          assessmentTypes.push(newObj);
        });
        dispatch(onAccessTypeSuccess(assessmentTypes));
        if (window.cordova) {
          dispatch(insert('worklist', '(url, json_response)', GET_MY_DELEGATE_URL, [GET_MY_DELEGATE_URL, JSON.stringify(res)]));
        }
      });
    } else {
      if (window.cordova) {
        dispatch(getListFromDB(GET_MY_DELEGATE_URL));
      }
    }
  };
}


export function getAssessmentReasons(sdID) {
  const reasonsList = [];
  return (dispatch, getState) => {
    const sdNum = sdID === undefined ? '' : sdID;
    if (window.navigator.onLine) {
      dispatch(turnOn());
      const auth = getState().authReducer.userAuth;
      request.get(config().baseUrl + config().getReasonList + '?cmsVersion=' + sdNum)
      .set({ 'Accept': 'application/json' })
      .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .end((err, res) => {
        dispatch(turnOff());
        if (err) {
          return dispatch(onListError(err));
        }
        const reasonsData = (JSON.parse(res.text)).reasonsList;
        _.forEach(reasonsData, function getData(data) {
          const newReasonObj = { 'key': data.reasonId, 'value': data.reasonText };
          reasonsList.push(newReasonObj);
        });
        dispatch(onReasonListSuccess(reasonsList));
      });
    } else {
      if (window.cordova) {
        dispatch(getListFromDB(GET_REASONS_URL));
      }
    }
  };
}

export function getMyManager() {
  return (dispatch, getState) => {
    if (window.navigator.onLine) {
      const auth = getState().authReducer.userAuth;
      request.get(config().loginUrl + '/user/1/MyManager')
      .set({ 'Accept': 'application/json' })
      .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .end((err, res) => {
        if (err) {
          return dispatch(onListError(err));
        }
        const managerData = (JSON.parse(res.text).cdsId);
        dispatch(onManagerDetailsSuccess(managerData));
      });
    } else {
      if (window.cordova) {
        dispatch(getListFromDB(GET_MANAGERDATA_URL));
      }
    }
  };
}
