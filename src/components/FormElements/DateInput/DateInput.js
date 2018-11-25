import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';

class DateInput extends Component {
  constructor(props) {
    super(props);
    const date = props.data ? props.data.split('/') : false;

    this.state = {
      date: (date) ? date[2] + '-' + date[0] + '-' + date[1] : ''
    };
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    const date = this.props.data ? this.props.data.split('/') : false;
    this.setState({ date: (date) ? date[2] + '-' + date[1] + '-' + date[0] : '' });
  }

  onDateChange(e) {
    const date = (e.target.value) ? e.target.value.split('-') : false;
    this.props.onChange(date[2] + '/' + date[1] + '/' + date[0]);
    this.setState({ date: e.target.value });
  }

  render() {
    return (
      <div>
        <label htmlFor={ this.props.id } className="label-header form-label">
          { this.props.children }
        </label>
        {
          this.props.isDisabled ?
          <input type="date" id={ this.props.id } value={ this.state.date } onChange={ this.onDateChange.bind(this) } disabled /> :
          <input type="date" id={ this.props.id } value={ this.state.date } onChange={ this.onDateChange.bind(this) } />
        }
      </div>
    );
  }
}
DateInput.propTypes = {
  id: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  children: PropTypes.string,
  onChange: PropTypes.func,
  data: PropTypes.object
};
export default cssModules(DateInput);
