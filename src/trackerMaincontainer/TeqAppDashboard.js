import React, { Component } from "react";
import AuthService from "../AuthService";
import Teqcalendar from "../TeqCalendar/teqcalendar";
import Pagination from "react-js-pagination";
//import AttendanceChart from "../TeqProjectChart/doughnutChart";
import AttendanceChart from "./doughnutChart";
const Auth = new AuthService();
const roundTo = require("round-to");
export default class TeqAppDashboard extends Component {
  constructor() {
    super();
    this.state = {
      projects: [],
      Web: 0,
      Sales: 0,
      dataPerPage: [],
      currentPage: 1,
      todosPerPage: 3,
      todos: [],
      activePage: 1,
      WebPercent: 0,
      SalesPercent: 0,
      idealEmployee: 0,
      idealpercent: 0,
      engagedEmployee: 0,
      engagedPercent: 0,
      count: 1,
      monthType: "",
      getTotalWorkingHours: 0,
      progress: "",
      completed: "",
      hold: "",
      monthlyholiday:"",
      holidaytext:"no"
    };
  }
  // getProjectList() {
  //   Auth.getProjectList().then(response => {  
  //       
  //     if (response.status == 200) {      
  //       this.setState({
  //         projects: response.projects,

  //       });
  //     }
  //   });
  // }

  getEmployeeList() {
    Auth.getEmployeeList("").then(response => {
      let ideal = 0;
      let engaged = 0;
      if (response.status == 200) {
        for (var i = 0; i < response.users.length; i++) {
          if (response.users[i].status == "Ideal") {
            ideal++;
          } else if (response.users[i].status == "Busy") {
            engaged++;
          }
        }
        this.setState({
          idealEmployee: ideal,
          engagedEmployee: engaged,
          idealpercent: roundTo((ideal / response.users.length) * 100, 2),
          engagedPercent: roundTo((engaged / response.users.length) * 100, 2)
        });
      }
    });
  }
  getTotalWorkingHours() {
    Auth.getTotalWorkingHours("").then(response => {
      if (response.status == 200) {

        this.setState({
          getTotalWorkingHours:
            Math.round(response.totalWorkingHours * 10) / 10,
        });
      }
    });
  }

  handlemonth = () => {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth();
    this.setState({
      monthType: currentMonth,
    });
  };

