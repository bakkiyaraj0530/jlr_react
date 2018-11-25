import React, { PropTypes, Component } from 'react';
import cssModules from 'react-css-modules';
import styles from './modalBlock.scss';

@cssModules(styles)
class ModalBlock extends Component {

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    const { active } = this.props;

    // prevent keyboard events while ModalBlock is active
    if (active) {
      e.preventDefault();
    }
  }

  render() {
    const { active } = this.props;
    const className = (active) ? 'blocker' : '';
    return (
      <div className={className}>
        <div className="spinner">
          <div className="cube1"></div>
          <div className="cube2"></div>
        </div>
      </div>
    );
  }
}


ModalBlock.propTypes = {
  active: PropTypes.any
};

export default cssModules(ModalBlock, styles);
