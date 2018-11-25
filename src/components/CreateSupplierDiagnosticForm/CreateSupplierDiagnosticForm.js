import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import cssModules from 'react-css-modules';
import styles from './CreateSupplierDiagnosticForm.scss';
import TextInput from '../FormElements/TextInput/TextInput';
import Dropdown from '../FormElements/Dropdown/Dropdown';
import CheckBoxGroup from '../FormElements/CheckBoxGroup/CheckBoxGroup';
import DateInput from '../FormElements/DateInput/DateInput';
const cancel = require('assets/images/icon-red-x.svg');
const save = require('assets/images/icon-green-tick.svg');
const supplierCategoryList = [
  { key: '1a', value: '1a' },
  { key: '1b', value: '1b' },
  { key: '1c', value: '1c' },
  { key: '2', value: '2' },
  { key: '3', value: '3' }
];

const validate = values => {
  const errors = {};
  if (values.assessmentType === '2' || values.assessmentType === '1') {
    if (!values.supplierBusinessName || !values.supplierBusinessName.length) {
      errors.supplierBusinessName = 'Please provide a Supplier Business Name';
    }
    if (!values.supplierSiteLocation || !values.supplierSiteLocation.length) {
      errors.supplierSiteLocation = 'Please provide a Supplier Site Location';
    }
    if (!values.supplierCategory || values.supplierCategory === ' ' || values.supplierCategory === 'na') {
      errors.supplierCategory = 'Please select a Supplier Category';
    }
    if (values.supplierRepEmail) {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.supplierRepEmail)) {
        errors.supplierRepEmail = 'Invalid email address';
      }
    }
  }

  if (values.dateOfAssessment) {
    const inputDate = values.dateOfAssessment.split('/');
    const inputYear = inputDate[2];

    const inputYearNum = Number(inputYear);
    const inputMonthNum = Number(inputDate[1]);
    const inputDayNum = Number(inputDate[0]);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    if (currentYear > inputYearNum) {
      errors.dateOfAssessment = 'Assessment date should not be less than current date';
    } else {
      if (currentMonth > inputMonthNum) {
        errors.dateOfAssessment = 'Assessment date should not be less than current date';
      } else if (currentMonth === inputMonthNum) {
        if (currentDay > inputDayNum) {
          errors.dateOfAssessment = 'Assessment date should not be less than current date';
        }
      }
    }
    if (inputYear.length > 4) {
      errors.dateOfAssessment = 'Enter valid date';
    }
  }
  return errors;
};

@cssModules(styles)
@reduxForm({
  form: 'CreateSupplierDiagnosticForm',
  fields: ['assessmentType', 'supplierSiteCode', 'supplierBusinessName', 'supplierSiteLocation', 'supplierCategory', 'managerId', 'supplierAssign', 'supplierRepName', 'supplierRepEmail', 'supplierRepNumber', 'assessmentReason', 'dateOfAssessment', 'userComments', 'mediaImagePermission'],
  validate
})
class CreateSupplierDiagnosticForm extends Component {

 constructor() {
   super();
   this.handleAssessmentDate = this.handleAssessmentDate.bind(this);
   this.state = {
     dateOfAssessment: ''
   };
 }

  componentWillMount() {
    this.setState({ dateNotSupported: this.checkDateInput() });
  }

  checkDateInput() {
    const input = document.createElement('input');
    input.setAttribute('type', 'date');

    const notADateValue = 'not-a-date';
    input.setAttribute('value', notADateValue);

    return (input.value !== notADateValue);
  }

  handleAssessmentDate(date) {
    this.setState({ dateOfAssessment: date });
  }