  getEmpReport = () => {
    var month = this.state.monthType;
    Auth.getEmployeeReport(month).then((response) => {
      if (response.status == 200) {
        console.log("Project report fetched", response);
      } else {
        console.log("Error in fetching data of Project Report");
      }
    });
  };
  handleClick = number => {
    this.setState({
      activePage: number,
      currentPage: number
    });
    const { currentPage, todosPerPage } = this.state;
    var todos = this.state.projects;
    const indexOfLastTodo = number * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    this.setState({ count: indexOfFirstTodo + 1 });
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });
    this.setState({
      dataPerPage: arr
    });
  };
  componentDidMount() {

    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then(response => {
      this.setState({
        userRole: response.user.role,
        data: response.user
      });
      this.getholidaylist(response.user.location);
    });
    Auth.getProjectList().then(response => {
      if (response.status == 200 && response.projects.length!=0) {
        this.setState({
          projects: response.projects,
          pjname: response.projects,
          project_name: response.projects[0]._id,
          defaultValue: response.projects[0]._id
        });
        var todos = this.state.projects;
        const { currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
        var arr = [];
        const renderTodos = currentTodos.map((todo, index) => {
          arr.push(todo);
          return arr;
        });
        this.setState({
          dataPerPage: arr,
          loading: false
        });
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
          pageNumbers.push(i);
        }
        this.setState({
          numbers: pageNumbers
        });
      }
    });
    Auth.getProjectStatus().then((response) => {
      if (response.status == 200) {
        this.setState({
          progress: response.projectstatus.data[0].y,
          completed: response.projectstatus.data[1].y,
          hold: response.projectstatus.data[2].y,
        });
      }
      console.log("Project status response", response);
    });
    //this.getprojectList("");
    this.getEmployeeList("");
    this.handlemonth();
    this.getTotalWorkingHours();
  }
  getholidaylist=(location)=>{
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth()+1;
    Auth.getmonthlyholidaylist(location,currentMonth).then((response) => {
    if (response.status == 200) {
      debugger
      var len=response.holiday_count;
      this.setState({
        monthlyholiday:response.holiday_count,
      });    
    }
    });
  }
  // getprojectList = (response) => {
  //   if (response.user._id != '') {

  //   };
  //}

  render() {
    return (
      <div className="page-content fade-in-up">
        {this.state.userRole == "Admin" || this.state.userRole == "HR" || this.state.userRole == "SuperAdmin" ? (
          <div>
            {/* <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="ibox bg-success color-white widget-stat">
                  <div className="ibox-body">
                    <h2 className="m-b-5 font-strong card-dash-font">
                      Ideal Employee
                                  </h2>
                    <i className="ti-user teqtrack widget-stat-icon"></i>
                    <div>
                      {this.state.idealEmployee} |{" "}
                      <i className="fa fa-level-up m-r-5"></i>
                      <small>{this.state.idealpercent}% </small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="ibox bg-info color-white widget-stat">
                  <div className="ibox-body">
                    <h2 className="m-b-5 font-strong card-dash-font">
                      Engage Employee
                                  </h2>
                    <i className="fa fa-user-times teqtrack widget-stat-icon"></i>
                    <div>
                      {this.state.engagedEmployee} |{" "}
                      <i className="fa fa-level-up m-r-5"></i>
                      <small>{this.state.engagedPercent}% </small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="ibox bg-warning color-white widget-stat">
                  <div className="ibox-body">
                    <h2 className="m-b-5 font-strong card-dash-font">
                      Salesforce Project
                                  </h2>
                    <i className="fa fa-cloud widget-stat-icon teqtrack"></i>
                    <div>
                      {this.state.Sales} | <i className="fa fa-level-up m-r-5"></i>
                      <small>{this.state.SalesPercent}% </small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="ibox bg-danger color-white widget-stat">
                  <div className="ibox-body">
                    <h2 className="m-b-5 font-strong card-dash-font">
                      Web-Dev Project
                                  </h2>
                    <i className="teqtrack widget-stat-icon fa fa-globe"></i>
                    <div>
                      {this.state.Web} | <i className="fa fa-level-down m-r-5"></i>
                      <small>{this.state.WebPercent}%</small>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="row">
              <div className="col-lg-12">
                <div className="ibox">
                  <div className="ibox-head bg-tbl-header  color-white">
                    <div className="ibox-title">Latest Project</div>
                  </div>
                  <div className="ibox-body">
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th className="tb-white-sp">Project Name</th>
                            <th className="tb-white-sp">Client Name</th>
                            <th className="tb-white-sp">Manager</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            {/* <th width="91px" className="tb-white-sp">
                              Submission Date
                                          </th> */}
                            <th width="91px" className="tb-white-sp">
                              Category
                                          </th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.dataPerPage.map((item, index) => (
                            <tr key={item._id}>
                              <td>{index + this.state.count}</td>
                              <td>{item.project_name} </td>
                              <td>{item.client_name} </td>
                              <td>{item.reporting_manger_name} </td>
                              <td>{item.start_date} </td>
                               <td>{item.end_date} </td> 
                              <td>{item.category}</td>
                              <td>
                                <div>
                                  {item.status == "Hold" ? (
                                    <div>
                                      <span className="badge badge-danger">
                                        Hold
                                                    </span>
                                    </div>
                                  ) : (
                                      <div>
                                        {item.status == "Completed" ? (
                                          <div>
                                            <span className="badge badge-success">
                                              Completed
                                                        </span>
                                          </div>
                                        ) : (
                                            <div>
                                              <span className="badge badge-warning">
                                                Progress
                                                        </span>
                                            </div>
                                          )}
                                      </div>
                                    )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-page">
                      <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={3}
                        totalItemsCount={100}
                        pageRangeDisplayed={3}
                        onChange={this.handleClick}
                        itemClass="page-item no-padding"
                        linkClass="page-link"
                        prevPageText="Previous"
                        nextPageText="Next"
                        totalItemsCount={this.state.projects.length}
                      />
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="ibox">
                  <div className="ibox-head head-center">
                    <div className="ibox-title">Calendar</div>
                  </div>
                  <div className="ibox-body">
                    <Teqcalendar></Teqcalendar>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                {this.state.userRole == "Admin" ||
                this.state.userRole == "SuperAdmin" ||
                this.state.userRole == "HR" ||
                this.state.userRole == "Manager" ? (
                  <div className="ibox">
                    <div className="ibox-head head-center">
                      <div className="ibox-title"> Project Statistics</div>
                    </div>
                    <div className="ibox-body">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <AttendanceChart></AttendanceChart>
                        </div>
                        <div className="col-md-4">
                          <div className="m-b-20 completedproject">
                            <i className="fa fa-circle-o m-r-10"></i>
                            Project Completed : {this.state.completed}
                          </div>
                          <div className="m-b-20 progressproject">
                            <i className="fa fa-circle-o m-r-10"></i>
                            Project in Progress : {this.state.progress}
                          </div>
                          <div className="m-b-20 holdproject">
                            <i className="fa fa-circle-o m-r-10"></i>
                            Project on Hold : {this.state.hold}
                          </div>
                        </div>
                      </div>

                      <ul className="list-group list-group-divider list-group-full">
                        <li className="list-group-item">
                          Project Completed
                          <span className="float-right completedproject">
                            {" "}
                            {this.state.completed}
                          </span>
                        </li>
                        <li className="list-group-item">
                          Project in Progress
                          <span className="float-right progressproject">
                            {" "}
                            {this.state.progress}
                          </span>
                        </li>
                        <li className="list-group-item">
                          Project on Hold
                          <span className="float-right holdproject">
                            {" "}
                            {this.state.hold}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

        ) : (
            ""
          )}
        {this.state.userRole == "Manager" || this.state.userRole == "TeamLead" ? (
          <div>
           

            <div className="ibox">
              <div className="ibox-body">
                <div className="row">
                  <div className="col-lg-4 col-md-4 text-center">
                    <div className="customtooltip customtooltip-timer">
                      <div className="fa-icon ">
                        <img src="../assets/img/timer.png" width="50px" />
                      </div>
                      <div className="fa-icon-text">
                        <div className="font-strong timer-day">{this.state.getTotalWorkingHours}<sub>h</sub></div>
                        <p className="small-txt"><small>tracked <br />this month</small></p>
                      </div>
                      <span className="tooltiptext tooltipcustomtext"> Your tracked hours for this month.</span>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 text-center">
                    <div className="customtooltip">
                      <div className="fa-icon">
                        <img src="../assets/img/vacation.png" width="50px" />
                      </div>
                      <div className="fa-icon-text">
                        <div className="font-strong timer-day">0</div>
                        <p className="small-txt"><small>vacation days<br />taken this month</small></p>
                      </div>
                      <span className="tooltiptext tooltipcustomtext">You have taken 0 day(s) of vacation this year.
                              <br />You have no planned vacation day(s).</span>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 text-center">
                    <div className="customtooltip">
                      <div className="fa-icon">
                        <img src="../assets/img/holiday.png" width="50px" />
                      </div>
                      <div className="fa-icon-text">
                        <div className="font-strong timer-day">{this.state.monthlyholiday}</div>
                        <p className="small-txt"><small>holiday <br />this month</small></p>
                      </div>
                      <span className="tooltiptext tooltipcustomtext">You have {this.state.monthlyholiday} holidays this month.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ibox">
              {/* <div className="ibox-head ibox-bg-img">
                <div className="ibox-title"><i className="fa fa-bell-o rel"></i> Notifications</div>
                <ul className="nav nav-tabs tabs-line pull-right">
                  <li className="nav-item">
                    <a className="nav-link" href="#tab-8-1" data-toggle="tab">Info</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#tab-8-2" data-toggle="tab">Requests</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link active" href="#tab-8-3" data-toggle="tab"> All</a>
                  </li>
                </ul>
              </div>
           <div className="ibox-body">
                <div className="tab-content">
                  <div className="tab-pane fade show active" id="tab-8-1">Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica.</div>
                  <div className="tab-pane" id="tab-8-2">Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica.</div>
                  <div className="tab-pane fade"
                    id="tab-8-3">Third tab</div>
                </div><br />
        </div> */}
            <div className="row">
              <div className="col-md-8">
                <div className="ibox">
                  <div className="ibox-head head-center">
                    <div className="ibox-title">Calendar</div>
                  </div>
                  <div className="ibox-body">
                    <Teqcalendar></Teqcalendar>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
               
                  <div className="ibox">
                    <div className="ibox-head head-center">
                      <div className="ibox-title"> Project Statistics</div>
                    </div>
                    <div className="ibox-body">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <AttendanceChart></AttendanceChart>
                        </div>
                        <div className="col-md-4">
                          <div className="m-b-20 completedproject">
                            <i className="fa fa-circle-o m-r-10"></i>
                            Project Completed : {this.state.completed}
                          </div>
                          <div className="m-b-20 progressproject">
                            <i className="fa fa-circle-o m-r-10"></i>
                            Project in Progress : {this.state.progress}
                          </div>
                          <div className="m-b-20 holdproject">
                            <i className="fa fa-circle-o m-r-10"></i>
                            Project on Hold : {this.state.hold}
                          </div>
                        </div>
                      </div>

                      <ul className="list-group list-group-divider list-group-full">
                        <li className="list-group-item">
                          Project Completed
                          <span className="float-right completedproject">
                            {" "}
                            {this.state.completed}
                          </span>
                        </li>
                        <li className="list-group-item">
                          Project in Progress
                          <span className="float-right progressproject">
                            {" "}
                            {this.state.progress}
                          </span>
                        </li>
                        <li className="list-group-item">
                          Project on Hold
                          <span className="float-right holdproject">
                            {" "}
                            {this.state.hold}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                
              </div>
            </div>
            </div>

          </div>) : (
            ""
          )}
        {this.state.userRole == "Employee" ? (
          <div>
            {/* <div className="ibox">
              <div className="ibox-head ibox-pd">
                <div className="admin-block d-flex">
                  <div>
                    <img src="../assets/img/admin-avatar.png" width="45px" />
                  </div>
                  <div className="admin-info-view">
                    <div className="font-strong profile-name">{this.state.data.name}</div><small>{this.state.userRole}</small></div>
                </div>
                <div className="ibox-tools">
                  <div className="admin-block d-flex">
                    <div>
                      <img src="../assets/img/admin-avatar.png" width="25px" />
                    </div>
                    <div className="admin-info-view">
                      <div className="font-strong profile-name">Project Name</div></div>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="ibox">
              <div className="ibox-body">
                <div className="row">
                  <div className="col-lg-4 col-md-4 text-center">
                    <div className="customtooltip customtooltip-timer">
                      <div className="fa-icon ">
                        <img src="../assets/img/timer.png" width="50px" />
                      </div>
                      <div className="fa-icon-text">
                        <div className="font-strong timer-day">{this.state.getTotalWorkingHours}<sub>h</sub></div>
                        <p className="small-txt"><small>tracked <br />this month</small></p>
                      </div>
                      <span className="tooltiptext tooltipcustomtext"> Your tracked hours for this month.</span>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 text-center">
                    <div className="customtooltip">
                      <div className="fa-icon">
                        <img src="../assets/img/vacation.png" width="50px" />
                      </div>
                      <div className="fa-icon-text">
                        <div className="font-strong timer-day">0</div>
                        <p className="small-txt"><small>vacation days<br />taken this month</small></p>
                      </div>
                      <span className="tooltiptext tooltipcustomtext">You have taken 0 day(s) of vacation this year.
                              <br />You have no planned vacation day(s).</span>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 text-center">
                    <div className="customtooltip">
                      <div className="fa-icon">
                        <img src="../assets/img/holiday.png" width="50px" />
                      </div>
                      <div className="fa-icon-text">
                        <div className="font-strong timer-day">{this.state.monthlyholiday}</div>
                        <p className="small-txt"><small>holiday <br />this month</small></p>
                      </div>
                      <span className="tooltiptext tooltipcustomtext">You have {this.state.monthlyholiday} holidays this month.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/*  <div className="ibox">
              <div className="ibox-head ibox-bg-img">
                <div className="ibox-title"><i className="fa fa-bell-o rel"></i> Notifications</div>
                <ul className="nav nav-tabs tabs-line pull-right">
                  <li className="nav-item">
                    <a className="nav-link" href="#tab-8-1" data-toggle="tab">Info</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#tab-8-2" data-toggle="tab">Requests</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link active" href="#tab-8-3" data-toggle="tab"> All</a>
                  </li>
                </ul>
              </div>
             <div className="ibox-body">
                <div className="tab-content">
                  <div className="tab-pane fade show active" id="tab-8-1">Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica.</div>
                  <div className="tab-pane" id="tab-8-2">Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica.</div>
                  <div className="tab-pane fade"
                    id="tab-8-3">Third tab</div>
          </div><br /></div> 
            </div>*/}
           <div className="row">
              <div className="col-md-8">
                <div className="ibox">
                  <div className="ibox-head head-center">
                    <div className="ibox-title">Calendar</div>
                  </div>
                  <div className="ibox-body">
                    <Teqcalendar></Teqcalendar>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
               
                  <div className="ibox">
                    <div className="ibox-head head-center">
                      <div className="ibox-title"> Project Statistics</div>
                    </div>
                    <div className="ibox-body">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <AttendanceChart></AttendanceChart>
                        </div>
                        <div className="col-md-4">
                          <div className="m-b-20 completedproject">
                            <i className="fa fa-circle-o m-r-10"></i>
                            Project Completed : {this.state.completed}
                          </div>
                          <div className="m-b-20 progressproject">
                            <i className="fa fa-circle-o m-r-10"></i>
                            Project in Progress : {this.state.progress}
                          </div>
                          <div className="m-b-20 holdproject">
                            <i className="fa fa-circle-o m-r-10"></i>
                            Project on Hold : {this.state.hold}
                          </div>
                        </div>
                      </div>

                      <ul className="list-group list-group-divider list-group-full">
                        <li className="list-group-item">
                          Project Completed
                          <span className="float-right completedproject">
                            {" "}
                            {this.state.completed}
                          </span>
                        </li>
                        <li className="list-group-item">
                          Project in Progress
                          <span className="float-right progressproject">
                            {" "}
                            {this.state.progress}
                          </span>
                        </li>
                        <li className="list-group-item">
                          Project on Hold
                          <span className="float-right holdproject">
                            {" "}
                            {this.state.hold}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                
              </div>
            </div>
          </div>
        ) : (
            ""
          )}
      </div>
    );
  }
}

//export default TeqAppDashboard;
