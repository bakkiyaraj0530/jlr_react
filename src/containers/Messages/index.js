import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './messages.scss';

const closeIcon = require('assets/images/icon-x-white.svg');

@cssModules(styles)
class Message extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messageState: true
    };

    this.closeMessage = this.closeMessage.bind(this);
    this.openMessage = this.openMessage.bind(this);
  }

  openMessage() {
    this.setState({ messageState: true });
  }

  closeMessage() {
    this.setState({ messageState: false });
  }

  render() {
    const { messageType, children } = this.props;
    const messageClass = this.state.messageState ? 'show-div' : 'hide-div';

    return (
      <div className={ messageClass + ' message-content ' + messageType + '-message' }>
        <div><span className="message-text">{ children }</span></div>
        <div><img src={ closeIcon } alt="Close" onClick={ this.closeMessage } className="message-close-icon" /></div>
      </div>
    );
  }
}

Message.propTypes = {
  messageType: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired
};

export default Message;
