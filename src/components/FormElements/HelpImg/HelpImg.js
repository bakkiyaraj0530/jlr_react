import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './helpImg.scss';
const helpIcon = require('assets/images/icon-help.svg');

class HelpImg extends Component {
  showMessage(help) {
    const messageObj = {
      message: help
    };
    this.props.openModal(messageObj);
  }
  render() {
    const { help, id } = this.props;
    return (<img id={id} src={helpIcon} className="help-icon" onClick={this.showMessage.bind(this, help)}/>);
  }
}
HelpImg.propTypes = {
  id: PropTypes.string,
  help: PropTypes.string,
  openModal: PropTypes.func
};
export default cssModules(HelpImg, styles);
