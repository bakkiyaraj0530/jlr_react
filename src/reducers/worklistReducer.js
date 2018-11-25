import * as types from '../constants/actionTypes/worklist';
import filter from 'lodash/filter.js';
import keys from 'lodash/keys.js';
import orderBy from 'lodash/orderBy';

const items = [];
const initialState = {
  worklists: items,
  dataFilter: items,
  currentWorklist: items
};

export default function worklistReducer(state = initialState, action) {
  switch (action.type) {

    case types.WORKLIST_SUCCESS:
      return Object.assign({}, state, {
        worklists: action.res,
        dataFilter: action.res
      });

    case types.SET_CURRENT_WORKLIST_SUCCESS:
      return Object.assign({}, state, {
        currentWorklist: action.res
      });

    case types.SET_CURRENT_WORKLIST_ERROR:
      return Object.assign({}, state, {
        currentWorklist: {}
      });

    case types.WORKLIST_ERROR:
      return Object.assign({}, state, {
        worklists: {},
        dataFilter: {}
      });

    case types.FILTER_WORKLIST_DATA_SUPPLIER:
      return Object.assign({}, state, {
        filter: 'supplierBusinessName',
        worklists: filter(state.dataFilter, function filterData(o) {
          return o.supplierBusinessName ? ((o.supplierBusinessName.toLowerCase()).indexOf(
              action.filterCriteria.toLowerCase()) > -1) : false;
        })
      });

    case types.FILTER_WORKLIST_DATA_RESET:
      return Object.assign({}, state, {
        worklists: state.dataFilter
      });

    case types.FILTER_WORKLIST_DATA_SDTYPE:
      return Object.assign({}, state, {
        filter: 'assessmentType',
        worklists: filter(state.dataFilter, function filterData(o) {
          return o.assessmentType ? ((o.assessmentType.toLowerCase()).indexOf(
              action.filterCriteria.toLowerCase()) > -1) : false;
        })
      });

    case types.SORT_ALPHABETICAL:
      return Object.assign({}, state, {
        worklists: orderBy(state.worklists, function sortData(o) {
          let column = '';
          if (action.columnName.startsWith('SupplierName')) {
            column = o.supplierBusinessName;
          } else if (action.columnName.startsWith('SiteCode')) {
            column = o.manufacturerSiteCode;
          } else if (action.columnName.startsWith('AssessmentType')) {
            column = o.assessmentType;
          } else if (action.columnName.startsWith('Status')) {
            column = o.status;
          } else if (action.columnName.startsWith('STAEngineer')) {
            column = o.staUserId;
          } else if (action.columnName.startsWith('StatusChanged')) {
            column = o.assessmentDate;
          } else if (action.columnName.startsWith('ID')) {
            column = o.id;
          }
          return column;
        }, action.order)
      });

    case types.SORT_DATE:
      return Object.assign({}, state, {
        worklists: orderBy(state.worklists, function sortData(o) {
          let date = '';
          // mm/dd/yyyy format expected
          const field = o.assessmentDate;
          if (field === null || field === '') {
            date = field;
          } else {
            const parts = (field + '').split('/');
            date = new Date(parts[2], parts[1] - 1, parts[0]);
          }
          return date;
        }, action.order)
      });

    case types.SEARCH_WORKLIST_DATA_ONLINE_SUCCESS:
      return Object.assign({}, state, {
        filter: 'assessmentType',
        worklists: action.searchCriteria
      });

    case types.SEARCH_WORKLIST_DATA_ONLINE_ERROR:
      return Object.assign({}, state, {
        filter: 'assessmentType',
        worklists: action.searchCriteria
      });

    case types.SEARCH_WORKLIST_DATA_OFFLINE:
      const filterData = JSON.stringify(action.searchCriteria);
      const searchObject = JSON.parse(filterData);
      const filterKeys = keys(searchObject);
      return Object.assign({}, state, {
        worklists: filter(state.dataFilter, function filterDataFunc(item) {
          let count = 0;
          function searching(a) {
            for (let i = 0; i < filterKeys.length; i++) {
              if (item[filterKeys[i]].toLowerCase().indexOf(a[filterKeys[i]].toLowerCase()) > -1) {
                count++;
              }
            }
            if (count !== filterKeys.length) {
              return false;
            }
            return true;
          }
          count = 0;
          return item.supplierBusinessName ? (searching(searchObject)) : false;
        })
      });

    default:
      return state;
  }
}
