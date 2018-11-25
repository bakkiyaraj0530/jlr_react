import React, { Component, PropTypes } from 'react';
import './home.scss';

class Home extends Component {
  componentDidUpdate() {
    window.scrollTo(0, 0);
  }
  render() {
    return (
      <div className="background">
        <div>
          { this.props.children }
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  children: PropTypes.any
};
export default Home;
