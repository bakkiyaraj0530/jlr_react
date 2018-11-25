import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import _ from 'lodash';
import styles from './question.scss';
import TextInput from '../FormElements/TextInput/TextInput';

const book = require('assets/images/icon-book.svg');
const imageUpload = require('assets/images/icon-image-attach.svg');
const imageActive = require('assets/images/icon-image-attach-green.svg');
const audioUpload = require('assets/images/icon-voice-attach.svg');
const audioPlay = require('assets/images/icon-voice-attach-green.svg');
const prev = require('assets/images/icon-prev-arrow-white.svg');
const next = require('assets/images/icon-next-arrow-white.svg');

@cssModules(styles)
class Question extends Component {
  constructor() {
    super();
    this.state = {
      scoreColors: [{ '-1': '#9E1B32' }, { '0': '#E2D5BE' }, { '1': '#E2D5BE' }, { '2': '#E2D5BE' }, { '3': '#E2D5BE' }, { '4': '#005A2B' }]
    };
  }

  render() {
    const {
      question,
      selectedScore,
      onScoreChange,
      onCommentsChange,
      onPrevious,
      onNext,
      totalNumberOfQuestion,
      imageAvail,
      handleImageClick,
      handleImageUpload,
      audioPlayback,
      handleAudioClick,
      handleAudioChange,
      handleAudioUpload,
      uploadError
    } = this.props;
    const that = this;
    const defaulttext = 'User can add comments here…';

    return (
      <div className="main-Crinfo">
      <div className="back-NextDiv">
         <div className="back-adjust">
            <span className={'back-Data' + ' ' + (question.questionNumber !== '1' ? 'qactive' : 'qinactive')} onClick={ onPrevious }> <img src={prev}/> PREV </span>
            <span className="set-number">{ question.questionNumber + ' OF ' + totalNumberOfQuestion }</span>
            <span className={'next-Data' + ' ' + (question.questionNumber !== ('' + totalNumberOfQuestion) ? 'qactive' : 'qinactive') } onClick={ onNext }> NEXT <img src={next}/></span>
         </div>
      </div>
      <div className="content question-container">
        <div id="quest-info-cont">
          <div id="quest-descp">
            <p>{ question.questionText }</p>
          </div>
          <img className="quest-book" src={ book } />
        </div>

        <div className="checkout">
          <form id="quest-form">
            {
              question.options.map((answerOption, index) => {
                const color = _.find(that.state.scoreColors, answerOption.optionPoints);
                let scoreColor = {};

                if (selectedScore === answerOption.optionPoints) {
                  scoreColor = {
                    'backgroundColor': color['' + answerOption.optionPoints]
                  };
                }

                return (
                  <div key={index} onClick={ onScoreChange.bind(this, answerOption.optionPoints) } className="answer-option-left">
                    <div className="answer-option-content">
                      <div className="vertical-center-container">
                        <div className="empty-score-icon" style={ scoreColor }>{ answerOption.optionPoints }</div>
                      </div>

                      <div className="vertical-center-container">
                        <div className="answer-desc">{ answerOption.optionText }</div>
                      </div>
                    </div>
                  </div>
                );
              })
            }

          <div className="button-sample1 cr-textarea">
            <label></label>
            <TextInput placeholder={ defaulttext } onChange={ onCommentsChange } >COMMENTS</TextInput>
          </div>

            <div className="comment-bar"></div>

            <div className="attachment-section center-text">
              <div className="file-upload attachment-btn" onClick={ handleImageClick }>
                <img src={ imageAvail ? imageActive : imageUpload } />
                <input type="file" accept="image/*" id="image-input" className="upload" onChange={ handleImageUpload } capture />
              </div>

              <div className="attachment-btn vertical-line"></div>

              <div className="file-upload attachment-btn" onClick={ handleAudioClick }>
                <img src={ audioPlayback ? audioPlay : audioUpload } />
                <input type="file" accept="audio/*" id="audio-input" className="upload" onChange={ handleAudioChange } capture />
              </div>

              <audio id="audio-playback" className="hide-div" onCanPlayThrough={ handleAudioUpload }></audio>

              <div>{ uploadError && <div className="upload-error">{ uploadError }</div> }</div>
            </div>
          </form>
        </div>
      </div>
      </div>
      );
  }
}

Question.propTypes = {
  question: PropTypes.object.isRequired,
  totalNumberOfQuestion: PropTypes.number,
  onScoreChange: PropTypes.func.isRequired,
  onCommentsChange: PropTypes.func.isRequired,
  selectedScore: PropTypes.string,
  imageAvail: PropTypes.bool,
  audioPlayback: PropTypes.bool,
  handleImageClick: PropTypes.func.isRequired,
  handleImageUpload: PropTypes.func.isRequired,
  handleAudioClick: PropTypes.func.isRequired,
  handleAudioChange: PropTypes.func.isRequired,
  handleAudioUpload: PropTypes.func.isRequired,
  uploadError: PropTypes.any,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default Question;
