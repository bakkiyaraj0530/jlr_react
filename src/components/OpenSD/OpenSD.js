import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import cssModules from 'react-css-modules';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import styles from './openSD.scss';
import TextInput from '../FormElements/TextInput/TextInput';
import Dropdown from '../FormElements/Dropdown/Dropdown';
import DateInput from '../FormElements/DateInput/DateInput';
import CheckBoxGroup from '../FormElements/CheckBoxGroup/CheckBoxGroup';

const exclamatoryIcon = require('assets/images/icon-exclamation-white.svg');
const tickIcon = require('assets/images/icon-tick-white.svg');
const disableOfflineInputs = window.navigator.onLine ? false : true;
const validate = values => {
  const errors = {};
  if (!disableOfflineInputs) {
    if (!values.supplierRepName || !values.supplierRepName.length) {
      errors.supplierRepName = 'Please provide a Supplier Contact Name';
    }

    if (!values.supplierRepEmail || !values.supplierRepEmail.length) {
      errors.supplierRepEmail = 'Please provide a Supplier Email';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.supplierRepEmail)) {
      errors.supplierRepEmail = 'Invalid email address';
    }

    if (!values.supplierRepNumber || !values.supplierRepNumber.length) {
      errors.supplierRepNumber = 'Please provide a Supplier Phone Number';
    }

    if (!values.assessmentDate || !values.assessmentDate.length) {
      errors.assessmentDate = 'Please select Assessment Date';
    }
  }
  return errors;
};

@cssModules(styles)
@reduxForm({
  form: 'openSDForm',
  fields: ['assessmentType', 'supplierBusinessName', 'supplierSiteLocation', 'supplierCategory', 'assignee', 'supplierRepName', 'supplierRepEmail', 'supplierRepNumber', 'assessmentReason', 'assessmentDate', 'comments', 'userId', 'mediaImagePermission'],
  validate
})

class OpenSD extends Component {

  constructor() {
    super();
    this.state = {
      assessmentDate: ''
    };
  }

  componentWillMount() {
    this.setState({ dateNotSupported: this.checkDateInput() });
  }

   componentWillReceiveProps(nextProps) {
     this.props = nextProps;
     const getAssessmentDate = this.props.fields.assessmentDate.initialValue;
     const splitDate = (getAssessmentDate) ? getAssessmentDate.split('/') : false;
     const AssessmentDate = (splitDate[1] + '/' + splitDate[0] + '/' + splitDate[2]);
     this.setState({ assessmentDate: AssessmentDate });
   }

  checkDateInput() {
    const input = document.createElement('input');
    input.setAttribute('type', 'date');

    const notADateValue = 'not-a-date';
    input.setAttribute('value', notADateValue);

    return (input.value !== notADateValue);
  }

  handleAssessmentDate(date) {
    this.setState({ assessmentDate: date });
  }

