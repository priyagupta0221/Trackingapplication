import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    NavLink,
    Switch,
    Link
} from "react-router-dom";
import AuthService from "../AuthService";
import AdminSidebar from "./adminSidebar";
import ManagerSidebar from "./managerSidebar";
import EmployeeSidebar from "./employeeSidebar";
import Maincontainer from '../maincontainer/Maincontainer';
import LeaveStatus from '../leaveStatus/LeaveStatus';
import LandingPage from "../maincontainer/LandingPage";
import AppDashboard from "../trackerMaincontainer/TeqAppDashboard";
import Axios from 'axios';
const Auth = new AuthService();
export default class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            data: [],
            userRole: [],
            show: false,
            dropdownOpen: false
        }
    }
    componentDidMount() {   
        var token = window.localStorage.getItem("id_token");
        Auth.getUserData(token).then(response => {       
            this.setState({
                userRole: response.user.role,
                data: response.user
            });
        });
    }

    render() {

        if (this.state.userRole == "Admin" || this.state.userRole == "SuperAdmin") {
            return (<AdminSidebar />);
        }
        else if (this.state.userRole == "Manager" || this.state.userRole == "TeamLead") {
            return (<ManagerSidebar></ManagerSidebar>);
        }
        else if (this.state.userRole == "HR") {
            return (<AdminSidebar></AdminSidebar>);
        }
        else (this.state.userRole = "Employee")
        {
            return (<EmployeeSidebar></EmployeeSidebar>);
        }
    }
}
