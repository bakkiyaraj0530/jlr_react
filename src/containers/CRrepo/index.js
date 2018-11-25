import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cssModules from 'react-css-modules';
import _ from 'lodash';
import styles from './CRrepo.scss';
import Header from '../Header';
import Complete from '../Complete';
import ProcessSubHeader from '../../components/ProcessSubHeader';
import TextInput from '../../components/FormElements/TextInput/TextInput';
import ImagePreview from '../../components/ImagePreview';
import { save } from '../../actions/SyncActions.js';
import { get, updateAnswerToWorklist, setLastUnAnsweredQuestionUrl } from '../../actions/processActions';
import { config } from '../../config/config';

const prev = require('assets/images/icon-prev-arrow-white.svg');
const next = require('assets/images/icon-next-arrow-white.svg');
const imageUpload = require('assets/images/icon-image-attach.svg');
const imageActive = require('assets/images/icon-image-attach-green.svg');
const audioUpload = require('assets/images/icon-voice-attach.svg');
const audioPlay = require('assets/images/icon-voice-attach-green.svg');

@cssModules(styles)
class Crresponsible extends Component {

  constructor(props) {
    super(props);
    this.back = this.back.bind(this);
    this.next = this.next.bind(this);
    this.crConfirm = this.crConfirm.bind(this);
    this.commentsDetail = this.commentsDetail.bind(this);
    this.state = {
      question: null,
      selectedScore: '',
      isCompleted: false,
      totalNumberOfQuestion: 0,
      comments: '',
      isCRFailed: false,
      isCRConducted: false,
      errorpopup: false,
      uploadError: false,
      imageSRC: '',
      imageAvail: false,
      previewIsOpen: false,
      audioSRC: '',
      audioPlayback: false,
      questionNumber: ''
    };

    this.imageClick = this.imageClick.bind(this);
    this.closePreview = this.closePreview.bind(this);
    this.imageUpload = this.imageUpload.bind(this);
    this.audioClick = this.audioClick.bind(this);
    this.audioChange = this.audioChange.bind(this);
    this.audioUpload = this.audioUpload.bind(this);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    dispatch(setLastUnAnsweredQuestionUrl(null));
    this.state.questionNumber = params.questionId;
    dispatch(get('/CorporateResponsibilityQuestions', 'crquestionset'));
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.getQuestion();
  }

  componentWillUnmount() {
    this.submitScore();
  }

  getQuestion() {
    const currentWorklist = this.props.worklistReducer.currentWorklist;
    const currentQuestionSet = this.props.processReducer.questionSet;
    const currentQuestion = _.find(currentQuestionSet.questionsList, { questionNumber: '' + this.state.questionNumber });
    const questionNumerVal = '' + this.state.questionNumber;
    const that = this;
    currentQuestion.comments = '';
    currentQuestion.sectionTitle = 'Corporate Responsibility';
    if (currentWorklist && currentWorklist.assessSections && currentWorklist.assessSections.length > 0) {
      const assessSection = _.find(currentWorklist.assessSections, { sectionNumber: '0' });
      if (assessSection.answers !== null) {
        assessSection.answers.map((answer) => {
          if (answer.questionNumber === questionNumerVal) {
            if (currentQuestion) {
              currentQuestion.score = answer.score;
              currentQuestion.comments = answer.comments;
              that.setState({
                question: currentQuestion,
                questionNumber: currentQuestion.questionNumber,
                totalNumberOfQuestion: currentQuestionSet.questionsList.length,
                selectedScore: answer.score,
                isCompleted: that.isComplete(),
                comments: answer.comments
              });
              return;
            }
          }
        });
      }
      that.setState({
        question: currentQuestion,
        questionNumber: currentQuestion.questionNumber,
        totalNumberOfQuestion: currentQuestionSet.questionsList.length,
        isCompleted: that.isComplete()
      });
    } else {
      this.setState({
        question: currentQuestion,
        questionNumber: currentQuestion.questionNumber,
        totalNumberOfQuestion: currentQuestionSet.questionsList.length,
        isCompleted: false,
        comments: ''
      });
    }
  }

