import React, { Component, PropTypes } from 'react';
import styles from './Dropdown.scss';
import cssModules from 'react-css-modules';

@cssModules(styles)
class Dropdown extends Component {

  handleDropDownChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    const { list, optionSelected, disabled } = this.props;
    return (
      <div>
        <select value={ optionSelected } disabled = { disabled } onChange={ this.handleDropDownChange.bind(this) }>
          <option value="na">{ this.props.children }</option>
          {
            list.map((item, index) => {
              return (
                <option
                  selected={ (optionSelected === list[index]) ? true : false }
                  value={ list[index].key }>{ list[index].value }</option>
              );
            })
          }
        </select>
      </div>
    );
  }
}

Dropdown.propTypes = {
  children: PropTypes.string,
  list: PropTypes.array,
  onChange: PropTypes.func,
  optionSelected: PropTypes.string,
  disabled: PropTypes.string
};

export default Dropdown;
