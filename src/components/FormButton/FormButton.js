import React, { PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './formButton.scss';


const FormButton = (props) =>
  <button
    className="form-button"
    onClick={ (event) => { event.preventDefault(); props.onClickButton(event); }}
    disabled={ props.disabled }>{ props.children }</button>;

FormButton.propTypes = {
  children: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClickButton: PropTypes.func
};

export default cssModules(FormButton, styles);
