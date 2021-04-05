import React, { Component } from "react";
import DatePicker from "react-datepicker";
import AuthService from "../AuthService";
import Pagination from "react-js-pagination";
import "react-datepicker/dist/react-datepicker.css";
import Loader from 'react-loader-spinner';
import handleValidation from "../validation";
import { Link } from "react-router-dom";
import Select from 'react-select';
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";
var Auth = new AuthService();

class ProjectList extends Component {
  constructor() {
    super();
    this.handleAddProject = this.handleAddProject.bind(this);
    this.showMember = this.showMember.bind(this);
    this.handleAddmember = this.handleAddmember.bind(this);
    this.state = {
      start_date: new Date(),
      end_date: "",
      project_name: "",
      client_name: "",
      alertMessage: "",
      alertMes: "",
      showAlert: false,
      showAl: false,
      danger: false,
      defaultValue: "",
      loading: true,
      category: "Web",
      member_role:"Developer",
      projects: [],
      count: 1,
      showmember: [],
      pjname: [],
      user_name: "",
      usname: [],
      mgname_list: [],
      mgname: "",
      tester_list:[],
      testername:"",
      dataPerPage: [],
      deletemem: [],
      project_id: [],
      proid: null,
      status: "",
      currentPage: 1,
      todosPerPage: 8,
      todos: [],
      activePage: 1,
      numbers: [],
      clientDetails: [],
      userRole: "",
      userName: "",
      userId: "",
      role:"Developer",
      reportsToList:[],
      report_to:"",
      count1:1,
      description:"",
      selectedOption: null,
      selectedOptionTester: null,
      nature_of_project:"",
      hours_envolved:""
    };
  }
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
  cancelForm = () => {
    this.setState({
      start_date: new Date(),
      end_date: new Date(),
     
      //client_name: "",
     // category: "",
      role: "Developer"
    });
    this.refs.role.value = "FrontEnd Developer";
    this.refs.project_name.value = "";
    this.refs.client_name.value = "";
    this.refs.category.value = "Web";
    this.refs.nature_of_project.value = "";
  };
  handleChange = date => {
    this.setState({
      start_date: date
    });
    if (this.state.end_date!="" && date > this.state.end_date) {
      this.setState({
        alertMessage: "*Start date must be smaller than end date",
        showAlert: true,
        danger: true
      });
    } else {
      this.setState({
        showAlert: false
      });
    }
  //  alert(this.state.alertMessage)
  };
  handleChangeEnd = date => {
   // debugger
    if (this.state.start_date > date) {
      this.setState({
        alertMessage: "*Start date must be be smaller than end date",
        showAlert: true,
        danger: true
      });
    } else if (this.state.start_date <= date) {
      this.setState({
        showAlert: false
      });
    }
    this.setState({
      end_date: date
    });
  };
  