  render() {
    const { fields, handleSubmit, downloadTemp, supplierDiagnosis, onCompleteClick } = this.props;
    const isHelpIconRequired = 'hide';
    const getManagerName = this.props.authdata.role === 'sta_manager' ? this.props.authdata.user : this.props.managerDetails;
    const isCompletedStatus = this.props.isCompletedStatus;
    const isSdStatus = supplierDiagnosis.status === 'Open' ? true : false;
    const chackBoxLable = ['Take picture on site has been granted'];
    return (
      <form className="open-sd-form" onSubmit={ handleSubmit } >
        <div className="open-sd-container">
          <div className="container sd-content">
              <div className="small-12 medium-6  columns">
                <TextInput
                  inputType="text"
                  helpIconhide= { isHelpIconRequired }
                  { ...fields.assessmentType }
                  data={ fields.assessmentType.value }
                  disabled>Assessment Type</TextInput>
              </div>

              <div className="small-12 medium-6  columns">
                <TextInput
                  inputType="text"
                  helpIconhide= { isHelpIconRequired }
                  { ...fields.supplierBusinessName }
                  data={ fields.supplierBusinessName.value }
                  disabled>Supplier Business Name</TextInput>
              </div>
              <div className="small-12 medium-6  columns">
                <TextInput
                  inputType="text"
                  helpIconhide= { isHelpIconRequired }
                  { ...fields.supplierSiteLocation }
                  data={ fields.supplierSiteLocation.value }
                  disabled>Supplier Site Location</TextInput>
              </div>

              <div className="small-12 medium-6  columns">
                <TextInput
                  inputType="text"
                  helpIconhide= { isHelpIconRequired }
                  { ...fields.supplierCategory }
                  data={ fields.supplierCategory.value }
                  disabled>Supplier Category</TextInput>
              </div>
              <div className="small-12 medium-6  columns">
                <TextInput
                { ...fields.managerId }
                inputType="text"
                helpIconhide= { isHelpIconRequired }
                data={ getManagerName }
                value={ fields.managerId }
                disabled>Manager</TextInput>
              </div>

              <div className="small-12 medium-6  columns">
                <TextInput
                  inputType="text"
                  helpIconhide= { isHelpIconRequired }
                  { ...fields.assignee }
                  data={ fields.assignee.value }
                  disabled>Assign</TextInput>
              </div>
              <div className="small-12 medium-6  columns">
                <TextInput
                  inputType="text"
                  helpIconhide= { isHelpIconRequired }
                  required
                  { ...fields.supplierRepName }
                  data={ fields.supplierRepName.value }>Supplier Contact Name</TextInput>
                  { fields.supplierRepName.touched && fields.supplierRepName.error && <div className="errorMessage">{ fields.supplierRepName.error }</div> }
              </div>

              <div className="small-12 medium-6  columns">
                <TextInput
                  inputType="text"
                  helpIconhide= { isHelpIconRequired }
                  required
                  { ...fields.supplierRepEmail }
                  data={ fields.supplierRepEmail.value }>Supplier Email</TextInput>
                  { fields.supplierRepEmail.touched && fields.supplierRepEmail.error && <div className="errorMessage">{ fields.supplierRepEmail.error }</div> }
              </div>
             <div className="small-12 medium-6  columns">
                <TextInput
                  inputType="text"
                  helpIconhide= { isHelpIconRequired }
                  required
                  { ...fields.supplierRepNumber }
                  data={ fields.supplierRepNumber.value }>Supplier Phone Number</TextInput>
                  {fields.supplierRepNumber.touched && fields.supplierRepNumber.error && <div className="errorMessage">{ fields.supplierRepNumber.error }</div> }
              </div>

              <div className="small-12 medium-6  columns">
                  <span>Assessment Reason</span><br/>
                  <Dropdown
                  list={ this.props.reasonsList }
                  value={ fields.assessmentReason }
                  { ...fields.assessmentReason }
                  optionSelected = { fields.assessmentReason.value } >Select reason...</Dropdown>

              </div>
             <div className="small-12 medium-6  column clearinfo">
                  <span className="form-label capitalize">Date of Assessment</span><br/>
                   {!(this.state.dateNotSupported) ?
                    <DatePicker
                    id="assessmentDate"
                    name="assessmentDate"
                    dateFormat="DD/MM/YYYY"
                    { ...fields.assessmentDate }
                    data={ fields.assessmentDate.value }
                    selected={(this.state.assessmentDate) ? moment(this.state.assessmentDate) : ''}
                    onChange={this.handleAssessmentDate.bind(this)}
                    placeholderText="MM/DD/YYYY" /> :
                    <DateInput
                    { ...fields.assessmentDate }
                    id="assessmentDate"
                    data={ fields.assessmentDate.value }/> }
                  { fields.assessmentDate.touched && fields.assessmentDate.error && <div className="errorMessage">{ fields.assessmentDate.error }</div> }
              </div>

              <div className="small-12 medium-6  column">
                <TextInput
                  helpIconhide= { isHelpIconRequired }
                  { ...fields.comments }
                  data={ fields.comments.value }>Comments</TextInput>
                  { fields.comments.touched && fields.comments.error && <div className="errorMessage">{ fields.comments.error }</div> }
              </div>
              <div className="small-12 medium-6  columns columnssd">
                <CheckBoxGroup
                optionValues={ chackBoxLable }
                optionSelected={ fields.mediaImagePermission.value }
                { ...fields.mediaImagePermission }
                initialValue = { fields.mediaImagePermission.value } />
              </div>
          </div>

          <div className="container create-sd-button-container">
            { isCompletedStatus ? <div className="form-button download-sd-button complete-btn capitalize" onClick={ onCompleteClick } ><img className={ this.props.isCRFailed ? 'complete-exclamation' : 'complete-tick' } src={ this.props.isCRFailed ? exclamatoryIcon : tickIcon }/>COMPLETE</div> : '' }
            <div className="form-button start-sd-button capitalize" onClick={ handleSubmit }>Continue</div>
            { isSdStatus ? <div className="form-button download-sd-button capitalize" onClick={ downloadTemp }>Download</div> : '' }
          </div>
        </div>
      </form>
    );
  }
}

OpenSD.propTypes = {
  fields: PropTypes.any,
  handleSubmit: PropTypes.func,
  downloadTemp: PropTypes.func,
  onCompleteClick: PropTypes.func,
  isCompletedStatus: PropTypes.string,
  isCRFailed: PropTypes.bool,
  sdStatus: PropTypes.string,
  reasonsList: PropTypes.func,
  managerDetails: PropTypes.string,
  authdata: PropTypes.object,
  supplierDiagnosis: PropTypes.object
};

export default OpenSD;
