import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import { Link } from 'react-router';

import styles from './checklistSubSection.scss';
const chevronRight = require('assets/images/icon-question-nav-fwd.svg');

@cssModules(styles)
class ChecklistSubSection extends Component {

  render() {
    const progress = {
      width: this.props.data.progress + '%'
    };
    return (<li className="large-3 small-10 checklist-item quest-subset-item">
          <Link className="no-underline fullWidth" to={ 'questionSet/' + this.props.sdId + '/' + this.props.sectionId + '/' + this.props.data.subsectionNumber }>
            <div className="vertical-center-container small-1">
              <div className="section-nameque">{ this.props.data.subsectionNumber }</div>
            </div>
            <div className="vertical-center-container small-7">
             <div className="score-sub-quest">{ this.props.data.subsectionTitle }</div>
            </div>
             <div className="vertical-center-container vertical-center-container-img small-2">
             <img className="list-chevque" src={chevronRight} />
             </div>
          </Link><div className="sub-section-progressbar" style={progress}></div>
      </li>);
  }
}

ChecklistSubSection.propTypes = {
  data: PropTypes.string.isRequired,
  sdId: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired
};
export default ChecklistSubSection;
