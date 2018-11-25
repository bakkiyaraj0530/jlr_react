import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-router';
import ProcessSubHeader from '../../components/ProcessSubHeader';
import QuestionSetItem from '../../components/QuestionSet';
import Complete from '../Complete';
import { get } from '../../actions/processActions';
import Header from '../Header';
import _ from 'lodash';

class QuestionSet extends Component {

  constructor() {
    super();
    this.state = {
      questionSet: null,
      isCompleted: false,
      isCRConducted: false,
      isCRFailed: false
    };
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    if (this.props.processReducer.unAnsweredQuestionUrl) {
      const sd = this.props.worklistReducer.currentWorklist;
      const unAnsweredQuestionUrl = this.props.processReducer.unAnsweredQuestionUrl.split('/');
      dispatch(push('/question/' + sd.id + '/' + unAnsweredQuestionUrl[1] + '/' + unAnsweredQuestionUrl[3] + '/' + unAnsweredQuestionUrl[5]));
    } else {
      dispatch(get('/CheckList/Sections/' + params.sectionId + '/Subsections/' + params.subSectionId + '/Questions', 'questionset'));
    }
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.getQuestion();
  }

  getQuestion() {
    const { params } = this.props;
    const questionSet = this.props.processReducer.questionSet;

    const currentWorklist = this.props.worklistReducer.currentWorklist;
    if (questionSet !== null && currentWorklist.assessSections && currentWorklist.assessSections.length > 0) {
      const assessSection = _.find(currentWorklist.assessSections, { 'subsectionNumber': params.subSectionId });
      const answers = assessSection.answers;
      if (answers !== null && answers.length > 0) {
        questionSet.questions.map((question, index) => {
          const answer = _.find(answers, { 'questionNumber': question.questionNumber });
          if (answer) {
            questionSet.questions[index].score = answer.score;
          } else {
            questionSet.questions[index].score = '';
          }
        });
      } else {
        questionSet.questions.map((question, index) => {
          questionSet.questions[index].score = '';
        });
      }
    }

    this.setState({
      questionSet: questionSet,
      isCompleted: this.isComplete()
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
    } else if (isCRCompletionWithFail) {
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
    const questionSet = this.state.questionSet;
    const { params } = this.props;
    return (<div className="quest-container">
        <Header />
        <ProcessSubHeader
          isHelpRequired={ questionSet !== null ? questionSet.subsectionDescription : '' }
          dispatch={this.props.dispatch}>{ questionSet !== null ? questionSet.subsectionTitle : '' }</ProcessSubHeader>
        <div className="quest-content">
        {
        (questionSet !== null) ?
          <ul className="unorderlist">{
            questionSet.questions.map((question, i) => {
              return (<QuestionSetItem key={i} question={question} sdId={ params.sdId } sectionId={ params.sectionId } subSectionId={ params.subSectionId }/>);
            })
        }</ul> : ' ' }</div>
        <Complete isCompleted={ this.state.isCompleted } screenName="QuestionSet" onClickButton={ this.completeDiagnosis } isCRFailed= { this.state.isCRFailed }/></div>);
  }
}
QuestionSet.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.object,
  processReducer: PropTypes.object,
  worklistReducer: PropTypes.object
};

function mapStateToProps(state) {
  return {
    processReducer: state.processReducer,
    worklistReducer: state.worklistReducer
  };
}

export default connect(mapStateToProps)(QuestionSet);
