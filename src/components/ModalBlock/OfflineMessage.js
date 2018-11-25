import React, { PropTypes, Component } from 'react';
import cssModules from 'react-css-modules';
import styles from './OfflineMessage.scss';


@cssModules(styles)
class OfflineMessage extends Component {
  render() {
    const { offLine } = this.props;
    return (
      <div>
      { offLine &&
        <div className="offline-msg">You are offline! Please check your connectivity before continuing</div>
      }
      </div>
    );
  }
}

OfflineMessage.propTypes = {
  offLine: PropTypes.any
};

export default cssModules(OfflineMessage, styles);
