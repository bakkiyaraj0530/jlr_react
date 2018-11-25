import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import { reduxForm } from 'redux-form';
import styles from './SearchForm.scss';
import { connect } from 'react-redux';
import Dropdown from '../FormElements/Dropdown/Dropdown';

const assessmentTypeList = [
  { key: 'Pre-source health check', value: 'Pre-source health check' },
  { key: 'Pre-source', value: 'Pre-source' },
  { key: 'SVO (Special Veh Operations)', value: 'SVO (Special Veh Operations)' },
  { key: 'Full Diagnosis', value: 'Full Diagnosis' },
  { key: 'Custom Diagnosis', value: 'Custom Diagnosis' }
];


@cssModules(styles)
@reduxForm({
  fields: ['supplierName', 'siteCode', 'updatedDate', 'reviewDate', 'status', 'sta_engineer', 'assessmentType'],
  form: 'search'
})

class SearchForm extends Component {

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    if (this.props.resetSearch === true) {
      this.props.resetForm('search');
    }
  }

  render() {
    const { fields } = this.props;
    const disableEngineer = 'disabled';
    const states = [
      { key: 'Open', value: 'Open' },
      { key: 'InProgress', value: 'InProgress' },
      { key: 'Completed', value: 'Completed' }
    ];
    return (
        <form name="searching">
         <div className="row expanded">
            <div className="small-12 medium-6 columns">
              <label htmlFor="supplierName" className="form-label">Supplier Name</label>
              <input type="text" name="supplierName" { ...fields.supplierName } />
            </div>
            <div className="small-12 medium-6 columns">
              <label htmlFor="supplierCode" className="form-label">Supplier Code</label>
              <input type="text" name="supplierCode" { ...fields.siteCode } disabled={ disableEngineer } />
            </div>
            <div className="small-12 medium-6 columns">
              <label htmlFor="updatedDate" className="form-label">Updated Date</label>
              <input type="date" name="updatedDate" { ...fields.updatedDate }/>
            </div>
            <div className="small-12 medium-6 columns">
              <label htmlFor="reviewDate" className="form-label">Review Date</label>
              <input type="date" name="reviewDate" { ...fields.reviewDate } disabled={ disableEngineer } />
            </div>
            <div className="small-12 medium-6 columns">
                <label htmlFor="process" className="form-label">State</label>
                <Dropdown
                { ...fields.status }
                list={ states }>Select
                </Dropdown>
            </div>
            <div className="small-12 medium-6 columns">
              <label htmlFor="staEngineer" className="form-label">STA Engineer</label>
              <input type="text" name="staEngineer" { ...fields.sta_engineer } disabled={ disableEngineer }/>
            </div>
            <div className="small-12 medium-6 columns">
                <label htmlFor="process" className="form-label">ESD Type</label>
                <Dropdown
                { ...fields.assessmentType }
                list={ assessmentTypeList } disabled={ disableEngineer } >Select
                </Dropdown>
            </div>
            <div className="clearfix"></div>
            <div className="search-button-container">
              <button type="submit" className="form-button-clear search-button" onClick = { this.props.handleSubmit } >SEARCH</button>
            </div>
          </div>
        </form>
      );
  }
}

SearchForm.propTypes = {
  fields: React.PropTypes.any,
  handleSubmit: React.PropTypes.func,
  foreachfield: React.PropTypes.func,
  resetForm: React.PropTypes.func.isRequired,
  resetSearch: React.PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    search: state
  };
}

export default connect(mapStateToProps)(SearchForm);