  render() {
    const { fields, handleSubmit, handleCancel, handleConfirm, supplierError, assessmentType } = this.props;
    const chackBoxLable = ['Take picture on site has been granted'];
    const disableBtnOffline = window.navigator.onLine ? '' : 'disable-btn';

    // show/hide form details
    let hideFullBlock = 'show-div';
    let buttonPosition = ' ';
    if (fields.assessmentType.value === 'na' || fields.assessmentType.value === undefined) {
      hideFullBlock = 'hide-div';
    } else {
      buttonPosition = 'button-pos';
    }

    // show/hide supplier code field
    let hideSupplierCodeBlock = 'show-div';
    if (fields.assessmentType.value === 'na' || fields.assessmentType.value === '2' || fields.assessmentType.value === '1' || fields.assessmentType.value === undefined) {
      hideSupplierCodeBlock = 'hide-div';
    }

    // show/hide save button
    let hideSaveButtonBlock = 'showBlock form-button capitalize save-sd-button';
    if (fields.assessmentType.value === 'na' || fields.assessmentType.value === undefined) {
      hideSaveButtonBlock = 'hideBlock';
    }

    let assessmentTypeUI = 'small-12 medium-6 columns';
    if (fields.assessmentType.value === 'na' || fields.assessmentType.value === undefined || fields.assessmentType.value === '3' || fields.assessmentType.value === '4' || fields.assessmentType.value === '5') {
      assessmentTypeUI = 'small-12 columns';
    }
    const engineerData = [
      { key: this.props.authdata.user, value: this.props.authdata.user }
    ];
    const getAssigneeList = this.props.authdata.role === 'sta_engineer' ? engineerData : this.props.assigneeList;
    const assigneeSelVal = this.props.authdata.role === 'sta_engineer' ? this.props.authdata.user : fields.supplierAssign.value;
    const supplierDetails = this.props.supplierDetails;
    const getManagerName = this.props.authdata.role === 'sta_manager' ? this.props.authdata.user : this.props.managerDetails;
    const disableSelVal = this.props.authdata.role === 'sta_engineer' ? 'disabled' : '';
    return (
      <form className="open-sd-form" onSubmit={ handleSubmit }>
        <div className="create-sd-container">
          <p className="assessmentHeading subtitle fancy text-center"><span>Create Assessment</span></p>
          <div className="spacer3"></div>
          <div className="row">
            <div className={ assessmentTypeUI }>
              <label className="form-label capitalize">Assessment Type</label>
              <Dropdown
                { ...fields.assessmentType }
                list={ assessmentType }
                optionSelected={ fields.assessmentType.value }>Select Type...
              </Dropdown>
              { fields.assessmentType.touched && fields.assessmentType.error && <div className="errorMessage">{ fields.assessmentType.error }</div> }
            </div>
            <div className = { hideFullBlock } >
            <div className = { hideSupplierCodeBlock }>
              <div className="small-12 medium-6 columns">
                <TextInput
                  inputType="text"
                  { ...fields.supplierSiteCode }
                  data={ fields.supplierSiteCode.value }>
                  MANUFACTURING SITE CODE*
                </TextInput>
                { supplierError && <div className="errorMessage">{ supplierError }</div> }
                <button className="small-4 button columns create-sd-button" onClick={ handleConfirm }>CONFIRM</button>
              </div>
            </div>
              <div className="small-12 medium-6 columns">
                <TextInput
                inputType="text"
                autoFocus="true"
                value={ fields.supplierBusinessName.value }
                { ...fields.supplierBusinessName }
                data={ supplierDetails.manufacturerSiteName }>Supplier Business Name* </TextInput>
                { fields.supplierBusinessName.touched && fields.supplierBusinessName.error && <div className="errorMessage">{ fields.supplierBusinessName.error }</div> }
              </div>
              <div className="small-12 medium-6 columns">
                <TextInput
                inputType="text"
                autoFocus="true"
                value={ fields.supplierSiteLocation }
                { ...fields.supplierSiteLocation }
                data={ supplierDetails.country}>Supplier Site Location* </TextInput>
                { fields.supplierSiteLocation.touched && fields.supplierSiteLocation.error && <div className="errorMessage">{ fields.supplierSiteLocation.error }</div> }
              </div>
              <div className="small-12 medium-6 columns">
                <label className="form-label capitalize">Supplier Category* </label>
                <Dropdown
                list={ supplierCategoryList }
                value={ fields.supplierCategory }
                { ...fields.supplierCategory }>Select Category...</Dropdown>
                { fields.supplierCategory.touched && fields.supplierCategory.error && <div className="errorMessage">{ fields.supplierCategory.error }</div> }
              </div>
              <div className="small-12 medium-6 column clearinfo">
                <TextInput
                inputType="text"
                autoFocus="true"
                data={ getManagerName }
                value={ fields.managerId }
                disabled
                { ...fields.managerId }>Manager</TextInput>
              </div>
              <div className="small-12 medium-6 columns">
               <label className="form-label capitalize">Assign*</label>
               <Dropdown
                list={ getAssigneeList }
                value={ fields.supplierAssign }
                { ...fields.supplierAssign }
                optionSelected = { assigneeSelVal }
                disabled = { disableSelVal } >Select assignee...</Dropdown>
                { fields.supplierAssign.touched && fields.supplierAssign.error && <div className="errorMessage">{ fields.supplierAssign.error }</div> }
              </div>
              <div className="small-12 medium-6 columns">
                <TextInput
                inputType="text"
                autoFocus="true"
                value={ fields.supplierRepName }
                { ...fields.supplierRepName } >Supplier Contact Name</TextInput>
              </div>
              <div className="small-12 medium-6 columns">
                <TextInput
                inputType="text"
                autoFocus="true"
                value={ fields.supplierRepEmail }
                { ...fields.supplierRepEmail } >Supplier Email</TextInput>
                { fields.supplierRepEmail.touched && fields.supplierRepEmail.error && <div className="errorMessage">{ fields.supplierRepEmail.error }</div> }
              </div>
              <div className="small-12 medium-6 columns">
                <TextInput
                inputType="text"
                autoFocus="true"
                value={ fields.supplierRepNumber }
                { ...fields.supplierRepNumber } >Supplier Phone Number</TextInput>
              </div>
              <div className="small-12 medium-6 columns">
                <label className="form-label capitalize">Assessment Reason</label>
                <Dropdown
                list={ this.props.reasonsList }
                value={ fields.assessmentReason }
                { ...fields.assessmentReason }>Select reason...</Dropdown>
              </div>
              <div className="small-12 medium-6 columns">
                <DateInput
                { ...fields.dateOfAssessment }
                id="dateOfAssessment"
                data={ fields.dateOfAssessment.value }/>
                { fields.dateOfAssessment.touched && fields.dateOfAssessment.error && <div className="errorMessage">{ fields.dateOfAssessment.error }</div> }
              </div>
              <div className="small-12 medium-6 columns">
                <TextInput
                autoFocus="true"
                value={ fields.userComments }
                { ...fields.userComments } >Comments </TextInput>
              </div>
              <div className="small-12 medium-6 columns">
                <CheckBoxGroup {...fields.mediaImagePermission} optionValues={ chackBoxLable } />
              </div>
            </div>
            <div className="clearfix"></div>
            <div className={'create-sd-button-container' + ' ' + buttonPosition }>
              <div className={'sd-form-button esdButton' + ' ' + hideSaveButtonBlock + ' ' + disableBtnOffline } onClick={ handleSubmit }><img src={save}/><span>SAVE</span></div>
              <div className="sd-form-button esdButton form-button capitalize cancel-sd-button" onClick={ handleCancel }><img src={cancel}/><span>CANCEL</span></div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

CreateSupplierDiagnosticForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleCancel: PropTypes.func,
  handleConfirm: PropTypes.func,
  fields: PropTypes.object,
  assigneeList: PropTypes.func,
  reasonsList: PropTypes.func,
  managerDetails: PropTypes.string,
  authdata: PropTypes.object,
  supplierDetails: PropTypes.array,
  supplierError: PropTypes.string,
  assessmentType: PropTypes.object
};

export default CreateSupplierDiagnosticForm;
