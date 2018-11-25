import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-router';
import _ from 'lodash';

import Header from '../Header';
import Complete from '../Complete';
import ChecklistComponent from '../../components/ChecklistSection';
import ProcessSubHeader from '../../components/ProcessSubHeader';
import { get } from '../../actions/processActions';

class ChecklistSection extends Component {

  constructor() {
    super();
    this.state = {
      checklist: [],
      isCompleted: false,
      isCRConducted: false,
      isCRFailed: false
    };
    this.completeDiagnosis = this.completeDiagnosis.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;

    if (this.props.processReducer.unAnsweredQuestionUrl) {
      const sd = this.props.worklistReducer.currentWorklist;
      const unAnsweredQuestionUrl = this.props.processReducer.unAnsweredQuestionUrl.split('/');
      if (unAnsweredQuestionUrl[1] === '0') {
        dispatch(push('/crlink/' + sd.id + '/' + unAnsweredQuestionUrl[1]));
      } else {
        dispatch(push('/checklistSubSection/' + sd.id + '/' + unAnsweredQuestionUrl[1]));
      }
    } else {
      dispatch(get('/CheckList/Sections?assessmentType=1', 'assesssection'));
    }
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.setState({
      checklist: this.sdProgressed(),
      isCompleted: this.isComplete(),
      allowAccess: this.checkAccess(),
      crIcon: this.checkIcon()
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

  sdProgressed() {
    const sd = this.props.worklistReducer.currentWorklist;
    const crsections = {
      'sectionNumber': '0',
      'sectionTitle': 'Corporate responsibility'
    };

    let sections = [];
    if (this.props.processReducer.assessSection !== null) {
      sections = this.props.processReducer.assessSection.sections;
      const crSectionIndex = _.findIndex(sections, (section) => { return section.sectionNumber === '0'; });
      if (crSectionIndex === -1) {
        sections.unshift(crsections);
      }
    }

    if (sections.length !== 0) {
      sections.map((section, index) => {
        const subSections = _.filter(sd.assessSections, { 'sectionNumber': section.sectionNumber });
        let totalQuestions = 0;
        let answeredCount = 0;

        subSections.map((subSection) => {
          totalQuestions += subSection.questionCount;
          if (subSection.answers && subSection.answers.length > 0) {
            answeredCount += subSection.answers.length;
          }
        });
        sections[index].progress = answeredCount === 0 ? 0 : _.round((answeredCount * 100) / totalQuestions);
      });
    }

    return sections;
  }

  checkAccess() {
    return (this.state.isCRConducted && !this.state.isCRFailed) ? true : false;
  }

  checkIcon() {
    if (this.state.isCRConducted) {
      return this.state.isCRFailed ? 'Blocksec' : 'Allowsec';
    }
    return 'Notconduct';
  }

  completeDiagnosis() {
  }

  render() {
    const { params } = this.props;
    const checkdata = (this.state.checklist === undefined) ? true : false;
    return (<div className="quest-container">
      <Header />
      <ProcessSubHeader>Supplier Diagnostic - Pre-source health check</ProcessSubHeader>
      <div className="quest-content large-12">
        { !checkdata ?
        <ul className="small-centered unorderlist">
          {
            this.state.checklist.map((section, index)=>{
              return (<ChecklistComponent key={index} data={section} sdId={params.sdId} isAccess={this.state.allowAccess} crIcon={this.state.crIcon}/>);
            })
          }
        </ul> : 'Loading...'
         }
      </div>
      <Complete isCompleted={ this.state.isCompleted } screenName="ChecklistSection" onClickButton={ this.completeDiagnosis } isCRFailed={this.state.isCRFailed}/>
    </div>);
  }
}
function mapStateToProps(state) {
  return {
    processReducer: state.processReducer,
    worklistReducer: state.worklistReducer
  };
}

ChecklistSection.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.object,
  processReducer: PropTypes.object,
  worklistReducer: PropTypes.object
};

export default connect(mapStateToProps)(ChecklistSection);
