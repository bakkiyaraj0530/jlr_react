import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import cssModules from 'react-css-modules';
import styles from './hamburgerMenu.scss';

const workListIcon = require('assets/images/icon-worklist.svg');
const reportsIcon = require('assets/images/icon-reports.svg');
const footerLogo = require('assets/images/logo-jlr.png');

@cssModules(styles)
class HamburgerMenu extends Component {

  menuToggle() {
    return 'hamburgerMenu ' + (this.props.menuIsOpen);
  }

  render() {
    const { closeMenu, handleLogOut } = this.props;
    const menuItems = [
     { link: '/worklist?refresh=true', icon: workListIcon, name: 'WORKLIST', id: 'worklistMenuLink' },
     { link: '/#', icon: reportsIcon, name: 'REPORTS', id: 'reportsMenuLink' }
    ];

    return (
      <div className={ this.menuToggle() }>

        <div className="logoutButton"><a name="logoutButton" onClick={() => {handleLogOut();}}>LOGOUT</a></div>
        <div className="menuCloseButton" name="closeMenu" onClick={ closeMenu }></div>

        <div className="hamburgerMenuContainer">
          { menuItems.map((element, key) => {
            return (
              <Link to={element.link} name={element.id} className="menuItem" key={key} onClick={ closeMenu }>
                <img className="menuItemImage" src={ element.icon }/>
                {element.name}
              </Link>);})}

        </div>
        <div className="menuFooterLogo">
          <img src={ footerLogo } />
        </div>
      </div>
     );
  }
}

HamburgerMenu.propTypes = {
  menuIsOpen: PropTypes.string.isRequired,
  closeMenu: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  handleLogOut: PropTypes.func.isRequired
};

export default HamburgerMenu;
