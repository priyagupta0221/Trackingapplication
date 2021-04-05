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
      designation:"",
      empId:""
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
  handleShow = (status_id,user_id) => {
    this.setState({
        status_id: status_id,
        user_id:user_id
    });
  };
  approvePendingLog(status_id,user_id,status) {
    Auth.approvePendingLog(status_id,user_id,status).then(response => {
        var listOfLeaves = [];
        var listOfAllLeaves = [];
        this.setState({
          show: false,
          showAlert: true,
          alertMessage: response.message
        });
        this.getPastLogs();
    })
  
}
  getPastLogs = () => {  
    debugger 
    Auth.getpastlogRequest().then((response) => {
        debugger
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
      debugger
      this.getPastLogs();
    });
   
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
             <div className="modal fade" id="apporved">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body appr-model sweet-alert showSweetAlert visible">
                    <div className="sa-icon sa-success animate">
                      <span className="sa-line sa-tip animateSuccessTip"></span>
                      <span className="sa-line sa-long animateSuccessLong"></span>
                      <div className="sa-placeholder"></div>
                      <div className="sa-fix"></div>
                    </div>
                  </div>
                  <div className="appr-model">
                    <h3 className="text-center">Are you sure?</h3>
                    <div>
                      <p className="mt-txt text-center">
                        You want to approve this Pending Log Hours!
                      </p>
                    </div>
                  </div>
                  <div className="modal-footer appr-center">
                    <div>
                      <button
                        className="btn btn-danger  btn-rounded"
                        data-dismiss="modal"
                      >
                        <i className="fa fa-times"></i> Cancel
                      </button>
                    </div>
                    <div>
                      <button
                        className="btn btn-success  btn-rounded"
                        data-dismiss="modal"
                        onClick={() => this.approvePendingLog(this.state.status_id,this.state.user_id,"approved")}
                      >
                        <i className="fa fa-check"></i> Approve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id="decline">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body appr-model sweet-alert showSweetAlert visible">
                    <div className="sa-icon sa-error animateErrorIcon">
                      <span className="sa-x-mark animateXMark">
                        <span className="sa-line sa-left"></span>
                        <span className="sa-line sa-right"></span>
                      </span>
                    </div>
                  </div>
                  <div className="appr-model">
                    <h3 className="text-center">Are you sure?</h3>
                    <div>
                      <p className="mt-txt text-center">
                        You want to decline this Pending log!
                      </p>
                    </div>
                  </div>
                  <div className="modal-footer appr-center">
                    <div>
                      <button
                        className="btn btn-danger  btn-rounded"
                        data-dismiss="modal"
                      >
                        <i className="fa fa-times"></i> Cancel
                      </button>
                    </div>
                    <div>
                      <button
                        className="btn btn-success  btn-rounded"
                        data-dismiss="modal"
                        onClick={() => this.approvePendingLog(this.state.status_id,this.state.user_id,"declined")}
                      >
                        <i className="fa fa-check"></i> Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                                <div className="ibox-title">Past Log Requests </div>
                                <div className="ibox-tools-filter">
                                <div className="form"> 
                              
                                                    </div>
                                                  <div className="ibox-tools btn-withdrop">  
                                                
                               
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
                    {this.state.userRole === "Admin" || this.state.userRole === "SuperAdmin" ? (
                    <th className="width_tableheader">Submitted By</th>):("")} 
                    <th className="width_tableheader">Date</th>
                    <th>Hours</th>
                    <th>Description</th>
                    <th>Project Name</th>
                    <th className="width_tableheader">Project Type</th>
                    <th className="width_tableheader">Status</th>
                    {this.state.userRole === "Admin" || this.state.userRole === "SuperAdmin" ? (
                    <th>Action</th>):("")} 
                  </tr>
                </thead>
                <tbody>
                  {this.state.dataPerPage.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + this.state.count}</td>
                      {this.state.userRole === "Admin" || this.state.userRole === "SuperAdmin" ? ( 
                     <td className="width_tableheader">{item.submitted_by}</td>):("")} 
                      <td >{item.date}</td>
                      <td>{item.hours}</td>
                      <td>{item.description}</td>
                      <td>{item.project}</td>
                      <td>{item.project_type}</td>
                      <td >{item.status}</td>
                      {this.state.userRole === "Admin" || this.state.userRole === "SuperAdmin" ? ( 
                     <td className="smallwidth">
                     <div className='row'>
                            <div className='col-md-6'>
                              <div className="customtooltip action col-md-6 approve-thumb">
                                <button
                                  className="btn btn-xs"
                                  onClick={() => this.handleShow(item.status_id,item.user_id)}
                                  data-toggle="modal"
                                  data-target="#apporved"
                                >
                                  <i className="fa fa-thumbs-up font approve"></i>
                                </button>
                         
                                <span className="tooltiptext">Approve</span>
                              </div>
                              </div>
                              <div className="customtooltip action col-md-6">
                                <button
                                  className="btn btn-xs"
                                  onClick={() => this.handleShow(item.status_id,item.user_id)}
                                  data-toggle="modal"
                                  data-target="#decline"
                                >
                                  <i className="fa fa-thumbs-down font decline"></i>
                                </button>
                                <span className="tooltiptext">Decline</span>
                              </div>
                            </div>
                     </td>):("")} 
                     
                    
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
