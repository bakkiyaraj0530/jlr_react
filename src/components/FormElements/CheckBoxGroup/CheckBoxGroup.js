import React, { PropTypes, Component } from 'react';

class CheckBoxGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionSelectionList: []
    };
    this.initializeOptionList(props);
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.state.optionSelectionList = [this.props.initialValue];
  }

  onChangeEvent() {
    const tempArr = [];
    const tempSelectionList = [];
    for (let i = 0; i < this.state.optionSelectionList.length; i++) {
      if (this.refs['checkbox' + i].checked) {
        tempArr.push(i + 1);
        tempSelectionList.push(true);
      } else {
        tempSelectionList.push(false);
      }
    }
    this.state.optionSelectionList = tempSelectionList;
    this.props.onChange(tempArr.toString());
  }

  initializeOptionList(props) {
    let optionSelected = [];
    const { optionValues, initialValue } = props;
    if (initialValue !== '' && initialValue !== null && initialValue !== undefined) {
      optionSelected = initialValue.split(',');
    }
    const tempSelectionList = [];
    for (let i = 1, selectionIndex = 0; i <= optionValues.length; i++, selectionIndex++) {
      if (optionSelected.indexOf('' + i) !== -1) {
        tempSelectionList.push(true);
      } else {
        tempSelectionList.push(false);
      }
    }
    this.state.optionSelectionList = tempSelectionList;
  }

  render() {
    const { optionValues } = this.props;
    return (
        <label className="label-header">
        {
          optionValues.map((item, index) => {
            return (
              <div key={ index } >
                <input ref={ 'checkbox' + index } type="checkbox" checked={ this.state.optionSelectionList[index] } onChange={ this.onChangeEvent.bind(this) }/>
                { item }
              </div>
            );
          })
        }
      </label>
    );
  }
}

CheckBoxGroup.propTypes = {
  optionValues: PropTypes.array.isRequired,
  optionSelected: PropTypes.string,
  initialValue: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default CheckBoxGroup;
