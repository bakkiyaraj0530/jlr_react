import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-router';
import _ from 'lodash';
import OpenSD from '../../components/OpenSD/OpenSD';
import Header from '../Header';
import ProcessSubHeader from '../../components/ProcessSubHeader';
import { get, setLastUnAnsweredQuestionUrl } from '../../actions/processActions';
import { getAssigneeList, getMyManager } from '../../actions/createSDActions';
import { updateWorklist, downloadCompleteReportsSummary } from '../../actions/openSDActions';
import DownloadTemplate from '../DownloadTemplate';
import { showConfirmPopup } from '../../actions/notificationsActions';
import { DOWNLOAD_TEMP_HEADING } from '../../constants/general';

class OpenSDContainer extends Component {

  constructor(props) {
    super(props);
    this.offlineRepObj = null;
    this.handleStart = this.handleStart.bind(this);
    this.downloadTempPopup = this.downloadTempPopup.bind(this);
    this.downloadsummaryreports = this.downloadsummaryreports.bind(this);
    this.getBlob = this.getBlob.bind(this);
  }

  componentWillMount() {
    this.state = {
      supplierDiagnosis: this.props.sdData,
      isCompleted: false,
      isCRConducted: false,
      isCRFailed: false
    };
    const { dispatch, params } = this.props;
    dispatch(getAssigneeList());
    dispatch(getMyManager());
    dispatch(get('/' + params.sdId, 'supplierdiagnosis'));
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.setState({
      supplierDiagnosis: this.props.sdData,
      isCompleted: this.isComplete()
    });
  }

  getUnAnsweredQuestionURL(sd) {
    const assessSections = sd.assessSections;
    let lastAnsweredSection = null;
    let nextSection = null;
    let isBackwardCheckRequired = false;
    let nextQuestionNum = 1;
    let lastAnsweredSectionIndex;
    let totalNoOfQuestions = 0;
    let totalNoOfQuestionsAnswered = 0;

    assessSections.map((assessSection, index) => {
      if (assessSection.answers) {
        lastAnsweredSection = assessSection;
        lastAnsweredSectionIndex = index;
        totalNoOfQuestionsAnswered += assessSection.answers.length;
      }

      totalNoOfQuestions += assessSection.questionCount;
    });

    if (totalNoOfQuestions === totalNoOfQuestionsAnswered) {
      return false;
    }
    const nextSectionIndex = (lastAnsweredSectionIndex < (assessSections.length - 1)) ? (lastAnsweredSectionIndex + 1) : -1;

    if (lastAnsweredSection) {
      const answers = lastAnsweredSection.answers;

      if (answers && answers.length > 0) {
        if (lastAnsweredSection.questionCount === answers.length) {
          const isAnswerHasNo = _.find(answers, { score: 'N' });
          if (isAnswerHasNo) {
            return false;
          }
          if (nextSectionIndex === -1) {
            isBackwardCheckRequired = true;
          } else {
            nextSection = assessSections[nextSectionIndex];
          }
        } else {
          const sortedAnswers = _.sortBy(answers, (answer) => { return answer.questionNumber; });
          const tempQuestionNum = sortedAnswers[sortedAnswers.length - 1].questionNumber;

          if (tempQuestionNum === lastAnsweredSection.questionCount) {
            if (nextSectionIndex === -1 || lastAnsweredSection.sectionNumber === '0') {
              isBackwardCheckRequired = true;
            } else {
              nextSection = assessSections[nextSectionIndex];
            }
          } else {
            nextQuestionNum = sortedAnswers[sortedAnswers.length - 1].questionNumber + 1;
          }
        }
      } else {
        nextQuestionNum = 1;
      }
    } else {
      // Navigation to CR
      return 'Sections/0/Subsections/0/Question/1';
    }

    if (nextSection) {
      // Navigation to next section
      return 'Sections/' + nextSection.sectionNumber + '/Subsections/' + nextSection.subsectionNumber + '/Question/1';
    } else if (isBackwardCheckRequired) {
      for (let j = 0; j < assessSections.length; j++) {
        const answers = assessSections[j].answers;
        if (answers) {
          if (answers.length !== assessSections[j].questionCount) {
            const sortedAnswers = _.sortBy(answers, (answer) => { return answer.questionNumber; });
            const answerArr = _.map(sortedAnswers, 'questionNumber');
            if (sortedAnswers) {
              const tempArr = new Array(assessSections[j].questionCount);
              for (let i = 0; i < tempArr.length; i++) {
                tempArr[i] = (i + 1);
              }
              const notAnsweredQuestions = _.xor(tempArr, answerArr);
              return 'Sections/' + assessSections[j].sectionNumber + '/Subsections/' + assessSections[j].subsectionNumber + '/Question/' + notAnsweredQuestions[0];
            } else if (!sortedAnswers) {
              return 'Sections/' + lastAnsweredSection.sectionNumber + '/Subsections/' + lastAnsweredSection.subsectionNumber + '/Question/1';
            }
          }
        } else if (!answers) {
          return 'Sections/' + assessSections[j].sectionNumber + '/Subsections/' + assessSections[j].subsectionNumber + '/Question/1';
        }
      }
    } else {
      return 'Sections/' + lastAnsweredSection.sectionNumber + '/Subsections/' + lastAnsweredSection.subsectionNumber + '/Question/' + nextQuestionNum;
    }
  }

