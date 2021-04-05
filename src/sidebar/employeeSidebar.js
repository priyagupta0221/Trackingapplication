import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    NavLink,
    Switch,
    Link
} from "react-router-dom";
import LandingPage from "../maincontainer/LandingPage";
import AuthService from "../AuthService";
import empl_user from '../sidebar/admin-avatar.png';
var path = window.location.pathname;
var authtokenurl = path.split("App", 1);
var tokenurl = authtokenurl[0];
const Auth = new AuthService();
class EmployeeSidebar extends Component {
    constructor(props) {
        super(props);
        this.handleActiveLink = this.handleActiveLink.bind(this);
        this.state = {
            user: [],
            data: [],
            userRole: [],
            show: false,
            dropdownOpen: false,
            active: '',
            imagePreviewUrl: ''
        }
    }
    handleActiveLink() {
        var element = document.getElementById("dashNotwfhdetail");
        element.classList.remove("active");
        var element = document.getElementById("dashNotleavedetail");
        element.classList.remove("active");
        var element = document.getElementById("dashNotabout");
        element.classList.remove("active");
        var element = document.getElementById("dash");
        element.classList.remove("active");
        var element = document.getElementById("dashNotProjects");
        element.classList.remove("active");
        var element = document.getElementById("dashNotTeam");
        element.classList.remove("active");
        var element = document.getElementById("dashNotAllReports");
        element.classList.remove("active");
        localStorage.removeItem('clicked_link');
        var url = window.location.href;
        var activeTab = url.substring(url.lastIndexOf("/") + 1);
        this.setState({ active: activeTab });


    }
    activeclass = (event) => {
        var element = document.getElementById("dash");
        element.classList.remove("active");
        var elems = document.querySelectorAll(".active");
        // [].forEach.call(elems, function (el) {
        //     el.classList.remove("active");
        // });
        var w = window.innerWidth;
        var h = window.innerHeight;
        if (w <= 1023) {
            var body = document.body;
            body.classList.add("sidebar-mini");
        }


        const clicked = event.target.id
        localStorage.setItem("clicked_link", clicked);
        // if (this.state.active === clicked) {
        //     this.setState({ active: '' });
        // } else {
        this.setState({ active: clicked })
        // }

    }
    componentDidMount() {
        var path = window.location.pathname;
        var authtokenurl = path.split("App", 1);
        var tokenurl = authtokenurl[0];
        var url = window.location.href;
        var activeTab = url.substring(url.lastIndexOf("/") + 1);
        // var link = window.localStorage.getItem("clicked_link");
        // if (link == null) {
        //     this.setState({ active: "first" });
        // } else {
        this.setState({ active: activeTab });
        // }
        var token = window.localStorage.getItem("id_token");
        Auth.getUserData(token).then(response => {
            if (response.user.imageData == undefined) {
                this.setState({
                    userRole: response.user.role,
                    data: response.user,

                });
            } else {

                this.setState({
                    userRole: response.user.role,
                    data: response.user,
                    imagePreviewUrl: response.user.imageData.image
                });
            }
        });
    }
    render() {
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img className="img-circle img-height img-side" src={imagePreviewUrl} />);
        } else {
           
            $imagePreview = (<img className="img-circle img-height img-side" src="../assets/img/users/u8.jpg" />);
           
        }
        return (
            <div>
                <nav className="page-sidebar" id="sidebar">
                    <div id="sidebar-collapse">
                        <div className="admin-block text-center">
                            <div>
                                {tokenurl !== "/teq" ? (
                                    <Link to="/profile">{$imagePreview}</Link>
                                ) : ( <Link to="/teqApp/emProfile1">{$imagePreview}</Link>)}
                                {/* // <img
                                //     className="img-circle img-height img-side"
                                //     src="../assets/img/users/u8.jpg"
                                // />)} */}
                                </div>
                            <div className="admin-info">
                                <div className="font-strong">{this.state.data.name}</div><small>{this.state.userRole}</small></div>
                        </div>
                        {tokenurl !== "/teq" ? (
                            <ul className="side-menu metismenu" >
                                <li id="dash" onClick={this.activeclass.bind(this)} className={this.state.active === "dashboard" ? 'active' : ''} >
                                    <Link to="/dashboard" ><i className="sidebar-item-icon fa fa-th-large icon-dasboard"></i>
                                        <span className="nav-label nav-dasboard" id="dashboard">Dashboard</span>
                                    </Link>
                                </li>

                                <li id="dashNotleavedetail" onClick={this.activeclass} className={this.state.active === "leavedetail" ? 'active' : ''}>
                                    <Link to="/leavedetail"><i className="sidebar-item-icon fa fa-dashboard icon-leavedetail"></i>
                                        <span className="nav-label nav-leavedetail" id="leavedetail">Leave Details</span>
                                    </Link>
                                </li>
                                <li id="dashNotwfhdetail" onClick={this.activeclass} className={this.state.active === "wfhdetail" ? 'active' : ''}>
                                    <Link to="/wfhdetail"><i className="sidebar-item-icon fa fa-dashboard icon-leavedetail"></i>
                                        <span className="nav-label nav-leavedetail" id="wfhdetail">WFH Details</span>
                                    </Link>
                                </li>
                                <li id="dashNotabout" onClick={this.activeclass} className={this.state.active === "about" ? 'active' : ''}>
                                    <Link to="/about"><i className="sidebar-item-icon fa fa-users icon-about"></i>
                                        <span className="nav-label nav-about" id="about">About</span>
                                    </Link>
                                </li>

                            </ul>
                        ) : (
                                <ul className="side-menu metismenu">
                                    <li id="dash" onClick={this.activeclass} className={this.state.active === "dashboard" ? "active" : ''}>
                                        <Link to="/teqApp/dashboard">
                                            <i className="sidebar-item-icon fa fa-th-large icon-dasboard"></i>
                                            <span className="nav-label nav-dasboard" id="dashboard">
                                                Dashboard</span>
                                        </Link>
                                    </li>
                                    <li id="dashNotProjects" onClick={this.activeclass} className={this.state.active === "projectlist" ? "active" : ""}>
                                        <Link to="/teqApp/projectlist">
                                            <i className="sidebar-item-icon fa fa-folder-open icon-dasboard"></i>
                                            <span className="nav-label nav-dasboard" id="projectlist">Projects</span>
                                        </Link>
                                    </li>
                                    <li id="dashNotTeam" onClick={this.activeclass} className={this.state.active === "teammembers" ? "active" : ""}>
                                        <Link to="/teqApp/teammembers">
                                            <i className="sidebar-item-icon fa fa-user icon-dasboard"></i>
                                            <span className="nav-label nav-dasboard" id="teammembers">Team Members</span>
                                        </Link>
                                    </li>
                                    <li id="dashNotAllReports"
                                        onClick={this.activeclass}
                                        className={this.state.active === "report" ? "active" : ""}
                                    >
                                        <Link to="/teqApp/report">
                                            <i className="sidebar-item-icon fa fa-file icon-leaverport "></i>
                                            <span className="nav-label nav-dasboard" id="report">Reports</span>
                                        </Link>
                                    </li>
                                    <li id="dashNotAllPastLogRequest"
                                     onClick={this.activeclass}
                                    className={this.state.active === "pastLogRequest" ? "active" : ""}
                                    >
                                  <Link to="/teqApp/pastLogRequest">
                                      <i className="sidebar-item-icon fa fa-file icon-leaverport "></i>
                                      <span className="nav-label nav-dasboard" id="pastLogRequest">Past Logs Request</span>
                                  </Link>
                                 </li>

                                </ul>
                            )
                        }
                    </div>
                </nav>
            </div>
        );
    }
}

export default EmployeeSidebar;