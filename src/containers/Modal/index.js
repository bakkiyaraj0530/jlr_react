import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalBlock from '../../components/ModalBlock/ModalBlock';
import OfflineMessage from '../../components/ModalBlock/OfflineMessage';

class Modal extends Component {
  render() {
    const { active, offLine } = this.props;

    return (
      <div>
        <ModalBlock active={ active } />
        <OfflineMessage offLine={ offLine } />
      </div>
    );
  }
}


Modal.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  state: React.PropTypes.object.isRequired,
  active: React.PropTypes.any,
  offLine: React.PropTypes.any,
};

function mapStateToProps(state) {
  return {
    state,
    active: state.modalBlockReducer.active,
    offLine: state.modalBlockReducer.offLine
  };
}

export default connect(mapStateToProps)(Modal);
