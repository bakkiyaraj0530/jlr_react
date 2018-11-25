import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-router';
import cssModules from 'react-css-modules';
import styles from './header.scss';
import Notifications from '../../components/Notifications/Notifications';
import { getUserNotificationsUnreadCount, getUserNotifications } from '../../actions/notificationsActions';
import { dateTodayFormatted } from '../../helpers/utils.js';
import HamburgerMenu from '../../components/Menu/HamburgerMenu';
import Modal from '../Modal';

const menuIcon = require('assets/images/icon-burger.svg');
const notificationIcon = require('assets/images/icon-notifications.svg');
const warningIcon = require('assets/images/icon-exclamation.svg');
const closeIcon = require('assets/images/icon-popup-cancel-white.svg');

@cssModules(styles)
class Header extends Component {
  constructor(props) {
    super(props);
    this.closeMenu = this.closeMenu.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.state = {
      menuOpenState: 'menuClosed',
      notificationsOpenState: false,
      closeBar: true,
      renderMenu: true
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getUserNotificationsUnreadCount());
    const dateToday = dateTodayFormatted();
    dispatch(getUserNotifications('unread', dateToday));
  }

  componentWillUpdate() {
    if (this.state.renderMenu === false) {
      this.setState({ renderMenu: true });
    }
  }

  openNotifications() {
    this.setState({ notificationsOpenState: true });
  }

  closeNotifications() {
    this.setState({ notificationsOpenState: false });
  }

  openMenu() {
    this.setState({ menuOpenState: 'menuOpen' });
  }

  handleLogOut() {
    const { dispatch } = this.props;
    this.setState({ menuOpenState: 'menuClosed', renderMenu: false });
    dispatch(push('/'));
  }

  closeMenu() {
    this.setState({ menuOpenState: 'menuClosed' });
  }

  closeError() {
    this.setState({ closeBar: false });
  }

  render() {
    const { auth, worklist, userNotifications, userNotificationsUnreadCount } = this.props;
    const authdata = auth.role;
    const userID = auth.user;
    const message = worklist.message;

    const cls = (message && message.structuredErrors) ? true : false;
    let isDisplayMenu = true;

    if (authdata === null || authdata === undefined || authdata === '') {
      isDisplayMenu = false;
    }
    return (
        <div>
        <Modal />
        {
          !this.state.renderMenu ? ''
          :
          <div className="header__container fixed-header" id="headerContainer">
            {(() => {
              if (isDisplayMenu) {
                return (
                  <div>
                    {(cls && this.state.closeBar) &&
                      <div className="errorBar">
                        <div className="msg">
                          <img name="warningIconImage" className="warningIcon" src={warningIcon} alt="Warning"/>
                          Please resolve the errors indicated.
                        </div>
                        <a onClick={ this.closeError.bind(this) } >
                          <img name="closeIconImage" className="closeIcon" src={closeIcon} alt="Close"/>
                        </a>
                      </div>
                    }
                    <Notifications
                      dispatch={this.props.dispatch}
                      notificationsIsOpen={ this.state.notificationsOpenState }
                      closeNotifications={ this.closeNotifications.bind(this) }
                      userNotifications={userNotifications}
                      worklist={worklist}
                      auth={auth}/>
                    <HamburgerMenu
                      menuIsOpen={ this.state.menuOpenState }
                      closeMenu={ this.closeMenu }
                      role={authdata}
                      handleLogOut={this.handleLogOut}/>
                    <div className="site-header">
                    <div className="center-header">
                      <div className="header-left-container">
                        <span className="header-text">{ 'eSD  | ' }</span>
                        <span className="header-text capitalize">{ userID }</span>
                      </div>
                      <div className="header-right-container">
                        <img name="notificationIconImage" src={ notificationIcon } className="header-menu" onClick={ this.openNotifications.bind(this) }/>
                        {(userNotificationsUnreadCount > 0) &&
                        <div className="numberErrors" onClick={ this.openNotifications.bind(this) }>{ userNotificationsUnreadCount }</div>
                        }
                        <img name="menuIconImage" src={ menuIcon } className="header-menu" onClick={ this.openMenu.bind(this) } />
                      </div>
                    </div>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        }
        </div>
    );
  }
}

Header.propTypes = {
  children: PropTypes.string,
  dispatch: React.PropTypes.func.isRequired,
  state: React.PropTypes.object.isRequired,
  auth: React.PropTypes.any,
  worklist: React.PropTypes.any,
  userNotificationsUnreadCount: React.PropTypes.string,
  userNotifications: React.PropTypes.any
};

function mapStateToProps(state) {
  return {
    state,
    auth: state.authReducer.userAuth,
    worklist: state.worklistReducer,
    userNotificationsUnreadCount: state.notificationsReducer.notificationsUserUnreadCount,
    userNotifications: state.notificationsReducer.notificationsUser,
    userName: state.authReducer.userAuth.user
  };
}

export default connect(mapStateToProps)(Header);
