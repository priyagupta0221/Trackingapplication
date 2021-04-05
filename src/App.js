import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
  withRouter
} from "react-router-dom";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import Maincontainer from "./maincontainer/Maincontainer";
import LandingPage from "./maincontainer/LandingPage";
import LeaveStatus from "./leaveStatus/LeaveStatus";
import EmployeeLeaveDetail from "./leaveStatus/employeeleavedetail";
import AddEmployee from "./employeemanagement/AddEmployee";
import LeaveDetail from "./leaveStatus/leaveDetail";
import DetailPage from "./leaveStatus/detailPage";
import ManagerLeaveRequest from "./managercomment/leaverequestmanager";
import ManagerWFHRequest from "./managercomment/wfhrequestmanager";
import About from "./About/About";
import Dash from "./dashboard/Dashboard";
import Login from "./login/login";
import NotFound from "./login/notFound";
import ITSupport from "./itsupportdashboard";
import withAuth from "./withAuth";
import "./App.css";
import AuthService from "./AuthService";
import Profile from "./header/profile";
import EmployeeProfile from "./header/employeeProfile";
import LeaveHistory from "./leaveStatus/leavehistory";
import ChartPage from "./leavereport";
import WFHRequest from "./leaveStatus/wfhRequest";
import WFHDetail from "./WFHdetails/wfhDetails";
import MyWfhRequset from "./WFHdetails/employeewfhdetails";
import HRSupport from "./hrPortal";
import AppDashboard from "./trackerMaincontainer/TeqAppDashboard";
import TeqEmployeeManagement from "./TeqEmployeeManagement/addemployee";
import TeqClients from "./TeqClients/clients";
import TeqProject from "./TeqProject/projectList";
import TeqUserProject from "./TeqProject/userProjectList";
import TeqTeamMembers from "./TeqTeamMembers/teamMembers";
import TeqReport from "./TeqReport/Report";
import TeqResourceReport from "./TeqReport/resourceReport";
import TeqPastLogRequests from "./TeqReport/pastLogRequest";
import AddHours from "./AddHours/addhours";
import EmProfile from "./TeqEmployeeManagement/emProfile"
import ProjectDetails from "./TeqProject/projectDetails";
import Emprofile1 from "./TeqEmployeeManagement/emProfile1";
//import EditemployeePage from "./TeqEmployeeManagement/editemployee"

