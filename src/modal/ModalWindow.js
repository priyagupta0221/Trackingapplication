import React, { Component } from "react";
import handleValidation from "../validation";
import AddEmployee from "../employeemanagement/AddEmployee";
import DatePicker from "react-datepicker";
import * as datesUtil from "../ApplyLeave/dateutils";
import axios from "axios";
import AuthService from "../AuthService";
const Auth = new AuthService();
const emp = new AddEmployee();
var path = window.location.pathname;	
var authtokenurl = path.split("App", 1);	
var tokenurl = authtokenurl[0];
export default class ModelWindow extends Component {
  constructor() {
    super();
    this.SubmitDetails = this.SubmitDetails.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBirthdateChange = this.handleBirthdateChange.bind(this);
    this.state = {
      joiningDate: new Date(),
      birthdate: new Date(),
      modal: 0,
      errors: {},
      manager: [],
      errorsdiv: false,
      selectValue: "",
      teamlead: "",
      hr: "",
      hr_name: "",
      response: {},
      showAlert: false,
      alertMessage: "",
      defaultValue: "",
      selectedRole: "",
      location: "",
      casual:"",
      sick:"",
      comp:"",
      wfh:"",
      category:"",
      skills:"",
      designation:"",
      specialization:"",
      remarks:""

      

    };
  }
  test() {
    //const profile = Auth.getProfile();
    return datesUtil.excludeAllSaturdaysAndSundays();
  }
  handleChange(date) {
    const profile = Auth.getProfile();
    if (date != null) {
      this.setState({
        joiningDate: date
      });
    } else {
      this.setState({
        joiningDate: ""
      });
    }
  }
  handleBirthdateChange(date) {
    const profile = Auth.getProfile();
    if (date != null) {
      this.setState({
        birthdate: date
      });
    } else {
      this.setState({
        birthdate: ""
      });
    }
  }
  currentDate(){
    var date = new Date();
 var currDate =   ((date.getMonth() > 8) ? (date.getMonth() + 1) :
         ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : 
         ('0' + date.getDate())) + '/' + date.getFullYear();
         return currDate;

}
birthDate(date){
  
var currDate =   ((date.getMonth() > 8) ? (date.getMonth() + 1) :
       ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : 
       ('0' + date.getDate())) + '/' + date.getFullYear();
       return currDate;

}
  SubmitDetails = event => {
    if( tokenurl !== "/teq"){
  const coBirthDate =  this.birthDate(this.state.birthdate).split("/");
  const compBirth =  this.currentDate().split("/");
if(coBirthDate[2] == compBirth[2]){
  this.setState({
    showAlert: true,
    alertMessage: "BirthDate is required !"
  });
  return;}
}
if(this.refs.role.value=="Manager"||this.refs.role.value=="Admin"||this.refs.role.value=="SuperAdmin"||
this.refs.role.value=="HR")
this.state.designation=this.refs.role.value;
    let formData = {
      email: this.refs.email.value,
      password: this.refs.password.value,
      name: this.refs.name.value,
      exp: this.refs.exp.value,
      casual: this.state.casual,
      sick: this.state.sick,
      comp: this.state.comp,
      wfh:this.state.wfh,
      DOJ: this.state.joiningDate,
      category:  this.state.category,     
      skills:  this.state.skills,
      role: this.refs.role.value

    };
    let errors = handleValidation(formData);
    this.setState({ errors: errors });
    if (errors["valid"] == true) {
      emp
        .SubmitDetails(
          this.refs.name.value,
          this.refs.email.value,
          this.refs.exp.value,
          this.refs.password.value,
          this.state.selectValue,
          this.refs.role.value,
          this.state.teamlead,
          this.state.hr,
          this.state.casual,
          this.state.sick,
          this.state.wfh,
         this.state.comp,
         
         this.state.joiningDate, 
         this.refs.location.value, 
         this.state.birthdate,
        
         this.state.empPermanent,
         this.state.category,     
          this.state.skills,
          this.state.designation,
          this.state.specialization,
          this.state.training,
          this.state.remarks

        )
        .then(res => {
          if (res.message == "user has been registered") {
            this.setState({ response: res });
            var addEmp = document.getElementById("addEmp");
            addEmp.style.display = "none";
            document.getElementById("userSuccess").style.display = "block";
            document.getElementById("userSuccess").style.opacity = 10;
            //document.getElementById('formDiv').style.display = 'none';
          } else {
            this.setState({
              showAlert: true,
              alertMessage: res.message
            });
          }
        });
    } else {
      this.setState({ errorsdiv: true });
      setTimeout(() => {
        this.setState({ errorsdiv: false });
      }, 4000);
    }
  };
  closeModal = () => {
    document.getElementById("userSuccess").style.display = "none";
    document.getElementById("userSuccess").style.opacity = 0;
    let modal = document.querySelector(".modal-backdrop");
   // modal.style.display = "none";
    this.refs.name.value = "";
    this.refs.password.value = "";
    this.refs.reportingManager.value = "";
    this.refs.role.value = "";
    this.refs.exp.value = "";
    this.refs.email.value = "";
    this.state.casual= "";
    this.state.sick= "";
    this.state.comp = "";
    this.state.wfh = "";
    this.state.specialization=""
    emp.apiResponse(this.state.response);
    this.setState({ errorsdiv: false });
    window.location.reload();
  };
  closeAdd = () => {
    // var addEmp = document.getElementById("addEmp");
    // addEmp.style.display = "none";
    // let modal = document.querySelector('.modal-backdrop');
    // modal.style.display = "none";
    this.refs.name.value = "";
    this.refs.email.value = "";
    this.refs.password.value = "";
    //this.refs.reportingManager.value = this.State.defaultValue;
    this.refs.role.value = "Employee";
    this.refs.exp.value = "0";
    this.state.casual = "";
    this.state.sick = "";
    this.state.comp = "";
    this.state.wfh = "";
    this.setState({ errorsdiv: false });
  };
  // onBackButtonEvent = (e) => {
  //
  //     //window.location.reload();
  //     nav.componentDidMount();
  //     //debug('handling back button press')
  //     // e.preventDefault()
  //     //this.transitionTo('chatrooms')
  // }
  componentDidMount() {
    //
    // window.onpopstate = nav.componentDidMount();
    var authtokenurl = path.split("App", 1);
        var tokenurl = authtokenurl[0];
    this.refs.name.value = "";
    this.refs.password.value = "";
    this.refs.email.value = "";
    // this.refs.reportingManager.value = "";
    // this.refs.role.value = '';
    // this.refs.exp.value = '';
    Auth.getReportingPerson().then(response => {
      if (response.message != "Permission required") {
        this.setState({
          manager: response.users,
          selectValue: response.users[0]._id,
          defaultValue: response.users[0]._id
        });
      } else {
      }
    });
    Auth.getTeamLeader().then(response => {
      var defaultTLValue = { _id: "N/A", name: "Select any value" };
      if (response.message != "Permission required" && response.users != '') {
        response.users.unshift(defaultTLValue);
        this.setState({
          teamLeader: response.users,
          teamlead_name: response.users[0]._id,
          teamlead: response.users[0]._id,
        });
      } else {
      }
    });
    Auth.getHRPerson().then(response => {
      var defaultHRValue = { _id: "N/A", name: "Select any value" };
      if (response.message != "Permission required" && response.users != '') {
        response.users.unshift(defaultHRValue);
        this.setState({
          hrPerson: response.users,
          hr_name: response.users[0]._id,
          hr: response.users[0]._id,
        });
      } else {
      }
    });
    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then(response => {

      this.setState({
        userRole: response.user.role,
        userName:response.user.name
      });
    });
  }
  handleSelectChange = event => {
    this.setState({ selectValue: event.currentTarget.value });
  };

