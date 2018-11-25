import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from '../Header';
import ModalPopup from '../ModalPopup';
import Worklist from '../../components/Worklist/Worklist';
import { showConfirmPopup } from '../../actions/notificationsActions';
import { getWorkListData } from '../../actions/worklistActions';
import { COMPLETE_CONFIRM } from '../../constants/general';

class WorklistContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchOpenState: false
    };

    this.toggleSearch = this.toggleSearch.bind(this);
    this.openConfirmPopup = this.openConfirmPopup.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getWorkListData());
  }

  toggleSearch() {
    this.setState({
      searchOpenState: (this.state.searchOpenState ? false : true)
    });
  }

  openConfirmPopup() {
    const { dispatch } = this.props;
    dispatch(showConfirmPopup(COMPLETE_CONFIRM, false));
  }

  goBack() {
    window.history.back();
  }

  render() {
    let worklist = this.props.worklistData;
    worklist = (worklist === null || worklist === undefined) ? [] : worklist;

    return (
      <div className="worklist">
        <Header />
        <ModalPopup
          ref="attachment_popup"
          modal={this.props.modal}
          dispatch={this.props.dispatch}
          onConfirmClick={ this.handleDelete } />
        <div className="message-bar"></div>
        <Worklist
          worklist = { worklist }
          searchIsOpen = { this.state.searchOpenState }
          toggleSearch = { this.toggleSearch }
          onDeleteClick={ this.openConfirmPopup } />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    worklistData: state.worklistReducer.worklists,
    modal: state.notificationsReducer
  };
}

WorklistContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  worklistData: PropTypes.array,
  modal: PropTypes.object
};

export default connect(mapStateToProps)(WorklistContainer);
