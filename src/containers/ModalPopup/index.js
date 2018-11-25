import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import cssModules from 'react-css-modules';
import styles from './ModalPopup.scss';

import { dontShowPopup } from '../../actions/notificationsActions';
import { DONT_SHOW } from '../../constants/actionTypes/notifications';

const popupSuccess = require('assets/images/icon-popup-success.svg');
const popupError = require('assets/images/icon-popup-error.svg');

const customConfirmBoxStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  }
};
const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  content: {
    top: '50%',
    left: '50%',
    width: '15%',
    height: '13.5em',
    transform: 'translate(-50%, -50%)',
    borderRadius: '0em',
    padding: '2.5em'
  }
};

class ModalPopup extends Component {

  constructor() {
    super();
    this.state = {
      isOpen: false,
      isError: false,
      messageData: { title: '' },
      isConfirmModal: false,
      isSingleConfirm: false
    };
    this.closeModal = this.closeModal.bind(this);
    this.confirmClicked = this.confirmClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    if (this.props.modal) {
      if (this.props.modal.MSG_TYPE === DONT_SHOW) {
        this.setState({
          isOpen: false
        });
      } else {
        if (this.props.modal.IS_CONFIRM) {
          this.openConfirmPopup(this.props.modal);
        } else {
          this.openInfoPopup(this.props.modal);
          const that = this;
          setTimeout(() => {
            that.closeModal();
            that.goBack();
          }, 2000);
        }
      }
    }
  }

  openConfirmPopup(messageObj) {
    this.setState({
      isOpen: true,
      messageData: { title: messageObj.MESSAGE },
      isConfirmModal: true,
      isSingleConfirm: messageObj.IS_SINGLE_CONFIRM
    });
  }

  openInfoPopup(messageObj) {
    this.setState({
      isOpen: true,
      messageData: { title: messageObj.MESSAGE },
      isError: messageObj.IS_ERROR,
      isConfirmModal: false
    });
  }

  closeModal() {
    const { dispatch } = this.props;
    dispatch(dontShowPopup());
    this.setState({
      isOpen: false,
      isError: false,
      messageData: { title: '' },
      isConfirmModal: false,
      isSingleConfirm: false
    });
  }

  confirmClicked() {
    this.props.onConfirmClick();
    this.closeModal();
  }

  goBack() {
    window.history.back();
  }

  render() {
    return (
      <div>
        { this.state.isConfirmModal ?
            <Modal isOpen={ this.state.isOpen } style={ customConfirmBoxStyles } className="modelMain">
              <div className="modalContent">
                <p className="modalConfirmTitle">{ this.state.messageData.title }</p>
                {
                  this.state.isSingleConfirm ?
                    <div className="modalConfirmButtonContainer modalDelegateButtonContainer">
                      <div className="modalConfirmButton" onClick={ this.closeModal }>OK</div>
                    </div> : <div className="modalConfirmButtonContainer">
                        <div className="modalConfirmButton modalConfirm" onClick={ this.confirmClicked }>CONFIRM</div>
                        <div className="modalConfirmButton modalCancel" onClick={ this.closeModal }>CANCEL</div>
                    </div>
                }
              </div>
            </Modal> :
            <Modal isOpen={ this.state.isOpen } style={ customModalStyles }>
              <div className="modalContent" onClick={ this.closeModal }>
                <img className="modalIcon" src={ this.state.isError ? popupError : popupSuccess} />
                <p className="modalTitle">{ this.state.messageData.title }</p>
              </div>
            </Modal>
        }
      </div>
    );
  }
}

ModalPopup.propTypes = {
  modal: PropTypes.object,
  onConfirmClick: PropTypes.func,
  dispatch: PropTypes.any
};

export default cssModules(ModalPopup, styles);
