import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-router';
import CreateSupplierDiagnosticForm from '../../components/CreateSupplierDiagnosticForm/CreateSupplierDiagnosticForm';
import { getAssigneeList, getAssessmentReasons, getAssessmentType, getSupplierDataByCode, createNewSd, getMyManager } from '../../actions/createSDActions';
import Header from '../Header';

class CreateSupplierDiagnostic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      createSD: props.createSupplierDiagnosticForm,
      createSDFormDetails: '',
      isSupplierCodeEmpty: '',
    };

    this.handleSave = this.handleSave.bind(this);
    this.getSupplierData = this.getSupplierData.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getAssigneeList());
    dispatch(getAssessmentType());
    dispatch(getAssessmentReasons('latest'));
    dispatch(getMyManager());
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  getSupplierData() {
    const { dispatch, createSupplierDiagnosticForm } = this.props;
    const supplierCode = createSupplierDiagnosticForm.supplierSiteCode.value;
    if (supplierCode === '' || supplierCode === null || supplierCode === undefined) {
      this.setState({ isSupplierCodeEmpty: 'Please provide supplier code' });
    } else {
      dispatch(getSupplierDataByCode(supplierCode));
      this.setState({ isSupplierCodeEmpty: '' });
    }
  }

  handleSave() {
    const { dispatch, createSupplierDiagnosticForm, auth } = this.props;
    const assigneeVal = auth.role === 'sta_engineer' ? auth.user : createSupplierDiagnosticForm.supplierAssign.value;
    const staUserId = auth.role === 'sta_engineer' ? auth.user : assigneeVal;
    const supplierRepName = createSupplierDiagnosticForm.supplierRepName === undefined ? null : createSupplierDiagnosticForm.supplierRepName.value;
    const supplierRepEmail = createSupplierDiagnosticForm.supplierRepEmail === undefined ? null : createSupplierDiagnosticForm.supplierRepEmail.value;
    const supplierRepNumber = createSupplierDiagnosticForm.supplierRepNumber === undefined ? null : createSupplierDiagnosticForm.supplierRepNumber.value;
    const assessmentReason = createSupplierDiagnosticForm.assessmentReason === undefined ? null : createSupplierDiagnosticForm.assessmentReason.value;
    const assessmentDate = createSupplierDiagnosticForm.dateOfAssessment === undefined ? null : createSupplierDiagnosticForm.dateOfAssessment.value;
    const userComments = createSupplierDiagnosticForm.userComments === undefined ? null : createSupplierDiagnosticForm.userComments.value;
    const mediaImagePermission = createSupplierDiagnosticForm.mediaImagePermission === undefined ? false : true;

    this.state.createSDFormDetails = {
      'staUserId': staUserId.toUpperCase(),
      'assessmentType': createSupplierDiagnosticForm.assessmentType.value,
      'supplierBusinessName': createSupplierDiagnosticForm.supplierBusinessName.value,
      'supplierSiteLocation': createSupplierDiagnosticForm.supplierSiteLocation.value,
      'comments': userComments,
      'supplierRepEmail': supplierRepEmail,
      'supplierRepName': supplierRepName,
      'supplierRepNumber': supplierRepNumber,
      'assignee': assigneeVal.toUpperCase(),
      'supplierCategory': createSupplierDiagnosticForm.supplierCategory.value,
      'assessmentReason': assessmentReason,
      'assessmentDate': assessmentDate,
      'status': 'Open',
      'mediaImagePermission': mediaImagePermission
    };
    dispatch(createNewSd(this.state.createSDFormDetails));
    dispatch(push('/worklist'));
  }

  goBack() {
    window.history.back();
  }


  render() {
    const createsd = this.state.createSD;
    const assigneeList = this.props.assigneeData;
    const reasonsList = this.props.reasonsData;
    const managerDetails = this.props.managerData;
    const supplierDetails = this.props.supplierDetails;
    const assessmentType = this.props.assessmentType;
    const authdata = this.props.auth;
    return (
      <div className="dashboard">
        <Header />
        <CreateSupplierDiagnosticForm
          { ...createsd }
          onSubmit={ this.handleSave } handleCancel={ this.goBack }
          handleConfirm={this.getSupplierData}
          assigneeList = { assigneeList }
          supplierError={ this.state.isSupplierCodeEmpty }
          supplierDetails = { supplierDetails }
          assessmentType = { assessmentType }
          authdata = { authdata }
          reasonsList = { reasonsList }
          managerDetails = { managerDetails } />
      </div>
    );
  }
}

CreateSupplierDiagnostic.propTypes = {
  dispatch: PropTypes.func.isRequired,
  createSupplierDiagnosticForm: PropTypes.object,
  params: PropTypes.object.isRequired,
  assigneeData: PropTypes.array,
  reasonsData: PropTypes.array,
  managerData: PropTypes.string,
  assessmentType: PropTypes.object,
  auth: PropTypes.any,
  supplierDetails: PropTypes.array
};

function mapStateToProps(state) {
  return {
    createSupplierDiagnosticForm: state.form.CreateSupplierDiagnosticForm,
    assigneeData: state.createSDReducer.assigneelist,
    reasonsData: state.createSDReducer.reasonslist,
    managerData: state.createSDReducer.managerdata,
    assessmentType: state.createSDReducer.assessmentType,
    auth: state.authReducer.userAuth,
    supplierDetails: state.createSDReducer.supplierDetails
  };
}

export default connect(mapStateToProps)(CreateSupplierDiagnostic);
