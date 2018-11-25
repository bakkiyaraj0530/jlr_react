import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import { Link } from 'react-router';

import styles from './checklistSection.scss';
const chevronRight = require('assets/images/icon-question-nav-fwd.svg');

@cssModules(styles)
class ChecklistSection extends Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if ((!this.props.isAccess) && (this.props.data.sectionNumber !== '0')) {
      e.preventDefault();
    }
  }

  render() {
    const { data, crIcon, isAccess } = this.props;
    const progress = {
      width: this.props.data.progress + '%'
    };

    return (<li className={'large-3 medium-4 small-10 checklist-item' + ((isAccess === false) ? ' other-notproceed' : '') }>
      <Link className="no-underline fullWidth"
        onClick={ this.handleClick }
        to={ ((data.sectionNumber) === '0') ? 'crlink/' + this.props.sdId + '/' + this.props.data.sectionNumber : 'checklistSubSection/' + this.props.sdId + '/' + data.sectionNumber }>
        <div className={ ((((data.sectionNumber) === '0') && (crIcon === 'Allowsec')) ? 'yesans-select show-div section-complete' : 'hide-div') + ' ' + ((((data.sectionNumber) === '0') && (crIcon === 'Blocksec')) ? 'noans-select show-div section-complete' : 'hide-div') }> </div>
        <div className={ ((((data.sectionNumber) === '0') && (crIcon === 'Notconduct')) ? 'section-name' : 'hide-div') + ' ' + (((data.sectionNumber) !== '0') ? 'section-name' : ' ') }>{ data.sectionNumber }</div>
        <div className="content-partName">{ data.sectionTitle }</div>
        <img className="list-chev" src={chevronRight} />
      </Link>
      <div className={ ((data.sectionNumber) !== '0') ? 'section-progressbar' : 'section-progressbar-cr' } style={progress}></div>
      </li>);
  }
}

ChecklistSection.propTypes = {
  data: PropTypes.object.isRequired,
  sdId: PropTypes.string,
  isAccess: PropTypes.bool.isRequired,
  crIcon: PropTypes.string.isRequired
};
export default ChecklistSection;
