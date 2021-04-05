import React, { Component } from "react";
import Pagination from "react-js-pagination";
import AuthService from "../AuthService";
import Loader from 'react-loader-spinner';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import MultipleDatePicker from 'react-multiple-datepicker';
import DatePicker from "react-datepicker";
import handleValidation from "../validation";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
  withRouter,
} from "react-router-dom";
const Auth = new AuthService();
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var dateHash = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12
};
class Report extends Component {
  constructor() {
    super();
    this.state = {
      monthType: "",
      loading: true,
      noDataFound: false,
      EmpReport: [],
      count: 1,
      activePage: 1,
      currentPage: 1,
      todosPerPage: 8,
      todos: [],
      dataPerPage: [],
      dataUser: [],
      numbers: [],
      todos1: [],
      statusUser: [],
      detailsShown: [],
      projectType:"",
      projects:[],
      weeklydailystatus:"monthly",
      currentproject:"",
      exportdata:"",
      start_date:"",
      end_date:"",
      currentmonth:"",
      clicks: 0,
      alertMessage:"",
      danger:false
    };
    this.handlemonth = this.handlemonth.bind(this);
    this.handleSelectChangeProjectType=this.handleSelectChangeProjectType.bind(this);
    this.handleProjectNameChange=this.handleProjectNameChange.bind(this);
  }
  handleClick = (number) => {
    if( document.getElementById("reportaccordian")!=null) 
    document.getElementById("reportaccordian").style.display = "none";
    this.setState({
      activePage: number,
      currentPage: number,
    });
    const {currentPage, todosPerPage}= this.state
    var todos = this.state.todos1;
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
      dataPerPage: arr,
    });
  };

  getEmpReport = (start_date,end_date,projectType,monthtype,currentproject) => { 

    Auth.getEmployeeReport(start_date,end_date,projectType,monthtype,currentproject).then((response) => {
      debugger
      if (response.status == 200) {
        this.setState({
          userList: response.monthlyRepo,
          todos: response.monthlyRepo,
          dataUser: response.monthlyRepo,
          loading: false
        });
        //console.log("the data user is ", this.state.dataUser);
        
        var arrobj = this.state.todos.filter(
          (v, i, a) =>
            a.findIndex((t) => t.name === v.name && t.date === v.date) === i
        );
        
      var arrobj1 = Array.from(new Set(this.state.dataUser.map(a => a.statusid)))
 .map(statusid => {
   return this.state.dataUser.find(a => a.statusid === statusid)
 })
        this.setState({
          todos1: arrobj,
          dataUser:arrobj1
        });
        console.log("sorted acrdng to date", arrobj);
        var todos=this.state.todos1
        const {currentPage, todosPerPage } = this.state;
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
        });

        console.log("Data per page", this.state.dataPerPage);
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
          pageNumbers.push(i);
        }
        this.setState({
          numbers: pageNumbers,
        });
        // console.log(this.state.EmpReport);
        //console.log("Project report fetched", response);
      } else {
        //console.log("Error in fetching data of Project Report");
      }
    });
  };
  hanndleAccodianClick=()=>{
    if( document.getElementById("reportaccordian")!=null) 
    document.getElementById("reportaccordian").style.display = "none";
  }
  handlemonth = () => {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth();
    var monthType = monthNames[currentMonth]
    this.setState({
      month: currentMonth+1,
      monthType: monthType,
    });
   // alert(monthType)
    var start_date=this.state.start_date;
    var end_date=this.state.end_date;
    var projectType=this.state.projectType;
    var monthtype=currentMonth+1;
    var currentproject=this.state.currentproject;
    this.getEmpReport(start_date,end_date,projectType,monthtype,currentproject);
  //  this.getEmpReport(currentMonth+1);
  };
  handleMonthChange = (event) => {
    var selectedMonth = event.currentTarget.value;
    var month = dateHash[selectedMonth];
    this.setState({
     month:month,
     
  });
  var start_date=this.state.start_date;
  var end_date=this.state.end_date;
    var projectType=this.state.projectType;
    var monthtype=month;
    var currentproject=this.state.currentproject;
    this.getEmpReport(start_date,end_date,projectType,monthtype,currentproject);
  }
  handledailyweekly = (event) => {
    document.getElementById("myBtn").disabled = false;
    document.getElementById("myBtnnext").disabled = false;
    this.setState({
     weeklydailystatus:event.currentTarget.value
    });
    if(event.currentTarget.value=="weekly"){
      var start_date=new Date();
      var dt = new Date(); // current date of week
var currentWeekDay = dt.getDay();
var lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
var start_date = new Date(new Date(dt).setDate(dt.getDate() - lessDays));
var end_date = new Date(new Date(start_date).setDate(start_date.getDate() + 6));
console.log(end_date)
this.setState({
  loading: true,
  month:"",
  start_date:start_date,
  end_date: end_date,
  monthType:""
});
var projectType=this.state.projectType;
//var monthtype=this.state.month;
var currentproject=this.state.currentproject;
var monthtype=""
this.getEmpReport(start_date,end_date,projectType,monthtype,currentproject);
//var date3=new Date(new Date(wkStart).setDate(wkStart.getDate() + 7));
    //  this.getEmpReport(start_date,end_date,projectType,monthtype,currentproject);
    }
    else
    if(event.currentTarget.value=="daily"){
      var start_date=new Date();
      var end_date=start_date;
      this.setState({
        loading: true,
        month:"",
        start_date:start_date,
        end_date: start_date,
        monthType:""
      });
      var projectType=this.state.projectType;
      var monthtype="";
      var currentproject=this.state.currentproject;
      this.getEmpReport(start_date,end_date,projectType,monthtype,currentproject); 

    }

    else
    if(event.currentTarget.value=="monthly"){ 
      var currentDate = new Date();
      var currentMonth = currentDate.getMonth();
      var monthType = monthNames[currentMonth]
    var start_date="";
    var end_date="";
    this.setState({
      loading: true,
      month: currentMonth+1,
      start_date:start_date,
      end_date:end_date,
      monthType:monthType
    });
    var projectType=this.state.projectType;
  
    var currentproject=this.state.currentproject;
    this.getEmpReport(start_date,end_date,projectType,currentMonth+1,currentproject);
   
    }
  }
  handleProjectNameChange = (event) => {
    this.setState({
   //   loading: true,
      currentproject:event.currentTarget.value
    });
    var start_date=this.state.start_date;
    var end_date=this.state.end_date;
    var projectType=this.state.projectType;
    var monthtype=this.state.month;
    var currentproject=event.currentTarget.value;
    this.getEmpReport(start_date,end_date,projectType,monthtype,currentproject);

  }
  handleChange = date => {
    this.setState({
      start_date: date,
      weeklydailystatus:""
    });
   if(this.state.end_date!="" && this.state.end_date!=undefined){
    let formData = {
      start_date:date,
      end_date:this.state.end_date,
    //  email:this.refs.clientemail.value
    };
    let errors = handleValidation(formData);
    this.setState({ errors: errors ,
    month:""});
    if (errors["valid"] == true) {
      var start_date=date;
      var end_date=this.state.end_date;
      var projectType=this.state.projectType;
      var monthtype="";
      var currentproject=this.state.currentproject;
      this.getEmpReport(start_date,end_date,projectType,monthtype,currentproject);
    }
    else {
      this.setState({ errorsdiv: true,  danger: true });
      setTimeout(() => {
        this.setState({ errorsdiv: false });
      }, 4000);
     }
  }
  };
  handleChangeEnd = date => {
    document.getElementById("myBtn").disabled = true;
    document.getElementById("myBtnnext").disabled = true;
    
    this.setState({
  
      end_date: date
    });
    let formData = {
      start_date:this.state.start_date,
      end_date:date,
    //  email:this.refs.clientemail.value
    };
    let errors = handleValidation(formData);
    this.setState({ errors: errors,
      month:"" });
    if (errors["valid"] == true) {
      var start_date=this.state.start_date;
      var end_date=date;
      var projectType=this.state.projectType;
      var monthtype="";
      var currentproject=this.state.currentproject;
      this.getEmpReport(start_date,end_date,projectType,monthtype,currentproject);
    }
    else {
      this.setState({ errorsdiv: true,  danger: true });
      setTimeout(() => {
        this.setState({ errorsdiv: false });
      }, 4000);
     }  
     
    };
  handleprevious=()=>{
    document.getElementById("myBtnnext").disabled = false;
    if(this.state.weeklydailystatus=="monthly")
    {
     
    var monthtype=this.state.month+this.state.clicks-1;
    var monthTypeName = monthNames[monthtype-1];
    this.setState({ clicks: this.state.clicks - 1,loading: true,monthType:monthTypeName });   
    if(monthtype==0)
    {
      document.getElementById("myBtn").disabled = true;
    }
    else{
    
    var projectType=this.state.projectType;
    var currentproject=this.state.currentproject;
    this.getEmpReport(this.state.start_date,this.state.end_date,projectType,monthtype,currentproject);
    }
  }
  else
  if(this.state.weeklydailystatus=="weekly"){
     var start_date=new Date(new Date(this.state.start_date).setDate(this.state.start_date.getDate() - 7));
     var end_date=new Date(new Date(start_date).setDate(start_date.getDate() + 6));
     this.setState({ 
      start_date: start_date,
      end_date:end_date,
      loading: true,
     });
     this.getEmpReport(start_date,end_date,this.state.projectType,this.state.month,this.state.currentproject);
  }
  if(this.state.weeklydailystatus=="daily"){
     var start_date=new Date(new Date(this.state.start_date).setDate(this.state.start_date.getDate() - 1));
     var end_date=start_date;
     this.setState({ 
      start_date: start_date,
      end_date:end_date,
      loading: true,
     });
     this.getEmpReport(start_date,end_date,this.state.projectType,this.state.month,this.state.currentproject);
  }  }
  handlenext=()=>{

    document.getElementById("myBtn").disabled = false;
    if(this.state.weeklydailystatus=="monthly")
    {
    
    var monthtype=this.state.month+this.state.clicks+1;
    var monthTypeName = monthNames[monthtype-1];
    this.setState({ clicks: this.state.clicks + 1,
      loading: true,monthType:monthTypeName });
    if(monthtype==13)
    {
      document.getElementById("myBtnnext").disabled = true;
    }
   else{
     var projectType=this.state.projectType;
     //  var monthtype=currentMonth+1;
       var currentproject=this.state.currentproject;
       this.getEmpReport(this.state.start_date,this.state.end_date,projectType,monthtype,currentproject);
   }}
   else
  if(this.state.weeklydailystatus=="weekly"){
     var start_date=new Date(new Date(this.state.start_date).setDate(this.state.start_date.getDate() + 7));
     var end_date=new Date(new Date(start_date).setDate(start_date.getDate() + 6));
     this.setState({ 
      start_date: start_date,
      end_date:end_date,
      loading: true
     });
     this.getEmpReport(start_date,end_date,this.state.projectType,this.state.month,this.state.currentproject);
  } 
  else
  if(this.state.weeklydailystatus=="daily"){
     var start_date=new Date(new Date(this.state.start_date).setDate(this.state.start_date.getDate() + 1));
     var end_date=start_date;
     this.setState({ 
      start_date: start_date,
      end_date:end_date,
      loading: true
     });
     this.getEmpReport(start_date,end_date,this.state.projectType,this.state.month,this.state.currentproject);
  } 
  } 
  
  handleUserStatus = (id, date, name, indexx,project_type,currentproject) => {
    Auth.getUserStatusLog(id, date,project_type,currentproject).then((response) => {
      if (response.status == 200) {
        this.setState({
          statusUser: response.statusUser,
        });
        const shownState = this.state.statusUser.slice();
        const index = shownState.indexOf(indexx);
        if (index >= 0) {
          shownState.splice(index, 1);
          this.setState({
            detailsShown: shownState,
          });
        } else {
          shownState.push(indexx);
          this.setState({
            detailsShown: shownState,
          });
        }
        console.log(this.state.statusUser);
      } else {
        console.log("no response found");
      }
    });
      if( document.getElementById("reportaccordian")!=null) 
      { 
        document.getElementById("reportaccordian").removeAttribute("style");}
  
  };
  handleSelectChangeProjectType = event => { 
    if( document.getElementById("reportaccordian")!=null) 
    document.getElementById("reportaccordian").style.display = "none";
    var projectType=event.currentTarget.value;    
     this.setState({
      projectType:projectType,
         userList:[],
         todos:[],
         dataUser:[],

     });
   // var month = this.state.month;
    var start_date=this.start_date;
    var end_date=this.end_date;
   // var projectType=this.state.projectType;
    var monthtype=this.state.month;
    var currentproject=this.state.currentproject;
    Auth.getEmployeeReport(start_date,end_date,projectType,monthtype,currentproject).then((response) => {
      if (response.status == 200) {
        this.setState({
          userList: response.monthlyRepo,
          todos: response.monthlyRepo,
          dataUser: response.monthlyRepo,
          loading: false,
          count:1
        });
        var arrobj = this.state.todos.filter(
          (v, i, a) =>
            a.findIndex((t) => t.name === v.name && t.date === v.date) === i
        );
        this.setState({
          todos1: arrobj,
        });
        console.log("sorted acrdng to date", arrobj);
        let indexOfFirstTodo = 0;
        var todos=this.state.todos1
        const {currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        if (projectType != "") {

          indexOfFirstTodo = 0;

        } else {
          indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
        }
     //   const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
        var arr = [];
        const renderTodos = currentTodos.map((todo, index) => {
          arr.push(todo);
          return arr;
        });

        this.setState({
          dataPerPage: arr,
        });

        console.log("Data per page", this.state.dataPerPage);
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
          pageNumbers.push(i);
        }
        this.setState({
          numbers: pageNumbers,
        });
        // console.log(this.state.EmpReport);
        //console.log("Project report fetched", response);
      } else {
        //console.log("Error in fetching data of Project Report");
      }
    });
    }
  componentDidMount() {
    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then((response) => {
      this.setState({
        userRole: response.user.role,
        data: response.user,
      });
      this.handlemonth();
    });
    Auth.getProjectDetailsRoleWise().then((response)=>{
      if (response.status == 200) {
        this.setState({
          projects: response.assignedProject});
  }
    })
  }
  handleAlertClass() {
    let classes = "alertHeight ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
  render() {
   
    if (this.state.loading) {
      return (
          <div className="loader-align">
              <Loader
                  type="ThreeDots"
                  color="#00BFFF"
                  height={100}
                  width={100}
                  timeout={5000} //3 secs
              />
          </div>
      );
  } else {
    return (
      <div className="page-content fade-in-up">
           {this.state.errorsdiv == true  ? (
          <div className={this.handleAlertClass()}>
            <button
              className="close"
              onClick={this.handleAlert}
              aria-label="Close"
            >
              ×
            </button>
            <strong>   {this.state.errors["start_date"]}</strong>
          </div>
        ) : (
            ""
          )}
        <div className="ibox">
        <div className="ibox-head box-emp-mang">
                                <div className="ibox-title">Report </div>
                                <div className="ibox-tools-filter">
                                <div className="form">
                                  <div className="form-group leave-type-select withgap">
                                 <label>                       
                                </label>
                        <div className="input-group date">
                          <span className="input-group-addon bg-white">
                            <i className="fa fa-calendar"></i>
                          </span>
                          <DatePicker
                           placeholderText="From Date"
                            dateFormat="MM/dd/yyyy"
                            ref="start_date"
                            className="form-control date-picker-date"
                            selected={this.state.start_date}
                            onChange={this.handleChange}
                          />
                        </div></div>
                      </div>
                      <div className="form">
                                  <div className="form-group leave-type-select withgap">
                                 <label>                       
                                </label>
                        <div className="input-group date">
                          <span className="input-group-addon bg-white">
                            <i className="fa fa-calendar"></i>
                          </span>
                          <DatePicker
                           placeholderText="To  Date"
                            dateFormat="MM/dd/yyyy"
                            ref="end_date"
                            className="form-control date-picker-date"
                            selected={this.state.end_date}
                            onChange={this.handleChangeEnd}
                          />
                          
                        </div> </div>
                      </div>
                                <div className="form"> <div className="form-group leave-type-select withgap">
                                <label></label>
                                                    <select id="projectType" ref="projectType"
                                                        className="form-control "
                                                        value={this.state.weeklydailystatus}                                                     
                                                        onChange={this.handledailyweekly.bind(this)}
                                                    >                                                        
                                                       <option value="monthly" selected>Monthly</option>
                                                       <option value="weekly">Weekly</option>
                                                       <option value="daily">Daily</option>
                                                       <option value="" > None </option>                                                     
                                                    </select>
                                                 
                                                </div>   </div>
                                    {/* <span>{this.state.month}</span> */} 
                                    <div className="form">
                                    <div className="form-group leave-type-select withgap">
                      <label>
                       
                      </label>
                      <select
                        type="text"
                        id="projects"
                        ref="projects"
                        className="form-control "
                      
                    //    value={this.state.client_project}
                        onChange={this.handleProjectNameChange.bind(this)}
                      >
                         <option value="" selected>
                          Choose one Project
                        </option>
                         {this.state.projects != undefined
                          ? this.state.projects.map(item => (
                            <option key={item._id} value={item._id}>
                              {item.project_name}
                            </option>
                          ))
                          : ""}
                      </select>
                      </div>
                    </div>                                      
                                        
                                <div className="form"> 
                                <label></label>                                         
                                                <div className="form-group leave-type-select">
                                                    <select id="projectType" ref="projectType"
                                                        className="form-control "
                                                      //  value={this.state.projectName}
                                                        onChange={this.handleSelectChangeProjectType.bind(this)}
                                                    >
                                                       <option value="">All</option>
                                                       <option value="billable">Billable</option>
                                                       <option value="non billable">Non Billable</option>
                                                    </select>
                                                  
                                                </div>                                                                                       
                                            </div>                                     
                                       
                                    <div></div>
                                </div>
                            </div>

          <div className="ibox-body"><div>
          <button  class="btn btn-primary" type="button" id="myBtn" onClick={this.handleprevious}>&#8249;</button>
          {this.state.monthType !=""? (
          <marquee width="50%">{this.state.monthType} Report</marquee>):("")}
          <button  class="btn btn-primary shift-right" id="myBtnnext" type="button" onClick={this.handlenext}>&#8250;</button>
          </div> <div className="table-responsive">
         
              <table className="table table-bordered table-hover" >
            
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th className="tbl-date">Working hours</th>
                    <th className="tbl-date">Total Hours</th>
                    <th className="tbl-date">Date</th>
                  </tr>
                </thead>
                {this.state.noDataFound === true ? (
                  <tbody></tbody>
                ) : (
                  <tbody>
                    {this.state.dataPerPage.map((item, indexx) => (
                      <React.Fragment>
                        <tr key={indexx + this.state.count}>
                          <td>
                            <button class="btn btn-default btn-xs">
                              <span class="glyphicon glyphicon-eye-open">
                                {indexx + this.state.count}
                              </span>
                            </button>
                          </td>

                          <td
                            data-toggle="collapse"
                            data-target="#demo1"
                            class="accordion-toggle "
                            onClick={this.handleUserStatus.bind(
                              this,
                              item.id,
                              item.date,
                              item.name,
                              indexx,
                              item.project_type,
                             this.state.currentproject
                            )}
                          >
                            <Link> {item.name}</Link>
                          </td>
                          <td className="tbl-date">{item.designation} </td>
                          <td className="tbl-date">{item.hours} h</td>
                          <td className="tbl-date">{item.totalWorkingHours}</td>
                          <td className="tbl-date">{item.date}</td>
                        </tr>

                        {this.state.detailsShown.includes(indexx) && (
                          <tr>
                            <td
                              colspan="12"
                               id="reportaccordian"
                              // className="hiddenRow accordian-body collapse"
                            >
                              <table className="table table-striped">
                                <thead>
                                  <tr className="info">
                                      <th>#</th>
                                    <th>Name</th>
                                    <th>Project Type</th>
                                    <th>Task Description</th>
                                    <th>Working hours
                                    <button class="btn badge-primary editbtn  m-r-5 accordian-contract" onClick={this.hanndleAccodianClick}>-</button>
                                    </th>
                                  </tr>
                                </thead>

                                {this.state.statusUser.map((item, index) => (
                                  <tr key={index}>
                                      <td>{index + this.state.count}</td>
                                    <td>{item.projectname}</td>
                                    <td>{item.project_type}</td>
                                    <td>{item.description}</td>
                                    <td>{item.hours} h</td>
                                  </tr>
                                ))}
                              </table>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
            {this.state.noDataFound === true ? (
              ""
            ) : (
              <div className="mt-page">
                <Pagination
                  activePage={this.state.activePage}
                  itemsCountPerPage={8}
                  totalItemsCount={100}
                  pageRangeDisplayed={3}
                  onChange={this.handleClick}
                  itemClass="page-item no-padding"
                  linkClass="page-link"
                  prevPageText="Previous"
                  nextPageText="Next"
                  totalItemsCount={this.state.todos1.length}
                />
              </div>
            )}
          </div>
        
        </div>
        <div className="ibox-body hide">
                <table className="table table-bordered table-hover table-responsive" id="table-to-xls">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Designation</th>
                      <th className="tb-white-sp">Working hours</th>
                      <th className="tb-white-sp">Project Name</th>
                      <th>Task Description</th>
                      <th>Project Type</th>
                      <th  className="tb-white-sp">
                       Date
                        </th>

                   
                    
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataUser.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + this.state.count}</td>                      
                        <td>{item.name}</td>
                        <td>{item.designation}</td>
                        <td>{item.currenthours}</td>
                        <td>{item.projectName}</td>
                        <td>{item.description}  </td>
                        <td>{item.project_type_excel}</td>
                        <td>{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
        {this.state.noDataFound === true ? (
                        ""
                    ) : (
                            <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="btn btn-primary btn-rounded"
                                table="table-to-xls"
                                filename={"Loghours_Report_" + this.state.monthType}
                                sheet="tablexls"
                                buttonText="Export Excel" />)}
      </div>
    );}
  }
  handleAlertClass() {
   // alert(this.state.danger)
    let classes = "alert alert-dismissable fade show alertpopup ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
}

export default Report;
