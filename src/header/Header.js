import React, { Component } from "react";
import AuthService from "../AuthService";
import ModalWindow from "../modal/ModalWindow";
import ApplyLeave from "../ApplyLeave/applyleave";
import teq_logo from "../header/logo.png";
import header_user from "../header/admin-avatar.png";
import * as datesUtil from "../ApplyLeave/dateutils";
import AdminSidebar from "../sidebar/adminSidebar";
import EmployeeSidebar from "../sidebar/employeeSidebar";
import ManagerSidebar from "../sidebar/managerSidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import addDays from "date-fns/addDays";
import AddHours from "../AddHours/addhours";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
  withRouter
} from "react-router-dom";

const Auth = new AuthService();
const sidebar = new AdminSidebar();
const empsidebar = new EmployeeSidebar();
const mansidebar = new ManagerSidebar();
var itSupport = window.location.pathname;
var authtokenurl = itSupport.split("App", 1);
var tokenurl = authtokenurl[0];
class Header extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.state = {
      showModal: false,
      role: null,
      imagePreviewUrl: "",
      startDate: new Date(),
      endDate: new Date(),
      reason: "",
      Validate: false,
      toastAlert: false,
      cats: [],
      click: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.handleChangeReason = this.handleChangeReason.bind(this);
  }

  // itSupportclick = () => {
  //   window.location.reload();
  //   var x = "IT"
  //   this.setState({
  //     click: x
  //   });
  // };
  // hrSupportclick = () => {
  //   window.location.reload();
  //   var x = "HR"
  //   this.setState({
  //     click: x
  //   });
  // };
  // backtoleave = () => {
  //   window.location.reload();
  //   document.getElementById("sidebar").style.display = "block";
  //   const profile = Auth.getProfile();

  //   const clickedButton = "dashboard";
  //   if (profile.role == "Employee") {
  //     empsidebar.handleActiveLink();
  //   }
  //   if (profile.role == "Manager") {
  //     mansidebar.handleActiveLink();
  //   }
  //   if (profile.role == "Admin" || profile.role == "SuperAdmin") {
  //     sidebar.handleActiveLink();
  //   }



  //   this.setState({
  //     click: ""
  //   });
  // }
  test() {
    const profile = Auth.getProfile();
    const totalExp = profile.experience + profile.teqFocusExp;
    return totalExp < 2
      ? datesUtil.combinedDays()
      : datesUtil.excludeAllSaturdaysAndSundays();
  }
  handleChange = date => {
    const profile = Auth.getProfile();
    this.setState({
      startDate: date
    });
    if (this.state.endDate < date) {
      this.setState({
        alertMessage: "**Start date must be smaller than end date",
        showAlert: true,
        danger: true
      });
    }
    else {
      this.setState({
        showAlert: false
      });
    }
  };
  handleChangeEnd = date => {
    const profile = Auth.getProfile();
    if (this.state.startDate > date) {
      this.setState({
        alertMessage: "**Start date must be smaller than end date",
        showAlert: true,
        danger: true
      });
    } else if (this.state.startDate <= date) {
      this.setState({
        showAlert: false
      });
    }
    this.setState({
      endDate: date
    });
  };
  handleChangeReason(event) {
    this.setState({
      reason: event.target.value
    });
    if (event.target.value.trim().length === 0) {
      this.setState({
        Validate: false
      });
    } else {
      this.setState({
        Validate: true
      });
    }
  }
  hidePreviousMonth = () => {
    var todayDate = new Date()
    var firstDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    return firstDate;
  }
  hideNextMonth = () => {
    var todayDate = new Date()
    var endDate = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);
    return endDate;
  }
  cancelForm = () => {
    this.setState({
      startDate: new Date(),
      endDate: new Date(),
      reason: ""
    });
    this.refs.reason.value = "";
  };
  createLeaveDates(startdate, enddate) {
    var tempDateArr = [];
    var startDate = startdate;
    var endDate = enddate;
    var differenceInDays = differenceInCalendarDays(endDate, startDate);
    var totalExp = this.state.data.experience + this.state.data.teqFocusExp;
    var isExpLessThan2 = totalExp < 2 ? true : false;
    var combinedDaysWithEvenSaturdaysAndSundays = datesUtil.combinedDaysWithEvenSaturdaysAndSundays();
    for (var i = 0; i <= combinedDaysWithEvenSaturdaysAndSundays.length; i++) {
      if (
        combinedDaysWithEvenSaturdaysAndSundays[i] > startDate &&
        combinedDaysWithEvenSaturdaysAndSundays[i] < endDate
      ) {
        if (combinedDaysWithEvenSaturdaysAndSundays[i] !== undefined)
          combinedDaysWithEvenSaturdaysAndSundays[
            i
          ] = combinedDaysWithEvenSaturdaysAndSundays[i]
            .toString()
            .substring(0, 10);
      }
    }

    var combinedDaysWithexcludeAllSaturdaysAndSundays = datesUtil.combinedDaysWithexcludeAllSaturdaysAndSundays();
    for (
      var i = 0;
      i <= combinedDaysWithexcludeAllSaturdaysAndSundays.length;
      i++
    ) {
      if (
        combinedDaysWithexcludeAllSaturdaysAndSundays[i] > startDate &&
        combinedDaysWithexcludeAllSaturdaysAndSundays[i] < endDate
      ) {
        if (combinedDaysWithexcludeAllSaturdaysAndSundays[i] !== undefined)
          combinedDaysWithexcludeAllSaturdaysAndSundays[
            i
          ] = combinedDaysWithexcludeAllSaturdaysAndSundays[i]
            .toString()
            .substring(0, 10);
      }
    }

    for (var i = 0; i <= differenceInDays; i++) {
      var tempDate = addDays(startDate, i);
      var dateStr = tempDate.toString().substring(0, 10);

      if (isExpLessThan2) {
        if (!combinedDaysWithEvenSaturdaysAndSundays.includes(dateStr))
          tempDateArr.push(tempDate);
      } else {
        if (!combinedDaysWithexcludeAllSaturdaysAndSundays.includes(dateStr))
          tempDateArr.push(tempDate);
      }
    }
    // this.setState({
    //   cats:tempDateArr
    // })

    var dates = tempDateArr;
    return dates;
  }
  handleSubmit = () => {

    var startDate = this.state.startDate;
    var reason = this.refs.reason.value;
    var endDate = this.state.endDate;


    var dates_durations = this.createLeaveDates(startDate, endDate)
    var numberOfDays = dates_durations.length;
    Auth.applywfh(startDate, endDate, reason, numberOfDays, dates_durations).then(response => {
      console.log(response);
      if (response.message == "WFH request applied successfully") {
        this.setState({
          alertMessage: "Request Submitted Successfully",
          toastAlert: true,
          danger: false
        });
        this.cancelmodal();
        setTimeout(() => {
          this.setState({ alertMessage: "", toastAlert: false });
        }, 4000);
        this.refs.reason.value = ""
      } else {
        this.setState({
          alertMessage: response.message,
          showAlert: true
        });
      }
    });
  };
  cancelmodal = () => {
    document.getElementById("workhome").style.display = "none";
    let modal = document.querySelector(".modal-backdrop");
    modal.style.display = "none";
  };
  handleAlertClass() {
    let classes = "alert alert-dismissable fade show alertpopup row toast-alert-pd ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
  componentDidMount() {
    
    var itSupport = window.location.pathname;
    var authtokenurl = itSupport.split("App", 1);
    var tokenurl = authtokenurl[0];
    let reader = new FileReader();
    const profile = Auth.getProfile();
    this.setState({
      role: profile.name
    });

    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then(response => {
      var base64Flag = "data:image/jpeg;base64,";
      // if (file != undefined) {
      //     reader.readAsDataURL(file)
      // }
      if (response.user.imageData == undefined) {
        this.setState({
          userRole: response.user.role,
          data: response.user,
          userId: response.user._id
        });
      } else {
        this.setState({
          userRole: response.user.role,
          data: response.user,
          userId: response.user._id,
          imagePreviewUrl: response.user.imageData.image
        });
      }
    });
  }
  handleLogout() {
    Auth.logout();
    this.props.history.replace("/login");
    window.location.reload();
  }
  render() {
    const CustomInput = props => {
      return (
        <input
          className="form-control"
          onClick={props.onClick}
          value={props.value}
          type="text"
          readOnly={true}
        />
      );
    };
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = <img className="img-circle" src={imagePreviewUrl} />;
    } else {
      $imagePreview = (
        <img className="img-circle" src="./assets/img/users/u8.jpg" />
      );
    }
    return (
      <div>
        {this.state.toastAlert == true ? (
          <div className={this.handleAlertClass()}>
            <div class="flag__image note__icon">
              <i class="fa fa-check"></i>
            </div>
            <button
              className="close space-bt"
              onClick={this.handleAlert}
              aria-label="Close"
            >
              ×
        </button>
            <div className="toast-msg-txt">
              <strong>{this.state.alertMessage}</strong>
            </div>
          </div>
        ) : (
            ""
          )}
        <div className="modal fade" id="workhome">
          <div className="modal-dialog">
            <div className="modal-content applyleave">
              <div className="modal-header applyleave">
                <h4 className="modal-title applyleave">
                  WFH Request
                </h4>
                {this.state.showAlert == true ? (
                  <div className="alertmessage">
                    {this.state.alertMessage} !
                  </div>
                ) : (
                    ""
                  )}
                <button
                  type="button"
                  className="close addholiday"
                  data-dismiss="modal"
                  onClick={this.cancelForm}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <from className="workhome">
                  <div className="row">
                    <div className="col-sm-6 form-group">
                      <div className="form-group" id="date_1">
                        <label className="font-normal">
                          Start Date<span className="required">*</span>{" "}
                        </label>
                        <div className="input-group date">
                          <span className="input-group-addon bg-white">
                            <i className="fa fa-calendar"></i>
                          </span>
                          <DatePicker
                            customInput={<CustomInput />}
                            dateFormat="MM/dd/yyyy"
                            minDate={
                              this.hidePreviousMonth()
                            }
                            maxDate={this.hideNextMonth()}
                            ref="startdate"
                            className="form-control date-picker-date"
                            selected={this.state.startDate}
                            onChange={this.handleChange}
                            excludeDates={this.test()}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 form-group">
                      <div className="form-group" id="date_2">
                        <label className="font-normal">
                          End Date <span className="required">*</span>
                        </label>
                        <div className="input-group date">
                          <span className="input-group-addon bg-white">
                            <i className="fa fa-calendar"></i>
                          </span>
                          <DatePicker
                            customInput={<CustomInput />}
                            minDate={
                              this.hidePreviousMonth()
                            }
                            maxDate={this.hideNextMonth()}
                            dateFormat="MM/dd/yyyy"
                            ref="startdate"
                            className="form-control date-picker-date"
                            selected={this.state.endDate}
                            onChange={this.handleChangeEnd}
                            excludeDates={this.test()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>
                      Reason<span className="required">*</span>
                    </label>
                    <textarea
                      onChange={this.handleChangeReason}
                      className="form-control"
                      ref="reason"
                      maxlength="300"
                      rows="3"
                      required
                    />
                  </div>
                </from>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  data-dismiss="modal"
                  onClick={this.cancelForm}
                  className="btn btn-danger btn-rounded btn-fix"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!this.state.Validate}
                  className="btn btn-success btn-rounded btn-fix save"
                  onClick={this.handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        {tokenurl == "/teq" ? (
          <div>

            <header className="header">
              <div className="page-brand pageLogo">

                <div className="link">
                  <Link to='//teqApp/dashboard'><img src={teq_logo} className="teq-logo" /></Link>
                </div>

              </div> <div className="flexbox flex-1">
                <ul className="nav navbar-toolbar">
                  <li>
                    <a className="nav-link sidebar-toggler js-sidebar-toggler">
                      <i className="ti-menu"></i>
                    </a>
                  </li>
                </ul>
                <Router>
                  <ul className="nav navbar-toolbar">
                    <li>
                      <div>
                         {this.state.userRole == "Manager" || this.state.userRole == "TeamLead" || this.state.userRole == "Employee" ? (
                           <button
                           className="btn btn-success btn-rounded app-leave"
                           data-toggle="modal"
                           data-target="#addHours"
                           aria-pressed="false"
                         >
                           <i className="fa fa-plus-circle m-r-5"></i> <span className="header-btn-none">Log Hours </span>
                         </button> 
                         ):("")}
                        
                      </div>
                    </li>
                    <li className="">
                      <a className="" onClick={this.handleLogout.bind(this)}>
                        <i className="fa fa-power-off logout m-r-5"></i>Logout
                </a>
                    </li>
                  </ul>
                </Router>
              </div>
            </header>
          </div>
        ) : (
            <header className="header">
              <div className="page-brand pageLogo">

                <div className="link">
                  <Link to='/dashboard'><img src={teq_logo} className="teq-logo" /></Link>
                </div>

              </div>
              <div className="flexbox flex-1">
                <div>

                  {itSupport === "/itsupport" || itSupport === "/hrsupport" ? (
                    <div>
                      <ul className="nav navbar-toolbar">
                        {/*} <li className="nav-link sidebar-toggler js-sidebar-toggler">
                      <div onClick={this.itSupportclick}>  <Link to="/itsupport"><button
                            //   className="btn btn-warning btn-rounded"
                            // >
                            //   <i className="fa fa-wrench"></i> <span className="header-btn-none">IT Support</span>
                            // </button></Link>
                            // </div> *
                      <div> <a href="https://teqfocus.atlassian.net/servicedesk/customer/portal/2" rel="noopener noreferrer" target="_blank"
                        className="btn btn-warning btn-rounded"
                      >
                        <i className="fa fa-wrench"></i> <span className="header-btn-none">IT Support</span>
                      </a>
                      </div>
                    </li>*/}
                        {/* <li className="nav-link sidebar-toggler js-sidebar-toggler">
                      <div>
                        {itSupport === "/hrsupport" ? (

                          <div onClick={this.backtoleave}>  <Link to="/dashboard"><button
                            className="btn btn-teq-icon btn-rounded"
                          >
                            <i className="fa fa-arrow-left mr-1"></i><span className="header-btn-none">Back To Teqleave</span>
                          </button></Link>
                          </div>
                        ) : (

                            <div onClick={this.hrSupportclick}>  <Link to="/hrsupport"><button
                              className="btn btn-warning btn-rounded"
                            >
                              <i className="fa fa-wrench"></i><span className="header-btn-none">HR Portal</span>
                            </button></Link>
                            </div>
                          )}
                      </div>
                    </li>
                  */}
                      </ul>

                    </div>
                  ) : (
                      <ul className="nav navbar-toolbar">
                        <li className="nav-link sidebar-toggler js-sidebar-toggler">
                          <a >
                            <i className="ti-menu"></i>
                          </a>
                        </li>

                        {/* <li className="nav-link sidebar-toggler js-sidebar-toggler">
                      <div>
                        {itSupport === "/hrsupport" ? (

                          <div onClick={this.backtoleave}>  <Link to="/dashboard"><button
                            className="btn btn-teq-icon btn-rounded"
                          >
                            <i className="fa fa-arrow-left mr-1"></i><span className="header-btn-none">Back To Teqleave</span>
                          </button></Link>
                          </div>
                        ) : (

                            <div onClick={this.hrSupportclick}>  <Link to="/hrsupport"><button
                              className="btn btn-warning btn-rounded"
                            >
                              <i className="fa fa-wrench"></i><span className="header-btn-none">HR Portal</span>
                            </button></Link>
                            </div>
                          )}
                      </div>
                    </li>
                  */}
                      </ul>

                    )}
                </div>
                {/* <ul className="nav navbar-toolbar itmargin">
            </ul> */}

                {itSupport === "/itsupport" || itSupport === "/hrsupport" ? (
                  <ul className="nav navbar-toolbar btn-nav-aap">
                    {this.state.click == "" ? (
                      <li>
                        <div> <a href="https://teqfocus.atlassian.net/servicedesk/customer/portal/2" rel="noopener noreferrer" target="_blank"
                          className="btn btn-teq-icon btn-rounded support-btn"
                        >
                          <i className="fa fa-headphones"></i> <span className="header-btn-none">IT Support</span>
                        </a>
                        </div>


                        {/*<div className="wfh_button">
                      <div> <button
                      className="btn btn-danger btn-rounded"
                      data-toggle="modal"
                      data-target="#workhome"
                      disabled
                    >
                      <i className="fa fa-laptop"></i> <span className="header-btn-none">WFH</span>
                    </button></div> 
                    </div>*/}
                      </li>
                    ) : ('')}
                    {this.state.click == "" ? (
                      <li>
                        <div>
                          <button
                            className="btn btn-success btn-rounded app-leave"
                            data-toggle="modal"
                            data-target="#empLeave"
                            aria-pressed="false"
                            disabled
                          >
                            <i className="fa fa-paper-plane"></i> <span className="header-btn-none">Apply </span>
                          </button>
                        </div>
                      </li>
                    ) : ('')}
                    <li className="dropdown dropdown-user">
                      <a
                        className="nav-link dropdown-toggle link"
                        data-toggle="dropdown"
                      >
                        {$imagePreview}
                        <span></span>{" "}
                        <span>
                          {this.state.role} <i className="fa fa-angle-down m-l-5"></i>
                        </span>
                      </a>
                      <ul className="dropdown-menu dropdown-menu-right">
                        <Link  >
                          <li className="dropdown-item " href="" >

                            <i className="fa fa-user"></i>Profile
                    </li>
                        </Link>

                        {/* <a className="dropdown-item" href="profile.html"><i className="fa fa-cog"></i>Settings</a>
                                    <a className="dropdown-item" href="#!"><i className="fa fa-support"></i>Support</a> */}
                        {/* <li className="dropdown-divider"></li> */}
                        <li>
                          <a
                            className="dropdown-item"
                            onClick={this.handleLogout.bind(this)}
                          >
                            <i className="fa fa-power-off"></i>Logout
                    </a>
                        </li>
                      </ul>
                    </li>
                  </ul>

                ) : (
                    <ul className="nav navbar-toolbar btn-nav-aap">
                      {this.state.click == "" ? (

                        <li>
                          <div className="wfh_button"> <a href="https://teqfocus.atlassian.net/servicedesk/customer/portal/2" rel="noopener noreferrer" target="_blank"
                            className="btn btn-teq-icon btn-rounded support-btn"
                          >
                            <i className="fa fa-headphones"></i> <span className="header-btn-none">IT Support</span>
                          </a>
                          </div>
                          {/* <div >
                    <div> <button
                      className="btn btn-danger btn-rounded"
                      data-toggle="modal"
                      data-target="#workhome"
                    >
                      <i className="fa fa-laptop"></i> <span className="header-btn-none">WFH</span>
                    </button></div>
                  </div> */}

                        </li>
                      ) : ('')}
                      {this.state.click == "" ? (
                        <li>
                          <div>
                            <button
                              className="btn btn-success btn-rounded app-leave"
                              data-toggle="modal"
                              data-target="#empLeave"
                              aria-pressed="false"
                            >
                              <i className="fa fa-paper-plane"></i> <span className="header-btn-none">Apply</span>
                            </button>
                          </div>
                        </li>
                      ) : ('')}
                      <li className="dropdown dropdown-user">
                        <a
                          className="nav-link dropdown-toggle link"
                          data-toggle="dropdown"
                        >
                          {$imagePreview}
                          <span></span>{" "}
                          <span>
                            {this.state.role} <i className="fa fa-angle-down m-l-5"></i>
                          </span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-right">
                          <Link to="/profile">
                            <li className="dropdown-item " href="">
                              <i className="fa fa-user"></i>Profile
                    </li>
                          </Link>

                          {/* <a className="dropdown-item" href="profile.html"><i className="fa fa-cog"></i>Settings</a>
                                    <a className="dropdown-item" href="#!"><i className="fa fa-support"></i>Support</a> */}
                          {/* <li className="dropdown-divider"></li> */}
                          <li>
                            <a
                              className="dropdown-item"
                              onClick={this.handleLogout.bind(this)}
                            >
                              <i className="fa fa-power-off"></i>Logout
                    </a>
                          </li>
                        </ul>
                      </li>
                    </ul>

                  )}


              </div>
            </header>
          )}
        <ModalWindow show={this.state.showModal} container={this} />
        <ApplyLeave show={this.state.showModal} container={this} />
        <AddHours show={this.state.showModal} container={this} />
      </div>
    );
  }
}
export default withRouter(Header);
