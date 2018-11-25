import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import { Link } from 'react-router';
import _ from 'lodash';
import styles from './questionSet.scss';

const chevronRight = require('assets/images/icon-question-nav-fwd.svg');

@cssModules(styles)
class QuestionSet extends Component {

  constructor() {
    super();
    this.state = {
      scoreColors: [{ '-1': '#9E1B32' }, { '0': '#E2D5BE' }, { '1': '#E2D5BE' }, { '2': '#E2D5BE' }, { '3': '#E2D5BE' }, { '4': '#005A2B' }, { '': '#8c8c8c' }]
    };
  }

  render() {
    const { question } = this.props;
    const color = _.find(this.state.scoreColors, question.score);
    const scoreColor = {
      'backgroundColor': color['' + question.score]
    };

    return (
      <li className="large-3 small-10 checklist-item quest-set-item">
        <Link className="no-underline" to={ 'question/' + this.props.sdId + '/' + this.props.sectionId + '/' + this.props.subSectionId + '/' + question.questionNumber }>
          <div className="vertical-center-container">
            <div className="score-info">
              <div className="score-item score-icon" >{ 'Q' + question.questionNumber }</div>
              <div className="score-item mark-icon" style={scoreColor}>{ question.score === '' ? '?' : question.score }</div>
            </div>
          </div>

          <div className="vertical-center-container">
            <div className="score-quest">{ question.questionText }</div>
          </div>

          <div className="vertical-center-container vertical-center-container-img">
            <img className="list-chevron" src={ chevronRight } />
          </div>
        </Link>
      </li>
    );
  }
}

QuestionSet.propTypes = {
  question: PropTypes.object.isRequired,
  sdId: PropTypes.string,
  sectionId: PropTypes.string,
  subSectionId: PropTypes.string
};

export default QuestionSet;
