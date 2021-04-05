import React, { Component } from "react";
import DatePicker from "react-datepicker";
import * as datesUtil from "./dateutils";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import addDays from "date-fns/addDays";
import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../AuthService";
import { de } from "date-fns/locale";
var newArray = [];
var testArray = [];
var dates = [];
var dateBackup = [];
var jsonObj = {};
var rv = {};
var DOB = null;
var expInTeq = 0;
var compoOffLeave;
const Auth = new AuthService();
class ApplyLeave extends Component {
  constructor(props) {
    super(props);
    this.SubmitRequest = this.SubmitRequest.bind(this);
    this.confirmSubmission = this.confirmSubmission.bind(this);
    this.HalfDayTest = this.HalfDayTest.bind(this);
    this.FullDay = this.FullDay.bind(this);
    this.cancel = this.cancel.bind(this);
    this.cancelForm = this.cancelForm.bind(this);
    this.addList = this.addList.bind(this);
    this.handleChangeReason = this.handleChangeReason.bind(this);
    this.handleLeaveType = this.handleLeaveType.bind(this);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      user: [],
      noOfDays: 0,
      dayType: null,
      fullDay: 0,
      halfDay: 0,
      flag: 0,
      leavesDate: [],
      cats: [],
      choice: true,
      reason: '',
      halfFlag: false,
      showAlert: false,
      alertMessage: "",
      danger: false,
      items: [],
      submitLeave: 0,
      user1: [],
      count: false,
      Validate: false,
      leavebalance: [],
      confirmationMessage: "",
      toastAlert: false,
      leaveType: '',
      birthdayLeave: 1,
      selectedOption: '',
      selectedOptionData: '',
      selectedOptionApply: "leav"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.changeLeaveType = this.changeLeaveType.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleOptionChangeTxt = this.handleOptionChangeTxt.bind(this);
    this.handleOptionChangeApplyLeave = this.handleOptionChangeApplyLeave.bind(this);
    this.handleOptionChangeApplyWfh = this.handleOptionChangeApplyWfh.bind(this);
  }



  confirmSubmission = event => {
 
    if (
      this.state.leavebalance.sick_balance <= 0 &&
      this.refs.leaveType.value == "Sick Leave"
    ) {
      document.getElementById("tableDiv").style.display = "none";
      document.getElementById("confirmSubmission").style.display = "block";
      document.getElementById("confirmSubmission").style.opacity = 10;
    } else if (
      this.state.leavebalance.casual_balance <= 0 &&
      this.refs.leaveType.value == "Casual Leave"
    ) {
      document.getElementById("tableDiv").style.display = "none";
      document.getElementById("confirmSubmission").style.display = "block";
      document.getElementById("confirmSubmission").style.opacity = 10;
    }
    else {
      this.SubmitRequest();
    }
  };
  cancelSubmission = () => {
    document.getElementById("tableDiv").style.display = "block";
    document.getElementById("confirmSubmission").style.display = "none";
    document.getElementById("confirmSubmission").style.opacity = 0;
  };
  approveSubmission = () => {
    document.getElementById("tableDiv").style.display = "block";
    document.getElementById("confirmSubmission").style.display = "none";
    document.getElementById("confirmSubmission").style.opacity = 0;
    this.SubmitRequest();
  };
  SubmitRequest = event => {

    console.log(this.state.cats);
    console.log(this.refs.reason.value);
    var numofLeaves = 0;
    for (var i = 0; i < this.state.cats.length; i++) {
      numofLeaves = numofLeaves + this.state.cats[i].number_of_leaves;
    }
    console.log(numofLeaves);
    if (numofLeaves > 10) {
      this.setState({
        alertMessage: "You can not take leave more than 10 days!",
        showAlert: true,
        danger: true
      });
      this.state.reason = "";
    }else if (this.state.leavebalance.compoOff_balance < numofLeaves &&
      this.refs.leaveType.value == "CompoOff Leave") {
      this.setState({
        alertMessage: "You can not take leave more than " + this.state.leavebalance.compoOff_balance ,
        showAlert: true,
        danger: true
      });
      this.state.reason = "";
    } else {
      if (this.state.startDate > this.state.endDate) {
        this.setState({
          alertMessage: "Start date should be smaller than end date",
          showAlert: true,
          danger: true
        });
      } else {
        Auth.applyLeave(
          this.state.cats,
          this.refs.leaveType.value,
          this.refs.reason.value,
          this.state.startDate,
          this.state.endDate,
          numofLeaves
        ).then(response => {
          this.apiResponse(response);
          if (response.message != "Leave applied successfully") {
            this.setState({
              alertMessage: response.message,
              showAlert: true,
              danger: true
            });
          }
        });
      }
    }
  };

