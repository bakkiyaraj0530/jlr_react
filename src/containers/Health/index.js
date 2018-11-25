import React, { Component } from 'react';
import { Link } from 'react-router';
import cssModules from 'react-css-modules';
import styles from './health.scss';

const acceptIcon = require('assets/images/icon-green-tick.svg');
const neverIcon = require('assets/images/icon-red-x.svg');
const healthSafeIcon = require('assets/images/icon-health-safety-cross.svg');

@cssModules(styles)
class Healtandsafetypage extends Component {
  render() {
    return (
    <div className="health-mainbody">
        <div className="header-cont"></div>
        <div className="health-safety">Health & Safety</div>
        <img src={ healthSafeIcon } className="add-symbol"/>
        <div className="health-context">When using this application</div>
        <div className="health-tips">
            <div className="health-right">
             <div className="health-always">
               <img src={ acceptIcon }/>
               <span>Always...</span>
             </div>
             <ul className="health-green">
                <li>Consider whether you are in a potentially hazardous area.</li>
                <li>Move to an area where you are protected from machinery and vehicular traffic.</li>
                <li>Ensure you can see and be seen.</li>
                <li>Stand still</li>
             </ul>
            </div>
            <hr/>
            <div className="health-wrong">
             <div className="health-never">
               <img src={ neverIcon }/>
               <span>Never...</span>
             </div>
             <ul className="health-red">
                <li>Use whilst driving, walking or using a staircase or steps.</li>
                <li>Take photographs in areas that you do not have pemision to do so.</li>
             </ul>
            </div>
        </div>
        <Link to="dashboard"><button type="submit">ACCEPT & CONTINUE</button></Link>
    </div>
    );
  }
}
export default Healtandsafetypage;
