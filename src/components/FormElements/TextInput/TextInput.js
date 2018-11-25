import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './textInput.scss';
import HelpImg from '../HelpImg/HelpImg';

class TextInput extends Component {
  onTextChange(e) {
    this.props.onChange(e.target.value);
  }
  render() {
    const {
      children,
      helpIconhide,
      secondLabel,
      inputType,
      id,
      help,
      openModal,
      data,
      required,
      serverError,
      placeholder,
      disabled
    } = this.props;

    const isLabelRequired = (children !== null && children !== undefined && children !== '0') ? true : false;
    const secondLabelTxt = (secondLabel !== null && secondLabel !== undefined) ? ' ' + secondLabel : '';
    const isTextBox = (inputType === 'text') ? true : false;
    const clsTextbox = (serverError) ? 'serverError' : 'textbox-styl';
    const clsTextarea = (serverError) ? 'serverErrorTextarea' : 'textarea-styl';
    const disabledStyle = (disabled) ? 'input-disabled' : '';
    const disableHelpicon = (helpIconhide === 'hide') ? false : true;
    return (
      <div className={this.props.className}>
        {
          isLabelRequired ?
          <label id={ id + 'Label' } className="form-label" htmlFor={ id }>{ children } { required ? '*' : '' }
          { disableHelpicon ? <HelpImg id={ id + 'Help' } help={ help } openModal={ openModal }/> : '' }
          <span className="second-label">{ secondLabelTxt }</span>
          </label> : '' }
        {
          isTextBox ?
          <input
            type="text"
            id={ id + 'Input' }
            className={ clsTextbox + ' ' + disabledStyle }
            placeholder={ placeholder }
            onChange={ this.onTextChange.bind(this) }
            value={ data }
            disabled={ disabled } /> :
          <textarea
            id={ id + 'TextArea' }
            rows="4"
            cols="50"
            className={ clsTextarea }
            placeholder={ placeholder }
            value={ data }
            disabled={ disabled }
            onChange={ this.onTextChange.bind(this) } />
        }
        {
          serverError &&
          <label id={ id + 'ServerError' } className="serverErrorMsg"> { serverError.errorMsg } </label>
        }
      </div>
    );
  }
}
TextInput.propTypes = {
  id: PropTypes.string,
  inputType: PropTypes.string,
  helpIconhide: PropTypes.string,
  children: PropTypes.string,
  onChange: PropTypes.func,
  openModal: PropTypes.func,
  help: PropTypes.string,
  data: PropTypes.string,
  secondLabel: PropTypes.string,
  required: PropTypes.any,
  disabled: PropTypes.any,
  className: PropTypes.string,
  serverError: PropTypes.any,
  placeholder: PropTypes.string
};
export default cssModules(TextInput, styles);
