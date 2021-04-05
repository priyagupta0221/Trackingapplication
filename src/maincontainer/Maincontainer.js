import React, { Component } from "react";
import Axios from "axios";
import FullCalendar from "fullcalendar-reactwrapper";
import Calendar from "./calendar";
import AuthService from "../AuthService";
import AttendanceChart from "./doughnutChart";
import Loader from "react-loader-spinner";
import DatePicker from "react-datepicker";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
const Auth = new AuthService();
let test = false;
var expInTeq = 0;
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
var count = 0;
export default class Maincontainer extends Component {
  constructor(props) {
    super(props);
    // this.changeDiv = this.changeDiv.bind(this);
    this.state = {
      today: new Date(),
      items: [],
      loading: true,
      events: [],
      currholiday: [],
      currholidayStatus: false,
      holiday: [],
      days: [],
      upcomingHoliday: {},
      absentCount: "",
      userLength: "",
      userRole: "",
      show: false,
      absent: [],
      present: [],
      user: [],
      holiday: [],
      selectDate: new Date(),
      name: "",
      numberofdays: "1",
      alertMessage: "",
      showAlert: false,
      danger: false,
      holidayId: null,
      role: false,
      Validate: false,
      location: 'Ranchi',
      locationchange: '',
      appliedUser: '',
      showAcc: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAddHoliday = this.handleAddHoliday.bind(this);
    this.handleChangeEvent = this.handleChangeEvent.bind(this);

    /* Start show data according to user based*/
    const profile = Auth.getProfile();
    if (
      profile.role == "Manager" ||
      profile.role == "Employee" ||
      profile.role == "TeamLead"
    ) {
      test = true;
      this.setState({
        role: true
      });
    }
  }
  /* End show data according to user based*/
  /* Start show holidays data according to location*/
  handleLocationChange = (event) => {
    this.setState({
      locationchange: event.currentTarget.value
    })
    var locationchange = event.currentTarget.value
    Auth.getHolidayList(locationchange).then(response => {
      var tempHolidaysList = [];
      for (var i = 0; i < response.holidays.length; i++) {
        response.holidays[i].date = response.holidays[i].date
          .toString()
          .substring(0, 10);
        var date = new Date(response.holidays[i].date);
        if(response.holidays[i].location == 'Canada'){
          var canada_offset = date.getTimezoneOffset();
          date.setMinutes(date.getMinutes() + canada_offset);
        }
        var day = weekday[date.getDay()];
        response.holidays[i].dayName = day;
        tempHolidaysList.push(response.holidays[i]);
      }
      for (var i = 0; i < tempHolidaysList.length; i++) {
        var x = tempHolidaysList[i].dayName;
        tempHolidaysList[i].dayName = x.slice(0, 3);
      }
      // for (var i = 0; i < tempHolidaysList; i++) {
      //   if (userlocation == tempHolidaysList[i].location) {
      //     tempHolidaysList.push(tempHolidaysList[i])
      //   }
      // }
      this.setState({
        holiday: tempHolidaysList,
      });

    });
  }
  /* End show holidays data according to location*/
  /* Start Add holidays data*/
  handleAddHoliday = () => {
    var date = this.state.selectDate;
    var name = this.refs.name.value;
    var number_of_days = this.state.numberofdays;
    var location = this.refs.location.value
    Auth.addHoliday(date, name, number_of_days, location).then(response => {
      if (response.status == 200) {
        this.setState({
          alertMessage: "Holiday Added Successfully",
          showAlert: true,
          danger: false
        });
        setTimeout(() => {
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);
        this.componentDidMount();
        window.location.reload();
        this.state.selectDate = new Date();
        this.refs.name.value = "";
      } else {
        this.setState({
          alertMessage: response.message,
          showAlert: true,
          danger: true
        });
        setTimeout(() => {
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);
      }
    });
  };
  /* End Add holidays data*/
  /* Start handle Change datepicker value*/
  handleChange = date => {
    const profile = Auth.getProfile();
    this.setState({
      selectDate: date
    });
  };
  /* End handle Change datepicker value*/
  /* Start handle Change Location value*/
  handlelocation = event => {
    this.setState({
      location: event.currentTarget.value
    });
  };
  /* End handle Change Location value*/
  /* Start handle Change Holiday value*/
  handleChangeEvent(event) {
    this.setState({
      name: event.target.value
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
  /* End handle Change Holiday value*/
  /* Start Cancel Model window  */
  cancelForm = () => {
    this.setState({
      selectDate: new Date(),
      name: "",
      Validate: false
    });
    this.refs.name.value = "";
  };
  /* End Cancel Model window  */
  /* Start show Delete  holiday  Model window  */
  handleShow(id) {
    this.setState({
      show: true,
      holidayId: id
    });
  }
  /* End show Delete  holiday  Model window  */
  /* Start Hide Previous Year datepicker value */
  hidePreviousYear = () => {
    var todayDate = new Date()
    var firstDate = new Date(todayDate.getFullYear(), 0, 1);
    return firstDate;
  }
  /* End Hide Previous Year datepicker value */
  /* Start Delete Holiday Value */
  deleteHoliday(id) {
    Auth.deleteHoliday(id).then(response => {
      if (response.status == 200) {
        this.setState({
          alertMessage: "Holiday Deleted Successfully",
          showAlert: true,
          danger: false
        });
        setTimeout(() => {
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);
        this.componentDidMount();
      } else {
        this.setState({
          alertMessage: response.message,
          showAlert: true,
          danger: true
        });
        setTimeout(() => {
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);
      }
    });
  }
  /* End Delete Holiday Value */
  /* Start Main Business Logic when page load  */
  componentDidMount() {
    var dashadmin = document.getElementById("dash");
    dashadmin.classList.add("active");
    Auth.getLeavesBalance().then(response => {
      if (response.balance.length > 0) {
        this.setState({
          appliedUser: response.balance[0].applied_by,
        });
        if (response.balance[0].casual_balance < 0) {
          var raisedOn = new Date()
            .toISOString()
            .substring(0, 10);
          var datestring = raisedOn.split("-");
          if (datestring[2] == '01') {
            this.updateCasual();
          } else {
            this.setState({
              items: response.balance[0],
              loading: false
            });
          }
        }
        else {
          this.setState({
            items: response.balance[0],
            loading: false
          });
        }
      }
    });
    Auth.getAttendance().then(response => {
      if (response.status == 200) {
        this.setState({
          absent: response.attendance.data[0].y,
          present: response.attendance.data[1].y
        });
      } else {
      }
    });
    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then(response => {
      this.setState({
        userRole: response.user.role
      });
      if (
        this.state.userRole == "Admin" ||
        this.state.userRole == "SuperAdmin"
      ) {
        Auth.getUserList("").then(response => {
          var len = response.users.length;

          this.setState({
            userLength: len
          });
        });
      }
    });
    const profile = Auth.getProfile();
    expInTeq = profile.teqFocusExp;
    var userlocation = profile.location;
    this.setState({
      locationchange: userlocation
    })
    Auth.getHolidayList(userlocation).then(response => {

      var dayArray;
      var tempHolidaysList = [];
      var upcomingHoliday;
      var tempobj = {};
      var holdData = []
      localStorage.setItem("dayArray", JSON.stringify(response.holidays));
      for (var i = 0; i < response.holidays.length; i++) {
        response.holidays[i].date = response.holidays[i].date
          .toString()
          .substring(0, 10);
        var date = new Date(response.holidays[i].date);
        if(response.holidays[i].location == 'Canada'){
          var canada_offset = date.getTimezoneOffset();
          date.setMinutes(date.getMinutes() + canada_offset);
        }
        var day = weekday[date.getDay()];
        response.holidays[i].dayName = day;
        // tempHolidaysList.push(response.holidays[i]);
      }
      for (var i = 0; i < response.holidays.length; i++) {
        if (userlocation == response.holidays[i].location) {
          tempHolidaysList.push(response.holidays[i])
        }
      }
      for (var j = 0; j < response.holidays.length; j++) {
        if (tempHolidaysList.length != 0) {
          if (new Date(response.holidays[j].date) >= this.state.today) {
            upcomingHoliday = tempHolidaysList[j].date;
            tempobj.date = upcomingHoliday;
            tempobj.day = weekday[new Date(upcomingHoliday).getDay()];
            console.log(tempobj);
            break;
          }
        }
      }
      for (var i = 0; i < tempHolidaysList.length; i++) {
        var x = tempHolidaysList[i].dayName;
        tempHolidaysList[i].dayName = x.slice(0, 3);
      }
      for (var i = 0; i < tempHolidaysList.length; i++) {
        var currmonth = this.currentDate().split("/");
        var currHolidayMonth = tempHolidaysList[i].date.split("-");

        if (currmonth[0] == currHolidayMonth[1]) {

          holdData.push(tempHolidaysList[i]);
        }
      }
      if (holdData.length == 0) {
        holdData.push({ name: " No holiday " });
        this.setState({
          currholidayStatus: true,

        });
      }
      this.setState({
        currholiday: holdData,

      });
      this.setState({
        holiday: tempHolidaysList,
        upcomingHoliday: tempobj
      });
    });
  }
  /* End Main Business Logic when page load  */
  /* Start Business Logic get current date */
  currentDate() {
    var date = new Date();
    var currDate = ((date.getMonth() > 8) ? (date.getMonth() + 1) :
      ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() :
        ('0' + date.getDate())) + '/' + date.getFullYear();
    return currDate;

  }
  /* End Business Logic get current date */
  /* Start Business Logic update casual leave */
  updateCasual() {
    Auth.getcasualBal(this.state.appliedUser).then(response => {
      if (response.casualTotal.length > 0) {
        this.setState({
          items: response.casualTotal[0],
          loading: false
        });
      }
    });
  }
  /* End Business Logic update casual leave */

  render() {
    let $test1 = null;

    let style = "";
    if (test) {
      $test1 = (
        <div className="ibox">
          <div className="ibox-head head-center">
            <div className="ibox-title">Holiday List 2020</div>
          </div>
          <div className="ibox-body">
            <div className="numberlist">
              <ol>
                {this.state.holiday.map(item => (
                  <li key={item._id}>
                    <div className="holiday-list">
                      <span className="holiday-list-flex">
                        {" "}
                        {item.date} | {item.dayName}
                        <span className="badge badge-primary badge-square float-right m-b-5 holiday-event">
                          {item.name}
                        </span>

                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      );
    } else {
      $test1 = (
        <div className="ibox">
          <div className="ibox-head ">
            <div className="ibox-title">Holiday List 2020</div>
            <div className="form">
              <div className="form-group leave-type-select">
                <label></label>
                <select
                  ref="locationchange"
                  className="form-control"
                  onChange={this.handleLocationChange}
                  value={this.state.locationchange}
                >
                  <option>Ranchi</option>
                  <option>Pune</option>
                  <option>Canada</option>
                </select>
              </div>
            </div>
            {this.state.userRole == "Admin" || this.state.userRole == "SuperAdmin" ? (
            <button
              className="btn btn-outline-info  btn-rounded addemployee-btn"
              data-toggle="modal"
              data-target="#addHoliday"
              aria-pressed="false"
            >
              <i className="fa fa-plus"></i>
            </button>
            ):('')}
          </div>
          <div className="ibox-body">
            <div className="numberlist">
              <ol>
                {this.state.holiday.map(item => (
                  <li key={item._id}>
                    <div className="holiday-list">
                      <span className="holiday-list-flex">
                        {" "}
                        {item.date} | {item.dayName}
                        <span className="badge badge-primary badge-square float-right m-b-5 holiday-event">
                          {item.name}
                        </span>
                        {this.state.userRole == "Admin" || this.state.userRole == "SuperAdmin" ? (
                        <button
                          className="btn badge-danger btn-xs"
                          data-toggle="modal"
                          data-target="#holidayDelete"
                          onClick={() => this.handleShow(item._id)}
                        >
                          <i className="fa fa-trash font decline"></i>
                        </button>):('')}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      );
    }
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
    if (this.state.loading) {
      return (
        <div className="loader-align">
          <Loader
            type="ThreeDots"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      );
    } else {
      return (
        <div className="page-content fade-in-up">
          {this.state.showAlert == true ? (
            <div className={this.handleAlertClass()}>
              <button
                className="close"
                onClick={this.handleAlert}
                aria-label="Close"
              >
                ×
              </button>
              <strong></strong> {this.state.alertMessage}
            </div>
          ) : (
              ""
            )}
          {/* AddHoliday */}
          <div className="modal fade" id="addHoliday" data-backdrop="static">
            <div className="modal-dialog">
              <div className="modal-content addholiday">
                <div className="modal-header addholiday">
                  <h4 className="modal-title addholiday">Add Holidays</h4>
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
                  <from className="addholiday">
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="form-group" id="holidayDate">
                          <label className="font-normal">Date </label>
                          <div className="input-group date">
                            <span className="input-group-addon bg-white">
                              <i className="fa fa-calendar"></i>
                            </span>
                            <DatePicker
                              customInput={<CustomInput />}
                              dateFormat="MM/dd/yyyy"
                              ref="holidayDate"
                              className="form-control date-picker-date"
                              minDate={this.hidePreviousYear()}
                              selected={this.state.selectDate}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 form-group">
                        <label>Location</label>
                        <select ref="location"
                          value={this.state.location}
                          onChange={this.handlelocation.bind(this)}
                          className="form-control">

                          <option>Ranchi</option>
                          <option>Pune</option>
                          <option>Canada</option>

                        </select>
                      </div>
                    </div>
                    <div className='row'>
                      <div className="col-sm-12">
                        <div className="form-group">
                          <label>Events</label>
                          <input
                            type="text"
                            onChange={this.handleChangeEvent}
                            className="form-control"
                            ref="name"
                          />
                        </div>
                      </div></div>
                  </from>
                </div>

                <div className="modal-footer">
                  <button
                    type="submit"
                    onClick={this.handleAddHoliday}
                    className="btn btn-success  btn-rounded btn-fix save"
                    data-dismiss="modal"
                    disabled={!this.state.Validate}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* delete holiday */}
          <div className="modal fade" id="holidayDelete">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body appr-model sweet-alert showSweetAlert visible">
                  <div
                    className="sa-icon sa-error animateErrorIcon"
                    data-dismiss="modal"
                  >
                    <span className="sa-x-mark animateXMark">
                      <span className="sa-line sa-left"></span>
                      <span className="sa-line sa-right"></span>
                    </span>
                  </div>
                </div>
                <div className="appr-model">
                  <h3 className="text-center">Are you sure?</h3>
                  <div>
                    <p className="text-center mt-txt">
                      You want to delete this Holiday!
                    </p>
                  </div>
                </div>
                <div className="modal-footer appr-center">
                  <div>
                    <button
                      className="btn btn-danger btn-rounded"
                      data-dismiss="modal"
                    >
                      <i className="fa fa-times"></i> Cancel
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn btn-success btn-rounded"
                      data-dismiss="modal"
                      onClick={() => this.deleteHoliday(this.state.holidayId)}
                    >
                      <i className="fa fa-check"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="row">
            <div className="col">
              <div className="iboxcard bg-success color-white widget-stat ibox-head">
                <div className="ibox-body">
                  <div className="row between-xs">
                    <div className="col-xs-4">
                      <div className="box">
                        <h2 className="m-b-1 font-strong">C L</h2>
                      </div>
                    </div>
                    <div className="col-xs-4">
                      <div className="widget-stat-icon">
                        <div className="box leave-box">
                          <i className="fa fa-plane plane-font"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list-group list-group-divider scroller">
                <div className="drop-pad">
                  <table className="table table-card">
                    <tbody>
                      <tr className="card-tr">
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-padd m-r-5 ">
                            BALANCE : {this.state.items.casual_balance}{" "}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white m-r-5 badge-card badge-white-appro-applied ">
                            APPLIED : {this.state.items.casual_applied}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5 ">
                            PENDING : {this.state.items.casual_pending}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5  ">
                            APPROVED : {this.state.items.casual_approved}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="iboxcard color-white widget-stat ibox-head">
                <div className="ibox-body">
                  <div className="row between-xs">
                    <div className="col-xs-4">
                      <div className="box">
                        <h2 className="m-b-1 font-strong">S L</h2>
                      </div>
                    </div>
                    <div className="col-xs-4">
                      <div className="widget-stat-icon">
                        <div className="box leave-box ambulance-box">
                          <i className="fa fa-ambulance ambulance-font"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list-group list-group-divider scroller">
                <div className="drop-pad">
                  <table className="table table-card">
                    <tbody>
                      <tr className="card-tr">
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-padd m-r-5 ">
                            BALANCE : {this.state.items.sick_balance}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white m-r-5 badge-card badge-white-appro-applied ">
                            APPLIED : {this.state.items.sick_applied}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5 ">
                            PENDING : {this.state.items.sick_pending}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5  ">
                            APPROVED : {this.state.items.sick_approved}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="iboxcard color-white widget-stat ibox-head">
                <div className="ibox-body">
                  <div className="row between-xs">
                    <div className="col-xs-4">
                      <div className="box">
                        <h2 className="m-b-1 font-strong">WFH</h2>
                      </div>
                    </div>

                    <div className="col-xs-4">
                      <div className="widget-stat-icon">
                        <div className="box leave-box birthday-box">
                          <i class="fa fa-laptop font" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list-group list-group-divider scroller">
                <div className="drop-pad">
                  <table className="table table-card">
                    <tbody>
                      <tr className="card-tr">
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-padd m-r-5 ">
                            BALANCE : {this.state.items.wfh_balance}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white m-r-5 badge-card badge-white-appro-applied ">
                            APPLIED : {this.state.items.wfh_applied}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5 ">
                            PENDING : {this.state.items.wfh_pending}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5  ">
                            APPROVED : {this.state.items.wfh_approved}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {expInTeq >= 3 ? (<div className="col">
              <div className="iboxcard bg-warning color-white widget-stat ibox-head">
                <div className="ibox-body">
                  <div className="row between-xs">
                    <div className="col-xs-4">
                      <div className="box">
                        <h2 className="m-b-1 font-strong">P L</h2>
                      </div>
                    </div>
                    <div className="col-xs-4">
                      <div className="widget-stat-icon">
                        <div className="box leave-box retweet-box">
                          <i className="fa fa-retweet retweet-font"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list-group list-group-divider scroller">
                <div className="drop-pad">
                  <table className="table table-card">
                    <tbody>
                      <tr className="card-tr">
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-padd m-r-5 ">
                            BALANCE :{" "}
                            {this.state.items.privileged_balance
                            }
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white m-r-5 badge-card badge-white-appro-applied ">
                            APPLIED :{" "}
                            {this.state.items.privileged_applied}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5 ">
                            PENDING :{" "}
                            {this.state.items.privileged_pending
                            }
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5  ">
                            APPROVED :{" "}
                            {this.state.items.privileged_approved}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>) : (
                <div className="col">
                  <div className="iboxcard bg-warning color-white widget-stat ibox-head">
                    <div className="ibox-body">
                      <div className="row between-xs">
                        <div className="col-xs-4">
                          <div className="box">
                            <h2 className="m-b-1 font-strong">P L</h2>
                          </div>
                        </div>
                        <div className="col-xs-4">
                          <div className="widget-stat-icon">
                            <div className="box leave-box retweet-box">
                              <i className="fa fa-retweet retweet-font"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="list-group list-group-divider scroller">
                    <div className="drop-pad">
                      <table className="table table-card">
                        <tbody>
                          <tr className="card-tr">
                            <td className="card-td">
                              <span className="badge badge-white badge-card badge-white-padd m-r-5 ">
                                BALANCE :{" "}
               0
              </span>
                            </td>
                            <td className="card-td-right">
                              <span className="badge badge-white m-r-5 badge-card badge-white-appro-applied ">
                                APPLIED :{" "}
                0
              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="card-td">
                              <span className="badge badge-white badge-card badge-white-appro m-r-5 ">
                                PENDING :{" "}
                0
              </span>
                            </td>
                            <td className="card-td-right">
                              <span className="badge badge-white badge-card badge-white-appro m-r-5  ">
                                APPROVED :{" "}
               0
              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>)}
            <div className="col">
              <div className="iboxcard bg-warning color-white widget-stat ibox-head">
                <div className="ibox-body">
                  <div className="row between-xs">
                    <div className="col-xs-4">
                      <div className="box">
                        <h2 className="m-b-1 font-strong">Comp Off</h2>
                      </div>
                    </div>
                    <div className="col-xs-4">
                      <div className="widget-stat-icon">
                        <div className="box leave-box retweet-box">
                          <i className="fa fa-clock-o retweet-font comoOff"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list-group list-group-divider scroller">
                <div className="drop-pad">
                  <table className="table table-card">
                    <tbody>
                      <tr className="card-tr">
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-padd m-r-5 ">
                            BALANCE :{" "}
                            {this.state.items.compoOff_balance
                            }
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white m-r-5 badge-card badge-white-appro-applied ">
                            APPLIED :{" "}
                            {this.state.items.compoOff_applied
                            }
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5 ">
                            PENDING :{" "}
                            {this.state.items.compoOff_pending}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5  ">
                            APPROVED :{" "}
                            {this.state.items.compoOff_approved}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          */}
          <div className="row">
            <div className="col">
              <div className="iboxcard bg-success color-white widget-stat ibox-head">
                <div className="ibox-body">
                  <div className="row between-xs">
                    <div className="col-xs-4">
                      <div className="box">
                        <h2 className="m-b-1 font-strong">C L</h2>
                      </div>
                    </div>
                    <div className="col-xs-4">
                      <div className="widget-stat-icon">
                        <div className="box leave-box">
                          <i className="fa fa-plane plane-font"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list-group list-group-divider scroller">
                <div className="drop-pad">
                  <table className="table table-card">
                    <tbody>
                      <tr className="card-tr">
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-padd m-r-5 ">
                            BALANCE : {this.state.items.casual_balance}{" "}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white m-r-5 badge-card badge-white-appro-applied ">
                            APPLIED : {this.state.items.casual_applied}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5 ">
                            PENDING : {this.state.items.casual_pending}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5  ">
                            APPROVED : {this.state.items.casual_approved}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="iboxcard color-white widget-stat ibox-head">
                <div className="ibox-body">
                  <div className="row between-xs">
                    <div className="col-xs-4">
                      <div className="box">
                        <h2 className="m-b-1 font-strong">S L</h2>
                      </div>
                    </div>
                    <div className="col-xs-4">
                      <div className="widget-stat-icon">
                        <div className="box leave-box ambulance-box">
                          <i className="fa fa-ambulance ambulance-font"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list-group list-group-divider scroller">
                <div className="drop-pad">
                  <table className="table table-card">
                    <tbody>
                      <tr className="card-tr">
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-padd m-r-5 ">
                            BALANCE : {this.state.items.sick_balance}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white m-r-5 badge-card badge-white-appro-applied ">
                            APPLIED : {this.state.items.sick_applied}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5 ">
                            PENDING : {this.state.items.sick_pending}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5  ">
                            APPROVED : {this.state.items.sick_approved}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="iboxcard color-white widget-stat ibox-head">
                <div className="ibox-body">
                  <div className="row between-xs">
                    <div className="col-xs-4">
                      <div className="box">
                        <h2 className="m-b-1 font-strong">WFH</h2>
                      </div>
                    </div>

                    <div className="col-xs-4">
                      <div className="widget-stat-icon">
                        <div className="box leave-box birthday-box">
                          <i class="fa fa-laptop font" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list-group list-group-divider scroller">
                <div className="drop-pad">
                  <table className="table table-card">
                    <tbody>
                      <tr className="card-tr">
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-padd m-r-5 ">
                            BALANCE : {this.state.items.wfh_balance}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white m-r-5 badge-card badge-white-appro-applied ">
                            APPLIED : {this.state.items.wfh_applied}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5 ">
                            PENDING : {this.state.items.wfh_pending}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5  ">
                            APPROVED : {this.state.items.wfh_approved}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* </div>
          <div className="row">
            <div className="col">
              <div className="iboxcard color-white widget-stat ibox-head">
                <div className="ibox-body">
                  <div className="row between-xs">
                    <div className="col-xs-4">
                      <div className="box">
                        <h2 className="m-b-1 font-strong">Birthday</h2>
                      </div>
                    </div>
                    <div className="col-xs-4">
                      <div className="widget-stat-icon">
                        <div className="box leave-box ambulance-box">
                          <i className="fa fa-birthday-cake ambulance-font"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list-group list-group-divider scroller">
                <div className="drop-pad">
                  <table className="table table-card">
                    <tbody>
                      <tr className="card-tr">
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-padd m-r-5 ">
                            BALANCE : {this.state.items.birthday_balance}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white m-r-5 badge-card badge-white-appro-applied ">
                            APPLIED : {this.state.items.birthday_applied}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5 ">
                            PENDING : {this.state.items.birthday_pending}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5  ">
                            APPROVED : {this.state.items.birthday_approved}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
           */}
            {expInTeq >= 3 ? (<div className="col">
              <div className="iboxcard bg-warning color-white widget-stat ibox-head">
                <div className="ibox-body">
                  <div className="row between-xs">
                    <div className="col-xs-4">
                      <div className="box">
                        <h2 className="m-b-1 font-strong">P L</h2>
                      </div>
                    </div>
                    <div className="col-xs-4">
                      <div className="widget-stat-icon">
                        <div className="box leave-box retweet-box">
                          <i className="fa fa-retweet retweet-font"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list-group list-group-divider scroller">
                <div className="drop-pad">
                  <table className="table table-card">
                    <tbody>
                      <tr className="card-tr">
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-padd m-r-5 ">
                            BALANCE :{" "}
                            {this.state.items.privileged_balance
                            }
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white m-r-5 badge-card badge-white-appro-applied ">
                            APPLIED :{" "}
                            {this.state.items.privileged_applied}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5 ">
                            PENDING :{" "}
                            {this.state.items.privileged_pending
                            }
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5  ">
                            APPROVED :{" "}
                            {this.state.items.privileged_approved}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>) : (
                <div className="col">
                  <div className="iboxcard bg-warning color-white widget-stat ibox-head">
                    <div className="ibox-body">
                      <div className="row between-xs">
                        <div className="col-xs-4">
                          <div className="box">
                            <h2 className="m-b-1 font-strong">P L</h2>
                          </div>
                        </div>
                        <div className="col-xs-4">
                          <div className="widget-stat-icon">
                            <div className="box leave-box retweet-box">
                              <i className="fa fa-retweet retweet-font"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="list-group list-group-divider scroller">
                    <div className="drop-pad">
                      <table className="table table-card">
                        <tbody>
                          <tr className="card-tr">
                            <td className="card-td">
                              <span className="badge badge-white badge-card badge-white-padd m-r-5 ">
                                BALANCE :{" "}
               0
              </span>
                            </td>
                            <td className="card-td-right">
                              <span className="badge badge-white m-r-5 badge-card badge-white-appro-applied ">
                                APPLIED :{" "}
                0
              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="card-td">
                              <span className="badge badge-white badge-card badge-white-appro m-r-5 ">
                                PENDING :{" "}
                0
              </span>
                            </td>
                            <td className="card-td-right">
                              <span className="badge badge-white badge-card badge-white-appro m-r-5  ">
                                APPROVED :{" "}
               0
              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>)}
            <div className="col">
              <div className="iboxcard bg-warning color-white widget-stat ibox-head">
                <div className="ibox-body">
                  <div className="row between-xs">
                    <div className="col-xs-4">
                      <div className="box">
                        <h2 className="m-b-1 font-strong">Comp Off</h2>
                      </div>
                    </div>
                    <div className="col-xs-4">
                      <div className="widget-stat-icon">
                        <div className="box leave-box retweet-box">
                          <i className="fa fa-clock-o retweet-font comoOff"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list-group list-group-divider scroller">
                <div className="drop-pad">
                  <table className="table table-card">
                    <tbody>
                      <tr className="card-tr">
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-padd m-r-5 ">
                            BALANCE :{" "}
                            {this.state.items.compoOff_balance
                            }
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white m-r-5 badge-card badge-white-appro-applied ">
                            APPLIED :{" "}
                            {this.state.items.compoOff_applied
                            }
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="card-td">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5 ">
                            PENDING :{" "}
                            {this.state.items.compoOff_pending}
                          </span>
                        </td>
                        <td className="card-td-right">
                          <span className="badge badge-white badge-card badge-white-appro m-r-5  ">
                            APPROVED :{" "}
                            {this.state.items.compoOff_approved}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div id="test">
            <div className="row">
              <div className="col-md-8">
                <div className="ibox">
                  <div className="ibox-head head-center">
                    <div className="ibox-title">Calendar</div>
                  </div>
                  <div className="ibox-body">
                    <Calendar></Calendar>
                  </div>
                </div>
              </div>
              <div className="col-md-4">{$test1}
                {this.state.userRole == "Admin" || this.state.userRole == "SuperAdmin" ? (
                  <div className="ibox">
                    <div className="ibox-head head-center">
                      <div className="ibox-title"> Attendance Statistics</div>
                    </div>
                    <div className="ibox-body">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <AttendanceChart></AttendanceChart>
                        </div>
                        <div className="col-md-6">
                          <div className="m-b-20 text-success">
                            <i className="fa fa-circle-o m-r-10"></i>Present :{" "}
                            {""}
                            {Math.round(
                              (this.state.present / this.state.userLength) * 100
                            )}
                            %
                          </div>
                          <div className="m-b-20 text-info">
                            <i className="fa fa-circle-o m-r-10"></i>Absent :{" "}
                            {Math.round(
                              (this.state.absent / this.state.userLength) * 100
                            )}
                            %
                          </div>
                        </div>
                      </div>

                      <ul className="list-group list-group-divider list-group-full">
                        <li className="list-group-item">
                          Present
                          <span className="float-right text-success">
                            {this.state.present}
                          </span>
                        </li>
                        <li className="list-group-item">
                          Absent
                          <span className="float-right text-danger">
                            {this.state.absent}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : ("")}
              </div>
            </div>
            {/* <div className="row">
              <div className="col-lg-8"></div>
              {this.state.userRole == "Admin" ||
            
                <div>
                  {this.state.userRole == "Manager" ? <div></div> : <div></div>}
                </div>
             
            </div> */}
          </div>
        </div>
      );
    }
  }
  handleAlertClass() {
    let classes = "alert alert-dismissable fade show alertpopup ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
}