  handleOptionTeamLead = event => {
    this.setState({ teamlead: event.currentTarget.value });
  };

  handleOptionHr = event => {
    this.setState({ hr: event.currentTarget.value });
  };

  handleSelectRole = event => {
    this.setState({ selectedRole: event.currentTarget.value });
  }
  handlelocation = event => {
    this.setState({ location: event.currentTarget.value });
  }
  handleCasualLeave=event=>{
    this.setState({ casual: event.currentTarget.value });
}
handleSickLeave=event=>{
  this.setState({ sick: event.currentTarget.value });
}
handleCompoLeave=event=>{
  this.setState({ compo: event.currentTarget.value });
}
handleWFHLeave=event=>{
  this.setState({ wfh: event.currentTarget.value });
}
handleCategory=event=>{

  this.setState({ category: event.currentTarget.value });
}
handleSkills=event=>{
  this.setState({ skills: event.currentTarget.value });
}
handleRemarks=event=>{
  this.setState({ remarks: event.currentTarget.value });
}
handleDesignation=event=>{
  this.setState({designation:event.currentTarget.value});
}
handlespecialization=event=>{
  this.setState({specialization:event.currentTarget.value});
}
handletraining=event=>{
  this.setState({training:event.currentTarget.value});
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
    const isWeekday = date => {
      const day = date.getDay();
      return day !== 0 && day !== 6;
    };
    return (
      <div>
        {/* {this.state.modal == 1 ? ( */}
        <div className="modal fade update-Emp" id="addEmp" data-backdrop="static">
          <div className="modal-dialog modal-lg">
            <div className="modal-content addemployee">
              {/* Modal Header  */}
              <div className="modal-header addemployee">
                <h4 className="modal-title addemployee">
                  Add Employee Profile
                </h4>
                {this.state.showAlert == true ? (
                  <div className="alertmessage">{this.state.alertMessage}</div>
                ) : (
                    ""
                  )}
                <button
                  type="button"
                  className="close addemployee "
                  onClick={this.closeAdd}
                  data-dismiss="modal"
                >
                  &times;
                </button>
              </div>
              <form>
                {/* Modal body  */}
                <div className="modal-body">
                  <div className="row">
                    <div className="col-sm-4 form-group">
                      <label>Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Name"
                        ref="name"
                      />
                      {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["name"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="col-sm-4 form-group">
                      <label>Email Address</label>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        ref="email"
                      />
                      {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["email"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="col-sm-4 form-group">
                      <label>Password</label>
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        ref="password"
                      />
                      {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["password"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>


                  </div>
                  <div className="row">
                   
                    <div className="col-sm-4 form-group">
                      <label>Role</label>
                      {this.state.userRole != "HR" ? <select ref="role"
                        value={this.state.selectedRole}
                        onChange={this.handleSelectRole.bind(this)}
                        className="form-control">
                          <option value="" selected>
                          Choose one category
                        </option>

                        <option>Employee</option>
                        <option>TeamLead</option>
                        <option>Manager</option>
                          <option>HR</option>
                          <option>Admin</option>
                         </select>
                      :  <select ref="role"
                      value={this.state.selectedRole}
                      onChange={this.handleSelectRole.bind(this)}
                      className="form-control">

                      <option>Employee</option>
                      <option>TeamLead</option>
                      <option>Manager</option>
                        
                       </select>
                      
                        }
                         {this.state.errorsdiv == true ? (
                          <span className="error">
                            {this.state.errors["role"]}
                          </span>
                        ) : (
                            ""
                          )}  
                    </div>
                   
                    <div className="col-sm-4 form-group">
                      <label>Before Teq Experience</label>
                      <input ref="exp" className="form-control">

                      </input>
                    </div>
                    <div className="col-sm-4 form-group">
                      <label>Reporting Manager</label>
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
                  {tokenurl !== "/teq" ? (
                  <div className="row">
                    <div className="col-sm-4 form-group">
                      <label>Casual Leave Balance</label>
                      <input ref="casual" className="form-control" onChange={this.handleCasualLeave.bind(this)}></input>

                    </div>
                    <div className="col-sm-4 form-group">
                      <label>Sick Leave Balance</label>
                      <input ref="sick" className="form-control" onChange={this.handleSickLeave.bind(this)}></input>

                    </div>
                    <div>
                      {/* <label>Comp Off Balance</label> */}
                      <input ref="comp" className="form-control" hidden onChange={this.handleCompoLeave.bind(this)}></input>

                    </div>
                    <div className="col-sm-4 form-group">
                      <label className="font-normal">Date of Joining </label>
                      <div className="input-group date">
                        <span className="input-group-addon bg-white">
                          <i className="fa fa-calendar"></i>
                        </span>
                        <DatePicker
                       
                          dateFormat="dd/MM/yyyy"
                          maxDate={new Date(+new Date() + 2592000000)}
                          ref="startdate"
                          className="form-control date-picker-date"
                          selected={this.state.joiningDate}
                          onChange={this.handleChange}
                          filterDate={isWeekday}
                       
                        />
                      </div>

                      {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["DOJ"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>



                  </div> ) :( 
                  <div className="row">
                     <div className="col-sm-4 form-group">
                      <label className="font-normal">Date of Joining </label>
                      <div className="input-group date">
                        <span className="input-group-addon bg-white">
                          <i className="fa fa-calendar"></i>
                        </span>
                        <DatePicker
                       
                          dateFormat="dd/MM/yyyy"
                          maxDate={new Date(+new Date() + 2592000000)}
                          ref="startdate"
                          className="form-control date-picker-date"
                          selected={this.state.joiningDate}
                          onChange={this.handleChange}
                          filterDate={isWeekday}
                       
                        />
                      </div>

                      {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["DOJ"]}
                        </span>
                      ) : ("")}
                    </div>
                    <div className="col-sm-4 form-group">
                      <label>
                        Category 
                      </label>
                      <select ref="category" value={this.state.category} className="form-control" onChange={this.handleCategory}>
                      <option value="" selected>
                          Choose one category
                        </option>
                        <option>Web</option>
                        <option>Salesforce</option>
                      </select>
                    </div>
                    {this.state.selectedRole == "Employee" ||this.state.selectedRole == "TeamLead"? (
                    <div className="col-sm-4 form-group">
                      <label>Designation 
                      </label>
                    
                      <select ref="designation" value={this.state.designation} className="form-control" onChange={this.handleDesignation}>
                      <option value="" selected>
                          Choose one designation
                        </option>
                        <option>Software Developer</option>
                        <option>Tester</option>
                      </select>
                  </div>):("")}
                 
                
                  </div>)}
                  <div className="row">
                   
                    <div className="col-sm-4 form-group">
                      <label>Location</label>
                      <select ref="location"
                        value={this.state.location}
                        onChange={this.handlelocation.bind(this)}
                        className="form-control">
                          <option value="" selected>
                          Choose one category
                        </option>
                        <option>Ranchi</option>
                        <option>Pune</option>
                        <option>Canada</option>

                      </select>
                    </div>
                    {this.state.selectedRole == "Employee" ? (
                      <div className="col-sm-4 form-group">
                        <label>Team Leader</label>
                        <select
                          ref="teamLead"
                          className="form-control"
                          value={this.state.teamlead}
                          onChange={this.handleOptionTeamLead.bind(this)}
                        >
                          {this.state.teamLeader != undefined
                            ? this.state.teamLeader.map(item => (
                              <option key={item._id} value={item._id}>
                                {item.name}
                              </option>
                            ))
                            : ""}
                        </select>
                      </div>
                    ) : (
                        ""
                      )}
                    {(  this.state.selectedRole != "HR")  ? (
                      
                      <div className="col-sm-4 form-group">
                        <label>HR</label>
                        <select
                          ref="hr"
                          className="form-control"
                          value={this.state.hr}
                          onChange={this.handleOptionHr.bind(this)}
                        >
                          {this.state.hrPerson != undefined
                            ? this.state.hrPerson.map(item => (
                              <option key={item._id} value={item._id}>
                                {item.name}
                              </option>
                            ))
                            : ""}
                        </select>
                      </div>
                    ) : (""
                      )}
                  </div>
                  {tokenurl !== "/teq" ? (
                  <div className='row'>
                    <div className="col-sm-4 form-group">
                      <label className="font-normal">Date of Birth </label>
                      <div className="input-group date">
                        <span className="input-group-addon bg-white">
                          <i className="fa fa-calendar"></i>
                        </span>
                        <DatePicker
                          dateFormat="dd/MM/yyyy"
                          ref="birthdate"
                          className="form-control date-picker-date"
                          selected={this.state.birthdate}
                          onChange={this.handleBirthdateChange}
                        />
                      </div>

                      {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["DOJ"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="col-sm-4 form-group">
                      <label>WFH Balance</label>
                      <input ref="wfh" className="form-control"   onChange={this.handleWFHLeave}></input>

                    </div>
                    </div>):(
                  <div class="row">
                    <div className="col-sm-4 form-group">
                    <label className="font-normal">
                        Skills 
                      </label>
                      <textarea
                        className="form-control"
                        maxlength="300"
                        rows="3"
                        ref="skills"
                        onChange={this.handleSkills} ></textarea>
                    </div>
                    <div className="col-sm-4 form-group">
                      
                    <label className="font-normal">
                     Specialization 
                      </label>
                      <textarea
                        className="form-control"
                        maxlength="300"
                        rows="3"
                        ref="specialization"
                        onChange={this.handlespecialization} ></textarea>
                    </div>
                    <div className="col-sm-4 form-group">
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
                    <div className="col-sm-4 form-group">
                    <label className="font-normal">
                       Remarks
                      </label>
                      <textarea
                        className="form-control"
                        maxlength="300"
                        rows="3"
                        ref="remarks"
                        onChange={this.handleRemarks} ></textarea>
                    </div>
                   
                  </div>)}
                </div>
                {/* Modal footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger  btn-rounded btn-fix"
                    onClick={this.closeAdd}
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success  btn-rounded btn-fix"
                    onClick={this.SubmitDetails}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* <div className="modal fade" id="updEmp">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            Modal Header 
                            <div className="modal-header">
                                <h4 className="modal-title">Update Employee Profile</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <form>
                                Modal body 
                                <div className="modal-body">

                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label>Name</label>
                                            <input className="form-control" type="text" placeholder="Name" />
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <label>Email Address</label>
                                            <input className="form-control" type="email" placeholder="Email" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label>Password</label>
                                            <input className="form-control" type="password" placeholder="Password" />
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <label>Role</label>
                                            <select ref="role" className="form-control">
                                                <option>Employee</option>
                                                <option>Manager</option>
                                                <option>Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <label>Experiance</label>
                                            <select ref="exp" className="form-control">
                                                <option>0</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                                <option>6</option>
                                                <option>7</option>
                                                <option>8</option>
                                                <option>9</option>
                                                <option>10</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <label>Reporting Manager</label>
                                            <select ref="reportingManager" className="form-control">
                                                <option>Andy</option>
                                                <option>Ankita</option>
                                                <option>Parth</option>
                                                <option>Sp</option>
                                                <option>Ekta</option>
                                                <option>Ravi</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                Modal footer
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary btn-fix" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary btn-fix">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div> */}

        {/* <div className="modal fade" id="empLeave">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Leave Request</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <form>
                                <div className="modal-body">

                                    <div className="form-group">
                                        <label>Leave Type</label>
                                        <select ref="reportingManager" className="form-control">
                                            <option>Casual Leave</option>
                                            <option>Sick Leave</option>

                                        </select>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <div className="form-group" id="date_1">
                                                <label className="font-normal">Start Date </label>
                                                <div className="input-group date">
                                                    <span className="input-group-addon bg-white"><i className="fa fa-calendar"></i></span>
                                                    <input className="form-control" type="date" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <div className="form-group" id="date_2">
                                                <label className="font-normal">End Date </label>
                                                <div className="input-group date">
                                                    <span className="input-group-addon bg-white"><i className="fa fa-calendar"></i></span>
                                                    <input className="form-control" type="date" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Reason</label>
                                        <textarea className="form-control" rows="3"></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary btn-fix" data-dismiss="modal">Cancel</button>
                                    <button className="btn btn-primary btn-fix">Next</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div> */}
        {/* 


                <div className="modal fade" id="apporved">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h4 className="modal-title">Are you sure you want to approve!</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-danger btn-circle"><i className="fa fa-times"></i></button>
                                <button className="btn btn-success btn-circle"><i className="fa fa-check"></i></button>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="modal fade" id="decline">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h4 className="modal-title">Are you sure you want to Decline!</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-danger btn-circle"><i className="fa fa-times"></i></button>
                                <button className="btn btn-success btn-circle"><i className="fa fa-check"></i></button>
                            </div>

                        </div>
                    </div>
                </div> */}

        {/* <div className="modal fade" id="empDelete">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h4 className="modal-title">Are you sure you want to Delete!</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-danger btn-circle"><i className="fa fa-times"></i></button>
                                <button className="btn btn-success btn-circle"><i className="fa fa-check"></i></button>
                            </div>

                        </div>
                    </div>
                </div> */}
        <div className="modal fade" id="userSuccess">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content applyleave">
              <div className="modal-header applyleave">
                <h4 className="modal-title applyleave">
                  User has been registered.
                </h4>
                <button
                  type="button"
                  className="close applyleave"
                  data-dismiss="modal"
                >
                  &times;
                </button>
              </div>

              <div className="modal-footer">
                {/* <button className="btn btn-danger btn-circle"><i className="fa fa-times"></i></button> */}
                <button
                  className="btn btn-success btn-circle"
                  onClick={this.closeModal}
                >
                  <i className="fa fa-check"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="modal fade" id="managcmt">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            Modal Header 
                            <div className="modal-header">
                                <h4 className="modal-title">Add Comment</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <form>
                                Modal body 
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Add Your Comment Here:</label>
                                        <textarea className="form-control" rows="3"></textarea>
                                    </div>
                                </div>
                                Modal footer
                                <div className="modal-footer">
                                    <button className="btn btn-primary btn-fix">Comment</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>*/}
      </div>
    );
  }
  handleModal() {
    let classes = "modal fade ";
    classes += this.state.modal == 0 ? "" : "show";
    return classes;
  }
}
