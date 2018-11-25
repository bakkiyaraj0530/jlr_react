import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import { connect } from 'react-redux';
import { pushState } from 'react-router';

import styles from './complete.scss';
import ModalPopup from '../ModalPopup';

import { showConfirmPopup } from '../../actions/notificationsActions';
import { COMPLETE_CONFIRM } from '../../constants/general';
import { save } from '../../actions/SyncActions';
import { downloadCompleteReportsSummary } from '../../actions/openSDActions';

const exclamatoryIcon = require('assets/images/icon-exclamation-white.svg');
const tickIcon = require('assets/images/icon-tick-white.svg');

@cssModules(styles)
class Complete extends Component {
  constructor() {
    super();
    this.onCompleteClick = this.onCompleteClick.bind(this);
    this.onCompleteConfirmed = this.onCompleteConfirmed.bind(this);
    this.downloadsummaryreports = this.downloadsummaryreports.bind(this);
    this.getBlob = this.getBlob.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  onCompleteClick() {
    const { dispatch } = this.props;
    dispatch(showConfirmPopup(COMPLETE_CONFIRM, false));
  }

  onCompleteConfirmed() {
    const SDstatus = 'Completed';
    const { dispatch, sdData, isCRFailed } = this.props;
    dispatch(showConfirmPopup(COMPLETE_CONFIRM, false));
    sdData.status = isCRFailed ? 'Failed' : 'Completed';
    dispatch(save('/' + sdData.id + '/Status?status=' + SDstatus, 'put', { 'status': sdData.status }, false));
    this.downloadsummaryreports();
    this.goToWorklist();
  }

  getBlob(stream, fileName) {
    const { dispatch } = this.props;
    if (window.cordova) {
      return this.getMobileBlob(stream.response);
    }
    if (!stream) {
      return dispatch(pushState(false, '/errorpage'));
    }
    this.setState({ isReady: true });
    // For a Windows IE Browser, this allows to save the PDF and open it.
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(stream.response, fileName);
    } else {
      const data = new Blob([stream], { type: 'text/csv' });
      const csvURL = window.URL.createObjectURL(data);
      const tempLink = document.createElement('a');
      tempLink.href = csvURL;
      tempLink.setAttribute('download', fileName);
      tempLink.click();
    }
  }

  getMobileBlob(stream) {
    const target = '_blank';
    const options = 'location=yes,hidden=yes,enableViewportScale=yes';
    const objURL = window.URL.createObjectURL(stream);
    const inAppBrowserRef = window.cordova.InAppBrowser.open(objURL, target, options);
    inAppBrowserRef.show();
    this.setState({ isReady: true });
  }

  downloadsummaryreports() {
    const { dispatch, sdData } = this.props;
    if (window.navigator.onLine) {
      dispatch(downloadCompleteReportsSummary(sdData.id, this.getBlob));
    }
    if (window.cordova) {
      const { params } = this.props;
      document.addEventListener('deviceready', () => {
        window.resolveLocalFileSystemURL(window.cordova.file.documentsDirectory, (dir) => {
          dir.getFile('SD-' + params.sdId + ' eSD Summary Report.xls', { create: true }, (file) => {
            this.offlineRepObj = file;
            if (this.offlineRepObj === 'null') {
              const data = ['sdfsdf '];
              this.writeLog(data);
            }
          });
        });
      });
    }
  }

  writeLog(str) {
    if (!this.offlineRepObj) {
      return;
    }
    const log = str + ' [' + (new Date()) + ']\n';
    this.offlineRepObj.createWriter((fileWriter) => {
      fileWriter.seek(fileWriter.length);
      const blob = new Blob([log], { type: 'text/plain' });
      fileWriter.write(blob);
    }, () => {
    /*  console.log('failed'); */
    });
  }

  goToWorklist() {
    const screenName = this.props.screenName;
    switch (screenName) {
      case 'OpenSD':
        window.history.back();
        break;
      case 'ChecklistSection':
        window.history.go(-2);
        break;
      case 'ChecklistSubSection':
        window.history.go(-3);
        break;
      case 'QuestionSet':
        window.history.go(-4);
        break;
      case 'Question':
        window.history.go(-5);
        break;
      case 'CRQuestionSet':
        window.history.go(-3);
        break;
      case 'CRQuestion':
        window.history.go(-4);
        break;
      default:
        window.history.back();
        break;
    }
  }

  render() {
    const visibilityStyle = this.props.isCompleted && this.props.userAuth.role === 'sta_engineer' ? { 'display': 'block' } : { 'display': 'none' };

    return (<div className="complete-cont" style={ visibilityStyle }>
      <ModalPopup
        ref="complete_confirm_popup"
        modal={this.props.modal}
        onConfirmClick={ this.onCompleteConfirmed }
        dispatch={ this.props.dispatch }/>
      <div className="complete-button" onClick={ this.onCompleteClick }>
        <img className={ this.props.isCRFailed ? 'complete-exclamation' : 'complete-tick' }
          src={ this.props.isCRFailed ? exclamatoryIcon : tickIcon }/>COMPLETE
      </div>
    </div>);
  }
}

Complete.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.object,
  modal: PropTypes.object,
  userAuth: PropTypes.object,
  sdData: PropTypes.object,
  onClickButton: PropTypes.func,
  isCompleted: PropTypes.bool,
  isCRFailed: PropTypes.bool,
  screenName: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    modal: state.notificationsReducer,
    userAuth: state.authReducer.userAuth,
    sdData: state.worklistReducer.currentWorklist
  };
}

export default connect(mapStateToProps)(Complete);
