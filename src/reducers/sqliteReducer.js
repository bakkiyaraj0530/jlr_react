import * as types from '../constants/actionTypes/sqlite';

const initialState = {
  connection: true,
  isOpen: false
};

export default function SqlliteReducer(state = initialState, action) {
  let data = [];
  switch (action.type) {
    case types.START_DB:
      data = action.open;
      return Object.assign({}, state, {
        isOpen: data
      });
    default:
      return state;
  }
}