  handleAddProject(event) {
    // event.preventDefault();

    var project_name = this.state.project_name;
    var client_name = this.state.client_name;
    var start_date = this.state.start_date;
    var category = this.state.category;
    var description=this.state.description;
    var nature_of_project=this.state.nature_of_project;
    let formData = {
      project_name:  this.refs.project_name.value
    };
    let errors = handleValidation(formData);
    this.setState({ errors: errors });
     if (errors["valid"] == true) {
    Auth.addproject(
      project_name,
      client_name,
      start_date,
      category,
      description,
      nature_of_project
    ).then(response => {
      console.log(response);
      if (response.status == 200) {
        this.setState({});
        document.getElementById("projectSuccess").style.display = "block";
        document.getElementById("projectSuccess").style.opacity = 10;
        document.getElementById("addproject").style.display = "none";
        document.getElementById("addproject").style.opacity = 0;
      } else {
        this.setState({
          showAl: true,
          alertMes: "Error Occurs"
        });
      }
    });
  }
  else{
    this.setState({ errorsdiv: true });
    setTimeout(() => {
      this.setState({ errorsdiv: false });
    }, 4000);
  }
}
  cancelModal() {
    document.getElementById("projectSuccess").style.display = "none";
    document.getElementById("projectSuccess").style.opacity = 0;
    let modal = document.querySelector(".modal-backdrop");
    modal.style.display = "none";
    // this.refs.name.value = "";
    // this.refs.password.value = "";
    // this.refs.reportingManager.value = "";
    // this.refs.role.value = "";
    // this.refs.experience.value = "";
    // this.refs.email.value = "";
    // this.refs.category.value = "";
    // this.refs.designation.value = "";
    // this.refs.skills.value = "";
    window.location.reload();
  }
  showMember = item => {
    this.setState({
      showmember: item.assigned_user,
      project_id: item._id,
      project_name: item.project_name
    });
  };
  hadleShow = item => {
    this.setState({
      deletemem: item.userid
    });
  };
  handleDelete = id => {
    this.setState({
      proid: id
    });
  };
  trimReason(e) {
    const res = arguments[0].slice(0, 10);
    return res;
  }
  memeberDelete() {
    var project_id = this.state.project_id;
    var deletemem = this.state.deletemem;
    Auth.memberDelete(project_id, deletemem).then(response => {
      console.log(response);
      var listofMember = [];
      listofMember = this.state.showmember;
      for (var i = 0; i < listofMember.length; i++) {
        var obj = listofMember[i];
        if (obj.userid == deletemem) {
          this.state.showmember.splice(i, 1);
        }
        this.setState({
          showmember: this.state.showmember
        });
      }
    });
    this.setState({
      show: false,
      alertMessage: "Deleted successfully",
      showAlert: true,
      danger: true
    });
    setTimeout(() => {
      this.setState({ alertMessage: "", showAlert: false });
    }, 4000);
  }
  projectDelete(id) {
    Auth.projectDelete(id).then(response => {
      console.log(response);
      this.setState({
        show: false,
        alertMessage: "Deleted successfully",
        showAlert: true,
        danger: true
      });
      setTimeout(() => {
        this.setState({ alertMessage: "", showAlert: false });
      }, 4000);
      this.componentDidMount();
    });
  }
  editProject(id) {
    this.setState({
      update: 1
    });
    Auth.editProject(id).then(response => {
      if (response.project.start_date!= "") {
        var dateString = response.project.start_date.split("-");
        var raisedOn = new Date(
          dateString[2],
          dateString[1] - 1,
          dateString[0]
        );
        response.project.start_date= Date.parse(raisedOn);
      }
      if (response.project.end_date!= "") {
        var dateString = response.project.end_date.split("-");
        var raisedOn = new Date(
          dateString[2],
          dateString[1] - 1,
          dateString[0]
        );
        response.project.end_date= Date.parse(raisedOn);
      }
      
      this.setState({
        projectList: response.project,
        project_name: response.project.project_name,
        client_name: response.project.client_name,
        category: response.project.category,
        status: response.project.status,
        mgname:response.project.reporting_manger,
       start_date: response.project.start_date,
       end_date:response.project.end_date,
       description:response.project.description,
       nature_of_project:response.project.nature_of_project
      });
    });
   
  }
  UpdateProjectDetails = id => {

    var project_name = this.state.project_name;
    // var client_name = this.state.client_name;
    var category = this.state.category;
    var status = this.state.status;
    var start_date = this.state.start_date;
    var mgname = this.state.mgname;
    var end_date=this.state.end_date;
    var description=this.state.description;
    var nature_of_project=this.state.nature_of_project;
    Auth.UpdateProjectDetails(id, project_name, category, status, start_date, mgname,end_date,description,nature_of_project).then(
      response => {
        console.log(response);
        if (response.status == 200) {
          this.setState({
            alertMessage: "Updated successfully",
            showAlert: true
          });
          setTimeout(() => {
            this.setState({ alertMessage: "", showAlert: false });
          }, 4000);
          window.location.reload();
        } else {
        }
      }
    );
  };
  handleAlertClass() {
    let classes = "alertHeight ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
  handleProjectNameOption = event => {
    this.setState({
      project_name: this.refs.project_name.value
    });
  };
  handleClientNameOption = event => {
    this.setState({
      client_name: event.currentTarget.value
    });
  };

  handleCategoryOption = event => {
    this.setState({
      category: event.currentTarget.value
    });
  };
  handleStatusOption = event => {
    this.setState({
      status: this.refs.status.value
    });
  };
  handleDescriptionChange= event => {
    this.setState({
      description:event.currentTarget.value
    })
  };
  handleProjectNatureOption= event => {
    this.setState({
      nature_of_project:event.currentTarget.value
    })
  };
 truncate(str){
   alert(str)
  return str.length > 10 ? str.substring(0, 7) + "..." : str;
  };
  debouncing=(fn,d)=>{
    let timer;
    return function(){
      let context=this,
      args=arguments;
      clearTimeout(timer);
     timer=setTimeout(()=>{
      fn.apply(context,arguments);
      },d);
    
    }
  }
  componentDidMount() {
    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then(response => {
      if (response.user.imageData == undefined) {
        this.setState({
          userRole: response.user.role,
          userName: response.user.name,
          userId: response.user._id
        });
      } else {
        this.setState({
          userRole: response.user.role,
          userName: response.user.name,
          userId: response.user._id,
          imagePreviewUrl: response.user.imageData.image
        });
      }
      this.getprojectList(response);
    });
   

    Auth.getEmployeeList("").then(response => {


      for (var i = 0; i < response.users.length; i++) {
        if (response.users[i].role == "Manager" ||response.users[i].role == "SuperAdmin"||
         response.users[i].role == "Admin"   ) {
          this.state.mgname_list.push(response.users[i])
          this.state.mgname = response.users[i]._id
         }
      /*  else if (response.users[i].role == "Manager" ||response.users[i].role == "SuperAdmin"||
        response.users[i].role == "Admin"){
          this.state.reportsToList.push(response.users[i])
          this.state.report_to = response.users[i]._id
        } */
        else if (response.users[i].designation == "Tester" ){
          var obj={};
          obj.value=response.users[i]._id;
          obj.label=response.users[i].name;
          this.state.tester_list.push(obj)
        //  this.state.tester_list.push(response.users[i])
        //  this.state.testername = response.users[i]._id
        } 
        else if (response.users[i].designation == "Software Developer" ){
          var obj={};
          obj.value=response.users[i]._id;
          obj.label=response.users[i].name;
          this.state.usname.push(obj)
       //   this.state.user_name = response.users[i]._id
        } 
        /* {
          this.setState({
            usname: response.users,
            user_name: response.users[0]._id,
            defaultValue: response.users[0]._id.value
          });
        }*/

      }
      console.log(this.state.usname)
      var x=this.state.usname

    });
    Auth.getClientList().then(response => {
      if (response.status == 200 && response.clients[0] != undefined) {
        this.setState({
          clientDetails: response.clients,
          client_name: response.clients[0]._id,
          defaultValue: response.clients[0]._id.value
        });
      }
    });
  }
  getprojectList=(response)=>{
    if (response.user._id!=''){
    Auth.getProjectList().then(response => {
      if (response.status == 200) {
        if(response.projects.length!=0){
        for (var i = 0; i < response.projects.length; i++) {
          if (this.state.userRole == "Manager") {

            if (response.projects[i].reporting_manger[0] == this.state.userId) {
              this.state.projects.push(response.projects[i]);

            }

          }
          else {
            this.setState({
              projects: response.projects,
              pjname: response.projects,
              project_name: response.projects[0]._id,
              defaultValue: response.projects[0]._id
            });

          }

        }}

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
    });};
  }
  handleSearch = e => { 
  //  debugger
        this.setState({
          projects: [],
          pjname:[]
       
        });
        var x = document.getElementById("myInput").value;
      //  alert(x)
          let indexOfFirstTodo = 0;
          Auth.searchByProjName(x).then(response => {
            if (response.status == 200) {
              for (var i = 0; i < response.projects.length; i++) {
               
                if (this.state.userRole == "Manager") {
      
                  if (response.projects[i].reporting_manger[0] == this.state.userId) {
                    this.state.projects.push(response.projects[i]);
      
                  }
      
                }
                else {
                  this.setState({
                    projects: response.projects,
                    pjname: response.projects,
                    project_name: response.projects[0]._id,
                    defaultValue: response.projects[0]._id
                  });
      
                }
      
              }
              
              var todos = this.state.projects;
              const { currentPage, todosPerPage } = this.state;
              const indexOfLastTodo = currentPage * todosPerPage;
          //    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
              if (x != "") {

                indexOfFirstTodo = 0;
    
              } else {
                indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
              }
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
        
       
      };
  handleProjectNameChange = event => {
    this.setState({ project_name: event.currentTarget.value });
  };
  handleRoleChange= event => {
    this.setState({ member_role: event.currentTarget.value });
  };
  handleRole1Change= event => {
    this.setState({ role: event.currentTarget.value });
  };
  handleUserNameChange = event => {
    alert(event.currentTarget.value )
    this.setState({ user_name: event.currentTarget.value });
  };
  handleTesterNameChange = event => {
    this.setState({ user_name: event.currentTarget.value });
  };
  handleManagerNameChange = event => {
    this.setState({ mgname: event.currentTarget.value });
  };
  handleReportChange = event => {
    this.setState({ report_to: event.currentTarget.value });

  };
  hoursengagementChange= event => {
    this.setState({ hours_envolved: event.currentTarget.value });

  };
  handleChangeDeveloper= selectedOption => {
    this.setState({ selectedOption ,
      user_name: selectedOption.value 
    });
    console.log(`Option selected:`, selectedOption);
  };
  handleChangeTester= selectedOptionTester => {
    this.setState({ selectedOptionTester ,
      user_name: selectedOptionTester.value 
    });
    console.log(`Option selected:`, selectedOptionTester);
  };
  handleAddmember(event) {
    event.preventDefault();
    let formData = {
     log_hours:this.refs.hours_envolved.value,
   
    };
    let errors = handleValidation(formData);
    this.setState({ errors: errors });
    if (errors["valid"] == true) {
    var project_name = this.state.project_id;
    var user_name = this.state.user_name;
    var role = this.refs.role.value;
    var hours_envolved=this.refs.hours_envolved.value;
 
    Auth.addmember(project_name, user_name, role,hours_envolved).then(response => {
      console.log(response);
      if (response.status == 200) {
        this.setState({
          alertMessage: "Your Request is Submitted",
          showAlert: true
        });
        window.location.reload();
      } else {
        this.setState({
          showAlert: true,
          danger: true,
        //  alertMessage: "Error Occcurs Please Re-Submit Form"
        alertMessage: response.errors
        });
        setTimeout(() => {
          this.setState({ showAlert: false });
        }, 2000);
      }
    });
  }
  else {
    this.setState({ errorsdiv: true });
    setTimeout(() => {
      this.setState({ errorsdiv: false });
    }, 4000);
  }
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
        {/* {this.state.showAlert == true ? (
          <div className="alertmessage">{this.state.alertMessage} !</div>
        ) : (
          ""
        )} */}
        {this.state.showAlert == true ? (
          <div className={this.handleAlertClass()}>
            <button
              className="close"
              onClick={this.handleAlert}
              aria-label="Close"
            >
              ×
            </button>
            <strong> {this.state.alertMessage}</strong>
          </div>
        ) : (
            ""
          )}
        {/* On Submit Sucess */}
        <div className="modal fade" id="projectSuccess">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content ">
              <div className="modal-header ">
                <h4 className="modal-title ">
                  Project has been Added Successfully.
                </h4>
                <button type="button" className="close " data-dismiss="modal">
                  &times;
                </button>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-success btn-circle"
                  onClick={this.cancelModal}
                >
                  <i className="fa fa-check"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <Project Add> */}
        <div className="modal" id="addproject">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Project</h4>{" "}
                {this.state.showAl == true ? (
                  <div className="alertmessage">{this.state.alertMes} !</div>
                ) : (
                    ""
                  )}
                <button
                  type="button"
                  className="close"
                  onClick={this.cancelForm}
                  data-dismiss="modal"
                >
                  &times;
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="form-group">
                    <label>
                      Project Name: <span className="star symbol">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Project Name"
                      ref="project_name"
                      onChange={this.handleProjectNameChange.bind(this)}
                    ></input>
                     {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["project_name"]}
                        </span>
                      ) : (
                          ""
                        )}
                  </div>
                  <div className="form-group">
                  <div className="row">
                  <div className="col-sm-6">
                    <label>
                      Client Name: <span className="star symbol">*</span>
                    </label>
                    <select
                      type="text"
                      ref="client_name"
                      className="form-control "
                      placeholder="Enter User Name"
                      value={this.state.client_name}
                      onChange={this.handleClientNameOption.bind(this)}
                    >
                      {this.state.clientDetails != undefined
                        ? this.state.clientDetails.map(item => (
                          <option key={item._id} value={item._id}>
                            {item.client_name}
                          </option>
                        ))
                        : ""}
                    </select>
                    </div>
                    <div className="col-sm-6">
                  <div className="form-group">
                    <label>
                      Category: <span className="star symbol">*</span>
                    </label>
                    <select
                      type="text"
                      className="form-control"
                      placeholder="Enter Category"
                      ref="category"
                      onChange={this.handleCategoryOption.bind(this)}
                    >
                      <option>Web</option>
                      <option>Salesforce</option>
                    </select>
                  </div>
                  </div>
                  </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>
                          Start Date: <span className="star symbol">*</span>
                        </label>
                        <div className="input-group date">
                          <span className="input-group-addon bg-white">
                            <i className="fa fa-calendar"></i>
                          </span>
                          <DatePicker
                            customInput={<CustomInput />}
                            dateFormat="MM/dd/yyyy"
                            ref="start_date"
                            className="form-control date-picker-date"
                            selected={this.state.start_date}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                    <div className="form-group">
                    <label>
                    Nature of Project: 
                    </label>
                    <select
                      type="text"
                      className="form-control"
                      placeholder="Enter Project Nature"
                      ref="nature_of_project"
                      onChange={this.handleProjectNatureOption.bind(this)}
                    >
                      <option value="" selectedOption>Enter Project Nature</option>
                      <option>Consulting</option>
                      <option>Full Time</option>
                      <option>Internal</option>
                      <option>Managed Services</option>
                    </select>
                  </div>
                    </div>
                  </div>
                  <div className="row">
                  <div className="col-sm-12 form-group">
                      <label className="font-normal">
                        Description 
                      </label>
                      <textarea
                        className="form-control"
                        maxlength="300"
                        rows="3"
                        ref="description"
                        value={this.state.description}
                        onChange={this.handleDescriptionChange}
                        
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary btn-fix btn-rounded"
                    data-dismiss="modal"
                    onClick={this.cancelForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success btn-fix btn-rounded"
                    onClick={this.handleAddProject}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* member Details */}
        <div className="modal fade" id="memberdetails">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 class="modal-title addemployee">Member Details</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th className="mem-details-table">Member Name</th>
                        <th className="mem-details-table">Role</th>
                        <th className="text-center">
                          <i className="ti-menu"></i>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.showmember.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + this.state.count1}</td>
                          <td className="mem-details-table">{item.name}</td>
                          <td className="mem-details-table">{item.role}</td>
                          <td className="text-center">
                            {this.state.userRole === "Admin" || this.state.userRole == "Manager" || this.state.userRole === "SuperAdmin" ? (

                              <button
                                className="btn badge-danger"
                                data-toggle="modal"
                                data-original-title="Delete"
                                data-target="#memDelete"
                                onClick={() => this.hadleShow(item)}
                              >
                                <i className="fa fa-trash font-14"></i>
                              </button>) : ("")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                {this.state.userRole === "Admin" || this.state.userRole == "Manager" || this.state.userRole === "SuperAdmin" ? (
                  <button
                    type="button"
                    className="btn btn-rounded btn-primary"
                    data-toggle="modal"
                    data-target="#addmember"
                  >
                    Add Member
                  </button>) : ("")}
              </div>
            </div>
          </div>
        </div>
        {/* <Member Add> */}
        <div className="modal fade" id="addmember">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Member</h4>
                {/* {this.state.showAlert == true ? (
                  <div className="alertmessage">
                    {this.state.alertMessage} !
                  </div>
                ) : (
                    ""
                  )} */}
                <button
                  type="button"
                  className="close"
                  onClick={this.cancelForm}
                  data-dismiss="modal"
                >
                  &times;
                </button>
              </div>
              <div className="form">
                <form onSubmit={this.handleAddmember}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>
                        Project Name: <span className="star symbol">*</span>
                      </label>
                      <input
                        type="text"
                        ref="project_name"
                        className="form-control "
                        placeholder="Enter Project Name"
                        value={this.state.project_name}
                      //  onChange={this.handleProjectNameChange.bind(this)}
                        readonly
                      >
                        {/* {this.state.pjname != undefined
                          ? this.state.pjname.map(item => (
                              <option key={item._id} value={item._id}>
                                {item.project_name}
                              </option>
                            ))
                          : ""} */}
                      </input>
                    </div>
                    <div className='form-group'>
                      <label>Select Role</label>
                      <select ref="role" className="form-control" type="text" value={this.state.role} onChange={this.handleRole1Change.bind(this)}>
                     {/*    <option>Manager</option>*/}
                        <option>Developer</option>
                        <option>Tester</option>
                      </select>
                    </div>
                  
                    {this.state.role=="Developer"?(
                      
                      <Select
                value={this.state.selectedOption}
                onChange={this.handleChangeDeveloper}
                 options={this.state.usname}
                 />

                    ):  this.state.role == "Tester" ? (
                      <Select
                value={this.state.selectedOptionTester}
                onChange={this.handleChangeTester}
                 options={this.state.tester_list}
                 />
                    ):("")} 
                    <div></div>                    
                    <div className="form-group">
                      <label>
                        Hours Engagement: 
                      </label>
                      <input
                        type="text"
                        ref="hours_envolved"
                        className="form-control "
                        value={this.state.hours_envolved}
                        onChange={this.hoursengagementChange.bind(this)}
                        
                      >
                        
                      </input>
                      {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["log_hours"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                  </div>
                  
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary btn-rounded btn-fix"
                      data-dismiss="modal"
                      onClick={this.cancelForm}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success btn-rounded btn-fix"
                      id="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Edit Project */}
        <div className="modal fade" id="editproject">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Update Project List</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="form">
                <form>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>
                        Project Name: <span className="star symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Project Name"
                        ref="project_name"
                        value={this.state.project_name}
                        onChange={this.handleProjectNameOption}
                      ></input>
                    </div>

                    <div className="row">
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>
                            Category: <span className="star symbol">*</span>
                          </label>
                          <select
                            type="text"
                            className="form-control"
                            placeholder="Enter Category"
                            ref="category"
                            value={this.state.category}
                            onChange={this.handleCategoryOption}
                          >
                            <option>Web</option>
                            <option>Salesforce</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>
                            Status: <span className="star symbol"></span>
                          </label>
                          <select
                            type="text"
                            className="form-control"
                            ref="status"
                            value={this.state.status}
                            onChange={this.handleStatusOption}
                          >
                            <option>Progress</option>
                            <option>Completed</option>
                            <option>Hold</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>
                            Start Date: <span className="star symbol">*</span>
                          </label>
                          <div className="input-group date">
                            <span className="input-group-addon bg-white">
                              <i className="fa fa-calendar"></i>
                            </span>
                            <DatePicker
                              customInput={<CustomInput />}
                              dateFormat="MM/dd/yyyy"
                              ref="start_date"
                              className="form-control date-picker-date"
                              selected={this.state.start_date}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>
                            Manager: <span className="star symbol"></span>
                          </label>
                          <select
                            type="text"
                            ref="mgname"
                            className="form-control "
                            placeholder="Enter User Name"
                            value={this.state.mgname}
                            onChange={this.handleManagerNameChange.bind(this)}
                          >
                            {this.state.mgname_list != undefined
                              ? this.state.mgname_list.map(item => (
                                <option key={item._id} value={item._id}>
                                  {item.name}
                                </option>
                              ))
                              : ""}
                          </select>

                        </div>
                      </div>

                    </div>
                    <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group">
                          <label>
                            End Date: 
                          </label>
                          <div className="input-group date">
                            <span className="input-group-addon bg-white">
                              <i className="fa fa-calendar"></i>
                            </span>
                            <DatePicker
                              customInput={<CustomInput />}
                              dateFormat="MM/dd/yyyy"
                              ref="end_date"
                              className="form-control date-picker-date"
                              selected={this.state.end_date}
                              onChange={this.handleChangeEnd}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                      <div className="form-group">
                    <label>
                    Nature of Project: 
                    </label>
                    <select
                      type="text"
                      className="form-control"
                      placeholder="Enter Project Nature"
                      ref="nature_of_project"
                      value={this.state.nature_of_project}
                      onChange={this.handleProjectNatureOption.bind(this)}
                    >
                      <option value="" selectedOption>Enter Project Nature</option>
                      <option>Consulting</option>
                      <option>Full Time</option>
                      <option>Internal</option>
                      <option>Managed Services</option>
                    </select>
                  </div>
                     
                    </div>
                    <div className="col-sm-6">
                    <label className="font-normal">
                        Description 
                      </label>
                      <textarea
                        className="form-control"
                        maxlength="300"
                        rows="3"
                        ref="description"
                        value={this.state.description}
                        onChange={this.handleDescriptionChange}
                        
                      ></textarea>
                    </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary btn-fix btn-rounded"
                      data-dismiss="modal"
                      onClick={this.cancelForm}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-success btn-fix btn-rounded"
                      onClick={() =>
                        this.UpdateProjectDetails(this.state.projectList._id)
                      }
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/*Delete member */}
        <div className="modal fade" id="memDelete">
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
                    You want to delete this Member!
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
                    onClick={() => this.memeberDelete()}
                  >
                    <i className="fa fa-check"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Delete Project */}
        <div className="modal fade" id="projectDelete">
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
                    You want to delete this Project!
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
                    onClick={() => this.projectDelete(this.state.proid)}
                  >
                    <i className="fa fa-check"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main COntent */}
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox">
              <div className="ibox-head box-emp-mang">
                <div className="ibox-title">Projects List </div>
                <div className="ibox-tools">
                <div class="btn-withdrop">
                  {this.state.userRole === "Admin" || this.state.userRole === "SuperAdmin" ? (

                    <button
                      className="btn btn-outline-info  btn-rounded addemployee-btn"
                      data-toggle="modal"
                      data-target="#addproject"
                      aria-pressed="false"
                    >
                      <i className="fa fa-plus-circle m-r-5"></i> Add Project
                    </button>) : ("")}
                  {/* <a
                    className=" color-white"
                    data-toggle="modal"
                    data-target="#addproject"
                  >
                    <i className="fa fa-plus-circle m-r-5"></i>Add Project
                  </a> */}
                    <div className="empSearch">
                              <div className="navbar-search search-emp search-nav">
                                <div className="rel ">
                                  <span className="search-icon">
                                    <i className="ti-search"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    placeholder="Search By Name..."
                                    id="myInput"
                                    onChange={this.debouncing(this.handleSearch,2000)}
                              //  onChange={this.handleSearch}
                                  />
                                  </div>
                                </div>
                              </div>
                            </div>
                </div>
              
              </div>
              {/* <div className="navbar-search">
                <div className="rel">
                  <span className="search-icon">
                    <i className="ti-search"></i>
                  </span>
                  <input className="form-control" placeholder="Search here..." />
                </div>
              </div> */}
              <div className="ibox-body">
                <table className="table table-bordered table-hover table-responsive">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Project Name</th>
                      <th class="width_tableheader">Client Name</th>
                      <th className="tb-white-sp">Manager Name</th>
                      <th className="tb-white-sp">Start Date</th>
                      <th>Category</th>
                      <th>Nature</th>
                      <th>Description</th>
                      <th width="91px" className="tb-white-sp">
                        Project Member's
                        </th>

                      <th>Status</th>
                      {this.state.userRole === "Admin" || this.state.userRole === "SuperAdmin" ? (
                        <th>Actions</th>) : ("")}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataPerPage.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + this.state.count}</td>
                         <td><Link to={`/teqApp/projectDetails/${item._id}`}>{item.project_name}</Link></td>
                      {/*  <td>{item.project_name}</td>*/}
                        <td>{item.client_name}</td>
                        <td>{item.reporting_manger_name}</td>
                        <td class="width_tableheader">{item.start_date}</td>
                        <td> {item.category} </td>
                        <td>{item.nature_of_project}</td>
                        {item.description!="" && item.description!=null ?
                     ( item.description.length > 10 ? (
                                  <td className="cmt-section">
                                    <div
                                      id={"UncontrolledPopover-" + item._id}
                                      className="pointer"
                                    >
                                      {this.trimReason(item.description, item._id)}
                                          ...
                                    </div>
                                    <UncontrolledPopover
                                      trigger="legacy"
                                      placement="bottom"
                                      target={"UncontrolledPopover-" + item._id}
                                    >
                                      <PopoverBody> {item.description}</PopoverBody>
                                    </UncontrolledPopover>
                                  </td>
                                ) :( <td className="cmt-section">{item.description}</td>)): (
                                    <td className="cmt-section">{item.description}</td>
                                  )}
                       {/*    <td> {this.truncate(this.item.description)} </td>*/}
                        <td>
                  
                          {" "}
                          <button
                            className="btn btn-outline-info"
                            data-toggle="modal"
                            data-target="#memberdetails"
                            aria-pressed="false"
                            onClick={() => this.showMember(item)}
                          >
                            <i className="fa fa-list list-status"></i>
                              Members
                            </button>
                        </td>

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
                    
                        {this.state.userRole === "Admin" || this.state.userRole === "SuperAdmin"? (
                          <td  class="width_tableheader">

                            <div className="customtooltip">
                              <button
                                type="button"
                                className="btn badge-primary editbtn  m-r-5"
                                data-toggle="modal"
                                data-target="#editproject"
                                onClick={() => this.editProject(item._id)}
                              >
                                <i className="fa fa-pencil font-14"></i>
                              </button>
                              <span className="tooltiptext">Edit</span>
                            </div>
                            <div className="customtooltip">
                              <button
                                className="btn badge-danger deletebtn "
                                data-toggle="modal"
                                data-target="#projectDelete"
                                onClick={() => this.handleDelete(item._id)}
                              >
                                <i className="fa fa-trash font-14"></i>
                              </button>
                              <span className="tooltiptext">Delete</span>
                            </div>
                          </td>
                        ) : ("")}
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>
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
                totalItemsCount={this.state.projects.length}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }}
  handleAlertClass() {
    let classes = "alert alert-dismissable fade show alertpopup ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
}

export default ProjectList;
