import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Dashboard from '../../components/Dashboard/Dashboard';
import { config } from '../../config/config';
import { dateTodayFormatted } from '../../helpers/utils.js';
import { getUserNotificationsUnreadCount, getUserNotifications, setRefreshIntervalIdWelcome } from '../../actions/notificationsActions';
import Header from '../Header';


class DashboardContainer extends Component {
  constructor() {
    super();
    this.state = {
      notificationCountCheck: ''
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getUserNotificationsUnreadCount());
    const dateToday = dateTodayFormatted();
    dispatch(getUserNotifications('unread', dateToday));
    const refreshIntervalIdWelcome = setInterval(() => {
      dispatch(getUserNotificationsUnreadCount());
    }, config().notificationsRefreshInterval);
    dispatch(setRefreshIntervalIdWelcome(refreshIntervalIdWelcome));
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    const { dispatch, userNotificationsUnreadCount, activeNotificationTab } = this.props;
    if (this.state.notificationCountCheck !== userNotificationsUnreadCount) {
      if (activeNotificationTab === 'TODAY') {
        const dateToday = dateTodayFormatted();
        dispatch(getUserNotifications('unread', dateToday));
      }
      if (activeNotificationTab === 'ALL') {
        dispatch(getUserNotifications('unread'));
      }
      this.setState({
        notificationCountCheck: userNotificationsUnreadCount,
      });
    }
  }

  render() {
    const { auth } = this.props;
    const authdata = auth;
    return (
      <div>
        <Header />
        <div className="row dashboard">
          <Dashboard author={authdata} />
        </div>
      </div>
    );
  }
}

DashboardContainer.propTypes = {
  state: PropTypes.object.isRequired,
  auth: PropTypes.any,
  userNotificationsUnreadCount: PropTypes.string,
  activeNotificationTab: PropTypes.string,
  dispatch: PropTypes.func.isRequired,

};

function mapStateToProps(state) {
  return {
    state,
    auth: state.authReducer.userAuth,
    userNotificationsUnreadCount: state.notificationsReducer.notificationsUserUnreadCount,
    activeNotificationTab: state.notificationsReducer.UserNotifictionsActiveState
  };
}

export default connect(mapStateToProps)(DashboardContainer);
