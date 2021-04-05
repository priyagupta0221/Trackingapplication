import React, { Component } from "react";
import AuthService from "../AuthService";
import { isTaggedTemplateExpression } from "@babel/types";
import Pagination from "react-js-pagination";
import handleValidation from "../validation";
import Loader from 'react-loader-spinner';
import EditableTable from "./editabletable"
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
  withRouter
} from "react-router-dom";
var Auth = new AuthService();
const edtitabletable = new EditableTable();
class AddEmployee extends Component {
  constructor() {
    super();
    this.handleSearch = this.handleSearch.bind(this);
    this.handleAddEmployee = this.handleAddEmployee.bind(this);
    this.UpdateDetails = this.UpdateDetails.bind(this);
    this.handleEmployeelist=this.handleEmployeelist.bind(this);
    this.state = {
      empname: "",
      empemail: "",
      emprole: "",
      category: "",
      designation: "",
      skills: "",
      password: "",
      experience: "",
      loading: true,
      reportingManager: "",
      count: 1,
      manager: [],
      defaultValue: [],
      selectValue: "",
      empId: null,
      report_to: "",
      alertMessage: "",
      alertMes: "",
      hrArr: [],
      showAlert: false,
      showAl: false,
      danger: false,
      activePage: 1,
      numbers: [],
      dataUser: [],
      dataPerPage: [],
      currentPage: 1,
      todosPerPage: 8,
      todos: [],
      managerArr: [],
      hrDataArr:[],
      userRole: "",
      teamlead:"",
      hr:"",
      role:"",
      casual_balance:"",
      sick_balance:"",
      doj:"",
      location:"",
      birth_date:"",
      wfh_balance:"",
      empPermanent:"",
      compoOff_balance:"",
      showallEditTableform: false,
      showallMangTLTableform: false,
      editTableform: false,
      myArray: [],
      specialization:"",
      remarks:""
    };
  }
  handleClick = number => {
    this.setState({
      activePage: number,
      currentPage: number
    });
    var todos = this.state.dataUser;
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
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
  handleSelectChange = event => {
    this.setState({ selectValue: event.currentTarget.value });
  };
  cancelForm = () => {
    this.setState({
      empname: "",
      empemail: "",
      emprole: "",
      category: "",
      designation: "",
      skills: "",
      emppassword: "",
      experience: "",
      reportingManager: ""
    });
   // this.refs.empname.value = "";
  //  this.refs.empemail.value = "";
  //  this.refs.emprole.value = "Employee";
  //  this.refs.category.value = "Web";
   // this.refs.designation.value = "";
   // this.refs.skills.value = "";
   // this.refs.emppassword.value = "";
   // this.refs.experience.value = "";
   // this.refs.reportingManager.value = "";
  };
  handleAddEmployee = event => {
    event.preventDefault();
    var name = this.refs.empname.value;
    var email = this.refs.empemail.value;
    var role = this.refs.emprole.value;
    var category = this.refs.category.value;
    var designation = this.state.designation;
    var skills = this.refs.skills.value;
    var password = this.refs.emppassword.value;
    var exp = this.refs.experience.value;
    var report = this.refs.reportingManager.value;
    Auth.addemployee(
      name,
      role,
      email,
      designation,
      password,
      skills,
      category,
      exp,
      report
    ).then(response => {
      console.log(response);
      if (response.status == 200) {
        this.setState({});
        document.getElementById("userSuccess").style.display = "block";
        document.getElementById("userSuccess").style.opacity = 10;
        document.getElementById("addEmp").style.display = "none";
        document.getElementById("addEmp").style.opacity = 0;
      } else {
        this.setState({
          showAl: true,
          alertMes: "Error Ocuurs please re-submit"
        });
      }
    });
  };
  editEmpHandleChange() {

    var alluser = [];
    this.setState({
      update: 1,
      showallEditTableform: true,
      showallMangTLTableform: false,
      editTableform: true,
  
    });
    edtitabletable.editEmployeeTable();

    this.refs.password.value = "";
  }
  
  cancelModal() {
    document.getElementById("userSuccess").style.display = "none";
    document.getElementById("userSuccess").style.opacity = 0;
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
  handleEmpDelete = id => {
    this.setState({
      empId: id
    });
  };
  employeeDelete(id) {
    Auth.employeeDelete(id).then(response => {
      console.log(response);
      this.componentDidMount();
      this.setState({
        show: false,
        alertMessage: "Deleted successfully",
        showAlert: true,
        danger: true
      });
      setTimeout(() => {
        this.setState({ alertMessage: "", showAlert: false });
      }, 4000);
    });
  }
  editEmp(id) {
    this.setState({
      update: 1
    });
    Auth.editEmp(id).then(response => {
      
      debugger
      if (response.user[0].doj != "") {
        var dateString = response.user[0].doj.split("/");
        var raisedOn = new Date(
          dateString[2],
          dateString[1] - 1,
          dateString[0]
        );
        response.user[0].doj = Date.parse(raisedOn);
      }
      if (response.user[0].birthday != "") {
        var dateString = response.user[0].birthday.split("/");
        var raisedOn = new Date(
          dateString[2],
          dateString[1] - 1,
          dateString[0]
        );
        response.user[0].birthday = Date.parse(raisedOn);
      }
      
      this.setState({
        userList: response.user[0],
        empname: response.user[0].name,
        empemail: response.user[0].email,
        role: response.user[0].role,
        experience: response.user[0].experience,
        reportingManager: response.user[0].report_to,
        doj:response.user[0].doj,
        birth_date:response.user[0].birthday,
        designation: response.user[0].designation,
        category: response.user[0].category,
        report_to: response.user[0].report[0],
        skills: response.user[0].skills,
        specialization:response.user[0].specialization,
        training:response.user[0].under_traning,
        remarks:response.user[0].remarks,
        teamlead:response.user[0].teamlead,
         hr:response.user[0].hr,
         casual_balance:response.user[0].casual_balance,
         sick_balance:response.user[0].sick_balance,
         doj:response.user[0].doj,
         location:response.user[0].location,
     //    birth_date:response.user[0].birth_date,
         wfh_balance:response.user[0].wfh_balance,
         empPermanent:response.user[0].empPermanent,
         compoOff_balance:response.user[0].compoOff_balance,
      });
    });
  }
  handleOption = event => {
    this.setState({
      role: event.currentTarget.value
    });
  };

  handleOptionExperience = event => {
    this.setState({
      experience: event.currentTarget.value
    });
  };
  cancelUpdateModal(){
    document.getElementById("EmployeeUpdateSuccess").style.display = "none";
    document.getElementById("EmployeeUpdateSuccess").style.opacity = 0;
    let modal = document.querySelector(".modal-backdrop");
   window.location.reload();
  }
  handleOptionReportingManager = event => {
    this.setState({
      reportingManager: event.currentTarget.value,
      report_to: event.currentTarget.value
    });
  };
  handleEmailOption = event => {
    this.setState({
      empemail: this.refs.email.value
    });
  };
  handleOptionDesignation = event => {
    this.setState({
      designation: event.currentTarget.value
    });
  };

  handleNameOption = event => {
    this.setState({
      empname: this.refs.name.value
    });
  };
  handleCategoryChange=event=>{
    this.setState({
      category:event.currentTarget.value
    })
  }
   handleSkillsChange=event=>{
    this.setState({
      skills:event.currentTarget.value
    })
   }
   handleRemarksChange=event=>{
    this.setState({
      remarks:event.currentTarget.value
    })
   }

  handleChange(date) {
    const profile = Auth.getProfile();
    
    if (date != null) {
      this.setState({
        empname:"njj",
      joiningDate: date
      });
    } else {
      this.setState({
        joiningDate: ""
      });
    }
  
  }
  handlespecialization=event=>{
    this.setState({specialization:event.currentTarget.value});
  }
  handletraining=event=>{
    this.setState({training:event.currentTarget.value});
  }
  UpdateDetails =event => {
    event.preventDefault();
    var id=this.state.userList._id
    if(this.state.role=="Manager"||this.state.role=="Admin"||this.state.role=="SuperAdmin"||
this.state.role=="HR")
this.state.designation=this.state.role;
let formData = {
  email: this.refs.email.value,
 // password: this.refs.password.value,
  name: this.refs.name.value,
  exp: this.refs.exp.value,
  DOJ: this.state.doj,
  category:  this.state.category,     
  skills:  this.state.skills,


};
let errors = handleValidation(formData);
this.setState({ errors: errors });
if (errors["valid"] == true) {
    Auth.UpdateDetails(
      id,
      this.state.empname,
      this.state.empemail,
      this.state.experience,
      this.refs.password.value,
      this.state.report_to,
	  this.state.teamlead,
	  this.state.hr,
      this.state.role,
	  this.state.casual_balance,
	  this.state.sick_balance,
	  this.state.doj,
	  this.state.location,
      this.state.birth_date,
	  this.state.wfh_balance,
	   this.state.empPermanent,
	   this.state.compoOff_balance,
      this.state.designation,
      this.state.category,
      this.state.skills,
      this.state.specialization,
      this.state.training,
      this.state.remarks

    ).then(response => {
      console.log(response);
      if (response.status == 200) {
        this.setState({});
        document.getElementById("EmployeeUpdateSuccess").style.display = "block";
        document.getElementById("EmployeeUpdateSuccess").style.opacity = 10;
        document.getElementById("updEmp").style.display = "none";
        document.getElementById("updEmp").style.opacity = 0;
        setTimeout(() => {
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);
        this.componentDidMount();
      } else {
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
  handleAlertClass() {
    let classes = "alertHeight ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
  handleSearch = (e) => {
    let indexOfFirstTodo = 0;
    var x = e.target.value;
   
    Auth.searchByEmpName(x).then((response) => {
      debugger
      this.setState({
        todos: response.users,
        hrDataArr:[]
      });

      for (var i = 0; i < response.users.length; i++) {
        if (this.state.userRole == "HR") {
          debugger
          if (response.users[i].hr_name == this.state.userName) {
            this.state.hrDataArr.push(response.users[i]);
          }
        } else if (this.state.userRole == "Manager") {
          if (response.users[i].report_to == this.state.userName) {
            this.state.managerDataArr.push(response.users[i]);
          }
        } else if (this.state.userRole == "TeamLead") {
          if (response.users[i].teamlead_name == this.state.userName) {
            this.state.teamLeadDataArr.push(response.users[i]);
          }
        } else if (
          response.users[i].birthday == undefined ||
          response.users[i].birthday == "Invalid date"
        ) {
          response.users[i].birthday = "N/A";
        }
      }
      if (response.users != undefined) {
        //   if (this.state.userRole == "Admin" || this.state.userRole == "SuperAdmin") {

        //     this.setState({
        //       userList: this.state.hrRoleWiseData,
        //       todos: this.state.hrRoleWiseData,
        //       dataUser: this.state.hrRoleWiseData,
        //       loading: false

        //     });
        //   }
        //   else
        if (this.state.userRole == "HR") {
          this.setState({
            userList: this.state.hrDataArr,
            todos: this.state.hrDataArr,
            dataUser: this.state.hrDataArr,
            loading: false,
          });
        } else if (this.state.userRole == "Manager") {
          this.setState({
            userList: this.state.managerDataArr,
            todos: this.state.managerDataArr,
            dataUser: this.state.managerDataArr,
            loading: false,
            showallMangTLTableform: true,
          });
        } else if (this.state.userRole == "TeamLead") {
          this.setState({
            userList: this.state.teamLeadDataArr,
            todos: this.state.teamLeadDataArr,
            dataUser: this.state.teamLeadDataArr,
            loading: false,
            showallMangTLTableform: true,
          });
        } else {
          this.setState({
            userList: response.users,
            todos: response.users,
            dataUser: response.users,
            loading: false,
          });
        }

        const { todos, currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        if (x != "") {
          indexOfFirstTodo = 0;
        } else {
          indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
        }
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

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
          pageNumbers.push(i);
        }
        this.setState({
          numbers: pageNumbers,
        });
      }
    });
  };
  componentDidMount() {
    this.setState({
      managerArr: [],
    });
    var todos;
    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then(response => {
      debugger
      if (response.user.imageData == undefined) {
        this.setState({
          userRole: response.user.role,
          userName: response.user.name
        });
      } else {
        this.setState({
          userRole: response.user.role,
          userName: response.user.name,
          imagePreviewUrl: response.user.imageData.image
        });
      }
      this.handleEmployeelist(response)
    });
  
  
    Auth.getReportingPersonForTracker().then(response => {
      if(response.status==200 && response.users[0]._id!=null )
      {
      this.setState({
        manager: response.users,
        selectValue: response.users[0]._id,
        defaultValue: response.users[0]._id
      });
    }
    });
  }
  handleEmployeelist(response){
    debugger
    if(response.user.role!=''){
      if (this.state.userRole == "Manager"){
        Auth.getMgrWiseTeamProjectList("").then(response => {
          debugger
          for (var i = 0; i < response.teamMembersRec.length; i++) {
          
                this.state.managerArr.push(response.teamMembersRec[i]);
             
         }
         
            this.setState({
              dataUser: this.state.managerArr,
              todos: this.state.managerArr,
              dataUser: this.state.managerArr,
    
            });
    
           
          //var todos = this.state.dataUser;
          const { todos, currentPage, todosPerPage } = this.state;
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
    
        });
      }
      else{
        debugger
      Auth.getEmployeeList("").then(response => {
        debugger
        if (this.state.userRole == "HR") {
          for (var i = 0; i < response.users.length; i++) {
          if (response.users[i].hr_name == this.state.userName) {
            this.state.hrArr.push(response.users[i]);
          }
          }
        this.setState({
          userList: this.state.hrArr,
          todos: this.state.hrArr,
          dataUser: this.state.hrArr,
          loading: false,
          showalluser: false,
          showallMangTLTableform: false
        });
      }
       else{
          this.setState({
            userList: response.users,
            todos: response.users,
            dataUser: response.users,
  
          });
      }
        //var todos = this.state.dataUser;
        const { todos, currentPage, todosPerPage } = this.state;
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
  
      });
    }
    }
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
            <strong> {this.state.alertMessage}</strong>
          </div>
        ) : (
            ""
          )}
           {/* On Update Sucess */}
    <div className="modal fade" id="EmployeeUpdateSuccess">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content ">
        <div className="modal-header ">
          <h4 className="modal-title ">Updated Successfully</h4>
          <button type="button" className="close " data-dismiss="modal"  onClick={this.cancelUpdateModal} >
            &times;
          </button>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-success btn-circle"
            onClick={this.cancelUpdateModal}
          >
            <i className="fa fa-check"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
        {/* Add Employee */}
        <div className="modal fade" id="addEmp">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content addemployee">
              <div className="modal-header addemployee">
                <h4 className="modal-title addemployee">
                  Add Employee Profile
                </h4>
                {this.state.showAl == true ? (
                  <div className="alertmessage">{this.state.alertMes} !</div>
                ) : (
                    ""
                  )}
                <button
                  type="button"
                  className="close addemployee "
                  data-dismiss="modal"
                  onClick={this.cancelForm}
                >
                  &times;
                </button>
              </div>
              <form onSubmit={this.handleAddEmployee}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-sm-6 form-group">
                      <label>
                        Name <span className="star symbol">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Name"
                        ref="empname"
                      />
                      {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["name"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="col-sm-6 form-group">
                      <label>
                        Email Address <span className="star symbol">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        ref="empemail"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 form-group">
                      <label>
                        Password <span className="star symbol">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        ref="emppassword"
                      />
                    </div>
                    <div className="col-sm-6 form-group">
                      <label>
                        Role <span className="star symbol">*</span>
                      </label>
                      <select ref="emprole" className="form-control">
                        <option>Employee</option>
                        <option>Manager</option>
                        <option>Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 form-group">
                      <label>
                        Designation <span className="star symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        ref="designation"
                        onChange={this.handleOptionDesignation}
                      ></input>
                    </div>
                    <div className="col-sm-6 form-group">
                      <label>
                        Category <span className="star symbol">*</span>
                      </label>
                      <select ref="category" className="form-control">
                      <option value="" selected>
                          Choose one category
                        </option>
                        <option>Web</option>
                        <option>Salesforce</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    {" "}
                    <div className="col-sm-6 form-group">
                      <label className="font-normal">
                        Experience <span className="star symbol">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        ref="experience"
                      ></input>
                    </div>
                    <div className="col-sm-6 form-group">
                      <label>
                        Reporting Manager <span className="star symbol">*</span>
                      </label>
                      <select
                        ref="reportingManager"
                        className="form-control"
                        value={this.state.selectValue}
                        onChange={this.handleSelectChange.bind(this)}
                      >
                        {this.state.manager != undefined
                          ? this.state.manager.map(item => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))
                          : ""}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12 form-group">
                      <label className="font-normal">
                        Skills <span className="star symbol">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        maxlength="300"
                        rows="3"
                        ref="skills"
                      ></textarea>
                    </div>
                  </div>
                </div>
                {/* Modal footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger  btn-rounded btn-fix"
                    data-dismiss="modal"
                    onClick={this.cancelForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success  btn-rounded btn-fix"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Delete emp */}
        <div className="modal fade" id="empDelete">
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
                    You want to delete this Employee!
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
                    onClick={() => this.employeeDelete(this.state.empId)}
                  >
                    <i className="fa fa-check"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Update Employee */}
        <div className="modal fade update-Emp" id="updEmp">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Update Employee Profile</h4>
                <button type="button" className="close" data-dismiss="modal"
                onClick={this.cancelForm}>
                  &times;
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-sm-6 form-group">
                      <label>Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Name"
                        ref="name"
                        value={this.state.empname}
                        onChange={this.handleNameOption}
                      />
                          {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["name"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="col-sm-6 form-group">
                      <label>Email Address</label>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        ref="email"
                        value={this.state.empemail}
                        onChange={this.handleEmailOption}
                      />
                      {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["email"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 form-group">
                      <label>Password</label>
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        ref="password"

                      //defaultValue={this.state.userList.password}
                      />
                       {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["password"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="col-sm-6 form-group">
                      <label>Role</label>
                      <select
                        ref="role"
                        value={this.state.role}
                        className="form-control"
                        onChange={this.handleOption}
                      >
                         <option>Employee</option>
                        <option>TeamLead</option>
                        <option>Manager</option>
                          <option>HR</option>
                          <option>Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-6 form-group">
                      <label>Experience</label>
                      <input
                        ref="exp"
                        type="text"
                        className="form-control"
                        value={this.state.experience}
                        onChange={this.handleOptionExperience}
                      ></input>
                    </div>

                    <div className="col-sm-6 form-group">
                      <label>Reporting Manager</label>
                      <select
                        ref="reportingManager"
                        className="form-control"
                        value={this.state.report_to}
                        onChange={this.handleOptionReportingManager}
                      >
                        {this.state.manager != undefined
                          ? this.state.manager.map(item => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))
                          : ""}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                  {this.state.role == "Employee" ||this.state.role == "TeamLead"? (
                  <div className="col-sm-6 form-group">
                      <label>
                        Category <span className="star symbol">*</span>
                      </label>
                     
                      <select ref="category" className="form-control" value={this.state.category}
                        onChange={this.handleCategoryChange}>
                           <option value="" selected>
                          Choose one category
                        </option>
                        <option>Web</option>
                        <option>Salesforce</option>
                      </select>
                    </div>):("")}
                    {this.state.role == "Employee" ||this.state.role == "TeamLead"? (
                    <div className="col-sm-6 form-group">
                      <label>Designation</label>
                      <select ref="category" className="form-control" value={this.state.designation}
                        onChange={this.handleOptionDesignation}>
                           <option value="" selected>
                          Choose one designation
                        </option>
                        <option>Software Developer</option>
                        <option>Tester</option>
                      </select>
                     
                    </div>):("")}
                    </div>
                    <div className="row">
                    <div className="col-sm-6 form-group">
                    <label className="font-normal">
                     Specialization 
                      </label>
                      <textarea
                        className="form-control"
                        maxlength="300"
                        rows="3"
                        ref="specialization"
                        value={this.state.specialization}
                        onChange={this.handlespecialization} ></textarea>
                    </div>
                    <div className="col-sm-6 form-group">
                    <label className="font-normal">
                    Under Training 
                      </label>
                      <select ref="training"
                        value={this.state.training}
                        onChange={this.handletraining.bind(this)}
                        className="form-control">
                          
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>
                    <div className="col-sm-6 form-group">
                      <label className="font-normal">
                        Skills <span className="star symbol">*</span>
                      </label>
                      
                      <textarea
                        className="form-control"
                        maxlength="300"
                        rows="3"
                        ref="skills"
                        value={this.state.skills}
                        onChange={this.handleSkillsChange}
                        
                      ></textarea>
                    </div>
                    <div className="col-sm-6 form-group">
                      <label className="font-normal">
                        Remarks <span className="star symbol">*</span>
                      </label>
                      
                      <textarea
                        className="form-control"
                        maxlength="300"
                        rows="3"
                        ref="remarks"
                        value={this.state.remarks}
                        onChange={this.handleRemarksChange}
                        
                      ></textarea>
                    </div>
                  </div>
                  </div>
                
                {/* Modal footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger btn-rounded btn-fix"
                    data-dismiss="modal"
                    onClick={this.cancelForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success btn-rounded btn-fix"
                  //  data-dismiss="modal"
                    onClick={this.UpdateDetails}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* On Submit Sucess */}
        <div className="modal fade" id="userSuccess">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content ">
              <div className="modal-header ">
                <h4 className="modal-title ">Employee has been registered.</h4>
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
        {/* Employee list */}
        {this.state.showallEditTableform === true && this.state.editTableform === true ? (

       <div className="ibox">
       <EditableTable></EditableTable>
       </div>

        ) : (
          
        <div>
        <div className="ibox">
          <div className="ibox-head box-emp-mang">
          {this.state.userRole == "Admin" || this.state.userRole == "SuperAdmin" ||this.state.userRole == "HR"  ? (
      <div className="ibox-tools btn-withdrop">
        
      <button
            className="btn btn-outline-info  btn-rounded addemployee-btn"
            data-toggle="modal"
            data-target="#addEmp"
            aria-pressed="false"
          >
            <i className="fa fa-user-plus"></i> Add Employee
          </button>
          <button
          className="btn btn-outline-info  btn-rounded addemployee-btn"
          onClick={() => this.editEmpHandleChange()}>
          <i class="fa fa-edit font comment"></i> Edit Employee
          </button>
        </div>   ) : (
              ""
            )}
            <div className="ibox-title"> Employee List</div>
            {/* <div className="alert alert-success alert-dismissable fade show">
                                <button className="close" data-dismiss="alert" aria-label="Close">×</button><strong>Success!</strong> You successfully read this important alert message.</div> */}
               {this.state.userRole == "Admin" || this.state.userRole == "SuperAdmin" ||this.state.userRole == "HR"  ? (                   
            <div className="ibox-tools btn-withdrop">            
                   <div className="empSearch  box-emp-search">
                              <div className="navbar-search search-emp search-nav">
                                <div className="rel ">
                                  <span className="search-icon">
                                    <i className="ti-search"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    placeholder="Search By Name..."
                                    onChange={this.handleSearch}
                                  />
                                </div>
                              </div>
                            </div>
                            

            </div> ) : (
                  ""
                )}
          </div>

          <div className="ibox-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                  {/*  <th>Role</th> */}
                    <th>Designation</th>
                    <th>Manager</th>
                    <th>Category</th>
                    <th>Experience</th>
                    <th>Skills</th>
                    {this.state.userRole === "Admin" ||this.state.userRole == "SuperAdmin"
                    ||this.state.userRole == "HR" ? (
                <th>Actions</th>):("")}
                    
                  </tr>
                </thead>
                <tbody>
                  {this.state.dataPerPage.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + this.state.count}</td>
                      {this.state.userRole === "Admin" ||this.state.userRole == "SuperAdmin"
                      ||this.state.userRole == "HR" ? (
                 <td> <Link to={`/teqApp/emProfile/${item._id}`}>
                 {item.name}
               </Link></td>):<td>
                          {item.name}
                       </td>}
                      
                      <td>{item.email}</td>
                   {/*   <td>{item.role}</td>*/}
                      <td>{item.designation}</td>
                      <td>{item.report_to}</td>
                      <td>{item.category}</td>
                      <td>{item.experience}</td>
                      <td>{item.skills}</td>
                      {this.state.userRole === "Admin" ||this.state.userRole == "SuperAdmin" 
                      ||this.state.userRole == "HR"? (
               
                      <td className="tbl-date">
                        <div className="customtooltip">
                          <button
                            className="btn badge-info btn-xs m-r-5"
                            data-toggle="modal"
                            data-target="#updEmp"
                            onClick={() => this.editEmp(item._id)}
                          >
                            <i className="fa fa-pencil font comment"></i>
                          </button>
                          <span className="tooltiptext">Edit</span>
                        </div>
                        <div className="customtooltip">
                          <button
                            className="btn badge-danger btn-xs"
                            data-toggle="modal"
                            data-target="#empDelete"
                            onClick={() => this.handleEmpDelete(item._id)}
                          >
                            <i className="fa fa-trash font decline"></i>
                          </button>
                          <span className="tooltiptext">Delete</span>
                        </div>
                      </td>
                      ) :("")}
                   </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            totalItemsCount={this.state.dataUser.length}
          />
        </div>
          
        </div> 
        ) }

      
      </div>
    );}
  }
  handleAlertClass() {
    let classes = "alert alert-dismissable fade show alertpopup ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
}

export default AddEmployee;