  apiResponse = response => {
    if (response.message == "Leave applied successfully") {
      this.setState({
        alertMessage: "Congratulations your Leave applied successfully!",
        toastAlert: true
      });
      var body = document.body;
      body.classList.remove("modal-open");

      document.getElementById("empLeave").style.display = "none";
      let modal = document.querySelector(".modal-backdrop");
      modal.style.display = "none";
      this.cancelmodal();
      setTimeout(() => {
        this.handleAlert();
      }, 4000);
    }
  };
  cancelmodal = () => {
    document.getElementById("empLeave").style.display = "none";
    let modal = document.querySelector(".modal-backdrop");
    modal.style.display = "none";
  };

  handleAlert = () => {
    if (document.getElementById("tableDiv").style.display == "block") {
      document.getElementById("tableDiv").style.display = "none";
      document.getElementById("formDiv").style.display = "block";
    }
    this.setState({ showAlert: false, danger: false, toastAlert: false });
    this.cancelForm();
  };
  HalfDayTest = event => {
    this.setState({
      halfDay: 1,
      flag: 1
    });
  };
  FullDay = event => {
    this.setState({
      fullDay: 1,
      flag: 1
    });
  };
  cancel() {
    this.setState({
      halfDay: 0,
      flag: 0,
      fullDay: 0,
      leavesDate: [],
      cats: [],
      dates: [],
      tempDateArr: [],
      testArray: [],
      showAlert: false,
      danger: false
    });

    if (document.getElementById("tableDiv")) {
      if (document.getElementById("tableDiv").style.display == "none") {
        document.getElementById("tableDiv").style.display = "block";
        document.getElementById("formDiv").style.display = "none";
      } else {
        document.getElementById("tableDiv").style.display = "none";
        document.getElementById("formDiv").style.display = "block";
      }
    }
  }
  cancelForm() {
    document.getElementById("sickleave").style.display = "none";
    document.getElementById("compoOff").style.display = "none";
    document.getElementById("casualleave").style.display = "block";
    document.getElementById("reason").readOnly = true;
    document.getElementById("reason").value = "";

    this.setState({
      selectedOption: false,
      selectedOptionApply: true,
      startDate: new Date(),
      endDate: new Date(),
      reason: null,
      Validate: false,
      showAlert: false, danger: false, toastAlert: false
    });
    dates = [];
    this.refs.reason.value = "";
    document.getElementById("myform").reset();
  }
  handleChangeReason(event) {
    this.setState({
      reason: event.target.value
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
  handleLeaveType(event) {

    this.setState({
      leaveType: event.target.value
    });
  }
  test() {
    const profile = Auth.getProfile();
    const totalExp = profile.experience + profile.teqFocusExp;
    return totalExp < 2
      ? datesUtil.combinedDays()
      : datesUtil.excludeAllSaturdaysAndSundays();
  }
  handleChange = (date) => {
    const profile = Auth.getProfile();
    this.setState({
      startDate: date
    });

    if (date > this.state.endDate) {
      dates = [];
      this.setState({
        alertMessage: "**Start date must be smaller than end date",
        showAlert: true,
        danger: true
      });
    } else {
      this.setState({
        showAlert: false
      });
    }
    if (this.state.halfDay == 1) {
      this.setState({
        noOfDays: 0.5
      });
      console.log(this.state.noOfDays);
    } else {
    }
    this.setState({
      user: profile
    });
    var tempDateArr = [];
    var startDate = date;
    var endDate = this.state.endDate;

    this.createLeaveDates(endDate, startDate);
    if (this.refs.leaveType.value == "Birthday Leave") {

      if (date <= this.state.endDate) {
        this.setState({
          showAlert: false,
          danger: false
        });
      }
      else {
        this.setState({
          alertMessage: "**Start date must be similar to end date",
          showAlert: true,
          danger: true
        });
      }
    }
    if (this.refs.leaveType.value == "Privileged Leave") {
      var todayDate = new Date();
      var diff = ((date - todayDate) / (1000 * 60 * 60 * 24))
      if (diff >= 21) {
        this.setState({
          showAlert: false,
          danger: false
        });
      }
      else {
        this.setState({
          alertMessage: "**You have to take this leave before 21 days",
          showAlert: true,
          danger: true
        });
      }
    }
    
    
  }

  createLeaveDates(endDate, startDate) {
    var tempDateArr = [];
    var startDate = startDate;
    var endDate = endDate;
    var differenceInDays = differenceInCalendarDays(endDate, startDate);
    var totalExp = this.state.user.experience + this.state.user.teqFocusExp;
    var isExpLessThan2 = totalExp < 2 ? true : false;
    var combinedDaysWithEvenSaturdaysAndSundays = datesUtil.combinedDaysWithEvenSaturdaysAndSundays();
    for (var i = 0; i <= combinedDaysWithEvenSaturdaysAndSundays.length; i++) {
      if (
        combinedDaysWithEvenSaturdaysAndSundays[i] > startDate &&
        combinedDaysWithEvenSaturdaysAndSundays[i] < endDate
      ) {
        if (combinedDaysWithEvenSaturdaysAndSundays[i] !== undefined)
          combinedDaysWithEvenSaturdaysAndSundays[
            i
          ] = combinedDaysWithEvenSaturdaysAndSundays[i]
            .toString()
            .substring(0, 10);
      }
    }

    var combinedDaysWithexcludeAllSaturdaysAndSundays = datesUtil.combinedDaysWithexcludeAllSaturdaysAndSundays();
    for (
      var i = 0;
      i <= combinedDaysWithexcludeAllSaturdaysAndSundays.length;
      i++
    ) {
      if (
        combinedDaysWithexcludeAllSaturdaysAndSundays[i] > startDate &&
        combinedDaysWithexcludeAllSaturdaysAndSundays[i] < endDate
      ) {
        if (combinedDaysWithexcludeAllSaturdaysAndSundays[i] !== undefined)
          combinedDaysWithexcludeAllSaturdaysAndSundays[
            i
          ] = combinedDaysWithexcludeAllSaturdaysAndSundays[i]
            .toString()
            .substring(0, 10);
      }
    }

    for (var i = 0; i <= differenceInDays; i++) {
      var tempDate = addDays(startDate, i);
      var dateStr = tempDate.toString().substring(0, 10);

      if (isExpLessThan2) {
        if (!combinedDaysWithEvenSaturdaysAndSundays.includes(dateStr))
          tempDateArr.push(tempDate);
      } else {
        if (!combinedDaysWithexcludeAllSaturdaysAndSundays.includes(dateStr))
          tempDateArr.push(tempDate);
      }
    }

    dates = tempDateArr;
    return dates;
  }
  handleChangeEnd = (date) => {
    const profile = Auth.getProfile();
    if (this.state.startDate > date) {
      this.setState({
        alertMessage: "**Start date must be smaller than end date",
        showAlert: true,
        danger: true
      });
    } else if (this.state.startDate <= date) {
      this.setState({
        showAlert: false
      });
    }
    this.setState({
      endDate: date,
      user: profile
    });
    var tempDateArr = [];
    var startDate = this.state.startDate;
    var endDate = date;
    this.createLeaveDates(endDate, startDate);
    if (this.refs.leaveType.value == "Birthday Leave") {
      if (date <= this.state.startDate) {
        this.setState({
          showAlert: false,
          danger: false,
          Validate:true
        });
      }
      else {
        this.setState({
          alertMessage: "**End date must be similar to start date",
          showAlert: true,
          danger: true
        });
      }
    }
    if (this.refs.leaveType.value == "Privileged Leave") {
      var todayDate = new Date();
      var diff = ((date - todayDate) / (1000 * 60 * 60 * 24))
      if (diff >= 21) {
        this.setState({
          showAlert: false,
          danger: false
        });
      }
      else {
        this.setState({
          alertMessage: "**You have to take this leave before 21 days",
          showAlert: true,
          danger: true
        });
      }
    }
  
  }
  handleShareholderNameChange = idx => event => {
    if (idx == 0) {
      this.setState({
        halfFlag: true
      });
    }
    var tempArr = this.state.cats;
    tempArr[idx].leave_type = event.target.value;
    var numOfLeaves = event.target.value === "Full Day" ? 1 : 0.5;
    tempArr[idx].number_of_leaves = numOfLeaves;
    this.setState({
      cats: tempArr
    });
  };
  addList = event => {
    var stdate = this.state.startDate;
    var endate = this.state.endDate;
    var dateArray = this.createLeaveDates(endate, stdate);
    var data = new Date();
    testArray = [];
    for (var i = 0; i < dateArray.length; ++i) {
      var startdateFormat = dateArray[i];
      newArray[i] = startdateFormat.toString().substring(0, 15);
      var temp = {
        leave_date: startdateFormat.toString().substring(0, 15),
        leave_type: "Full Day",
        number_of_leaves: 1
      };
      testArray.push(temp);
    }
    this.setState({
      leavesDate: newArray,
      cats: testArray,
      halfDay: 1
    });
    if (this.refs.leaveType.value == "Birthday Leave") {
      var sdate = this.state.startDate;
      var edate = this.state.endDate;
      var dob = DOB;
      var sdatemonth = sdate.getMonth();
      var sdateday = sdate.getDate();
      var edatemonth = edate.getMonth();
      var edateday = edate.getDate();
      var dobmonth = dob.getMonth();
      var dobday = dob.getDate();
      if ((sdatemonth == dobmonth && edatemonth == dobmonth) && (sdateday == dobday && edateday == dobday)) {
        console.log(this.state.cats + "hi");
        var x = document.getElementById("formDiv");
        var y = document.getElementById("tableDiv");
        if (document.getElementById("formDiv")) {
          if (document.getElementById("formDiv").style.display == "none") {
            document.getElementById("formDiv").style.display = "block";
            document.getElementById("tableDiv").style.display = "none";
          } else {
            document.getElementById("formDiv").style.display = "none";
            document.getElementById("tableDiv").style.display = "block";
          }
        }
      }
      else {
        this.setState({
          alertMessage: "Date must be similar to your birth date",
          showAlert: true,
          danger: false
        })
      }
    }
    else if (this.refs.leaveType.value == "Privileged Leave") {
      var todayDate = new Date();
      var firstDate = this.state.startDate;
      var lastDate = this.state.endDate;
      var diff1 = ((firstDate - todayDate) / (1000 * 60 * 60 * 24));
      var diff2 = ((lastDate - todayDate) / (1000 * 60 * 60 * 24));
      // var diff3 = ((lastDate - firstDate) / (1000 * 60 * 60 * 24));
      if ((diff1 >= 21 && diff2 >= 21)) {
        if (event.length <= 5) {
          console.log(this.state.cats + "hi");
          var x = document.getElementById("formDiv");
          var y = document.getElementById("tableDiv");
          if (document.getElementById("formDiv")) {
            if (document.getElementById("formDiv").style.display == "none") {
              document.getElementById("formDiv").style.display = "block";
              document.getElementById("tableDiv").style.display = "none";
            } else {
              document.getElementById("formDiv").style.display = "none";
              document.getElementById("tableDiv").style.display = "block";
            }
          }
        }
        else {
          this.setState({
            alertMessage: "You can only take this leave maximum 5 days",
            showAlert: true,
            danger: false
          })
        }
      }
      else {
        this.setState({
          alertMessage: "You have to take this leave before 21 days",
          showAlert: true,
          danger: false
        })
      }
    
    }
   
    else {
      console.log(this.state.cats + "hi");
      var x = document.getElementById("formDiv");
      var y = document.getElementById("tableDiv");
      if (document.getElementById("formDiv")) {
        if (document.getElementById("formDiv").style.display == "none") {
          document.getElementById("formDiv").style.display = "block";
          document.getElementById("tableDiv").style.display = "none";
        } else {
          document.getElementById("formDiv").style.display = "none";
          document.getElementById("tableDiv").style.display = "block";
        }
      }
    }
  };

  componentDidMount = () => {
    document.getElementById("applyLeaveRequest").style.display = "block";
    document.getElementById("applyWfhRequest").style.display = "none";
    document.getElementById("compoOff").style.display = "none";

    document.getElementById("reason").readOnly = true;
    document.getElementById("reason").value = "";
    var x = Auth.getProfile();
    if (x.birthday != undefined) {
      var dateString = x.birthday.split("-");
      var raisedOn = dateString[1] + '/' + dateString[0] + '/' + dateString[2];
      x.birthday = raisedOn;
    }
    DOB = new Date(x.birthday);
    expInTeq = x.teqFocusExp;
    Auth.getLeavesBalance().then(response => {
      compoOffLeave = response.balance[0].compoOff_balance
      if (response.balance.length > 0) {
        this.setState({
          leavebalance: response.balance[0],
          birthdayLeave: response.balance[0].birthday_balance
        });
      }
    });
    // document.getElementById("reason-other").style.display="none";
  };
  handleOptionChange = (event) => {
    this.setState({
      selectedOption: event.target.value,
      Validate: true
    });
    // document.getElementById("reason-other").style.display="none";
    document.getElementById("read-reason").style.display = "block";

    document.getElementById("reason").readOnly = true;
    document.getElementById("reason").value = event.target.value;


  }
  handleOptionChangeApplyWfh = (event) => {

    this.setState({
      selectedOptionApply: event.target.value,
      showAlert: false
    });
    document.getElementById("applyWfhRequest").style.display = "block";
    document.getElementById("applyLeaveRequest").style.display = "none";

  }
  handleOptionChangeApplyLeave = (event) => {
    
    this.setState({
      selectedOptionApply: event.target.value,
      showAlert: false
    });
    document.getElementById("applyLeaveRequest").style.display = "block";
    document.getElementById("applyWfhRequest").style.display = "none";
  }
  hidePreviousMonth = () => {
    var todayDate = new Date()
    var firstDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    return firstDate;
  }
  hideNextMonth = () => {
    var todayDate = new Date()
    var endDate = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);
    return endDate;
  }


  changeLeaveType = (event) => {
    if (this.refs.leaveType.value == "Sick Leave") {
      this.setState({
        selectedOption: event.target.value,
        Validate: false,
        showAlert: false
      });
      document.getElementById("sickleave").style.display = "block";
      document.getElementById("casualleave").style.display = "none";
      document.getElementById("compoOff").style.display = "none";
      // document.getElementById("reasonBox").style.display = "none"; 
      document.getElementById("reason").readOnly = true;
      document.getElementById("reason").value = "";
      // document.getElementById("myform").reset();
 

    } else if (this.refs.leaveType.value == "Casual Leave") {
      
      this.setState({
        selectedOption: event.target.value,
        Validate: false,
        showAlert: false
      });
      document.getElementById("compoOff").style.display = "none";
      document.getElementById("sickleave").style.display = "none";
      document.getElementById("casualleave").style.display = "block";

      document.getElementById("reason").readOnly = true;
      document.getElementById("reason").value = "";
      // document.getElementById("myform").reset();
 
    }
    else if (this.refs.leaveType.value == "Birthday Leave") {
    
      this.setState({
        selectedOption: event.target.value,
        Validate: false,
        showAlert: false
      });
      
      document.getElementById("sickleave").style.display = "none";
      document.getElementById("casualleave").style.display = "none";
      document.getElementById("compoOff").style.display = "none";
      document.getElementById("reason").readOnly = true;
      document.getElementById("reason").value = "Birthday";
      document.getElementById("read-reason").style.display = "none";
      
      // document.getElementById("myform").reset();
    } else if (this.refs.leaveType.value == "Privileged Leave") {
      this.setState({
        selectedOption: event.target.value,
        Validate: false,
        showAlert: false
      });
      document.getElementById("sickleave").style.display = "none";
      document.getElementById("casualleave").style.display = "none";
      document.getElementById("compoOff").style.display = "none";
      document.getElementById("reason").readOnly = false;
      document.getElementById("reason").value = "";
      // document.getElementById("myform").reset();
      
    }
    else if (this.refs.leaveType.value == "CompoOff Leave") {
      this.setState({
        selectedOption: event.target.value,
        Validate: false,
        showAlert: false
      });
      document.getElementById("compoOff").style.display = "block";
      document.getElementById("sickleave").style.display = "none";
      document.getElementById("casualleave").style.display = "none";
      document.getElementById("reason").readOnly = true;
      document.getElementById("reason").value = "";
      // document.getElementById("myform").reset();
      
    }
  }
  handleOptionChangeTxt = (event) => {

    document.getElementById("reason").readOnly = false;
    this.setState({
      selectedOption: event.target.value,
      Validate: false
    });
    document.getElementById("read-reason").style.display = "block";
    document.getElementById("reason").value = "";
    // document.getElementById("reason").empty();
    // document.getElementById("reason-other").style.display="block";
  }
  handleSubmit = () => {
    
    var startDate = this.state.startDate;
    var reason = this.refs.reasonwfh.value;
    var endDate = this.state.endDate;


    var dates_durations = this.createLeaveDates( endDate, startDate)
    var numberOfDays = dates_durations.length;
    
    Auth.applywfh(startDate, endDate, reason, numberOfDays, dates_durations).then(response => {
      console.log(response);
      if (response.message == "WFH request applied successfully") {
        this.setState({
          alertMessage: "Request Submitted Successfully",
          toastAlert: true,
          danger: false
        });
        this.cancelmodal();
        setTimeout(() => {
          this.setState({ alertMessage: "", toastAlert: false });
        }, 4000);
        this.refs.reason.value = ""
      } else {
        this.setState({
          alertMessage: response.message,
          showAlert: true
        });
      }
    });
  };

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
        <div className="modal fade confirmLeave" id="confirmSubmission">
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
                  <p className="text-center mt-txt">
                    You want to apply for this leave <br />
                    as this leave will be treated as Unpaid leave
                  </p>
                </div>
              </div>
              <div className="modal-footer appr-center">
                <div>
                  <button
                    className="btn btn-outline-danger"
                    onClick={this.cancelSubmission}
                  >
                    <i className="fa fa-times"></i> No
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-outline-success"
                    data-dismiss="modal"
                    onClick={this.approveSubmission}
                  >
                    <i className="fa fa-check"></i> Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="empLeave" data-backdrop="static">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content applyleave">
              <div className="modal-header applyleave">
                <h4 className="modal-title applyleave"> Request</h4>
                {this.state.showAlert == true ? (
                  <div className="alertmessage">
                    {this.state.alertMessage} !
                  </div>
                ) : (
                    ""
                  )}
                {compoOffLeave <= 0 && this.refs.leaveType.value == "CompoOff Leave" ? (
                  <div className="alertmessage">
                    **You are not eligible for Comp Off !
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
              <div id="Applyrequest">
                <div className="modal-body radio-btn-body">
                  <form>
                    <div className="form-group">
                      <label className="ui-radio ui-radio-inline ui-radio-info">
                        <input type="radio" name="apply" checked={this.state.selectedOptionApply === 'leav'}
                          onChange={this.handleOptionChangeApplyLeave} value="leav" />
                        <span className="input-span" ></span>Leave </label>
                      <label className="ui-radio ui-radio-inline ui-radio-info">
                        <input type="radio" name="apply"
                          onChange={this.handleOptionChangeApplyWfh} value="wfh" checked={this.state.selectedOptionApply === 'wfh'} />
                        <span className="input-span"></span>WFH </label>
                    </div>
                  </form>
                </div>
              </div>
              <div id="applyWfhRequest">
                <div className="modal-body radio-btn-body">
                  <from className="workhome">
                    <div className="row">
                      <div className="col-sm-6 form-group">
                        <div className="form-group" id="date_1">
                          <label className="font-normal">
                            Start Date<span className="required">*</span>{" "}
                          </label>
                          <div className="input-group date">
                            <span className="input-group-addon bg-white">
                              <i className="fa fa-calendar"></i>
                            </span>
                            <DatePicker
                              customInput={<CustomInput />}
                              dateFormat="MM/dd/yyyy"
                              minDate={
                                this.hidePreviousMonth()
                              }
                              maxDate={this.hideNextMonth()}
                              ref="startdate"
                              className="form-control date-picker-date"
                              selected={this.state.startDate}
                              onChange={this.handleChange}
                              excludeDates={this.test()}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 form-group">
                        <div className="form-group" id="date_2">
                          <label className="font-normal">
                            End Date <span className="required">*</span>
                          </label>
                          <div className="input-group date">
                            <span className="input-group-addon bg-white">
                              <i className="fa fa-calendar"></i>
                            </span>
                            <DatePicker
                              customInput={<CustomInput />}
                              minDate={
                                this.hidePreviousMonth()
                              }
                              maxDate={this.hideNextMonth()}
                              dateFormat="MM/dd/yyyy"
                              ref="startdate"
                              className="form-control date-picker-date"
                              selected={this.state.endDate}
                              onChange={this.handleChangeEnd}
                              excludeDates={this.test()}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>
                        Reason<span className="required">*</span>
                      </label>
                      <textarea
                        onChange={this.handleChangeReason}
                        className="form-control"
                        ref="reasonwfh"
                        maxlength="300"
                        rows="3"
                        required
                      />
                    </div>
                  </from>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    data-dismiss="modal"
                    onClick={this.cancelForm}
                    className="btn btn-danger btn-rounded btn-fix"
                  >
                    Cancel
                </button>
                  <button
                    type="button"
                    disabled={!this.state.Validate}
                    className="btn btn-success btn-rounded btn-fix save"
                    onClick={this.handleSubmit}
                  >
                    Submit
                </button>
                </div>

              </div>
              <div id="applyLeaveRequest">
                <div id="formDiv">
                  <form id="myform">
                    <div className="modal-body apply-leave-body">
                      <div className="form-group">
                        <label>
                          Leave Type<span className="required">*</span>
                        </label>
                        <select ref="leaveType" className="form-control" onChange={this.changeLeaveType}>
                          <option value="Casual Leave">Casual Leave</option>
                          <option value="Sick Leave">Sick Leave</option>
                          <option value="CompoOff Leave">Comp Off</option>
                          {this.state.birthdayLeave == 1 ? (<option value="Birthday Leave">Birthday Leave</option>) : ("")}
                          {(expInTeq >= 3 && this.state.leavebalance.privileged_approved == 0) && this.state.leavebalance.privileged_pending == 0 ? (<option value="Privileged Leave">Privileged  Leave</option>) : ("")}
                        </select>
                      </div>
                      <div className="row">
                        <div className="col-sm-6 form-group">
                          <div className="form-group" id="date_1">
                            <label className="font-normal">
                              Start Date<span className="required">*</span>{" "}
                            </label>
                            <div className="input-group date">
                              <span className="input-group-addon bg-white">
                                <i className="fa fa-calendar"></i>
                              </span>
                              <DatePicker
                                customInput={<CustomInput />}
                                dateFormat="MM/dd/yyyy"
                                minDate={
                                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                                }
                                maxDate={new Date(+new Date() + 8035200000)}
                                ref="startdate"
                                className="form-control date-picker-date"
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                excludeDates={this.test()}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 form-group">
                          <div className="form-group" id="date_2">
                            <label className="font-normal">
                              End Date <span className="required">*</span>
                            </label>
                            <div className="input-group date">
                              <span className="input-group-addon bg-white">
                                <i className="fa fa-calendar"></i>
                              </span>
                              <DatePicker
                                customInput={<CustomInput />}
                                dateFormat="MM/dd/yyyy"
                                minDate={this.state.startDate}
                                maxDate={new Date(+new Date() + 8035200000)}
                                ref="startdate"
                                className="form-control date-picker-date"
                                selected={this.state.endDate}
                                onChange={this.handleChangeEnd}
                                onClick={this.handleClickDate}
                                excludeDates={this.test()}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="sickleave">
                        <div className="form-group">
                          <label className="ui-radio ui-radio-inline ui-radio-info">
                            <input type="radio" name="sick" value="Fever" checked={this.state.selectedOption === 'Fever'}
                              onChange={this.handleOptionChange} />
                            <span className="input-span"></span>Fever</label>
                          <label className="ui-radio ui-radio-inline ui-radio-info">
                            <input type="radio" name="sick" value="Cough and Cold" checked={this.state.selectedOption === 'Cough and Cold'}
                              onChange={this.handleOptionChange} />
                            <span className="input-span"></span>Cough and Cold</label>
                          <label className="ui-radio ui-radio-inline ui-radio-info">
                            <input type="radio" name="sick" value="Headache" checked={this.state.selectedOption === 'Headache'}
                              onChange={this.handleOptionChange} />
                            <span className="input-span"></span>Headache</label>
                        </div>
                        <div className="form-group">
                          <label className="ui-radio ui-radio-inline ui-radio-info">
                            <input type="radio" name="sick" value="Dental issue" checked={this.state.selectedOption === 'Dental issue'}
                              onChange={this.handleOptionChange} />
                            <span className="input-span"></span>Dental issue</label>
                          <label className="ui-radio ui-radio-inline ui-radio-info">
                            <input type="radio" name="sick" onClick={this.handleOptionChangeTxt} />
                            <span className="input-span" ></span>Other</label>
                        </div>
                      </div>

                      <div id="casualleave">
                        <div className="form-group">
                          <label className="ui-radio ui-radio-inline ui-radio-info">
                            <input type="radio" name="casual" value="Out of town" checked={this.state.selectedOption === 'Out of town'}
                              onChange={this.handleOptionChange} />
                            <span className="input-span"></span>Out of town</label>
                          <label className="ui-radio ui-radio-inline ui-radio-info">
                            <input type="radio" name="casual" value="Banking Work" checked={this.state.selectedOption === 'Banking Work'}
                              onChange={this.handleOptionChange} />
                            <span className="input-span" ></span>Banking Work</label>
                          <label className="ui-radio ui-radio-inline ui-radio-info">
                            <input type="radio" name="casual" value="Administrative Work" checked={this.state.selectedOption === 'Administrative Work'}
                              onChange={this.handleOptionChange} />
                            <span className="input-span"></span>Administrative Work</label>

                        </div>
                        <div className="form-group">
                          <label className="ui-radio ui-radio-inline ui-radio-info">
                            <input type="radio" name="casual" value="Attending Some Function" checked={this.state.selectedOption === 'Attending Some Function'}
                              onChange={this.handleOptionChange} />
                            <span className="input-span"></span>Attending Some Function</label>
                          <label className="ui-radio ui-radio-inline ui-radio-info">
                            <input type="radio" name="casual" onClick={this.handleOptionChangeTxt} />
                            <span className="input-span"></span>Other</label>
                        </div>
                      </div>
                      <div id="compoOff">
                        <div className="form-group">
                          <label className="ui-radio ui-radio-inline ui-radio-info">
                            <input type="radio" name="compoOff" value="For Client Request" checked={this.state.selectedOption === 'For Client Request'}
                              onChange={this.handleOptionChange} />
                            <span className="input-span"></span>For Client Request</label>
                          <label className="ui-radio ui-radio-inline ui-radio-info">
                            <input type="radio" name="compoOff" value="For PM Request" checked={this.state.selectedOption === 'For PM Request'}
                              onChange={this.handleOptionChange} />
                            <span className="input-span" ></span>For PM Request</label>


                        </div>

                      </div>

                      <div className="form-group" id="read-reason" >
                        <label>
                          Reason<span className="required">*</span>
                        </label>
                        <textarea
                          className="form-control"
                          id="reason"
                          ref="reason"
                          onChange={this.handleChangeReason}
                          maxlength="300"
                          rows="3"
                          required
                        />
                      </div>
                      {/* <div className="form-group" id="reason-other">
                      <label>
                        Reason<span className="required">*</span>
                      </label>
                      <textarea                        
                        onChange={this.handleChangeReason}
                        className="form-control"
                        ref="reason"
                        maxlength="300"
                        rows="3"
                        required
                      />
                    </div> */}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        data-dismiss="modal"
                        onClick={this.cancelForm}
                        className="btn btn-danger btn-rounded btn-fix"
                      >
                        Cancel
                    </button>

                      {compoOffLeave <= 0 && this.refs.leaveType.value == "CompoOff Leave" ? (
                        <button
                          type="button"

                          disabled

                          className="btn btn-success btn-rounded btn-fix"
                        >
                          Next
                        </button>
                      ) : (
                          <button
                            type="button"
                            id="next"
                            disabled={!this.state.Validate}
                            onClick={() => this.addList(dates)}
                            className="btn btn-success btn-rounded btn-fix"
                          >
                            Next
                          </button>
                        )}
                    </div>
                  </form>
                </div>
                <div id="tableDiv">
                  <div className="modal-body">
                    <div className="form-horizontal">
                      {this.state.cats.map((item, index) => (
                        <div className="form-group row" key={item.id}>
                          <label className="col-sm-6 col-form-label">
                            {" "}
                            {item.leave_date}
                          </label>
                          <div className="col-sm-6">
                            {this.refs.leaveType.value == "Birthday Leave" || this.refs.leaveType.value == "Privileged Leave" ? (
                              <div className="form-group">
                                <input
                                  className="form-control"
                                  value="Full Day"
                                >
                                </input>
                              </div>
                            ) : (
                                <select
                                  onChange={this.handleShareholderNameChange(index)}
                                  className="form-control"
                                >
                                  <option value="Full Day">FullDay</option>
                                  <option value="First Half">
                                    HalfDay(First Half)
                            </option>
                                  <option value="Second Half">
                                    HalfDay(Second Half)
                            </option>
                                </select>)}

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-primary btn-rounded btn-fix btn-pdCan"
                      variant="primary"
                      onClick={this.cancel}
                    >
                      Back
                  </button>
                    <button
                      variant="primary"
                      className="btn-pdSub"
                      onClick={this.confirmSubmission}
                      className="btn btn-success btn-rounded btn-fix"
                    >
                      Submit
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ApplyLeave;
