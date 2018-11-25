import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { checkUser, unsetUser } from '../../actions/loginActions';

export function requireAuthentication(Component, usersAuth) {
  class AuthenticatedComponent extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        user: false
      };
    }

    componentWillMount() {
      const { dispatch } = this.props;
      dispatch(checkUser((res) => {
        this.state.user = res;
        this.checkAuth();
      }));
    }

    checkDate(userTime) {
      const date = new Date();
      const time = date.getTime();
      if (userTime < time) {
        return false;
      }
      return true;
    }

    // check if user is present
    checkAuth() {
      const { dispatch, userAuth, currentOffLine } = this.props;
      // check if user is in the rule
      const user = userAuth || this.state.user;
      const isAllowed = (user) ? usersAuth.indexOf(user.role) : false;
      const isOnTime = this.checkDate(user.timeout);
      // tmp check api
      if (!user || isAllowed === -1 || (!isOnTime && !currentOffLine)) {
        if (isAllowed === -1) {
          dispatch(unsetUser());
        }
        dispatch(pushState(null, '/'));
      }
    }

    render() {
      return (
        <div>
          <Component {...this.props}/>
        </div>
      );
    }
  }

  AuthenticatedComponent.propTypes = {
    userAuth: React.PropTypes.any,
    dispatch: React.PropTypes.func,
    currentOffLine: React.PropTypes.any
  };

  const mapStateToProps = (state) => ({
    userAuth: state.authReducer.userAuth,
    currentOffLine: state.modalBlockReducer.offLine
  });

  return connect(mapStateToProps)(AuthenticatedComponent);
}
