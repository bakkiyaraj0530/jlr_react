import * as types from '../constants/actionTypes/sync.js';
import { MEDIA_UPLOAD_SUCCESS } from '../constants/actionTypes/process';
import request from 'superagent';
import { config } from '../config/config';
import { insert } from './sqliteActions';
import { get } from './processActions';
import { turnOn, turnOff } from './modalBlockActions';

function doSuccess(res) {
  return (dispatch) => {
    dispatch(get('/' + res.req._data.sdId, 'getupdatedsd'));
  };
}

function mediaUploadSuccess(res) {
  return { type: MEDIA_UPLOAD_SUCCESS, url: res.req.url };
}

function syncCount(count) {
  return { type: types.SYNC_COUNT, count: count };
}

function show48Hour(status) {
  return { type: types.SYNC_LAST_UPDATE, status: status };
}

export function syncLastUpdate() {
  return (dispatch) => {
    document.addEventListener('deviceready', () => {
      window.db.transaction((tx) => {
        tx.executeSql('SELECT COUNT (*) FROM sync WHERE last_updated < date("now", "-2 days")', [], (tx1, res) => {
          if (res.rows.item(0)['COUNT (*)'] > 0) {
            dispatch(show48Hour(true));
          } else {
            dispatch(show48Hour(false));
          }
        });
      });
    });
  };
}

function addToSync(url, action, payload, media) {
  if (window.cordova) {
    if (media) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        document.addEventListener('deviceready', () => {
          window.db.transaction((tx) => {
            tx.executeSql('REPLACE INTO sync (url, action, payload, media) VALUES (?,?,?,?)', [url, action, reader.result, media]);
          });
        });
      }, false);
      if (window.FileAPI.getFiles(payload) !== undefined) {
        reader.readAsDataURL(payload);
      }
    } else {
      document.addEventListener('deviceready', () => {
        window.db.transaction((tx) => {
          tx.executeSql('REPLACE INTO sync (url, action, payload, media) VALUES (?,?,?,?)', [url, action, JSON.stringify(payload), media]);
        });
      });
    }
  }
  return { type: 'ADD_TO_SYNC_TABLE' };
}

function doSave(url, action, payload, media) {
  return (dispatch, getState) => {
    const auth = getState().authReducer.userAuth;
    dispatch(turnOn());
    if (media) {
      request[action](config().baseUrl + config().SDApi + url)
      .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .attach('file', payload)
      .end((err, res) => {
        dispatch(turnOff());
        console.log(res);
        if (res.status === 201) {
          dispatch(mediaUploadSuccess(res));
        }

        if (err) {
          if (window.cordova) {
            dispatch(addToSync(url, action, payload, media));
          }

          return err;
        }
      });
    } else {
      request[action](config().baseUrl + config().SDApi + url)
      .set({ 'Accept': 'application/json' })
      .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .send(payload)
      .end((err, res1) => {
        dispatch(turnOff());
        if (err) {
          if (window.cordova) {
            dispatch(addToSync(url, action, payload, media));
          }
        }
        dispatch(doSuccess(res1));
      });
    }
  };
}

// save image in database or upload to server
export function save(url, action, payload, media) {
  return (dispatch) => {
    if (window.navigator.onLine) {
      dispatch(doSave(url, action, payload, media));
    } else {
      if (window.cordova) {
        dispatch(addToSync(url, action, payload, media));
        dispatch(insert('worklist', '(url, json_response)', url, [url, JSON.stringify(payload)]));
      }
    }
  };
}

// return the new ammount
export function deleteFromDB(url) {
  return (dispatch) => {
    if (window.cordova && window.navigator.onLine) {
      document.addEventListener('deviceready', () => {
        window.db.transaction((tx) => {
          tx.executeSql('DELETE FROM sync WHERE url=?', [url], (tx1) => {
            tx1.executeSql('SELECT * FROM sync', [], (tx2, res2) => {
              dispatch(syncCount(res2.rows.length));
            });
          });
        });
      });
    }
  };
}

function convertToBlob(data) {
  const arr = data.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

function syncSave(url, action, payload, media) {
  return (dispatch, getState) => {
    dispatch(turnOn());
    const auth = getState().authReducer.userAuth;
    if (media === 'true') {
      const data = convertToBlob(payload);

      request.post(config().apiUrl + url)
      .attach('file', data)
      .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .end((err) => { // eslint-disable-line no-loop-func
        dispatch(turnOff());
        if (err) {
          dispatch(deleteFromDB(url));
        } else {
          dispatch(deleteFromDB(url));
        }
      });
    } else {
      request[action](config().apiUrl + url)
      .send(JSON.parse(payload))
      .set({ 'Authorization': 'Bearer ' + auth.access_token })
      .end((err) => { // eslint-disable-line no-loop-func
        dispatch(turnOff());
        if (err) {
          dispatch(deleteFromDB(url));
          return err;
        }
        dispatch(deleteFromDB(url));
      });
    }
  };
}

export function syncStatus() {
  return (dispatch) => {
    if (window.cordova && window.navigator.onLine) {
      document.addEventListener('deviceready', () => {
        window.db.transaction((tx) => {
          tx.executeSql('SELECT * FROM sync', [], (tx1, res) => {
            if (res.rows.length > 0) {
              for (let i = 0; i < res.rows.length; i++) {
                dispatch(syncCount(res.rows.length));
                dispatch(syncSave(res.rows.item(i).url, res.rows.item(i).action, res.rows.item(i).payload, res.rows.item(i).media));
              }
            }
          });
        });
      });
    } else {
      if (window.cordova) {
        document.addEventListener('deviceready', () => {
          window.db.transaction((tx) => {
            tx.executeSql('SELECT * FROM sync', [], (tx1, res) => {
              dispatch(syncCount(res.rows.length));
            });
          });
        });
      }
    }
  };
}
