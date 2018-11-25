import * as types from '../constants/actionTypes/modalBlock';

export function turnOn() {
  return { type: types.MODAL_BLOCK_ON };
}

export function turnOff() {
  return { type: types.MODAL_BLOCK_OFF };
}

export function turnOfflineOn() {
  return { type: types.MODAL_OFFLINE_ON };
}

export function turnOfflineOff() {
  return { type: types.MODAL_OFFLINE_OFF };
}
