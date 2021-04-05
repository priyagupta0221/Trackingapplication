import React, { Component } from "react";
import DatePicker from "react-datepicker";
import * as datesUtil from "./dateutils";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import addDays from "date-fns/addDays";
import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../AuthService";
import Calendar from "../TeqCalendar/teqcalendar";
import handleValidation from "../validation";

import { de } from "date-fns/locale";
const Auth = new AuthService();
const calendar = new Calendar();

var dates = [];
class AddHours extends Component {
  constructor(props) {
    super(props);
    this.SubmitRequest = this.SubmitRequest.bind(this);
    this.state = {
      date: new Date(),
      userId: '',
      user: [],
      projetData: [],
      dataProject: [],
      flag: 0,
      description: '',
      halfFlag: false,
      showAlert: false,
      alertMessage: "",
      danger: false,
      items: [],
      count: false,
      Validate: false,
      confirmationMessage: "",
      toastAlert: false,
      projects: [],
      value: "",
      alertMessageProject: "",
      messageAlert: false,
      showAlertProject: false,
      dangerproject: false,
      project_type:"billable"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChangeProjet = this.handleSelectChangeProjet.bind(this);
    this.handleChangeReason = this.handleChangeReason.bind(this);
    this.handleTypeOption= this.handleTypeOption.bind(this);
  }
  handleChange = (date) => {
    const profile = Auth.getProfile();
    this.setState({
      date: date
    });
    var tempDateArr = [];
    var date = date;
  }
  handleSelectChangeProjet = event => {
    this.setState({ selectValue: event.currentTarget.value });
  };
  handleTypeOption = event => {
    this.setState({
      type: event.currentTarget.value
    });
  };
  apiResponse = response => {
    debugger
    if (response.message == "Status Submitted") {
      this.setState({
        alertMessage: "Congratulations your work log updated successfully!",
        toastAlert: true
      });
      var body = document.body;
      body.classList.remove("modal-open");
      document.getElementById("addHours").style.display = "none";
      let modal = document.querySelector(".modal-backdrop");
      modal.style.display = "none";
      this.cancelmodal();
      setTimeout(() => {
        this.handleAlert();
      }, 4000);
    }
  };
  handleAlert = () => {
    this.setState({ showAlert: false, danger: false, toastAlert: false });
    this.cancelForm();
  };
  cancelmodal = () => {
    document.getElementById("addHours").style.display = "none";
    let modal = document.querySelector(".modal-backdrop");
    modal.style.display = "none";
  };
  cancelForm() {
    document.getElementById("addHours").style.display = "none";
    let modal = document.querySelector(".modal-backdrop");
    modal.style.display = "none";
    document.getElementById("emphours").value = '';
    document.getElementById("description").value = '';
   // document.getElementById("alertmessage").value = '';
    this.setState({ showAlert: false });

    // this.setState({
    //   emphours: '', description: '', Validate: false, showAlert: false, danger: false, toastAlert: false});

  }
  handleChangeReason(event) {
    this.setState({
      description: event.target.value
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
  test() {
    const profile = Auth.getProfile();
    const totalExp = profile.experience + profile.teqFocusExp;
    return totalExp < 2
      ? datesUtil.combinedDays()
      : datesUtil.excludeAllSaturdaysAndSundays();
  }
  componentDidMount = () => {
    this.setState({
      projetData: [],
    });
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
          imagePreviewUrl: response.user.imageData.image,
          userId: response.user._id
        });
      }
     
      this.getprojectList(response);
    });};
  
   getprojectList=(response)=>{
  
    if (response.user._id!=''){

      Auth.getEmpWiseProjectList().then(response => {
      
       if (response.projects.length != 0){ 
        

       for (var i = 0; i < response.projects.length; i++) {
          if (this.state.userRole == "Manager"  ||this.state.userRole == "SuperAdmin"||
          this.state.userRole== "Admin"   ) {

            if (response.projects[i].reporting_manger[0] == this.state.userId) {
              this.state.projetData.push(response.projects[i]);

            }

          }
          else{
          for (var j = 0; j < response.projects[i].assigned_user.length; j++) {
            if (response.projects[i].assigned_user[j].userid == this.state.userId) {
              this.state.projetData.push(response.projects[i]);
            }
          }
        }
      }
        this.setState({
          dataProject: this.state.projetData,
          pjname: response.projects,
          selectValue: response.projects[0]._id,
          defaultValue: response.projects[0]._id
        });
  
        // this.setState({
        //   projects: response.projects,
        //   pjname: response.projects,
        //   selectValue: response.projects[0]._id,
        //   defaultValue: response.projects[0]._id
        // });
      }
     });
    };
   }
  hidePreviousMonth = () => {
    var todayDate = new Date()
    var firstDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    return firstDate;
  }
  hideNextMonth = () => {
    // new Date()
    // var todayDate = new Date()
    // var endDate = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);
    // return endDate;
  }
  cancelModal() {
    document.getElementById("hourSuccess").style.display = "none";
    document.getElementById("hourSuccess").style.opacity = 0;
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
  SubmitRequest(event) {
    let formData = {
     projectname: this.refs.projectitem.value,
    log_hours: this.refs.emphours.value,
    task_name : this.refs.description.value,
    project_type:this.refs. project_type.value
    };
    let errors = handleValidation(formData);
    this.setState({ errors: errors });
    if (errors["valid"] == true) {
      
    Auth.addHours(
      this.state.date,
      this.refs.emphours.value,
      this.refs.projectitem.value,
      this.refs.description.value,
      this.refs. project_type.value
      
    ).then(response => {
    //  this.apiResponse(response);
      console.log(response);
      if (response.message == "Status Submitted") {
        this.setState({});
        document.getElementById("hourSuccess").style.display = "block";
        document.getElementById("hourSuccess").style.opacity = 10;
        document.getElementById("addHours").style.display = "none";
        document.getElementById("addHours").style.opacity = 0;
      } else {
        this.setState({
          showAl: true,
          alertMes: "Error Occurs"
        });
      }
    });
   // window.location.reload();
  }
  else {
    this.setState({ errorsdiv: true });
    setTimeout(() => {
      this.setState({ errorsdiv: false });
    }, 4000);
  }}
 

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
    return (
      <div>
        {this.state.toastAlert == true ? (
          <div className="alert alert-success alert-dismissable fade show alertpopup apply-toast row toast-alert-pd">
            <div className="flag__image note__icon">
              <i className="fa fa-check"></i>
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
            <div className="modal fade" id="hourSuccess">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content ">
              <div className="modal-header ">
                <h4 className="modal-title ">
                Congratulations your work log updated successfully!
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
        <div className="modal fade" id="addHours" data-backdrop="static">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content applyleave">
              <div className="modal-header applyleave">
                <h4 className="modal-title applyleave"> Add Hours</h4>
                {this.state.showAlert == true ? (
                  <div className="alertmessage" id="alertmessage">
                    {this.state.alertMessage} !
                  </div>
                ) : (
                    ""
                  )}
                <button
                  type="button"
                  className="close applyleave"
                  data-dismiss="modal"
                  onClick={this.handleAlert}
                >
                  &times;
                </button>
              </div>
              <div>
                <div className="modal-body radio-btn-body">
                  <form className="myform">
                    <div className="row">
                      <div className="col-sm-6 form-group">
                        <div className="form-group" id="date_1">
                          <label className="font-normal">
                            Date<span className="required star symbol">*</span>{" "}
                          </label>
                          <div className="input-group date">
                            <span className="input-group-addon bg-white">
                              <i className="fa fa-calendar"></i>
                            </span>
                            <DatePicker
                              customInput={<CustomInput />}
                              dateFormat="MM/dd/yyyy"
                           //   minDate={
                            //    this.hidePreviousMonth()
                           //   }
                              // maxDate={this.hideNextMonth()}
                              maxDate={new Date()}
                              ref="date"
                              className="form-control date-picker-date"
                              selected={this.state.date}
                              onChange={this.handleChange}
                              excludeDates={this.test()}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 form-group">
                        <label>
                          Enter Hours <span className="star symbol">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Hours"
                          ref="emphours"
                          id="emphours"
                        />
                           {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["log_hours"]}
                        </span>
                      ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>
                        Project List<span className="required star symbol">*</span>
                      </label>                   
                      <select
                        ref="projectitem"
                        className="form-control"
                        value={this.state.selectValue}
                        onChange={this.handleSelectChangeProjet.bind(this)}
                      >
                        <option value="" selected>
                          Choose one project
                        </option>
                        {this.state.dataProject != undefined
                          ? this.state.dataProject.map((item) => (
                              <option key={item._id} value={item._id}>
                                {item.project_name}
                              </option>
                            ))
                          : ""}
                      </select>
                      {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["projectname"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="form-group">
                    <label>
                      Type: <span className="required star symbol">*</span>
                    </label>
                    <select
                      type="text"
                      className="form-control"
                      placeholder="Enter Type"
                      ref="project_type"
                      onChange={this.handleTypeOption.bind(this)}
                    >
                       <option value="" selected>
                          Choose one Type
                        </option>
                      <option value="non billable">Non billable</option>
                      <option value="billable">Billable</option>
                    </select>
                    {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["project_type"]}
                        </span>
                      ) : (
                          ""
                        )}
                  </div>

                    <div className="form-group">
                      <label>
                        Worked on<span className="required star symbol">*</span>
                      </label>
                      <textarea
                        onChange={this.handleChangeReason}
                        className="form-control"
                        ref="description"
                        maxlength="300"
                        rows="3"
                        required
                        id="description"
                      />
                        {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["task_name"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                  </form>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    data-dismiss="modal"
                    onClick={this.handleAlert}
                    aria-label="Close"
                    className="btn btn-danger btn-rounded btn-fix"
                  >
                    Cancel
                </button>
                  <button
                    type="button"
                    disabled={!this.state.Validate}
                    className="btn btn-success btn-rounded btn-fix save"
                    onClick={this.SubmitRequest}
                  >
                    Submit
                </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddHours;
