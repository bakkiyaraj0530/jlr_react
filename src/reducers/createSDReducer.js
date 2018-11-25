import * as types from '../constants/actionTypes/createSD';

const items = [];
const initialState = {
  assigneelist: items,
  reasonslist: items,
  assessmentType: items,
  supplierDetails: items,
  managerdata: ''
};

export default function createSDReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_ASSIGNEE_LIST_SUCCESS:
      return Object.assign({}, state, {
        assigneelist: action.res
      });
    case types.GET_ASSESSMENT_TYPE_SUCCESS:
      return Object.assign({}, state, {
        assessmentType: action.res
      });
    case types.GET_REASON_LIST_SUCCESS:
      return Object.assign({}, state, {
        reasonslist: action.res
      });
    case types.GET_SUPPLIER_DATA_BY_CODE_SUCCESS:
      return Object.assign({}, state, {
        supplierDetails: JSON.parse(action.res.text)
      });
    case types.GET_SUPPLIER_DATA_BY_CODE_ERROR:
      return Object.assign({}, state, {
        supplierDetails: null
      });

    case types.GET_MANAGER_DATA_SUCCESS:
      return Object.assign({}, state, {
        managerdata: action.res
      });
    default:
      return state;
  }
}
