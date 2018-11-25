import * as types from '../constants/actionTypes/sqlite';


function openDB() {
  const tables = [
    'CREATE TABLE IF NOT EXISTS sync (url TEXT PRIMARY KEY, action TEXT, payload TEXT, media BOOLEAN, last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
    'CREATE TABLE IF NOT EXISTS worklist (url TEXT PRIMARY KEY, json_response TEXT)'
  ];
  document.addEventListener('deviceready', () => {
    window.db = window.sqlitePlugin.openDatabase({ name: 'esd_db', location: 'default' });
    window.db.transaction((tx) => {
      tables.map((statement) => {
        tx.executeSql(statement);
      });
    });
  });
  return { type: types.START_DB, open: true };
}

export function startDB() {
  return (dispatch) => {
    if (window.cordova) {
      dispatch(openDB());
    }
  };
}

export function insert(TABLE, TABLE_HEADERS, URL, VALUES) {
  document.addEventListener('deviceready', () => {
    window.db.transaction((tx) => {
      const query = 'REPLACE INTO ' + TABLE + ' ' + TABLE_HEADERS + ' VALUES(?, ?)';
      tx.executeSql(query, VALUES, (tx2, suc) => {
        console.log(tx2 + ' : ' + JSON.stringify(suc));
      }, (tx3, err) => {
        console.log(tx3 + ' : ' + JSON.stringify(err));
      });
    });
  });
  return { type: 'INSERT' };
}

export function insertMultiRows(TABLE, TABLE_HEADERS, URL, ARR_VALUES) {
  document.addEventListener('deviceready', () => {
    window.db.transaction((tx) => {
      let query = 'REPLACE INTO ' + TABLE + ' ' + TABLE_HEADERS + ' VALUES';
      ARR_VALUES.map((value) => {
        const valueObj = '\'' + JSON.stringify(value) + '\'';
        const url = '\'' + 'worklist/' + value.id + '\'';
        query += ' (' + url + ', ' + valueObj + '),';
      });
      query = query.substring(0, query.length - 1);

      tx.executeSql(query, [], (tx2, suc) => {
        console.log('insertMultiRows success ' + tx2 + ' : ' + JSON.stringify(suc));
      }, (tx3, err) => {
        console.log('insertMultiRows error ' + tx3 + ' : ' + JSON.stringify(err));
      });
    });
  });
  return { type: 'INSERT' };
}
