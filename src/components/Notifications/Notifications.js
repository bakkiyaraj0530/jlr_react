import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import cssModules from 'react-css-modules';
import styles from './notifications.scss';
import { getUserNotifications, markAsReadNotifications, getUserNotificationsUnreadCount, getUserNotificationsActive } from '../../actions/notificationsActions';
import { dateTodayFormatted } from '../../helpers/utils.js';

const unreadIcon = require('assets/images/icon-tickmark.svg');
const jlrLogo = require('../../assets/images/logo-jlr.png');

@cssModules(styles)
class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterSelected: 'TODAY',
      notificationToRemove: ''
    };
  }

  notificationsOpenToggle() {
    return 'notifications ' + (this.props.notificationsIsOpen ? 'notifications-open' : 'notifications-close');
  }

  notificationItemClassName(id) {
    return this.state.notificationToRemove === id ? 'notification-item notificationitem-remove' : 'notification-item notification-item-onLoad';
  }

  handleFilter(e) {
    const selectedFilter = e;
    const { dispatch } = this.props;
    if (selectedFilter === 'TODAY') {
      setTimeout(() => {
        dispatch(getUserNotificationsActive('TODAY'));
        dispatch(getUserNotifications('unread', dateTodayFormatted()));
      }, 150);
    } else if (selectedFilter === 'ALL') {
      setTimeout(() => {
        dispatch(getUserNotificationsActive('ALL'));
        dispatch(getUserNotifications('unread'));
      }, 150);
    }
    this.state.filterSelected = selectedFilter;
  }

  markAsReadNotifications(id, filterSelected) {
    this.setState({ notificationToRemove: id });
    const { dispatch } = this.props;
    dispatch(markAsReadNotifications(id, () => {
      this.handleFilter(filterSelected);
      dispatch(getUserNotificationsUnreadCount());
    }));
  }

  checkCurrentWorklist() {
    return true;
  }

  render() {
    const { notificationsIsOpen, closeNotifications, userNotifications, worklist } = this.props;
    const filterByToday = this.state.filterSelected === 'TODAY' ? ' notifications__filter selected' : 'notifications__filter';
    const filterByAll = this.state.filterSelected === 'ALL' ? ' notifications__filter selected' : 'notifications__filter';
    if (notificationsIsOpen) {
      document.body.className = 'no-scroll';
    } else {
      document.body.className = document.body.className.replace('no-scroll', '');
    }

    return (
        <div className={ this.notificationsOpenToggle() } notificationsIsOpen={ notificationsIsOpen }>
          <div className="notifications__filter__container">
            <div name="todayNotification" className={ filterByToday } onClick={this.handleFilter.bind(this, 'TODAY')}>TODAY</div>
            <div name="allNotification" className={ filterByAll } onClick={this.handleFilter.bind(this, 'ALL')}>ALL</div>
          </div>
          <div name="notifications-close" className="notifications-close-button" onClick={ closeNotifications }></div>
          {(userNotifications) ? (<div className="notifications-container">
            { (userNotifications.length === 0) ? (<div className="no-new"><h2>NO NEW NOTIFICATIONS</h2></div>) :
              (userNotifications.map((item, key) => {
                return (
                  <div className={ this.notificationItemClassName(item.id) } key={key}>
                    <div className="notifications__unread__icon"><img src={ unreadIcon } name={'markAsRead' + key} onClick={ this.markAsReadNotifications.bind(this, item.id, this.state.filterSelected) }/></div>
                    <div className="notifications__list">
                      { (item.resourceType === 'SD' && this.checkCurrentWorklist(worklist.data, item.resourceId)) ? (
                        <Link name={ 'sd' + item.resourceId } id={ 'sd' + item.resourceId } to={`/opensd/${item.resourceId}/`} onClick={ closeNotifications }>
                          <div className="notifications__subject">{item.subject}</div>
                          <div className="notifications__date">{item.dateSent}</div>
                          <div className="notifications__body">{item.body}</div>
                        </Link>
                      ) : (
                        <div>
                          <div className="notifications__subject">{item.subject}</div>
                          <div className="notifications__date">{item.dateSent}</div>
                          <div className="notifications__body">{item.body}</div>
                        </div>
                      )}
                    </div>
                  </div>);
              })
            )}
          </div>) : '' }
          <div className="menu-footer-logo">
            <img src={jlrLogo} className="logo" alt="Jaguar Land Rover" />
          </div>
        </div>
    );
  }
}

Notifications.propTypes = {
  notificationsIsOpen: PropTypes.bool.isRequired,
  closeNotifications: PropTypes.func.isRequired,
  userNotifications: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.any,
  worklist: PropTypes.any
};

export default Notifications;
