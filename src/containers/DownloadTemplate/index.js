import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import cssModules from 'react-css-modules';
import styles from './downloadTemplate.scss';
import { pushState } from 'redux-router';

import { dontShowPopup } from '../../actions/notificationsActions';
import { DONT_SHOW } from '../../constants/actionTypes/notifications';

const close = require('assets/images/icon-red-x.svg');

const customConfirmBoxStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  }
};

const data = [
   ['1', 'Supplier has process documentation for firewall in place? Process Planning Documentation  are updated to include Firewall activity?'],
   ['2', 'Non conforming parts metrics / Firewall Management'],
   ['3', 'Firewall operators have all necessary tools, gauges & test equipment available?'],
   ['4', 'Has training been provided to assist people in understanding their responsibilities?'],
   ['5', 'Has training been provided to assist people in understanding their responsibilities?'],
];

class DownloadTemplate extends Component {

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
    this.downloadBlankTemp = this.downloadBlankTemp.bind(this);
    this.downloadEsdSummary = this.downloadEsdSummary.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
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

  downloadBlankTemp() {
    const { dispatch } = this.props;
    dispatch(pushState(null, 'file/reportXLS'));
    this.closeModal();
  }

  downloadEsdSummary() {
    let csv = 'Question Number,Question details\n';
    data.forEach(function downloadTemp(row) { csv += row.join(','); csv += '\n';});
    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'STA_eSD_summary.csv';
    hiddenElement.click();
    this.closeModal();
  }

  confirmClicked() {
    this.closeModal();
    this.props.onConfirmClick();
  }

  goBack() {
    window.history.back();
  }

  render() {
    return (
            <Modal isOpen={ this.state.isOpen } style={ customConfirmBoxStyles } className="download-template-main">
              <div className="modal-content">
                <p className="close-button" onClick={ this.closeModal }><img src={close}/></p>
                <p className="modal-confirm-title">{ this.state.messageData.title }</p>
                    <div className="modal-confirm-button-container modal-delegate-button-container">
                        <div className="download-template-button" onClick={ this.downloadBlankTemp }>BLANK TEMPLATE</div>
                        <div className="download-template-button" onClick={ this.downloadEsdSummary }>eSD SUMMARY</div>
                        <div className="download-template-button" onClick={ this.closeModal }>DOWNLOAD TYPE</div>
                    </div>
              </div>
            </Modal>
    );
  }
}

DownloadTemplate.propTypes = {
  modal: PropTypes.object,
  onConfirmClick: PropTypes.func,
  dispatch: PropTypes.any
};

export default cssModules(DownloadTemplate, styles);
