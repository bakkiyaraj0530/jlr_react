import React, { Component } from 'react';
import SupplierDetailForm from '../../components/SupplierDetailForm/SupplierDetailForm';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Header from '../Header';
import { getSupplierDataByCode } from '../../actions/supplierActions';

class SupplierDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      supplierCode: '',
      error: ''
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getSupplierData() {
    const supplierCode = this.state.supplierCode.trim().toLowerCase();
    const { dispatch } = this.props;

    if (supplierCode === '' || supplierCode === null) {
      this.setState({ error: 'Invaid Site Code' });
    } else {
      dispatch(getSupplierDataByCode(supplierCode));
      this.setState({ error: '' });
    }
  }

  handleChange(e) {
    this.setState({ supplierCode: e.target.value });
  }

  handleKeyDown(e) {
    if (e.which === 13) {
      this.getSupplierData();
    }
  }

  render() {
    const supplierDataObj = this.props.supplierData.supplierReducer.supplierData;
    const isError = this.props.supplierData.supplierReducer.isInvilidCode;
    const isempty = (supplierDataObj === undefined || supplierDataObj === '' || supplierDataObj === null) ? true : false;
    return (
      <div>
      <Header />
      <div className="supplierDetailContainer">
        <h2>MANFACTURER SITE CODE*</h2>
        <input
          type="text"
          autoFocus="true"
          placeholder="<site code>"
          value={ this.state.supplierCode }
          onChange={ this.handleChange }
          onKeyDown={ this.handleKeyDown } />
          <button onClick={ this.getSupplierData.bind(this) }>Confirm</button>
          { (this.state.error !== '' || isError) && <div className="errorMessage filterError">Invaid Site Code</div> }
      </div>
      <div> {
      isempty ?
          <div></div> :
          <SupplierDetailForm supplierData={ supplierDataObj }/>}</div>
          <Link to = "checklistSection">CHECKLIST</Link>
      </div>
      );
  }
}

SupplierDetails.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  supplierData: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    supplierData: state
  };
}

export default connect(mapStateToProps)(SupplierDetails);
