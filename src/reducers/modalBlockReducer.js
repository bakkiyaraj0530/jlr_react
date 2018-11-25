import * as types from '../constants/actionTypes/modalBlock';

const initialState = {
  active: false,
  offLine: false
};

export default function modalBlockReducer(state = initialState, action) {
  switch (action.type) {
    case types.MODAL_BLOCK_ON:
      return Object.assign({}, state, {
        active: true
      });
    case types.MODAL_BLOCK_OFF:
      return Object.assign({}, state, {
        active: false
      });
    case types.MODAL_OFFLINE_ON:
      return Object.assign({}, state, {
        offLine: true
      });
    case types.MODAL_OFFLINE_OFF:
      return Object.assign({}, state, {
        offLine: false
      });
    default:
      return state;
  }
}
