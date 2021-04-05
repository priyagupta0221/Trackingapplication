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
      danger:false,
      userList:[],
      selectfilter:false,
      name:"",
      under_traning:"",
      skills:"",
      specialization:"",
      project_name:"",
      nature_of_project:"",
      availability:"",
      hours_engaged:"",
      designation:""
    };

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
  handlefilter=(event)=>{
    if(event.currentTarget.value!=""){
      if(event.currentTarget.value=="projects"){
    this.setState({
      selectfilter:true,
      projectfilter:true,
      typeoffilter:event.currentTarget.value
     });
    }
     else{
      this.setState({
        selectfilter:true,
        projectfilter:false,
        typeoffilter:event.currentTarget.value
       }); 

     }
    
    }
    else{
      this.setState({
        selectfilter:false
       });}
       this.getResourceReport(this.state.name,this.state.under_traning,this.state.skills,this.state.specialization,
        this.state.project_name,this.state.nature_of_project,this.state.availability,
        this.state.hours_engaged,this.state.designation);
  }
  getResourceReport = (name,under_traning,skills,specialization,project_name,nature_of_project,
    availability,hours_engaged,designation) => {   
    Auth.getResourceReport(name,under_traning,skills,specialization,project_name,nature_of_project,
      availability,hours_engaged,designation).then((response) => {
      if (response.status == 200) {
        this.setState({
          userList: response.users,
          todos: response.users,
          dataUser: response.users,
          loading: false
        });
        //console.log("the data user is ", this.state.dataUser);
        
        var arrobj = this.state.todos.filter(
          (v, i, a) =>
            a.findIndex((t) => t.name === v.name && t.date === v.date) === i
        );
        this.setState({
          todos1: arrobj,
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
 

  
  
  
  
  componentDidMount() {
    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then((response) => {
      this.setState({
        userRole: response.user.role,
        data: response.user,
      });
      this.getResourceReport(this.state.name,this.state.under_traning,this.state.skills,this.state.specialization,
        this.state.project_name,this.state.nature_of_project,this.state.availability,
        this.state.hours_engaged,this.state.designation);
    });
    Auth.getProjectDetailsRoleWise().then((response)=>{
      if (response.status == 200) {
        this.setState({
          projects: response.assignedProject});
  }
    })
  }

   handleSearchName = (e) => {
      let indexOfFirstTodo = 0;
      var x = e.target.value;
      this.getResourceReport(x,this.state.under_traning,this.state.skills,this.state.specialization,
        this.state.project_name,this.state.nature_of_project,this.state.availability,
        this.state.hours_engaged,this.state.designation);
   }
   handleSearchSkills = (e) => {
    let indexOfFirstTodo = 0;
    var skills = e.target.value;
    this.getResourceReport(this.state.name,this.state.under_traning,skills,this.state.specialization,
      this.state.project_name,this.state.nature_of_project,this.state.availability,
      this.state.hours_engaged,this.state.designation);
 }
 handleSearchSpecialization = (e) => {
  let indexOfFirstTodo = 0;
  var specialization = e.target.value;
  this.getResourceReport(this.state.name,this.state.under_traning,this.state.skills,specialization,
    this.state.project_name,this.state.nature_of_project,this.state.availability,
    this.state.hours_engaged,this.state.designation);
}
handleDesignation = event => {
 
  var  designation=event.currentTarget.value;
  
  this.getResourceReport(this.state.name,this.state.under_traning,this.state.skills,this.state.specialization,
    this.state.project_name,this.state.nature_of_project,this.state.availability,
    this.state.hours_engaged,designation);
};
handleNatureProject = event => {
 
  var  nature_of_project=event.currentTarget.value;
  
  this.getResourceReport(this.state.name,this.state.under_traning,this.state.skills,this.state.specialization,
    this.state.project_name,nature_of_project,this.state.availability,
    this.state.hours_engaged,this.state.designation);
};
handleunder_traning = event => {
 
  var  under_traning=event.currentTarget.value;
  
  this.getResourceReport(this.state.name,under_traning,this.state.skills,this.state.specialization,
    this.state.project_name,this.state.nature_of_project,this.state.availability,
    this.state.hours_engaged,this.state.designation);
};
handlehours_engaged = event => {
 
  var  hours_engaged=event.currentTarget.value;
  
  this.getResourceReport(this.state.name,this.state.under_traning,this.state.skills,this.state.specialization,
    this.state.project_name,this.state.nature_of_project,this.state.availability,
    hours_engaged,this.state.designation);
};
handleavailability = event => {
 
  var  availability=event.currentTarget.value;
  
  this.getResourceReport(this.state.name,this.state.under_traning,this.state.skills,this.state.specialization,
    this.state.project_name,this.state.nature_of_project,availability,
    this.state.hours_engaged,this.state.designation);
};
handleProjectNameChange= event => {
 
  var  projectname=event.currentTarget.value;
  
  this.getResourceReport(this.state.name,this.state.under_traning,this.state.skills,this.state.specialization,
    projectname,this.state.nature_of_project,this.state.availability,
    this.state.hours_engaged,this.state.designation);
};

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
                                <label></label>
                                                    <select id="projectType" ref="projectType"
                                                        className="form-control "
                                                        onChange={this.handlefilter.bind(this)}
                                                    >                                                        
                                                       <option value="" selected>Select Any Filter</option>
                                                       <option value="name">Name</option>
                                                       <option value="skills">Skills</option>
                                                       <option value="designation" > Designation </option>  
                                                       <option value="specialization">Specialization</option>  
                                                       <option value="projects">Projects</option>  
                                                       <option value="nature_of_project">Nature Of Project</option> 
                                                       <option value="under_traning">Under Training</option> 
                                                       <option value="availability">Availibility</option> 
                                                       <option value="hours_engaged">Hours Engaged</option> 
                                                                                                   
                                                    </select>
                                                    </div>
                                                    </div>
                                                  <div className="ibox-tools btn-withdrop">  
                                                  {this.state.selectfilter ==true? (          
                   <div className="empSearch  box-emp-search">
                       {this.state.typeoffilter =="projects"? ( 
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
                             ):("")}
                               {this.state.typeoffilter =="name" ? ( 
                              <div className="navbar-search search-emp search-nav">
                              <div className="rel ">
                                <span className="search-icon">
                                  <i className="ti-search"></i>
                                </span>
                                <input
                                  className="form-control"
                                  placeholder="Search Name..."
                                  onChange={this.handleSearchName}
                                />
                             
                           
                          </div>
                          </div>):("")}
                          { this.state.typeoffilter =="skills"
                              ? ( 
                              <div className="navbar-search search-emp search-nav">
                              <div className="rel ">
                                <span className="search-icon">
                                  <i className="ti-search"></i>
                                </span>
                                <input
                                  className="form-control"
                                  placeholder="Search Skills..."
                                  onChange={this.handleSearchSkills}
                                />
                             
                           
                          </div>
                          </div>):("")}
                          {
                            this.state.typeoffilter =="specialization"? ( 
                              <div className="navbar-search search-emp search-nav">
                              <div className="rel ">
                                <span className="search-icon">
                                  <i className="ti-search"></i>
                                </span>
                                <input
                                  className="form-control"
                                  placeholder="Search Specialization..."
                                  onChange={this.handleSearchSpecialization}
                                />
                             
                           
                          </div>
                          </div>):("")}
                          {this.state.typeoffilter =="designation"? ( 
                            <select ref="designation"  className="form-control" onChange={this.handleDesignation}>
                              <option value="" selected>
                          Choose one designation
                        </option>
                              <option>Software Developer</option>
                              <option>Tester</option>
                            </select>
                           
                          ):("")}
                           {this.state.typeoffilter =="nature_of_project"? ( 
                            <select ref="nature_of_project"  className="form-control" onChange={this.handleNatureProject}>
                            <option value="" selectedOption>Enter Project Nature</option>
                      <option>Consulting</option>
                      <option>Full Time</option>
                      <option>Internal</option>
                      <option>Managed Services</option>
                            </select>
                           
                          ):("")}
                            {this.state.typeoffilter =="under_traning"? ( 
                            <select ref="under_traning"  className="form-control" onChange={this.handleunder_traning}>
                            <option value="" selectedOption>Choose option</option>
                      <option>Yes</option>
                      <option>No</option>
                     
                            </select>
                           
                          ):("")}
                          {this.state.typeoffilter =="hours_engaged"? ( 
                            <select ref="hours_engaged"  className="form-control" onChange={this.handlehours_engaged}>
                            <option value="" selectedOption>Choose option</option>
                      <option>Yes</option>
                      
                     
                            </select> ):("")}
                              {this.state.typeoffilter =="availability"? ( 
                                <select ref="availability"  className="form-control" onChange={this.handleavailability}>
                                <option value="" selectedOption>Choose option</option>
                          <option>Yes</option>
                          
                         
                                </select>
                           
                          ):("")}   
                               </div> ):("")}
                               
                                 </div>                           
                                     <div>                                      
                                      </div>
                                </div>
                            </div>

          <div className="ibox-body">
      
           <div className="table-responsive">
         
          
            
               
                {this.state.noDataFound === true ? (
                  <tbody></tbody>
                ) : (
                    
          
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th >Team</th>
                    <th className="width_tableheader">Full Name</th> 
                    <th className="width_tableheader">Reports to</th>
                    <th>Designation</th>
                    <th>Skillset</th>
                    <th>Specialization</th>
                    <th className="width_tableheader">Previous Experience</th>
                    <th className="width_tableheader">Teqfocus Experience</th>
                    <th className="width_tableheader">Total Experience</th>
                     <th className="width_tableheader">Under Training</th>
                     <th className="width_tableheader">Consulting Projects</th>
                    <th className="width_tableheader">Full Time Project Association</th>
                    <th className="width_tableheader">Managed Services Project</th>
                    <th className="width_tableheader">Internal Projects</th>
                    <th className="width_tableheader">Hours Engaged</th>
                    <th>Availabiliy</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.dataPerPage.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + this.state.count}</td>
                    
                 <td className="width_tableheader">
                 {item.team}
               </td>
                      
                      <td className="width_tableheader">{item.name}</td>
                      <td className="width_tableheader">{item.reporting_manger}</td>
                      <td className="width_tableheader">{item.designation}</td>
                      <td>{item.skills}</td>
                      <td>{item.specialization}</td>
                      <td>{item.exp_before_teqfocus}</td>
                      <td>{item.teqfous_exp}</td>
                      <td>{item.total_exp}</td>
                      <td>{item.under_traning}</td> 
                      <td>{item.consulting_project}</td>
                      <td>{item.full_time_project}</td>
                      <td>{item.managed_service}</td>
                      <td>{item.internal_projects}</td>
                      <td>{item.hours_engaged}</td>
                      <td>{item.availability}</td>
                      <td>{item.remarks}</td>
                     
                    
                   </tr>
                  ))}
                </tbody>
              </table>
            
          
      
                )}
           
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
