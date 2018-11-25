import * as types from '../constants/actionTypes/worklist';
import request from 'superagent';
import { config } from '../config/config';
import { insertMultiRows, insert } from './sqliteActions';
import { GET_WORKLIST_URL } from '../constants/URLConfig';
import { turnOn, turnOff } from './modalBlockActions';

function worklistSuccess(res) {
  return { type: types.WORKLIST_SUCCESS, res };
}

function gotError(err) {
  return { type: types.WORKLIST_ERROR, err };
}

function currentWorklistSuccess(res) {
  return { type: types.SET_CURRENT_WORKLIST_SUCCESS, res };
}

function gotErrorCurrent(err) {
  return { type: types.SET_CURRENT_WORKLIST_ERROR, err };
}

export function setCurrentWorkList(res) {
  return (dispatch) => {
    dispatch(currentWorklistSuccess(res));
  };
}

export function getWorklistFromDB() {
  return (dispatch) => {
    document.addEventListener('deviceready', () => {
      window.db.transaction((tx) => {
        tx.executeSql('SELECT * FROM worklist WHERE url LIKE \'%worklist%\'', [], (tx1, res) => {
          const data = [];
          for (let i = 0; i < res.rows.length; i++) {
            data[i] = JSON.parse(res.rows.item(i).json_response);
          }
          dispatch(worklistSuccess(data));
        }, (tx2, err) => {
          console.log(JSON.stringify('error fetching worklist data from database' + err));
        });
      });
    });
  };
}

export function getWorkListData() {
  return (dispatch, getState) => {
    if (window.navigator.onLine) {
      dispatch(turnOn());
      const auth = getState().authReducer.userAuth;
      request.get(config().baseUrl + config().getWorklist)
      .set({ 'Accept': 'application/json' })
      .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .end((err, res) => {
        dispatch(turnOff());
        if (err) {
          return dispatch(gotError(err));
        }
        const response = JSON.parse(res.text);
        dispatch(worklistSuccess(response));
        if (window.cordova) {
          dispatch(insertMultiRows('worklist', '(url, json_response)', GET_WORKLIST_URL, response));
        }
      });
    } else {
      if (window.cordova) {
        dispatch(getWorklistFromDB());
      }
    }
  };
}

export function getCurrentWorkList(worklistId) {
  return (dispatch, getState) => {
    if (window.navigator.onLine) {
      dispatch(turnOn());
      const auth = getState().authReducer.userAuth;
      request.get(config().baseUrl + config().getWorklist + '/' + worklistId)
      .set({ 'Accept': 'application/json' })
      .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .end((err, res) => {
        dispatch(turnOff());
        if (err) {
          return dispatch(gotErrorCurrent(err));
        }
        dispatch(currentWorklistSuccess(JSON.parse(res.text)));
        if (window.cordova) {
          const url = GET_WORKLIST_URL + '/' + worklistId;
          dispatch(insert('worklist', '(url, json_response)', url, [url, res.text]));
        }
      });
    } else {
      if (window.cordova) {
        dispatch(getWorklistFromDB());
      }
    }
  };
}

export function filterWorklistDataSupplier(filterCriteria) {
  return {
    type: types.FILTER_WORKLIST_DATA_SUPPLIER,
    filterCriteria
  };
}

export function filterWorklistDatasSDType(filterCriteria) {
  return {
    type: types.FILTER_WORKLIST_DATA_SDTYPE,
    filterCriteria
  };
}

export function resetWorlist() {
  return {
    type: types.FILTER_WORKLIST_DATA_RESET
  };
}

export function sortAlphabetical(columnName, order) {
  return {
    type: types.SORT_ALPHABETICAL,
    columnName,
    order
  };
}

export function sortDate(columnName, order) {
  return {
    type: types.SORT_DATE,
    columnName,
    order
  };
}

export function searchWorklistDataOffline(searchCriteria) {
  return {
    type: types.SEARCH_WORKLIST_DATA_OFFLINE,
    searchCriteria
  };
}

export function searchWorklistDataOnlineSuccess(searchCriteria) {
  return {
    type: types.SEARCH_WORKLIST_DATA_ONLINE_SUCCESS,
    searchCriteria
  };
}

export function searchWorklistDataOnlineError(searchCriteria) {
  return {
    type: types.SEARCH_WORKLIST_DATA_ONLINE_ERROR,
    searchCriteria
  };
}

export function searchWorklistDataOnline(searchData) {
  return (dispatch, getState) => {
    dispatch(turnOn());
    const auth = getState().authReducer.userAuth;
    request.get(config().baseUrl + config().SDApi + '/SearchEngineer')
    .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .query(searchData)
      .end((err, res) => {
        dispatch(turnOff());
        if (err) {
          return dispatch(searchWorklistDataOnlineError(err));
        }
        const data = JSON.parse(res.text);
        dispatch(searchWorklistDataOnlineSuccess(data));
      });
  };
}
