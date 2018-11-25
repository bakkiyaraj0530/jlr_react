import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-router';
import _ from 'lodash';
import Header from '../Header';
import ChecklistSubItem from '../../components/ChecklistSubSection';
import ProcessSubHeader from '../../components/ProcessSubHeader';
import Complete from '../Complete';
import { get } from '../../actions/processActions';

class ChecklistSubSection extends Component {

  constructor() {
    super();
    this.state = {
      checklistSubSection: null,
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
      dispatch(push('/questionSet/' + sd.id + '/' + unAnsweredQuestionUrl[1] + '/' + unAnsweredQuestionUrl[3]));
    } else {
      dispatch(get('/CheckList/Sections/' + params.sectionId + '/Subsections', 'assesssubsection'));
    }
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.setState({
      checklistSubSection: this.sdProgressed(),
      isCompleted: this.isComplete()
    });
  }

  sdProgressed() {
    const sd = this.props.worklistReducer.currentWorklist;
    const assessSubSection = this.props.processReducer.assessSubSection;
    const subSections = assessSubSection.subsections;
    subSections.map((subSection, index) => {
      const answeredSubSection = _.filter(sd.assessSections, { 'subsectionNumber': subSection.subsectionNumber });
      let totalQuestions = 0;
      let answeredCount = 0;
      answeredSubSection.map((answeredsection) => {
        totalQuestions += answeredsection.questionCount;
        if (answeredsection.answers) {
          answeredCount += answeredsection.answers.length;
        }
      });
      subSections[index].progress = _.round((answeredCount * 100) / totalQuestions);
    });
    assessSubSection.subsections = subSections;
    return assessSubSection;
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
    const checklistSubSection = this.state.checklistSubSection;
    return (<div className="quest-container">
      <Header />
      <ProcessSubHeader>{ checklistSubSection !== null ? checklistSubSection.sectionTitle : '' }</ProcessSubHeader>
      <div className="quest-content large-12">
      {
        (checklistSubSection !== null) ?
        <ul className="small-centered unorderlist">
          {
            checklistSubSection.subsections.map((section, index)=>{
              return (<ChecklistSubItem key={index} data={section} sdId={ params.sdId } sectionId={ params.sectionId }/>);
            })
          }
        </ul> : ' ' }
      </div>
      <Complete isCompleted={ this.state.isCompleted } screenName="ChecklistSubSection" onClickButton={ this.completeDiagnosis } isCRFailed={ this.state.isCRFailed }/>
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

ChecklistSubSection.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.object,
  processReducer: PropTypes.object,
  worklistReducer: PropTypes.object
};
export default connect(mapStateToProps)(ChecklistSubSection);
