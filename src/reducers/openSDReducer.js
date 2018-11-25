import * as types from '../constants/actionTypes/opensd';

const initialState = {
  sd: {
    'id': '1',
    'assessmentType': 'Pre-Source Health Check',
    'siteCode': 'NA',
    'supplierName': 'ABC',
    'supplierLocation': 'XYZ',
    'category': '2A',
    'repName': '',
    'repMail': null,
    'repNumber': null,
    'assessmentReason': null,
    'assessmentDate': null,
    'comments': null,
    'process': 'Create Diagnosis'
  }
};

export default function openSDReducer(state = initialState, action) {
  switch (action.type) {
    case types.WORKLIST_SUCCESS:
      return Object.assign({}, state, {
        message: {}
      });
    case types.WORKLIST_ERROR:
      return Object.assign({}, state, {
        message: {}
      });
    default:
      return state;
  }
}