  getBlob(stream, fileName) {
    const { dispatch } = this.props;
    if (window.cordova) {
      return this.getMobileBlob(stream.response);
    }
    if (!stream) {
      return dispatch(push(false, '/errorpage'));
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

  downloadTempPopup() {
    const { dispatch } = this.props;
    dispatch(showConfirmPopup(DOWNLOAD_TEMP_HEADING, true));
  }

  downloadsummaryreports() {
    const { dispatch, sdData, params } = this.props;
    dispatch(downloadCompleteReportsSummary(sdData.id, this.getBlob));
    if (window.cordova) {
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
      /* console.log('failed'); */
    });
  }

  isComplete() {
    const worklist = this.props.sdData;
    let totalQuestionCount = 0;
    let answerCount = 0;
    let isCRCompletionWithFail = false;
    const that = this;

    if (worklist.assessSections && worklist.assessSections.length === 0) {
      return false;
    }
    worklist.assessSections.map((assessSection) => {
      answerCount += assessSection.answers ? assessSection.answers.length : 0;
      totalQuestionCount += assessSection.questionCount;

      if (assessSection.sectionNumber === '0' && assessSection.answers) {
        const answers = assessSection.answers;
        if (answers.length === assessSection.questionCount) {
          const isAnswerHasNo = _.find(answers, { score: 'N' });
          if (isAnswerHasNo) {
            isCRCompletionWithFail = true;
          }
        }
        answers.map((answer) => {
          if (answer.score === 'N') {
            that.state.isCRFailed = true;
            return true;
          }
        });
        that.state.isCRConducted = answers.length === assessSection.questionCount ? true : false;
      }
    });
    if (isCRCompletionWithFail) {
      this.state.isCRFailed = true;
      return true;
    } else if (!isCRCompletionWithFail) {
      this.state.isCRFailed = false;
    }
    if ((this.state.isCRConducted && this.state.isCRFailed) || (totalQuestionCount === answerCount)) {
      return true;
    }
    return false;
  }

  handleStart() {
    const { dispatch, openSDForm, params } = this.props;
    const updateSD = this.props.sdData;
    updateSD.supplierRepName = openSDForm.supplierRepName.value;
    updateSD.supplierRepEmail = openSDForm.supplierRepEmail.value;
    updateSD.supplierRepNumber = openSDForm.supplierRepNumber.value;
    updateSD.assessmentReason = openSDForm.assessmentReason.value;
    updateSD.assessmentDate = openSDForm.assessmentDate.value;
    updateSD.comments = openSDForm.comments.value;
    updateSD.mediaImagePermission = openSDForm.mediaImagePermission.value ? true : false;
    updateSD.status = 'InProgress';

    this.state.supplierDiagnosis = updateSD;
    dispatch(updateWorklist(params.sdId, updateSD));

    const navURL = this.getUnAnsweredQuestionURL(updateSD);
    if (navURL) {
      dispatch(setLastUnAnsweredQuestionUrl(navURL));
    }

    dispatch(push('/checklistSection/' + updateSD.id));
  }

  render() {
    const setInitialValues = { initialValues: this.state.supplierDiagnosis };
    let sdStatus = '';
    if (this.state.supplierDiagnosis && this.state.supplierDiagnosis.status) {
      sdStatus = this.state.supplierDiagnosis.status === 'Open' ? 'Start' : 'Continue';
    }
    const reasonsList = this.props.reasonsData;
    const authdata = this.props.auth;
    const managerDetails = this.props.managerData;
    const isCompletedStatus = this.state.isCompleted;
    return (
      <div className="open-sd">
        <Header />
        <DownloadTemplate
          ref="attachment_popup"
          modal={this.props.modal}
          dispatch={this.props.dispatch}
          onConfirmClick={ this.handleDelete } />
        <ProcessSubHeader navInfo="WORKLIST" goBack={this.goBack} />
        <OpenSD
          { ...setInitialValues }
          supplierDiagnosis={ this.state.supplierDiagnosis }
          sdStatus={ sdStatus }
          modal={this.props.modal}
          onSubmit={ this.handleStart }
          downloadTemp={ this.downloadTempPopup }
          onCompleteClick={ this.downloadsummaryreports }
          reasonsList = { reasonsList }
          authdata = { authdata }
          managerDetails = { managerDetails }
          isCompletedStatus = { isCompletedStatus }
          isCRFailed= { this.state.isCRFailed }/>
      </div>
    );
  }
}

OpenSDContainer.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  params: PropTypes.object,
  sdData: PropTypes.object,
  reasonsData: PropTypes.func,
  managerData: PropTypes.string,
  openSDForm: PropTypes.object,
  auth: React.PropTypes.any,
  modal: PropTypes.object
};

function mapStateToProps(state) {
  return {
    sdData: state.worklistReducer.currentWorklist,
    openSDForm: state.form.openSDForm,
    reasonsData: state.createSDReducer.reasonslist,
    managerData: state.createSDReducer.managerdata,
    auth: state.authReducer.userAuth,
    modal: state.notificationsReducer
  };
}

export default connect(mapStateToProps)(OpenSDContainer);
