import * as types from '../constants/actionTypes/sync';

const initialState = {
  synced: true,
  count: 0,
  lastUpdateMsg: false
};

export default function SqlliteReducer(state = initialState, action) {
  let data;
  switch (action.type) {
    case types.POST_SUCCESS:
      return state;
    case types.SYNC_COUNT:
      data = action.count;
      return Object.assign({}, state, {
        count: data
      });
    case types.SYNC_LAST_UPDATE:
      data = action.status;
      state.lastUpdateMsg = data;
      return state;
    default:
      return state;
  }
}
