import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginForm from '../../components/LoginForm/LoginForm';
import { authUser, unsetUser } from '../../actions/loginActions';
import { push } from 'redux-router';
import { startDB } from '../../actions/sqliteActions';

class Login extends Component {
  constructor() {
    super();
    this.handleUserPassword = this.handleUserPassword.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(unsetUser());
  }
  // check if user is logged once dispatched
  componentDidUpdate() {
    const { state, dispatch } = this.props;
    const user = state.authReducer.userAuth || null;
    if (user && user.role) {
    // check if running as a Cordova mobile app (two options available)
      if (window.cordova !== undefined) {
        dispatch(push('/healthsafety'));
      } else {
        dispatch(push('/dashboard'));
      }
    }
  }

  handleUserPassword() {
    const { state, dispatch } = this.props;
    const { form } = state;
    if (form.login &&
        form.login.username &&
        form.login.password &&
        form.login.username.value &&
        form.login.password.value) {
      dispatch(authUser(form.login.username.value, form.login.password.value));
    }
    dispatch(startDB());
  }

  render() {
    const { state } = this.props;
    const msg = state.authReducer.message || {};

    return (
      <LoginForm
        onSubmit={ this.handleUserPassword }
        message={ msg } />
    );
  }
}

Login.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  state: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    state
  };
}

export default connect(mapStateToProps)(Login);
