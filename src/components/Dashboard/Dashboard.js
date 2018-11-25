import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import { Link } from 'react-router';
import styles from './Dashboard.scss';


const workListIcon = require('assets/images/icon-worklist.svg');
const workListIconHover = require('assets/images/icon-worklist-hover.svg');
const reportsIcon = require('assets/images/icon-reports.svg');
const reportsIconHover = require('assets/images/icon-reports-hover.svg');
const jlrLogo = require('../../assets/images/logo-jlr.png');
// let reportImage = reportsIcon;
@cssModules(styles)
class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      reportImage: reportsIcon,
      workListImage: workListIcon
    };
    this.mouseEnterReports = this.mouseEnterReports.bind(this);
    this.mouseLeaveReports = this.mouseLeaveReports.bind(this);
    this.mouseEnterWorkList = this.mouseEnterWorkList.bind(this);
    this.mouseLeaveWorkList = this.mouseLeaveWorkList.bind(this);
  }
  mouseEnterReports() {
    this.setState({ reportImage: reportsIconHover });
  }
  mouseLeaveReports() {
    this.setState({ reportImage: reportsIcon });
  }
  mouseEnterWorkList() {
    this.setState({ workListImage: workListIconHover });
  }
  mouseLeaveWorkList() {
    this.setState({ workListImage: workListIcon });
  }
  render() {
    const authuser = this.props;
    const logInDetails = authuser.author;
    return (
      <div className="small-12 small-centered columns dashboardContainer">
        <h1 className="capitalize"> WELCOME { logInDetails.user}</h1>
        <ul>

            <li className="myWorkList">
            <Link to="worklist">
            <img src={ this.state.workListImage } onMouseEnter={ this.mouseEnterWorkList } onMouseLeave = {this.mouseLeaveWorkList}/>
            <p>WORKLIST</p>
            </Link>
            </li>

            <li className="reports">
            <img src={ this.state.reportImage } onMouseEnter={ this.mouseEnterReports } onMouseLeave = {this.mouseLeaveReports}/>
            <p>REPORTS</p>
            </li>
        </ul>
        <img src={jlrLogo} className="logo" alt="Jaguar Land Rover" />
      </div>

      );
  }
}

export default Dashboard;
