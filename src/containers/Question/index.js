import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fileapi } from 'fileapi';
import ProcessSubHeader from '../../components/ProcessSubHeader';
import QuestionComponent from '../../components/Question';
import ImagePreview from '../../components/ImagePreview';
import Complete from '../Complete';
import Header from '../Header';
import { save } from '../../actions/SyncActions';
import { get, updateAnswerToWorklist, setLastUnAnsweredQuestionUrl, getMedia } from '../../actions/processActions';
import { config } from '../../config/config';

class Question extends Component {

  constructor(props) {
    super(props);

    this.state = {
      question: null,
      questionNumber: '',
      selectedScore: '',
      comments: '',
      isCompleted: false,
      totalNumberOfQuestion: 0,
      isCRFailed: false,
      isCRConducted: false,
      uploadError: false,
      imageSRC: '',
      imageAvail: false,
      getImgUrl: '',
      previewIsOpen: false,
      audioSRC: '',
      audioPlayback: false
    };

    // const { params } = this.props;

    // this.answerURL = '/' + params.sdId + '/Section/' + params.sectionNumber + '/Subsection/' + params.subSectionNumber + '/Question/' + params.questionNumber;
    this.updateAnswerURL = '/1/Section/2.1/Subsection/2.1.1/Question/4';
    this.submitScore = this.submitScore.bind(this);
    this.imageClick = this.imageClick.bind(this);
    this.closePreview = this.closePreview.bind(this);
    this.imageUpload = this.imageUpload.bind(this);
    this.audioClick = this.audioClick.bind(this);
    this.audioChange = this.audioChange.bind(this);
    this.audioUpload = this.audioUpload.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.onScoreChange = this.onScoreChange.bind(this);
    this.onCommentsChange = this.onCommentsChange.bind(this);

    if (fileapi) {
      return;
    }
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    dispatch(setLastUnAnsweredQuestionUrl(null));
    this.state.questionNumber = params.questionId;
    dispatch(get('/CheckList/Sections/' + params.sectionId + '/Subsections/' + params.subSectionId + '/Questions', 'questionset'));
    if (this.state.getImgUrl) {
      dispatch(getMedia('/' + params.sdId + '/Sections/' + params.sectionId + '/Subsections/' + params.subSectionId + '/Questions/' + params.questionId + '/Image'));
    }
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.getQuestion();
  }

  componentWillUnmount() {
    this.submitScore();
  }

  onScoreChange(score) {
    this.setState({ selectedScore: score });
  }

  onCommentsChange(comments) {
    this.state.comments = comments;
  }

  onPrevious(e) {
    const questNumber = parseInt(this.state.question.questionNumber, 10);

    if (questNumber === 1) {
      e.preventDefault();
    } else {
      this.submitScore();
      this.state.questionNumber = questNumber - 1;
      this.setState({
        question: null,
        selectedScore: '',
        comments: '',
        isCompleted: false,
        totalNumberOfQuestion: 0,
        imageAvail: false

      });
    }
  }

  onNext(e) {
    const questNumber = parseInt(this.state.question.questionNumber, 10);
    if (questNumber === this.state.totalNumberOfQuestion) {
      e.preventDefault();
    } else {
      this.submitScore();
      this.state.questionNumber = questNumber + 1;
      this.setState({
        question: null,
        selectedScore: '',
        comments: '',
        isCompleted: false,
        totalNumberOfQuestion: 0,
        imageAvail: false
      });
    }
  }

  getQuestion() {
    const currentWorklist = this.props.worklistReducer.currentWorklist;
    const currentQuestionSet = this.props.processReducer.questionSet;
    const viewImage = this.props.processReducer.media;
    const { params } = this.props;
    const that = this;

    if (currentQuestionSet) {
      const currentQuestion = _.find(currentQuestionSet.questions, { questionNumber: '' + this.state.questionNumber });
      const assessSection = _.find(currentWorklist.assessSections, { subsectionNumber: params.subSectionId });
      currentQuestion.screenTitle = currentQuestionSet.subsectionTitle;
      currentQuestion.subsectionDescription = currentQuestionSet.subsectionDescription;
      if (assessSection.answers !== null) {
        assessSection.answers.map((answer) => {
          if (answer.questionNumber === currentQuestion.questionNumber) {
            if (currentQuestion) {
              currentQuestion.score = answer.score;
              currentQuestion.comments = answer.comments;
              that.state.totalNumberOfQuestion = assessSection.questionCount;
              if (answer.imageGetUrl && answer.imageGetUrl !== undefined && answer.imageGetUrl !== '') {
                currentQuestion.imageGetUrl = answer.imageGetUrl;
                this.updateImgUrl(answer.imageGetUrl);
                this.uploadImageState();
              }
              that.setState({
                question: currentQuestion,
                questionNumber: currentQuestion.questionNumber,
                selectedScore: answer.score,
                comments: currentQuestion.comments,
                totalNumberOfQuestion: currentQuestionSet.questions.length,
                isCompleted: that.isComplete(),
                imageSRC: (viewImage !== null && viewImage !== undefined && viewImage !== '') ? viewImage : ''
              });
              return;
            }
          }
        });
      }
      that.setState({
        question: currentQuestion,
        questionNumber: currentQuestion.questionNumber,
        totalNumberOfQuestion: currentQuestionSet.questions.length,
        isCompleted: that.isComplete()
      });
    }
  }