  isComplete() {
    const worklist = this.props.worklistReducer.currentWorklist;
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

  completeDiagnosis() {
  }

  imageClick() {
    if (!this.state.imageAvail) {
      const imageInput = document.getElementById('image-input');
      imageInput.click();
    } else if (this.state.imageAvail) {
      this.setState({ previewIsOpen: true });
    }
  }

  closePreview() {
    this.setState({ previewIsOpen: false });
  }

  imageUpload() {
    const { dispatch, params } = this.props;
    const imageInput = document.getElementById('image-input');
    const imageInputObj = window.FileAPI.getFiles(imageInput)[0];

    this.checkImage(imageInputObj);

    if (!this.state.uploadError) {
      window.FileAPI.readAsDataURL(imageInputObj, (evt) => {
        if (evt.type === 'load') {
          this.setState({ imageSRC: evt.result });
        }
      });

      this.setState({ imageAvail: true });
      dispatch(save('/' + params.sdId + '/Section/0/Subsection/0/Question/' + params.questionId + '/Image', 'post', imageInputObj, true));
    }
  }

  checkImage(imageObj) {
    const maxImageSize = config().maximumImageSize;
    const type = imageObj.type;

    if (imageObj) {
      if (imageObj.size < maxImageSize) {
        if (type !== '') {
          if (type.indexOf('image/bmp') || type.indexOf('image/gif') || type.indexOf('image/jpeg') || type.indexOf('image/png')) {
            this.setState({ uploadError: false });
          } else {
            this.setState({ uploadError: 'Supported image types are PNG, BMP, GIF, JPEG' });
          }
        } else {
          this.setState({ uploadError: 'The file is not a valid image format' });
        }
      } else {
        this.setState({ uploadError: 'Image attachment size must be ' + maxImageSize / maxImageSize + 'MB or less' });
      }
    }
  }

  audioClick() {
    if (!this.state.audioPlayback) {
      if (window.cordova) {
        document.addEventListener('deviceready', () => {
          navigator.device.capture.captureAudio(this.audioCaptureSuccess, this.audioCaptureError);
        });
      } else {
        const audioInput = document.getElementById('audio-input');
        audioInput.click();
      }
    } else if (this.state.audioPlayback) {
      if (window.cordova) {
        document.addEventListener('deviceready', () => {
          const audioRecPlay = new window.Media(this.state.audioSRC);
          audioRecPlay.play();
        });
      } else {
        const audioElem = document.getElementById('audio-playback');
        return audioElem.paused ? audioElem.play() : audioElem.pause();
      }
    }
  }

  audioCaptureSuccess(audioFile) {
    console.log(audioFile[0]);
    // this.setState({ audioSRC: audioFile[0].localURL });
  }

  audioCaptureError(error) {
    console.log(error);
  }

  audioChange(e) {
    const audioInputObj = window.FileAPI.getFiles(e.currentTarget)[0];

    if (audioInputObj) {
      window.FileAPI.readAsDataURL(audioInputObj, (evt) => {
        if (evt.type === 'load') {
          document.getElementById('audio-playback').src = evt.result;
        }
      });
    }
  }

  audioUpload(e) {
    const audioInput = document.getElementById('audio-input');
    const audioObj = window.FileAPI.getFiles(audioInput)[0];

    this.checkAudio(audioObj.type, e.currentTarget.duration);

    if (!this.state.uploadError) {
      this.setState({ audioPlayback: true });
      // dispatch(save(this.updateAnswerURL + '/Voice', 'post', audioObj, true));
    }
  }

  checkAudio(type, duration) {
    if (duration && duration < config().maximumAudioDuration) {
      if (type !== '') {
        if (type === 'audio/mp3' || type === 'audio/wav') {
          this.setState({ uploadError: false });
        } else {
          this.setState({ uploadError: 'Supported audio types are MP3 and WAV' });
        }
      } else {
        this.setState({ uploadError: 'The file is not a valid audio format' });
      }
    } else {
      this.setState({ uploadError: 'Voice note duration should not exceed 2 minutes' });
    }
  }

  back(e) {
    const questNumber = parseInt(this.state.questionNumber, 10);
    if (questNumber === 1 || this.state.errorpopup) {
      e.preventDefault();
    } else {
      this.submitScore();
      this.state.questionNumber = questNumber - 1;
      this.setState({
        question: null,
        selectedScore: '',
        isCompleted: false,
        totalNumberOfQuestion: 0
      });
    }
  }

  next(e) {
    const questNumber = parseInt(this.state.questionNumber, 10);
    if (questNumber === this.state.totalNumberOfQuestion || this.state.errorpopup) {
      e.preventDefault();
    } else {
      this.submitScore();
      this.state.questionNumber = questNumber + 1;
      this.setState({
        question: null,
        selectedScore: '',
        isCompleted: false,
        totalNumberOfQuestion: 0
      });
    }
  }

  submitScore() {
    const { dispatch, params } = this.props;
    const answer = {
      'sdId': params.sdId,
      'sectionNumber': '0',
      'subsectionNumber': '0',
      'questionNumber': this.state.question.questionNumber,
      'score': this.state.selectedScore,
      'comments': this.state.comments,
      'imageGetUrl': null,
      'imagePostUrl': null,
      'voiceGetUrl': null,
      'voicePostUrl': null
    };
    dispatch(save('/' + params.sdId + '/Section/0/Subsection/0/Question/' + this.state.question.questionNumber + '/Answer?cmsVersion=1.0', 'put', answer, false));
    dispatch(updateAnswerToWorklist(answer, '0', '0'));
  }

  commentsDetail(e) {
    this.state.comments = e;
    if ((!e) || (!e.length)) {
      this.setState({
        errorpopup: true
      });
    } else {
      this.setState({
        errorpopup: false
      });
    }
  }

  crConfirm(e) {
    if (e.target.value === 'YES') {
      this.setState({
        selectedScore: 'Y',
        errorpopup: false
      });
    } else {
      this.setState({
        selectedScore: 'N',
        errorpopup: !this.state.comments ? true : false
      });
    }
  }

  render() {
    const question = this.state.question;
    const isEmpty = (question !== null) ? false : true;
    const defaulttext = 'User can add comments here….';
    const isError = (this.state.errorpopup);
    return (<div className="quest-container">
      <Header/>
      <ProcessSubHeader goBack={this.goBack}>Corporate Responsibility</ProcessSubHeader>
      {
        !isEmpty ?
        <div className="quest-content main-Crinfo">
          <div className="back-NextDiv">
            <div className="back-adjust">
              <span className={'back-Data' + ' ' + (question.questionNumber !== '1' ? 'qactive' : 'qinactive')} onClick={ this.back }> <img src={prev}/> PREV </span>
              <span className="set-number">{ question.questionNumber + ' OF ' + this.state.totalNumberOfQuestion }</span>
              <span className={'next-Data' + ' ' + (question.questionNumber !== ('' + this.state.totalNumberOfQuestion) ? 'qactive' : 'qinactive') } onClick={ this.next }> NEXT <img src={next}/></span>
            </div>
          </div>
          <div className="content question-container"></div>
          { isError ? <div className="errorMessage">You must provide mandatory details comments before navigating away. If mandatory fields are not completed the question will not be updated.</div> : ' '}
          <div className="questionin-focss">{question.question}</div>
          <div className="button-sample">
            <button className= { (this.state.selectedScore === 'Y') ? 'YesAns-select' : 'YesAns' } value="YES" onClick= { this.crConfirm }> YES </button>
            <button className={(this.state.selectedScore === 'N') ? 'NoAns-select' : 'NoAns'} value="NO" onClick={ this.crConfirm }> NO </button>
          </div>
          <hr/>
          <div className="button-sample1">
            <TextInput className="cr-textarea" onChange={this.commentsDetail} data={this.state.comments} placeholder={ defaulttext }>COMMENTS</TextInput>
          </div>
          <hr/>

          <div className="attachment-section center-text">
            <div className="file-upload attachment-btn" onClick={ this.imageClick }>
              <img src={ this.state.imageAvail ? imageActive : imageUpload } />
              <input type="file" accept="image/*" id="image-input" className="upload" onChange={ this.imageUpload } capture />
            </div>

            <div className="attachment-btn vertical-line"></div>

            <div className="file-upload attachment-btn" onClick={ this.audioClick }>
              <img src={ this.state.audioPlayback ? audioPlay : audioUpload } />
              <input type="file" accept="audio/*" id="audio-input" className="upload" onChange={ this.audioChange } capture />
            </div>

            <audio id="audio-playback" className="hide-div" onCanPlayThrough={ this.audioUpload }></audio>

            <div>{ this.state.uploadError && <div className="upload-error">{ this.state.uploadError }</div> }</div>
          </div>
          </div> : ' '
      }
      <Complete isCompleted={ this.state.isCompleted } screenName="CRQuestion" onClickButton={ this.completeDiagnosis } isCRFailed={ this.state.isCRFailed }/>
      <ImagePreview closePreview={ this.closePreview } previewState={ this.state.previewIsOpen } imageSource={ this.state.imageSRC } />
    </div>);
  }
}

function mapStateToProps(state) {
  return {
    processReducer: state.processReducer,
    worklistReducer: state.worklistReducer
  };
}

Crresponsible.propTypes = {
  processReducer: PropTypes.object,
  worklistReducer: PropTypes.object,
  params: PropTypes.object,
  dispatch: PropTypes.func,
  comments: PropTypes.string,
  errorpopup: PropTypes.bool
};
export default connect(mapStateToProps)(Crresponsible);
