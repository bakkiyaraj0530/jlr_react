import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './processSubHeader.scss';
import { push } from 'redux-router';
import { showConfirmPopup } from '../../actions/notificationsActions';
const backIcon = require('assets/images/icon-back-arrow.svg');
const helpIcon = require('assets/images/icon-help.svg');

@cssModules(styles)
class ProcessSubHeader extends Component {

  goBack() {
    const { dispatch, navInfo } = this.props;
    if (navInfo === 'WORKLIST') {
      dispatch(push('/worklist'));
    } else {
      window.history.back();
    }
  }

  showInfoPopup() {
    const { dispatch, isHelpRequired } = this.props;
    dispatch(showConfirmPopup(isHelpRequired, true));
  }

  render() {
    const { isHelpRequired, navInfo } = this.props;

    return (
      <div className="fullWidth process-header fixed-header">
        <div className={'back-image columns' + navInfo ? 'small-8' : 'small-2' }>
           <img className="back-icon" src={backIcon} onClick={ this.goBack.bind(this) }/><span className="back-icon">{ navInfo ? navInfo : '' }</span>
        </div>
        <div className="content-part medium-offset-2 small-8">
          { this.props.children }
        </div>
        {
          isHelpRequired ? <img className="small-2 process-help-icon" src={ helpIcon } onClick={ this.showInfoPopup.bind(this) }/> : ''
        }
    </div>);
  }
}

ProcessSubHeader.propTypes = {
  children: PropTypes.string,
  isHelpRequired: PropTypes.string,
  navInfo: PropTypes.string,
  dispatch: PropTypes.any
};

export default ProcessSubHeader;