var itSupport = window.location.pathname;
var hrSupport = window.location.pathname;
var Path;
const Auth = new AuthService();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    var itSupport = window.location.pathname;
    // debugger;
    if (itSupport == "/landing-page") {
      var bodyTag = document.getElementById("bodyClass");
      bodyTag.classList.add("bodyClass");
    }
    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then(response => {
      this.setState({
        userRole: response.user.role,
        data: response.user
      });
    });
  }

  render() {
    return (
      <div className="page-wrapper">
        {itSupport == "/landing-page" ? (
          <LandingPage></LandingPage>
        ) : (<div>
          <Header />
          <Router>
            {itSupport !== "/itsupport" && hrSupport !== "/hrsupport" ? (
              <Sidebar />
            ) : ("")}


            <Header></Header>
            {this.state.userRole == "Admin" ? (
              <div className="content-wrapper">
                <Switch>
                  <Route exact path="/dashboard" component={Maincontainer} />
                  <Route path="/teqApp/emProfile1" component={Emprofile1} />
                  <Route path="/teqApp/project" component={TeqProject} />
                  <Route exact path="/" component={Maincontainer} />
                  <Route path="/leaverequest" component={LeaveStatus} />
                  <Route path="/employeemanagement" component={AddEmployee} />
                  <Route path="/leavedetail" component={LeaveDetail} />
                  <Route path="/about" component={About} />
                  <Route path="/profile" component={Profile} />
                  <Route path="/empProfile/:id" component={EmployeeProfile} />
                  <Route path="/teqApp/emProfile/:id" component={EmProfile} />
                  <Route path="/detailspage/:id/:userid" component={DetailPage} />
                  <Route path="/leavehistory/:id" component={LeaveHistory} />
                  <Route path="/leavereport" component={ChartPage} />
                  <Route path="/hrSupport" component={HRSupport} />
                  <Route path="/itsupport" component={ITSupport} />
                  <Route path="/wfhrequest" component={WFHRequest} />
                  <Route path="/wfhdetails" component={WFHDetail} />
                  <Route path="/teqApp/dashboard" component={AppDashboard} />
                  <Route path="/teqApp/employeelist" component={TeqEmployeeManagement} />
                  <Route path="/teqApp/clients" component={TeqClients} />
                  <Route path="/teqApp/project" component={TeqProject} />
                  <Route path="/teqApp/teammembers" component={TeqTeamMembers} />
                  <Route path="/teqApp/projectlist" component={TeqUserProject} />
                  <Route path="/teqApp/report" component={TeqReport} />
                  <Route path="/teqApp/resource-report" component={TeqResourceReport} />
                  <Route path="/teqApp/pastLogRequest" component={TeqPastLogRequests} />
                  <Route path="/teqApp/projectDetails/:id" component={ProjectDetails} />
                  <Route path="/dashbord1" component={Dash}>



                    {" "}
                  </Route>
                  <Route path="*" component={NotFound} />
                </Switch>
              </div>
            ) : (
                ""
              )}
            {this.state.userRole == "Manager" ? (
              <div className="content-wrapper">
                <Switch>
                  <Route exact path="/dashboard" component={Maincontainer} />
                  <Route path="/teqApp/emProfile1" component={Emprofile1} />
                  <Route exact path="/" component={Maincontainer} />
                  <Route path="/teqApp/dashboard" component={AppDashboard} />
                  <Route path="/teqApp/clients" component={TeqClients} />
                  <Route path="/teqApp/project" component={TeqProject} />
                  <Route path="/teqApp/employeelist" component={TeqEmployeeManagement} />
                  <Route path="/teqApp/teammembers" component={TeqTeamMembers} />
                  <Route path="/teqApp/report" component={TeqReport} />
                  <Route path="/teqApp/resource-report" component={TeqResourceReport} />
                  <Route path="/teqApp/pastLogRequest" component={TeqPastLogRequests} />
                  <Route path="/teqApp/emProfile/:id" component={EmProfile} />
                  <Route path="/detailspage/:id/:userid" component={DetailPage} />
                  <Route path="/about" component={About} />
                  <Route
                    path="/leavedetail"
                    component={EmployeeLeaveDetail}
                  ></Route>
                  <Route
                    path="/wfhdetail"
                    component={MyWfhRequset}
                  ></Route>
                  <Route
                    path="/leaverequest"
                    component={ManagerLeaveRequest}
                  ></Route>
                  <Route path="/employeemanagement" component={AddEmployee} />
                  <Route
                    path="/wfhrequest"
                    component={ManagerWFHRequest}
                  ></Route>
                  <Route path="/profile" component={Profile} />
                  <Route path="/itsupport" component={ITSupport} />
                  <Route path="/hrsupport" component={HRSupport} />
                  <Route path="/empProfile" component={EmployeeProfile} />
                  <Route path="/dashbord1" component={Dash}>
                    {" "}
                  </Route>
                  <Route path="/teqApp/projectDetails/:id" component={ProjectDetails} />
                  <Route path="*" component={NotFound} />
                </Switch>{" "}
              </div>
            ) : (
                ""
              )}

            {this.state.userRole == "Employee" ? (
              <div className="content-wrapper">
                <Switch>
                  <Route exact path="/dashboard" component={Maincontainer} />
                  <Route exact path="/" component={Maincontainer} />
                  <Route path="/teqApp/dashboard" component={AppDashboard} />
                  <Route path="/teqApp/emProfile1" component={Emprofile1} />
                  <Route path="/about" component={About} />
                  <Route
                    path="/leavedetail"
                    component={EmployeeLeaveDetail}
                  ></Route>
                  <Route
                    path="/wfhdetail"
                    component={MyWfhRequset}
                  ></Route>
                  <Route path="/dashbord1" component={Dash}>
                    {" "}
                  </Route>
                  <Route path="/profile" component={Profile} />
                  <Route path="/empProfile" component={EmployeeProfile} />
                  <Route path="/itsupport" component={ITSupport} />
                  <Route path="/hrSupport" component={HRSupport} />
                  {/* <Route path="/teqApp/dashboard" component={AppDashboard} /> */}
                  <Route path="/teqApp/teammembers" component={TeqTeamMembers} />
                  <Route path="/teqApp/projectlist" component={TeqUserProject} />
                  <Route path="/teqApp/report" component={TeqReport} />
                  <Route path="/teqApp/pastLogRequest" component={TeqPastLogRequests} />
                  <Route path="*" component={NotFound} />
                </Switch>
              </div>
            ) : (
                ""
              )}
            {this.state.userRole == "SuperAdmin" ? (
              <div className="content-wrapper">
                <Switch>
                  <Route exact path="/dashboard" component={Maincontainer} />
                  <Route exact path="/" component={Maincontainer} />
                  <Route path="/teqApp/dashboard" component={AppDashboard} />
                  <Route path="/teqApp/clients" component={TeqClients} />
                  <Route path="/teqApp/emProfile1" component={Emprofile1} />
                  <Route path="/teqApp/project" component={TeqProject} />
                  <Route path="/teqApp/projectDetails/:id" component={ProjectDetails}/>
                  <Route path="/teqApp/employeelist" component={TeqEmployeeManagement} />
                  <Route path="/teqApp/report" component={TeqReport} />
                  <Route path="/teqApp/pastLogRequest" component={TeqPastLogRequests} />
                  <Route path="/teqApp/resource-report" component={TeqResourceReport} />
                  <Route path="/teqApp/emProfile/:id" component={EmProfile} />
                  <Route path="/leaverequest" component={LeaveStatus} />
                  <Route path="/employeemanagement" component={AddEmployee} />
                  <Route path="/leavedetail" component={LeaveDetail} />
                  <Route path="/about" component={About} />
                  <Route path="/profile" component={Profile} />
                  <Route path="/empProfile/:id" component={EmployeeProfile} />
                  <Route path="/dashbord1" component={Dash} />
                  <Route path="/detailspage/:id/:userid" component={DetailPage} />
                  <Route path="/leavehistory" component={LeaveHistory} />
                  <Route path="/leavereport" component={ChartPage} />
                  <Route path="/wfhrequest" component={WFHRequest} />
                  <Route path="/wfhdetails" component={WFHDetail} />
                  <Route path="/itsupport" component={ITSupport} />
                  <Route path="/hrSupport" component={HRSupport} />
                  <Route path="*" component={NotFound} />
                </Switch>
              </div>
            ) : (
                ""
              )}
            {this.state.userRole == "TeamLead" ? (
              <div className="content-wrapper">
                <Switch>
                  <Route exact path="/dashboard" component={Maincontainer} />
                  <Route exact path="/" component={Maincontainer} />
                  <Route path="/teqApp/emProfile1" component={Emprofile1} />
                <Route path="/detailspage/:id/:userid" component={DetailPage} />
                  <Route path="/about" component={About} />
                  <Route
                    path="/leavedetail"
                    component={EmployeeLeaveDetail}
                  ></Route>
                  <Route path="/employeemanagement" component={AddEmployee} />
                  <Route
                    path="/wfhdetail"
                    component={MyWfhRequset}
                  ></Route>
                  <Route
                    path="/leaverequest"
                    component={ManagerLeaveRequest}
                  ></Route>
                  <Route
                    path="/wfhrequest"
                    component={ManagerWFHRequest}
                  ></Route>
                  <Route path="/teqApp/dashboard" component={AppDashboard} />                 
                  <Route path="/teqApp/teammembers" component={TeqTeamMembers} />
                  <Route path="/teqApp/projectlist" component={TeqUserProject} />
                  <Route path="/teqApp/emProfile/:id" component={EmProfile} />
                  <Route path="/teqApp/report" component={TeqReport} />
                  <Route path="/teqApp/pastLogRequest" component={TeqPastLogRequests} />
                  <Route path="/profile" component={Profile} />
                  <Route path="/empProfile" component={EmployeeProfile} />
                  <Route path="/dashbord1" component={Dash}>
                    {" "}
                  </Route>
                  <Route path="/itsupport" component={ITSupport} />
                  <Route path="/hrSupport" component={HRSupport} />
                  <Route path="*" component={NotFound} />
                </Switch>{" "}
              </div>
            ) : (
                ""
              )}

            {this.state.userRole == "HR" ? (
              <div className="content-wrapper">
                <Switch>
                  <Route exact path="/dashboard" component={Maincontainer} />
                  <Route path="/teqApp/emProfile1" component={Emprofile1} />
                  <Route exact path="/" component={Maincontainer} />
                  <Route path="/leaverequest" component={LeaveStatus} />
                  <Route path="/leavereport" component={ChartPage} />
                  <Route path="/leavedetail" component={LeaveDetail} />
                  <Route path="/about" component={About} />
                  <Route path="/employeemanagement" component={AddEmployee} />
                  <Route path="/profile" component={Profile} />
                  <Route path="/empProfile/:id" component={EmployeeProfile} />
                  <Route path="/detailspage/:id/:userid" component={DetailPage} />
                  <Route path="/leavehistory/:id" component={LeaveHistory} />
                  <Route path="/wfhrequest" component={WFHRequest} />
                  <Route path="/wfhdetails" component={WFHDetail} />
                  <Route path="/teqApp/emProfile/:id" component={EmProfile} />
                  <Route path="/teqApp/dashboard" component={AppDashboard} />
                  <Route path="/teqApp/clients" component={TeqClients} />
                  <Route path="/teqApp/project" component={TeqProject} />
                  <Route path="/teqApp/projectDetails/:id" component={ProjectDetails}/>
                  <Route path="/teqApp/employeelist" component={TeqEmployeeManagement} />
                  <Route path="/teqApp/teammembers" component={TeqTeamMembers} />
                  <Route path="/teqApp/projectlist" component={TeqUserProject} />
                  <Route path="/teqApp/report" component={TeqReport} />
                  <Route path="/teqApp/pastLogRequest" component={TeqPastLogRequests} />
                  <Route path="/dashbord1" component={Dash}>
               
                    {" "}
                  </Route>
                  <Route path="/itsupport" component={ITSupport} />
                  <Route path="/hrSupport" component={HRSupport} />
                  <Route path="*" component={NotFound} />
                </Switch>
              </div>
            ) : (
                ""
              )}
          </Router>
        </div>)} </div>
    );
  }
}

export default withRouter(withAuth(App));
