import React, { Component } from "react";
import AuthService from "../AuthService";
import AddEmployee from "./addemployee";

const Auth = new AuthService();
var map1 = new Map();

export default class EditableTable extends Component {

  constructor(props) {
    super(props);
    this.editEmployeeTable = this.editEmployeeTable.bind(this)
    this.state = {
      userData: [],
      userDataList: [],
      hrArr: [],
      userRole: "",
      userName: "",
      managerList: [],
      teamLeadList: [],
      hrList: [],
      flag: 0,
      alertMessage: "",
      showAlert: false,
    }

  }
  componentDidMount() {

    Auth.getReportingPerson().then(response => {
      if (response.message != "Permission required") {
        this.setState({
          managerList: response.users
          // report_to: response.users[0]._id
        });
      } else {
      }
    });
    Auth.getTeamLeader().then(response => {
      var defaultHRValue = { _id: "", name: "Select any value" };
      if (response.message != "Permission required" && response.users != '') {
        response.users.unshift(defaultHRValue);
        this.setState({
          teamLeadList: response.users,
          // teamlead_name: response.users[0]._id
        });
      } else {
      }
    });

    Auth.getHRPerson().then(response => {
       var defaultHRValue = { _id: "", name: "Select any value" };
      if (response.message != "Permission required" && response.users != '') {
         response.users.unshift(defaultHRValue);
        this.setState({
          hrList: response.users,
         // hr_name: response.users[0]._id
        });
      } else {
      }
    });
    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then(response => {

      this.setState({
        userRole: response.user.role,
        userName: response.user.name
      });
    });
    Auth.getUserList().then(response => {

      debugger// response.users = response.user.slice(0,20)
      for (var i = 0; i < response.users.length; i++) {
        if (this.state.userRole == "HR") {
          if (response.users[i].hr_name == this.state.userName) {
            this.state.hrArr.push(response.users[i]);
          }
        }
      }
      if (this.state.userRole == "HR") {
        this.setState({
          userDataList: this.state.hrArr,
        });
      }
      else {
        this.setState({
          userDataList: response.users,
        });
      }

      console.log("hi hi hi" + this.state.userDataList)
      this.setState({
        userData: this.state.userDataList,
      });
    });
  }
  handleUpdateBulkEmp() {
debugger
    console.log(map1);
    var arr = Array.from(map1.values());
    Auth.BulkUpdateEmpTable(arr).then(response => {

      if (response.message == "Users updated successfully") {
        this.setState({
          showAlert: true,
          alertMessage: response.message,
          danger: false,
          flag: 1
        });
        setTimeout(() => {
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);
        // var x = 200;
        // if(x==200){
        //  this.setState({
        //      flag:1
        //  })
        // }
      }
      else {
        if (response.message == "Users update failed") {
          this.setState({
            showAlert: true,
            alertMessage: response.message,
            danger: true,
            flag: 0
          });
          setTimeout(() => {
            this.setState({ alertMessage: "", showAlert: false });
          }, 4000);
          // var x = 200;
          // if(x==200){
          //  this.setState({
          //      flag:1
          //  })
          // }
        }
      }
    })

  }
  changeExperiance = idx => event => {

    for (var i = 0; i < this.state.userData.length; i++) {
      if (this.state.userData[i]._id == idx) {


        this.state.userData[i].experience = event.target.value;
        this.setState({
          userDataList: this.state.userData,
        })
        map1.set(idx, this.state.userData[i])
      }
    }
  }
  handleCasualBalance = idx => event => {

    for (var i = 0; i < this.state.userData.length; i++) {
      if (this.state.userData[i]._id == idx) {


        this.state.userData[i].casual_balance = event.target.value;
        this.setState({
          userDataList: this.state.userData
        })
        map1.set(idx, this.state.userData[i])
      }
    }
  }
  handleSickBalance = idx => event => {
    for (var i = 0; i < this.state.userData.length; i++) {
      if (this.state.userData[i]._id == idx) {


        this.state.userData[i].sick_balance = event.target.value;
        this.setState({
          userDataList: this.state.userData
        })
        map1.set(idx, this.state.userData[i])
      }
    }
  }
  handleWFHbalance = idx => event => {
    for (var i = 0; i < this.state.userData.length; i++) {
      if (this.state.userData[i]._id == idx) {


        this.state.userData[i].wfh_balance = event.target.value;
        this.setState({
          userDataList: this.state.userData
        })
        map1.set(idx, this.state.userData[i])
      }
    }
  }
  handleRoleChange = idx => event => {

    for (var i = 0; i < this.state.userData.length; i++) {
      if (this.state.userData[i]._id == idx) {


        this.state.userData[i].role = event.target.value;
        this.setState({
          userDataList: this.state.userData
        })
        map1.set(idx, this.state.userData[i])
      }
    }

  }
  handlelocation = idx => event => {
    for (var i = 0; i < this.state.userData.length; i++) {
      if (this.state.userData[i]._id == idx) {


        this.state.userData[i].location = event.target.value;
        this.setState({
          userDataList: this.state.userData
        })
        map1.set(idx, this.state.userData[i])
      }
    }
  }
  handledesignation = idx => event => {
    debugger
    for (var i = 0; i < this.state.userData.length; i++) {
      if (this.state.userData[i]._id == idx) {


        this.state.userData[i].designation = event.target.value;
        this.setState({
          userDataList: this.state.userData
        })
        map1.set(idx, this.state.userData[i])
      }
    }
  }
  handleskills = idx => event => {
      debugger
    for (var i = 0; i < this.state.userData.length; i++) {
      if (this.state.userData[i]._id == idx) {


        this.state.userData[i].skills = event.target.value;
        this.setState({
          userDataList: this.state.userData
        })
        map1.set(idx, this.state.userData[i])
      }
    }
  }

  handleChangeReportingManager = idx => event => {

    for (var i = 0; i < this.state.userData.length; i++) {
      if (this.state.userData[i]._id == idx) {


        this.state.userData[i].report_to = event.target.value;
        this.setState({
          userDataList: this.state.userData
        })
        map1.set(idx, this.state.userData[i])
      }
    }
  }
  handleChangeHR = idx => event => {

    for (var i = 0; i < this.state.userData.length; i++) {


      if (this.state.userData[i]._id == idx && this.state.userData[i].role == "HR") {


      }
      else if (this.state.userData[i]._id == idx) {


        this.state.userData[i].hr_name = event.target.value;
        this.setState({
          userDataList: this.state.userData
        })
        map1.set(idx, this.state.userData[i])
      }
    }
  }

  handleCancel() {
    this.setState({
      flag: 1
    })
  }

  handleChangeTeamLead = idx => event => {

    for (var i = 0; i < this.state.userData.length; i++) {
      if (this.state.userData[i]._id == idx && this.state.userData[i].role == "HR") {
      }
      else
      if (this.state.userData[i]._id == idx) {
        this.state.userData[i].teamlead_name = event.target.value;
        this.setState({
          userDataList: this.state.userData
        })
        map1.set(idx, this.state.userData[i])
      }
    }
  }
  editEmployeeTable() {

  }
  render() {
    if (this.state.flag == 0) {


      return (


        <div className="ibox">
          <div className="page-content fade-in-up">
            {this.state.showAlert == true ? (
              <div className="alert alert-success alert-dismissable fade show alertpopup apply-toast row toast-alert-pd">
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
          </div>
          <div className="ibox-head box-emp-mang">
            <div className="ibox-title"> Employee List</div>
            <div><button className="btn btn-outline-danger btn-rounded addemployee-btn" onClick={() =>
              this.handleCancel()}>Cancel</button> &nbsp;
                    <button className="btn btn-outline-info btn-rounded addemployee-btn" onClick={() =>
                this.handleUpdateBulkEmp()}>Submit</button></div>
          </div>

          <div className="ibox-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th className="tbl-date">Exp before Teq</th>
                    <th>Manager</th>
                    <th className="tbl-date">Team Leader</th>
                    <th >Role</th>
                    <th className="tbl-date">Designation</th>
                    <th className="tbl-date">Skill </th>
                 
                  </tr>
                </thead>

                <tbody>
                  {this.state.userDataList.map((item, index) => (
                    <tr key={item._id}>

                      <td className="td tbl-date edit-tbl input td tbl-date 
                                               edit-tbl select td tbl-date edit-tbl">
                        {index}
                      </td>
                      <td className="td tbl-date edit-tbl input td tbl-date 
                                               edit-tbl select td tbl-date edit-tbl form-group">{item.name}</td>
                      <td className="td tbl-date edit-tbl input td tbl-date 
                                               edit-tbl select td tbl-date edit-tbl">
                        <input type="text"
                          ref="expBteq"
                          value={item.experience}
                          onChange={this.changeExperiance(item._id)}

                        ></input>
                      </td>

                {/*     <td className="td tbl-date edit-tbl input td tbl-date 
                                               edit-tbl select td tbl-date edit-tbl">
                        <select
                          ref="hr" value={item.hr_name}
                          className="form-control textboxsize"
                          onChange={this.handleChangeHR(item._id)}
                        >
                          {this.state.hrList != undefined
                            ? this.state.hrList.map(itemmanager => (
                              <option key={itemmanager._id} value={itemmanager.hr_name}>
                                {itemmanager.name}
                              </option>
                            ))
                            : ""}
                        </select>
                            </td> */}
                      <td className="td tbl-date edit-tbl input td tbl-date 
                                               edit-tbl select td tbl-date edit-tbl">
                        <select
                          ref="reportingManager"
                          className="form-control textboxsize"
                          value={item.report_to}
                          onChange={this.handleChangeReportingManager(item._id)}
                        >
                          {this.state.managerList != undefined
                            ? this.state.managerList.map(itemmanager => (
                              <option key={itemmanager._id} value={itemmanager.report_to}>
                                {itemmanager.name}
                              </option>
                            ))
                            : ""}
                        </select>
                      </td>
                      <td className="td tbl-date edit-tbl input td tbl-date 
                                               edit-tbl select td tbl-date edit-tbl">
                        <select
                          ref="teamlead"
                          className="form-control textboxsize"
                          value={item.teamlead_name}
                          onChange={this.handleChangeTeamLead(item._id)}
                        >
                          {this.state.teamLeadList != undefined
                            ? this.state.teamLeadList.map(itemmanager => (
                              <option key={itemmanager._id} value={itemmanager.teamlead_name}>
                                {itemmanager.name}
                              </option>
                            ))
                            : ""}
                        </select>
                      </td>
                      <td className="td tbl-date edit-tbl input td tbl-date 
                                               edit-tbl select td tbl-date edit-tbl">
                        <select
                          ref="role"
                          value={item.role}
                          className="form-control textboxsize"
                          onChange={this.handleRoleChange(item._id)}
                        >
                          <option value="Employee">Employee</option>
                          <option value="TeamLead">TeamLead</option>
                          <option value="Manager">Manager</option>
                          <option value="HR">HR</option>
                          <option value="Admin">Admin</option>

                        </select></td>
                   {/*   <td className="td tbl-date edit-tbl input td tbl-date 
                                               edit-tbl select td tbl-date edit-tbl">
                        <select ref="location"
                          value={item.location}
                          onChange={this.handlelocation(item._id)}
                          className="form-control textboxsize">

                          <option value="Ranchi">Ranchi</option>
                          <option value="Pune">Pune</option>
                          <option value="Canada">Canada</option>

                        </select>
                            </td> */}
                      <td className="td tbl-date edit-tbl input td tbl-date 
                                               edit-tbl select td tbl-date edit-tbl">
                       <select ref="location"
                          value={item.designation}
                          onChange={this.handledesignation(item._id)}
                          className="form-control textboxsize">

                          <option value="Software Developer"> Developer</option>
                          <option value="Tester">Tester</option>
                          <option value="Manager">Manager</option>
                          <option value="HR">HR</option>
                        

                        </select>
                      </td>
                      <td className="td tbl-date edit-tbl input td tbl-date 
                                               edit-tbl select td tbl-date edit-tbl">
                        <input type="text"
                          ref="sick"
                          value={item.skills}
                          onChange={this.handleskills(item._id)}

                        ></input>
                      </td>
                     

                    </tr>
                  ))}
                </tbody>


              </table>

            </div>
          </div>
        </div>
      );
    }
    if (this.state.flag == 1) {
      return (
        <div className="ibox">
          <AddEmployee></AddEmployee>
        </div>
      );


    }
  }


}