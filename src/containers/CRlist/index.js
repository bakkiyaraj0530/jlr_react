import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import { connect } from 'react-redux';
import { push } from 'redux-router';
import { Link } from 'react-router';
import _ from 'lodash';
import Header from '../Header';
import Complete from '../Complete';
import ProcessSubHeader from '../../components/ProcessSubHeader';
import styles from './CRlist.scss';
import { get } from '../../actions/processActions';
const chevronRight = require('assets/images/icon-question-nav-fwd.svg');

@cssModules(styles)
class CRlist extends Component {

  constructor(props) {
    super(props);
    this.state = {
      questionSet: null,
      isCompleted: false,
      isCRFailed: false,
      isCRConducted: false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.processReducer.unAnsweredQuestionUrl) {
      const sd = this.props.worklistReducer.currentWorklist;
      const unAnsweredQuestionUrl = this.props.processReducer.unAnsweredQuestionUrl.split('/');
      dispatch(push('/CRinfo/' + sd.id + '/' + unAnsweredQuestionUrl[5]));
    } else {
      dispatch(get('/CorporateResponsibilityQuestions', 'crquestionset'));
    }
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.getQuestion();
  }

  getQuestion() {
    const questionSet = this.props.processReducer.questionSet;
    const currentWorklist = this.props.worklistReducer.currentWorklist;
    if (questionSet !== null && currentWorklist.assessSections && currentWorklist.assessSections.length > 0) {
      const assessSection = _.find(currentWorklist.assessSections, { 'sectionNumber': '0' });
      const answers = assessSection.answers;
      if (answers !== null && answers.length > 0) {
        questionSet.questionsList.map((question, index) => {
          const answer = _.find(answers, { 'questionNumber': question.questionNumber });
          if (answer) {
            questionSet.questionsList[index].score = answer.score;
          } else {
            questionSet.questionsList[index].score = '';
          }
        });
      } else {
        questionSet.questionsList.map((question, index) => {
          questionSet.questionsList[index].score = '';
        });
      }
    }
    this.state.isCompleted = this.isComplete();
    this.setState({
      questionSet: questionSet
    });
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

  render() {
    const { params } = this.props;
    const questionSet = this.state.questionSet;
    return (<div className="quest-container">
      <Header />
      <ProcessSubHeader goBack={this.goBack}>Corporate Responsibility</ProcessSubHeader>
      <div className="quest-content">
      {
        (questionSet !== null) ?
        <ul className="unorderlist">
				{
          questionSet.questionsList.map((question) => {
            return (
              <li className="large-3 small-10 checklist-item quest-set-item">
                <Link className="no-underline" to={'/CRinfo/' + params.sdId + '/' + question.questionNumber}>
                  <div className="vertical-center-container">
                    <div className="score-info">
                      <div className="score-item score-icon">{ 'Q' + question.questionNumber}</div>
                      <div className={ 'score-icon1' + '  ' + ((question.score === 'Y') ? 'yesans-select' : ' ') + '  ' + ((question.score === 'N') ? 'noans-select' : ' ')}></div>
                    </div>
                  </div>

                  <div className="vertical-center-container ">
                    <div className="score-quest">{ question.question }</div>
                  </div>

                  <div className="vertical-center-container vertical-center-container-img">
                    <img className="list-chevron" src={ chevronRight } />
                  </div>
                </Link>
              </li>);
          })
        }</ul> : ' ' }
    </div>
    <Complete isCompleted={ this.state.isCompleted } screenName="CRQuestionSet" onClickButton={ this.completeDiagnosis } isCRFailed={ this.state.isCRFailed }/>
	</div>);
  }
}

function mapStateToProps(state) {
  return {
    processReducer: state.processReducer,
    worklistReducer: state.worklistReducer
  };
}
CRlist.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.object,
  processReducer: PropTypes.object,
  worklistReducer: PropTypes.object
};
export default connect(mapStateToProps)(CRlist);
