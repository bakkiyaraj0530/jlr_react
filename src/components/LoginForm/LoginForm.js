import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import cssModules from 'react-css-modules';
import styles from './loginForm.scss';
import FormButton from '../FormButton/FormButton';

const logo = require('assets/images/logo-jlr.png');
const validate = values => {
  const errors = {};

  if (!values.username || values.username.length === 0) {
    errors.username = 'Required';
  }

  if (!values.password || values.password.length === 0) {
    errors.password = 'Required';
  }

  return errors;
};

@cssModules(styles)
@reduxForm({
  fields: ['username', 'password'],
  form: 'login',
  validate
})

class LoginForm extends Component {
  render() {
    const { fields, message, handleSubmit } = this.props;
    return (
      <div className="alignLogin">
        <div className="content login row">
          <form className="small-10 medium-7 large-6 small-centered columns" onSubmit={ handleSubmit }>
           <div className="row login-form">
             <div className="ssmall-12 medium-12 large-12">
                  <div className="logo small-9 small-centered columns">
                    <img src={logo} alt="Jaguar Land Rover"/>
                  </div>
                  <h2 className="text-center">Supplier Diagnostic</h2>
                  <p className={'errorMessage' + ' ' + (message.error ? 'show adjsutelement' : 'hide')}>{ message.error ? <div> Auth problem, check username and password </div> : '' }</p>
                  <div>
                    <div className="inputinfo">
                      <input type="show-for-small-only text" {...fields.username} placeholder="Username" />
                      { fields.username.touched && fields.username.error && <p className="requiredMsg">{ fields.username.touched && fields.username.error && <span className="errorMessage">{ fields.username.error }</span> }</p>}
                    </div>
                    <div className="inputinfo">
                      <input type="password" {...fields.password} placeholder="Password"/>
                      { fields.password.touched && fields.password.error && <p className="requiredMsg">{ fields.password.touched && fields.password.error && <span className="errorMessage">{ fields.password.error }</span> }</p>}
                    </div>
                  </div>
                  <FormButton
                    className="form-button"
                    type="button"
                    disabled={ false }
                    onClickButton={ handleSubmit }>LOGIN
                  </FormButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  fields: React.PropTypes.any,
  handleSubmit: React.PropTypes.func,
  message: React.PropTypes.object,
  disable: React.PropTypes.bool
};

function mapStateToProps(state) {
  return {
    login: state
  };
}

export default connect(mapStateToProps)(LoginForm);
