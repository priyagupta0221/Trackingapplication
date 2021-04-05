import React, { Component } from 'react';
import AuthService from "../AuthService";
import Pagination from "react-js-pagination";
var Auth = new AuthService();
class LandingPage extends Component {
    constructor() {
        super();
        this.state = {
        };
    }


    componentDidMount() {
  
    }


    render() {
        return (
            <div className="page-content fade-in-up">
                <div className="hs-item">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="hs-text">
                                    <h2 className="h-text"><span>TeqApp</span> for everyone.</h2>
                                    <p>Wecome to TeqApp ,your anytime anywhere virtual workplace. Teqtracker has every information regarding our ongoing organisation project this helps the organization to track the employees. In Teqleave Employee can apply leave and Managers can see leaves details of their .</p>
                                    <a href="/dashboard" className="site-btn">Teqleave</a>
                                    <a href="/dashboard" className="site-btn sb-c2">Teqtracker</a>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="hr-img">
                                    <img src="./assets/img/landing_page.jpg" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}

export default LandingPage;