  uploadImageState() {
    this.setState({ imageAvail: true });
  }

  updateImgUrl(Url) {
    this.setState({ getImgUrl: Url });
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
      this.setState({ isCRFailed: true });
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

  submitScore() {
    const { dispatch, params } = this.props;
    const answer = {
      'sdId': params.sdId,
      'sectionNumber': params.sectionId,
      'subsectionNumber': params.subSectionId,
      'questionNumber': this.state.question.questionNumber,
      'score': this.state.selectedScore,
      'comments': this.state.comments
    };

    dispatch(save('/' + params.sdId + '/Section/' + params.sectionId + '/Subsection/' + params.subSectionId + '/Question/' + this.state.question.questionNumber + '/Answer?cmsVersion=1.1', 'put', answer, false));
    dispatch(updateAnswerToWorklist(answer, params.sectionId, params.subSectionId));
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
      dispatch(save('/' + params.sdId + '/Section/' + params.sectionId + '/Subsection/' + params.subSectionId + '/Question/' + params.questionId + '/Image', 'post', imageInputObj, true));
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
          /* const src = 'documents://voice-record.m4a';
          const options = {
            SampleRate: 8000,
            NumberOfChannels: 1
          };
          const voiceRec = new window.Media(src, this.recordSuccess, this.recordError);

          voiceRec.startRecordWithCompression(options); */
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

  /* recordSuccess(recording) {
    console.log(recording);
  } */

  audioCaptureSuccess(audioFile) {
    console.log(audioFile[0]);
    audioFile[0].getFormatData((data) => {
      console.log(data.codecs);
      console.log(data.duration);
    });

    /* this.setState({
      audioPlayback: true,
      audioSRC: audioFile[0].localURL
    }); */

    /* const audioRecPlay = new window.Media(audioRecPath, null, null, (e) => {
      console.log(e);
    });
    const audioRecDuration = audioRecPlay.getDuration();
    console.log(audioRecDuration);
    audioRecPlay.play(); */

    /* window.resolveLocalFileSystemURL(audioFile[0].localURL, (entry) => {
      console.log(entry.toURL());
      document.getElementById('audio-playback').src = entry.toURL(); */

      /* audioInput.file((audioInputObj) => {
        const reader = new FileReader();

        reader.onload = () => {
          document.getElementById('audio-playback').src = reader.result;
        };

        if (audioInputObj) {
          reader.readAsDataURL(audioInputObj);
        }
      }); */
    /* }, (error) => {
      console.log(error);
    }); */
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
    const { dispatch } = this.props;
    const audioInput = document.getElementById('audio-input');
    const audioObj = window.FileAPI.getFiles(audioInput)[0];

    this.checkAudio(audioObj.type, e.currentTarget.duration);

    if (!this.state.uploadError) {
      this.setState({ audioPlayback: true });
      dispatch(save(this.updateAnswerURL + '/Voice', 'post', audioObj, true));
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

  dataURItoBlob(dataURI) {
    const dataURIArr = dataURI.split(',');
    const byteString = dataURIArr[0].indexOf('base64') >= 0 ? atob(dataURIArr[1]) : unescape(dataURIArr[1]);

    // separate out the mime component
    const mimeString = dataURIArr[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const u8arr = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      u8arr[i] = byteString.charCodeAt(i);
    }

    return new Blob([u8arr], { type: mimeString });
  }

  render() {
    const isEmpty = (this.state.question !== null) ? false : true;

    return (
      <div className="quest-container">
        <Header />
        <ProcessSubHeader
          isHelpRequired={ !isEmpty ? this.state.question.subsectionDescription : '' }
          dispatch={this.props.dispatch}>{ !isEmpty ? this.state.question.screenTitle : '' }</ProcessSubHeader>
        <div className="quest-content">
          {
            !isEmpty ?
            <QuestionComponent
              question={this.state.question}
              onScoreChange={ this.onScoreChange }
              onCommentsChange={ this.onCommentsChange }
              selectedScore={ this.state.selectedScore }
              comments={ this.state.comments }
              totalNumberOfQuestion={ this.state.totalNumberOfQuestion }
              onPrevious={ this.onPrevious }
              onNext={ this.onNext }
              imageAvail={ this.state.imageAvail }
              audioPlayback={ this.state.audioPlayback }
              handleImageClick={ this.imageClick }
              handleImageUpload={ this.imageUpload }
              handleAudioClick={ this.audioClick }
              handleAudioChange={ this.audioChange }
              handleAudioUpload={ this.audioUpload }
              uploadError={ this.state.uploadError } />
            : ' '
          }
        </div>
        <Complete
          isCompleted={ this.state.isCompleted }
          screenName="Question"
          onClickButton={ this.completeDiagnosis }
          isCRFailed={ this.state.isCRFailed } />
        <ImagePreview
          closePreview={ this.closePreview }
          previewState={ this.state.previewIsOpen }
          imageSource={ this.state.imageSRC } />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    processReducer: state.processReducer,
    worklistReducer: state.worklistReducer
  };
}

Question.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.object,
  processReducer: PropTypes.object,
  worklistReducer: PropTypes.object
};

export default connect(mapStateToProps)(Question);
