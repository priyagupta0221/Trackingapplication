import React, { Component } from "react";
import AuthService from "../AuthService";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";
import Pagination from "react-js-pagination";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
const Auth = new AuthService();
var weekday = new Array(7);
let test = false;
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
var id = null;
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
var userId = null;
var date = "";
class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.leaveDetails = this.leaveDetails.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleShowDecline = this.handleShowDecline.bind(this);
    this.handleClickApprovedPaged = this.handleClickApprovedPaged.bind(this);
    this.handleClickDeclinedPaged = this.handleClickDeclinedPaged.bind(this);
    this.handleClickWFHApprovedPaged = this.handleClickWFHApprovedPaged.bind(this);
    this.handleClickWFHDeclinedPaged = this.handleClickWFHDeclinedPaged.bind(this);
    this.approvedTabClick = this.approvedTabClick.bind(this);
    this.declineTabClick = this.declineTabClick.bind(this);
    this.approvedWFHTabClick = this.approvedWFHTabClick.bind(this);
    this.declineWFHTabClick = this.declineWFHTabClick.bind(this);
    this.state = {
      leaveDetails: [],
      data: [],
      items: [],
      Leaveitems: [],
      currentPage: 1,
      todosPerPage: 3,
      numbers: [],
      activePage: 1,
      file: "",
      imagePreviewUrl: "",
      userId: "",
      showAlert: false,
      alertMessage: "",
      preview: null,
      defaultPreview: null,
      image: "",
      id: null,
      leaveDetails: [],
      leaveDetailss: [],
      dataPerPage: [],
      approvedLeave: [],
      approvedWFH: [],
      approvedLeavePaged: [],
      declinedLeavePaged: [],
      pendingLeave: [],
      declineLeave: [],
      pendingWFH: [],
      declineWFH: [],
      balanceLeaves: [],
      userDetail: [],
      activePageapp: 1,
      activePagedec: 1,
      imagePreviewUrl: "",
      loading: true,
      approvalMessage: "",
      role: false,
      countApprove: 1,
      countDecline: 1,
      approvedWFHPaged:[],
      declinedWFHPaged: [],
      leaveType:'',
      commentChat:[]
    };

    const profile = Auth.getProfile();

    if (profile.role == "Manager" || profile.role == "TeamLead") {

      test = true;
      this.setState({
        role: true
      });
      // let divA = document.getElementById("approveDiv");
      // divA.classList.add("hide");
    }
    var x = props.location.pathname;
    id = x.slice(13, 37);
    userId = x.slice(38, 62);
  }
  showComment=id=>{

    Auth.getComment(id).then(response=>{
      
      console.log(response)
      if(response.status==200){
        this.setState({
          commentChat:response.comment
        })
      }
    })
  }
  showWfhComment=id=>{

    Auth.getWfhComment(id).then(response=>{
      
      console.log(response)
      if(response.status==200){
        this.setState({
          commentChat:response.comment
        })
      }
    })
  }
  approvedTabClick() {
    var tabA = document.getElementById("tab-2");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-1");
    tabB.classList.add("active");
    tabB.classList.add("show");
  }
  approvedWFHTabClick() {
    var tabA = document.getElementById("tab-4");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-3");
    tabB.classList.add("active");
    tabB.classList.add("show");
  }
  declineTabClick() {
    var tabA = document.getElementById("tab-1");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-2");
    tabB.classList.add("active");
    tabB.classList.add("show");
    const todos = this.state.declineLeave;
    const { currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    this.setState({ countDecline: indexOfFirstTodo + 1 });
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i].leave_type;
      if (x == "Sick Leave") {
        arr[i].leave_type = x.slice(0, 4);
      } else if (x == "Casual Leave") {
        arr[i].leave_type = x.slice(0, 6);
      }
      else if (x == "Birthday Leave") {
        arr[i].leave_type = x.slice(0, 8);
      }
      else if (x == "Privileged Leave") {
        arr[i].leave_type = x.slice(0, 10);
      }
    }
    this.setState({
      declinedLeavePaged: arr
    });
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
      pageNumbers.push(i);
    }
    this.setState({
      number: pageNumbers
    });
  }
  declineWFHTabClick() {
    var tabA = document.getElementById("tab-3");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-4");
    tabB.classList.add("active");
    tabB.classList.add("show");
    const todos = this.state.declineWFH;
    const { currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    this.setState({ countDecline: indexOfFirstTodo + 1 });
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });

    this.setState({
      declinedWFHPaged: arr
    });
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
      pageNumbers.push(i);
    }
    this.setState({
      number: pageNumbers
    });
  }
  handleClickDeclinedPaged(number) {
    this.setState({
      activePagedec: number
    });
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ countDecline: indexOfFirstTodo + 1 });
    const currentTodos = this.state.declineLeave.slice(
      indexOfFirstTodo,
      indexOfLastTodo
    );
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });

    for (var i = 0; i < arr.length; i++) {
      var x = arr[i].leave_type;
      if (x == "Sick Leave") {
        arr[i].leave_type = x.slice(0, 4);
      } else if (x == "Casual Leave") {
        arr[i].leave_type = x.slice(0, 6);
      }
      else if (x == "Birthday Leave") {
        arr[i].leave_type = x.slice(0, 8);
      }
      else if (x == "Privileged Leave") {
        arr[i].leave_type = x.slice(0, 10);
      }
    }
    this.setState({
      declinedLeavePaged: arr
    });
  }
  handleClickWFHDeclinedPaged(number) {
    this.setState({
      activePagedec: number
    });
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ countDecline: indexOfFirstTodo + 1 });
    const currentTodos = this.state.declineWFH.slice(
      indexOfFirstTodo,
      indexOfLastTodo
    );
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });
    this.setState({
      declinedWFHPaged: arr
    });
  }
  handleClickApprovedPaged(number) {
    this.setState({
      activePageapp: number
    });
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ countApprove: indexOfFirstTodo + 1 });
    const currentTodos = this.state.approvedLeave.slice(
      indexOfFirstTodo,
      indexOfLastTodo
    );
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });

    for (var i = 0; i < arr.length; i++) {
      var x = arr[i].leave_type;
      if (x == "Sick Leave") {
        arr[i].leave_type = x.slice(0, 4);
      } else if (x == "Casual Leave") {
        arr[i].leave_type = x.slice(0, 6);
      }
      else if (x == "Birthday Leave") {
        arr[i].leave_type = x.slice(0, 8);
      }
      else if (x == "Privileged Leave") {
        arr[i].leave_type = x.slice(0, 10);
      }
    }
    this.setState({
      approvedLeavePaged: arr
    });
  }
  handleClickWFHApprovedPaged(number) {
    this.setState({
      activePageapp: number
    });
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ countApprove: indexOfFirstTodo + 1 });
    const currentTodos = this.state.approvedWFH.slice(
      indexOfFirstTodo,
      indexOfLastTodo
    );
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });
    this.setState({
      approvedWFHPaged: arr
    });
  }
  goBack() {
    this.props.history.replace("/leaverequest");
  }
  trimReason(e) {
    const res = arguments[0].slice(0, 10);
    return res;
  }
  handleClick = number => {
    this.setState({
      activePage: number
    });
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ count: indexOfFirstTodo + 1 });
    const currentTodos = this.state.leaveDetails.slice(
      indexOfFirstTodo,
      indexOfLastTodo
    );
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });

    for (var i = 0; i < arr.length; i++) {
      var x = arr[i].leave_type;
      if (x == "Sick Leave") {
        arr[i].leave_type = x.slice(0, 4);
      } else if (x == "Casual Leave") {
        arr[i].leave_type = x.slice(0, 6);
      }
      else if (x == "Birthday Leave") {
        arr[i].leave_type = x.slice(0, 8);
      }
      else if (x == "Privileged Leave") {
        arr[i].leave_type = x.slice(0, 10);
      }
    }
    this.setState({
      dataPerPage: arr
    });
  };
  leaveDetails = item => {
    this.setState({
      leaveDetailss: item.leave_details
    });
  };
  handleAlert = () => {
    if (this.state.alertMessage == "Leave updated successfully") {
      this.goBack();
    }
    this.setState({ showAlert: false, alertMessage: "" });
  };
  componentDidMount() {
    var token = window.localStorage.getItem("id_token");
    Auth.getPendingStatus().then(response => {
      
      var leaves = [];
      var LeaveItem = [];
      if (response.leaves.length > 0) {
        var leaves = response.leaves;
        for (var i = 0; i < leaves.length; i++) {
          // response.leaves[i].number =i;
          for (var j = 0; j < response.leaves[i].leave_details.length; j++) {
            if (response.leaves[i].approved_by[j] == "Admin") {
              response.leaves[i].message = "Approved By HR";
            } else if (response.leaves[i].approved_by[j] == "SuperAdmin") {
              response.leaves[i].message = "Approved By Delivery Head";
            }
            date = response.leaves[i].leave_details[j].leave_date;
            var datestring = date.split("-");
            var finalLeaveDate =
              datestring[1] + "-" + datestring[0] + "-" + datestring[2];
            var realdate = new Date(finalLeaveDate);
            var day = weekday[realdate.getDay()];
            if (j < response.leaves[i].leave_details.length) {
              response.leaves[i].leave_details[j].day = day;
              response.leaves[i].leave_details[j].number = j + 1;
            }
          }
          // var raisedOn = new Date(response.leaves[i].requested_at);
          // response.leaves[i].requested_at =
          //   raisedOn.getDate() +
          //   "-" +
          //   monthNames[raisedOn.getMonth()] +
          //   "-" +
          //   raisedOn
          //     .getFullYear()
          //     .toString()
          //     .substr(-2);
          var raisedOn = new Date(response.leaves[i].requested_at)
            .toISOString()
            .substring(0, 10);
          var datestring = raisedOn.split("-");
          var finalRequestDate =
            datestring[2] + "-" + datestring[1] + "-" + datestring[0];

          response.leaves[i].requested_at = finalRequestDate;
          if (id == leaves[i]._id) {
            LeaveItem = leaves[i];
          }
        }
      }

      this.setState({
        Leaveitems: LeaveItem,
        approvalMessage: LeaveItem.message,
        leaveDetails: LeaveItem.leave_details,
        leaveType:LeaveItem.leave_type,
        loading: false
      });

      const { currentPage, todosPerPage } = this.state;
      const todos = this.state.leaveDetails;
      const indexOfLastTodo = currentPage * todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
      const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
      var arr = [];
      const renderTodos = currentTodos.map((todo, index) => {
        arr.push(todo);
        return arr;
      });

      this.setState({
        dataPerPage: arr
      });
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
        pageNumbers.push(i);
      }
      this.setState({
        numbers: pageNumbers
      });
    });
    Auth.getUserSummary(userId).then(res => {
      
      if(res.leaves !=undefined){
      var approvedLeaves = [];
      var declineLeaves = [];
      var pendingLeaves = [];
      var approvedData = [];
      var declinedData = [];
      var pendingData = [];
      for (var i = 0; i < res.leaves.length; i++) {
        if ((res.leaves[i].start_date && res.leaves[i].end_date) != undefined) {
          if (
            (res.leaves[i].start_date && res.leaves[i].end_date) != undefined
          ) {
            // var raisedOn = new Date(res.leaves[i].requested_at);
            // res.leaves[i].requested_at = raisedOn.getMonth() + 1 + '-' + raisedOn.getDate() + '-' + raisedOn.getFullYear();
            // var raisedOn = new Date(res.leaves[i].requested_at);
            // res.leaves[i].requested_at =
            //   raisedOn.getDate() +
            //   "-" +
            //   monthNames[raisedOn.getMonth()] +
            //   "-" +
            //   raisedOn
            //     .getFullYear()
            //     .toString()
            //     .substr(-2);
            var raisedOn = new Date(res.leaves[i].requested_at)
              .toISOString()
              .substring(0, 10);
            var datestring = raisedOn.split("-");
            var finalRequestDate =
              datestring[2] + "-" + datestring[1] + "-" + datestring[0];

            res.leaves[i].requested_at = finalRequestDate;
          }
        }
        // var StartOn = new Date(res.leaves[i].start_date);
        // res.leaves[i].start_date = StartOn.getDate() + '-' + monthNames[StartOn.getMonth()] + '-' + StartOn.getFullYear();

        // var endOn = new Date(res.leaves[i].end_date);
        // res.leaves[i].end_date = endOn.getDate() + '-' + monthNames[endOn.getMonth()] + '-' + endOn.getFullYear();

        if (res.leaves[i].approval_status == "Approved") {
          //res.leaves[i].countApprove = countApprove;
          approvedData.push(res.leaves[i]);
         // countApprove = countApprove + 1;
        }
        if (res.leaves[i].approval_status == "Rejected") {
         // res.leaves[i].countDecline = countDecline;
          declinedData.push(res.leaves[i]);
         // countDecline = countDecline + 1;
        }
        if (res.leaves[i].approval_status == "Pending") {
          pendingData.push(res.leaves[i]);
        }
      }

        approvedLeaves = (approvedData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        declineLeaves = (declinedData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        pendingLeaves = (pendingData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();


      this.setState({
        approvedLeave: approvedData,
        declineLeave: declinedData,
        balanceLeaves: res.balance[0],
        userDetail: res.user[0]
      });
      if (res.user[0].imageData == undefined) {
        this.setState({
          imagePreviewUrl: ""
        });
      } else {
        this.setState({
          imagePreviewUrl: res.user[0].imageData.image
        });
      }
      const todos = this.state.approvedLeave;
      const { currentPage, todosPerPage } = this.state;
      const indexOfLastTodo = currentPage * todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
      this.setState({ countApprove : indexOfFirstTodo + 1 });
      const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
      var arr = [];
      const renderTodos = currentTodos.map((todo, index) => {
        // return <li key={index}>{todo}</li>;

        arr.push(todo);
        return arr;
      });
      for (var i = 0; i < arr.length; i++) {
        var x = arr[i].leave_type;
        if (x == "Sick Leave") {
          arr[i].leave_type = x.slice(0, 4);
        } else if (x == "Casual Leave") {
          arr[i].leave_type = x.slice(0, 6);
        }
        else if (x == "Birthday Leave") {
          arr[i].leave_type = x.slice(0, 8);
        }
        else if (x == "Privileged Leave") {
          arr[i].leave_type = x.slice(0, 10);
        }
      }
      this.setState({
        approvedLeavePaged: arr
      });
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
        pageNumbers.push(i);
      }
      this.setState({
        number: pageNumbers
      });
    }
   if(res.wfhs!=undefined){
      var approvedWFH = [];
      var declineWFH = [];
      var pendingWFH = [];
      var approvedWFHData = [];
      var declinedWFHData = [];
      var pendingWFHData = [];
      for (var i = 0; i < res.wfhs.length; i++) {
        if ((res.wfhs[i].start_date && res.wfhs[i].end_date) != undefined) {
          if (
            (res.wfhs[i].start_date && res.wfhs[i].end_date) != undefined
          ) {
            var raisedOn = new Date(res.wfhs[i].requested_at)
              .toISOString()
              .substring(0, 10);
            var datestring = raisedOn.split("-");
            var finalRequestDate =
              datestring[2] + "-" + datestring[1] + "-" + datestring[0];

            res.wfhs[i].requested_at = finalRequestDate;
          }
        }

        if (res.wfhs[i].approval_status == "Approved") {
          //res.wfhs[i].countApprove = countApprove;
          approvedWFHData.push(res.wfhs[i]);
          // countApprove = countApprove + 1;
        }
        if (res.wfhs[i].approval_status == "Rejected") {
          // res.wfh[i].countDecline = countDecline;
          declinedWFHData.push(res.wfhs[i]);
          // countDecline = countDecline + 1;
        }
        if (res.wfhs[i].approval_status == "Pending") {
          pendingWFHData.push(res.wfhs[i]);
        }
      }

      approvedWFH = (approvedData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
      declineWFH = (declinedData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
      pendingWFH = (pendingData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();


      this.setState({
        approvedWFH: approvedWFHData,
        declineWFH: declinedWFHData,
        balanceLeaves: res.balance[0],
        userDetail: res.user[0]
      });
      const todos = this.state.approvedWFH;
      const { currentPage, todosPerPage } = this.state;
      const indexOfLastTodo = currentPage * todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
      this.setState({ countApprove: indexOfFirstTodo + 1 });
      const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
      var arr = [];
      const renderTodos = currentTodos.map((todo, index) => {
        // return <li key={index}>{todo}</li>;

        arr.push(todo);
        return arr;
      });
      this.setState({
        approvedWFHPaged: arr
      });
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
        pageNumbers.push(i);
      }
      this.setState({
        number: pageNumbers
      });
    }
    });
    
  }
  approveLeave(id) {
    if(this.state.leaveType!="WFH"){
    Auth.approveLeaveStatus(id).then(response => {
      var listOfLeaves = [];
      var listOfAllLeaves = [];
      this.setState({
        show: false,
        showAlert: true,
        alertMessage: response.message
      });
      if (response.message != "Leave updated successfully") {
        listOfLeaves = this.state.dataPerPage;
        listOfAllLeaves = this.state.todos;
        for (var i = 0; i < listOfLeaves.length; i++) {
          var obj = listOfLeaves[i];
          if (response.message == "Leave approved by Admin") {
            this.setState({
              show: false,
              showAlert: true,
              alertMessage: response.message
            });
            if (obj._id == id) {
              listOfLeaves[i].message = "Approved By HR";
              this.setState({
                approvalMessage: "Approved By HR"
              });
            }
          } else if (response.message == "Leave approved by SuperAdmin") {
            this.setState({
              show: false,
              showAlert: true,
              alertMessage: response.message
            });
            if (obj._id == id) {
              listOfLeaves[i].message = "Approved By Delivery Head";
              this.setState({
                approvalMessage: "Approved By Delivery Head"
              });
            }
          }

          if (
            obj._id == id &&
            response.message == "Leave updated successfully"
          ) {
            // this.state.dataPerPage.splice(i, 1);
            this.setState({
              dataPerPage: this.state.dataPerPage,
              todos: listOfAllLeaves
            });
          } else {
            this.setState({
              dataPerPage: listOfLeaves
            });
          }
        }
        this.approveResponse();
      }
      setTimeout(() => {
        this.setState({ alertMessage: "", showAlert: false });
        if (response.message == "Leave updated successfully") {
          this.goBack();
        }
      }, 4000);
    });
  }
 else if(this.state.leaveType=="WFH"){
    Auth.approveWFHStatus(id).then(response => {
      var listOfLeaves = [];
      var listOfAllLeaves = [];
      this.setState({
        show: false,
        showAlert: true,
        alertMessage: response.message
      });
      if (response.message != "Leave updated successfully") {
        listOfLeaves = this.state.dataPerPage;
        listOfAllLeaves = this.state.todos;
        for (var i = 0; i < listOfLeaves.length; i++) {
          var obj = listOfLeaves[i];
          if (response.message == "WFH Request approved by Admin") {
            this.setState({
              show: false,
              showAlert: true,
              alertMessage: response.message
            });
            if (obj._id == id) {
              listOfLeaves[i].message = "Approved By HR";
              this.setState({
                approvalMessage: "Approved By HR"
              });
            }
          } else if (response.message == "WFH Request approved by SuperAdmin") {
            this.setState({
              show: false,
              showAlert: true,
              alertMessage: response.message
            });
            if (obj._id == id) {
              listOfLeaves[i].message = "Approved By Delivery Head";
              this.setState({
                approvalMessage: "Approved By Delivery Head"
              });
            }
          }

          if (
            obj._id == id &&
            response.message == "WFH Request updated successfully"
          ) {
            // this.state.dataPerPage.splice(i, 1);
            this.setState({
              dataPerPage: this.state.dataPerPage,
              todos: listOfAllLeaves
            });
          } else {
            this.setState({
              dataPerPage: listOfLeaves
            });
          }
        }
      }
      setTimeout(() => {
        this.setState({ alertMessage: "", showAlert: false });
        if (response.message == "WFH Request updated successfully") {
          this.goBack();
        }
      }, 4000);
    });
  }
  }
  approveResponse = () => {
    Auth.getLeaveStatus().then(response => {
      var leaves = [];
      var LeaveItem = [];
      if (response.leaves != undefined) {
        var leaves = response.leaves;
        for (var i = 0; i < leaves.length; i++) {
          // response.leaves[i].number =i;
          for (var j = 0; j < response.leaves[i].leave_details.length; j++) {
            if (response.leaves[i].approved_by[j] == "Admin") {
              response.leaves[i].message = "Approved By HR";
            } else if (response.leaves[i].approved_by[j] == "SuperAdmin") {
              response.leaves[i].message = "Approved By Delivery Head";
            }

            date = response.leaves[i].leave_details[j].leave_date;
            var datestring = date.split("-");
            var finalLeaveDate =
              datestring[1] + "-" + datestring[0] + "-" + datestring[2];
            var realdate = new Date(finalLeaveDate);
            var day = weekday[realdate.getDay()];
            if (j < response.leaves[i].leave_details.length) {
              response.leaves[i].leave_details[j].day = day;
              response.leaves[i].leave_details[j].number = j + 1;
            }
          }
          // var raisedOn = new Date(response.leaves[i].requested_at);
          // response.leaves[i].requested_at =
          //   raisedOn.getDate() +
          //   "-" +
          //   monthNames[raisedOn.getMonth()] +
          //   "-" +
          //   raisedOn
          //     .getFullYear()
          //     .toString()
          //     .substr(-2);
          var raisedOn = new Date(response.leaves[i].requested_at)
            .toISOString()
            .substring(0, 10);
          var datestring = raisedOn.split("-");
          var finalRequestDate =
            datestring[2] + "-" + datestring[1] + "-" + datestring[0];

          response.leaves[i].requested_at = finalRequestDate;
          if (id == leaves[i]._id) {
            LeaveItem = leaves[i];
          }
        }
      }

      this.setState({
        Leaveitems: LeaveItem,
        approvalMessage: LeaveItem.message,
        leaveDetails: LeaveItem.leave_details,
        loading: false
      });

      const { currentPage, todosPerPage } = this.state;
      const todos = this.state.leaveDetails;
      const indexOfLastTodo = currentPage * todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
      const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
      var arr = [];
      const renderTodos = currentTodos.map((todo, index) => {
        arr.push(todo);
        return arr;
      });

      for (var i = 0; i < arr.length; i++) {
        var x = arr[i].leave_type;
        if (x == "Sick Leave") {
          arr[i].leave_type = x.slice(0, 4);
        } else if (x == "Casual Leave") {
          arr[i].leave_type = x.slice(0, 6);
        }
        else if (x == "Birthday Leave") {
          arr[i].leave_type = x.slice(0, 8);
        }
        else if (x == "Privileged Leave") {
          arr[i].leave_type = x.slice(0, 10);
        }
      }
      this.setState({
        dataPerPage: arr
      });
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
        pageNumbers.push(i);
      }
      this.setState({
        numbers: pageNumbers
      });
    });
  };

  declineLeave(id) {
    if(this.state.leaveType!="WFH"){
    Auth.declineLeaveStatus(id).then(response => {
      this.apiResponse(response);
      var listOfLeaves = [];
      listOfLeaves = this.state.dataPerPage;
      for (var i = 0; i < listOfLeaves.length; i++) {
        var obj = listOfLeaves[i];

        // if (obj._id == id) {
        //   this.state.dataPerPage.splice(i, 1);
        //   this.setState({
        //     dataPerPage: this.state.dataPerPage
        //   })
        // }
      }
    });

    this.setState({
      showDec: false,
      showAlert: true,
      alertMessage: "Leave declined successfully"
    });
    setTimeout(() => {
      this.setState({ alertMessage: "", showAlert: false });
      this.goBack();
    }, 4000);
  }
  else if(this.state.leaveType=="WFH"){
    Auth.declineWFHStatus(id).then(response => {
      // this.apiResponse(response);
      var listOfLeaves = [];
      listOfLeaves = this.state.dataPerPage;
      for (var i = 0; i < listOfLeaves.length; i++) {
        var obj = listOfLeaves[i];
      }
    });

    this.setState({
      showDec: false,
      showAlert: true,
      alertMessage: "WFH declined successfully"
    });
    setTimeout(() => {
      this.setState({ alertMessage: "", showAlert: false });
      this.goBack();
    }, 4000);
  }
  }
  apiResponse = response => {
    Auth.getLeaveStatus().then(response => {
      var leaves = [];
      var LeaveItem = [];
      if (response.leaves.length > 0) {
        var leaves = response.leaves;
        for (var i = 0; i < leaves.length; i++) {
          // response.leaves[i].number =i;
          for (var j = 0; j < response.leaves[i].leave_details.length; j++) {
            if (response.leaves[i].approved_by[j] == "Admin") {
              response.leaves[i].message = "Approved By HR";
            } else if (response.leaves[i].approved_by[j] == "SuperAdmin") {
              response.leaves[i].message = "Approved By Delivery Head";
            }

            var date = new Date(response.leaves[i].leave_details[j].leave_date);
            var day = weekday[date.getDay()];
            if (j < response.leaves[i].leave_details.length) {
              response.leaves[i].leave_details[j].day = day;
              response.leaves[i].leave_details[j].number = j + 1;
            }
          }
          // var raisedOn = new Date(response.leaves[i].requested_at);
          // response.leaves[i].requested_at =
          //   raisedOn.getDate() +
          //   "-" +
          //   monthNames[raisedOn.getMonth()] +
          //   "-" +
          //   raisedOn
          //     .getFullYear()
          //     .toString()
          //     .substr(-2);
          var raisedOn = new Date(response.leaves[i].requested_at)
            .toISOString()
            .substring(0, 10);
          var datestring = raisedOn.split("-");
          var finalRequestDate =
            datestring[2] + "-" + datestring[1] + "-" + datestring[0];

          response.leaves[i].requested_at = finalRequestDate;
          if (id == leaves[i]._id) {
            LeaveItem = leaves[i];
          }
        }
      }

      this.setState({
        Leaveitems: LeaveItem,
        approvalMessage: "",
        leaveDetails: LeaveItem.leave_details,
        loading: false
      });

      const { currentPage, todosPerPage } = this.state;
      const todos = this.state.leaveDetails;
      const indexOfLastTodo = currentPage * todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
      const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
      var arr = [];
      const renderTodos = currentTodos.map((todo, index) => {
        arr.push(todo);
        return arr;
      });

      for (var i = 0; i < arr.length; i++) {
        var x = arr[i].leave_type;
        if (x == "Sick Leave") {
          arr[i].leave_type = x.slice(0, 4);
        } else if (x == "Casual Leave") {
          arr[i].leave_type = x.slice(0, 6);
        }
        else if (x == "Birthday Leave") {
          arr[i].leave_type = x.slice(0, 8);
        }
        else if (x == "Privileged Leave") {
          arr[i].leave_type = x.slice(0, 10);
        }
      }
      this.setState({
        dataPerPage: arr
      });
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
        pageNumbers.push(i);
      }
      this.setState({
        numbers: pageNumbers
      });
    });
    if (response.success == true) {
    } else {
    }
  };

  handleShow(id) {
    this.setState({
      empId: id
    });
  }
  handleShowDecline(id) {
    this.setState({
      showDec: true,
      empId: id
    });
  }
  render() {
    let $test1 = null;
    // const style = this.test? {display:'none'}:{};
    let style = "";
    if (test) {
      //  style = 'hide';
      // var x= document.getElementById("tab-2");
      $test1 = <div></div>;
    } else {
      $test1 = (
        <div className="flexbox flex-1">
          <button
            class="btn btn-success btn-rounded approve-leave"
            onClick={() => this.handleShow(id)}
            data-toggle="modal"
            data-target="#apporvedTab"
            aria-pressed="false"
          >
            <i class="fa fa-thumbs-up font-14 mr-1"></i>Approve
          </button>
          <button
            class="btn btn-danger btn-rounded approve-leave"
            onClick={() => this.handleShowDecline(id)}
            data-toggle="modal"
            data-target="#declineTab"
            aria-pressed="false"
          >
            <i class="fa fa-thumbs-down font-14 mr-1"></i>Decline
          </button>
        </div>
      );
    }
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
        <img className="img-circle img-height" src={imagePreviewUrl} />
      );
    } else {
      $imagePreview = (
        <img className="img-circle img-height" src="/assets/img/users/u8.jpg" />
      );
    }
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
        <div>
          <div className="page-content fade-in-up">
            <div className="modal fade" id="apporvedTab">
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
                        You want to approve this Leave Request!
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
                        onClick={() => this.approveLeave(this.state.empId)}
                      >
                        <i className="fa fa-check"></i> Approve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id="declineTab">
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
                      <p className="text-center mt-txt">
                        You want to decline this Leave Request!
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
                        onClick={() => this.declineLeave(this.state.empId)}
                      >
                        <i className="fa fa-check"></i> Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal fade" id="leaveDetails">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title"></h4>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th width="91px" className="tb-leave-ty">
                              Date
                            </th>
                            {/* <th>Day</th> */}
                            <th>Leave Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.leaveDetailss.map(item => (
                            <tr key={item._id}>
                              <td className="tbl-date">{item.leave_date}</td>
                              {/* <td className="tbl-date">{item.day}</td> */}
                              <td className="tbl-date"> {item.leave_type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
 {/* Chat Record */}
 <div className="modal fade" id="Chatrecord" data-backdrop="static">
        <div className="modal-dialog ">
          <div className="modal-content">
            <div className="modal-header applyleave">
              <h4 className="modal-title applyleave">
                Chat Window
                </h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
              >
                &times;
                </button>
            </div>
            <div className="row chat-window">
 
              <div className="col-sm-12">
                <div className="modal-body chat-background">

                      <section id="tab1">
                      <div className="row">
                        <div className="col-sm-12">
                        {this.state.commentChat.map(item =>
                        <div className="msg_cotainer_send bg-primary">
                                     <span>{item}</span>                                       
                       </div>   
                       )}
                
                        </div>
                      </div>
                  </section> 
                </div>
                <div className="modal-footer">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
            <div className="row">
              <div className="col-lg-4 col-md-4">
                <div className="ibox profile-ibox">
                  <div className="left left-paddi">
                    <button
                      class="btn btn-success btn-circle"
                      aria-pressed="false"
                      onClick={this.goBack}
                    >
                      <i class="fa fa-arrow-left"></i>
                    </button>
                  </div>

                  <div className="ibox-body text-center">
                    <div className="m-t-20">{$imagePreview}</div>
                    <h5 className="font-strong m-b-10 m-t-10">
                      {this.state.userDetail.name}
                    </h5>
                    <div className="m-b-20 text-muted">
                      {this.state.userDetail.role}
                    </div>
                    <div className="row text-center m-b-20">
                      <div className="col-4">
                        <div className="font-24 profile-stat-count">
                          {this.state.balanceLeaves.casual_balance}
                        </div>
                        <div className="text-muted with-sp">Casual Balance</div>
                      </div>
                      <div className="col-4">
                        <div className="font-24 profile-stat-count">
                          {this.state.balanceLeaves.sick_balance}
                        </div>
                        <div className="text-muted with-sp">Sick Balance</div>
                      </div>
                      <div className="col-4">
                        <div className="font-24 profile-stat-count">
                          {this.state.balanceLeaves.sick_balance +
                            this.state.balanceLeaves.casual_balance}
                        </div>
                        <div className="text-muted with-sp">Total Balance</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-8">
                <div className="ibox profile-ibox">
                {this.state.showAlert == true ? (
                      <div className="alert alert-success alert-dismissable fade show alertpopup row toast-alert-pd detail-txt-toast">
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
                  <strong>Success!</strong> {this.state.alertMessage}
                    </div>
                        
                      </div>
                    ) : (
                      ""
                    )}
                  <div className="ibox-body">
                    <h4 className="text-info m-b-20 m-t-20">
                      <i className="fa fa-tasks"></i> Latest Request
                    </h4>
                   
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Type</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.dataPerPage.map((item, index) => (
                            <tr key={item._id}>
                              <td>{item.number}</td>
                              <td>{item.leave_date}</td>
                              <td>{item.day}</td>
                              <td>{item.leave_type}</td>
                              <td>
                                {this.state.approvalMessage ==
                                  "Approved By HR" ? (
                                    <div>
                                      <button className="btn btn-default tech leave-details m-r-20 btn-rounded">
                                        Tech
                                    </button>
                                      <button className="btn btn-success hr leave-details btn-rounded">
                                        HR
                                    </button>
                                    </div>
                                  ) : (
                                    <div>
                                      {this.state.approvalMessage ==
                                        "Approved By Delivery Head" ? (
                                          <div>
                                            <button className="btn btn-success tech leave-details btn-rounded m-r-20">
                                              Tech
                                        </button>
                                            <button className="btn hr leave-details btn-default btn-rounded">
                                              HR
                                        </button>
                                          </div>
                                        ) : (
                                          <div>
                                            <button className="btn tech leave-details btn-default m-r-20 btn-rounded">
                                              Tech
                                        </button>
                                            <button className="btn hr leave-details btn-default btn-rounded">
                                              HR
                                        </button>
                                          </div>
                                        )}
                                    </div>
                                  )}
                                {/* <td>{this.state.approvalMessage} */}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="row btn-padd-detail style">
                      {/* <div className="flexbox flex-1">
                        <button
                          class="btn btn-success btn-rounded approve-leave"
                          onClick={() => this.handleShow(id)}
                          data-toggle="modal"
                          data-target="#apporvedTab"
                          aria-pressed="false"
                        >
                          <i class="fa fa-thumbs-up font-14 mr-1"></i>Approve
                        </button>
                        <button
                          class="btn btn-danger btn-rounded approve-leave"
                          onClick={() => this.handleShowDecline(id)}
                          data-toggle="modal"
                          data-target="#declineTab"
                          aria-pressed="false"
                        >
                          <i class="fa fa-thumbs-down font-14 mr-1"></i>Decline
                        </button>
                      </div> */}
                      {$test1}
                    </div>
                    <div className="mt-page detail-profile">
                      <Pagination
                        className="justify-content-center"
                        activePage={this.state.activePage}
                        itemsCountPerPage={3}
                        totalItemsCount={100}
                        pageRangeDisplayed={5}
                        onChange={this.handleClick}
                        itemClass="page-item no-padding"
                        linkClass="page-link"
                        prevPageText="Previous"
                        nextPageText="Next"
                        totalItemsCount={this.state.leaveDetails.length}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="ibox">
                  <div className="ibox-body">
                    <ul className="nav nav-tabs tabs-line">
                      <li className="nav-item">
                        <a
                          className="nav-link active approved"
                          href="#tab-1"
                          data-toggle="tab"
                          onClick={() => this.approvedTabClick(this)}
                        >
                          Approved<i class="fa fa-check-circle-o"></i>
                        </a>
                      </li>
                      <li class="nav-item">
                        <a
                          className="nav-link decline"
                          href="#tab-2"
                          data-toggle="tab"
                          onClick={() => this.declineTabClick(this)}
                        >
                          Declined<i class="fa fa-times-circle-o"></i>
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div className="tab-pane fade show active" id="tab-1">
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th className="tbl-date" width="91px">
                                  Start Date
                                </th>
                                <th className="tbl-date" width="91px">
                                  End Date
                                </th>
                                <th>Request</th>
                                <th>Days</th>
                                <th>Type</th>
                                <th>Details</th>
                                <th className="cmt-section">Reason</th>
                                <th className="cmt-section tbl-date">Comment</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.approvedLeavePaged.map(
                                (item, index) => (
                                  <tr key={item._id}>
                                    <td>{index + this.state.countApprove}</td>
                                    <td className="tbl-date">
                                      {item.person_name}
                                    </td>
                                    <td className="tbl-date">
                                      {item.start_date}
                                    </td>
                                    <td className="tbl-date">
                                      {item.end_date}
                                    </td>
                                    <td className="tbl-date">
                                      {item.requested_at}
                                    </td>

                                    <td className="tbl-date">
                                      {item.leave_days}
                                    </td>
                                    <td className="tbl-date">
                                      {item.leave_type}
                                    </td>
                                    <td className="tbl-date">
                                      <button
                                        className="btn btn-outline-info"
                                        data-toggle="modal"
                                        data-target="#leaveDetails"
                                        aria-pressed="false"
                                        onClick={() => this.leaveDetails(item)}
                                      >
                                        <i className="fa fa-list list-status"></i>
                                        Details
                                      </button>
                                    </td>
                                    {item.reason.length > 10 ? (
                                      <td>
                                        <div
                                          id={"UncontrolledPopover-" + item._id}
                                          className="pointer"
                                        >
                                          {this.trimReason(
                                            item.reason,
                                            item._id
                                          )}
                                          ...
                                        </div>
                                        <UncontrolledPopover
                                          trigger="legacy"
                                          placement="bottom"
                                          target={
                                            "UncontrolledPopover-" + item._id
                                          }
                                        >
                                          {/* <PopoverHeader>Popover Title</PopoverHeader> */}
                                          <PopoverBody>
                                            {" "}
                                            {item.reason}
                                          </PopoverBody>
                                        </UncontrolledPopover>
                                      </td>
                                    ) : (
                                        <td>{item.reason}</td>
                                      )}
                                      <td className="tbl-date"> <div className="customtooltip">
                                        <button
                                          className="btn btn-xs"
                                          type="button"
                                          onClick={() => this.showComment(item._id)}
                                          data-toggle="modal"
                                          data-target="#Chatrecord"
                                        >
                                          <i className="fa fa-comments font comment"></i>
                                        </button>
                                        <span className="tooltiptext">Comment</span>
                                      </div></td>
                                    <td className="tbl-date">
                                      <span className="badge badge-success">
                                        {item.approval_status}
                                      </span>
                                      {/* <p>{item.message}</p> */}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-page">
                          <Pagination
                            className="justify-content-center"
                            activePage={this.state.activePageapp}
                            itemsCountPerPage={3}
                            totalItemsCount={100}
                            pageRangeDisplayed={3}
                            onChange={this.handleClickApprovedPaged}
                            itemClass="page-item no-padding"
                            linkClass="page-link"
                            prevPageText="Previous"
                            nextPageText="Next"
                            totalItemsCount={this.state.approvedLeave.length}
                          />
                        </div>
                      </div>
                      <div className="tab-pane fade " id="tab-2">
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th className="tbl-date" width="91px">
                                  Start Date
                                </th>
                                <th className="tbl-date" width="91px">
                                  End Date
                                </th>
                                <th>Request</th>
                                <th>Days</th>
                                <th>Type</th>
                                <th>Details</th>
                                <th className="cmt-section">Reason</th>
                                <th className="cmt-section tbl-date">Comment</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.declinedLeavePaged.map(
                                (item, index) => (
                                  <tr key={item._id}>
                                    <td>{index + this.state.countDecline}</td>
                                    <td className="tbl-date">
                                      {item.person_name}
                                    </td>
                                    <td className="tbl-date">
                                      {item.start_date}
                                    </td>
                                    <td className="tbl-date">
                                      {item.end_date}
                                    </td>
                                    <td className="tbl-date">
                                      {item.requested_at}
                                    </td>

                                    <td className="tbl-date">
                                      {item.leave_days}
                                    </td>
                                    <td className="tbl-date">
                                      {item.leave_type}
                                    </td>
                                    <td className="tbl-date">
                                      <button
                                        className="btn btn-outline-info "
                                        data-toggle="modal"
                                        data-target="#leaveDetails"
                                        aria-pressed="false"
                                        onClick={() => this.leaveDetails(item)}
                                      >
                                        <i className="fa fa-list list-status"></i>
                                        Details
                                      </button>
                                    </td>
                                    {item.reason.length > 10 ? (
                                      <td>
                                        <div
                                          id={"UncontrolledPopover-" + item._id}
                                          className="pointer"
                                        >
                                          {this.trimReason(
                                            item.reason,
                                            item._id
                                          )}
                                          ...
                                        </div>
                                        <UncontrolledPopover
                                          trigger="legacy"
                                          placement="bottom"
                                          target={
                                            "UncontrolledPopover-" + item._id
                                          }
                                        >
                                          {/* <PopoverHeader>Popover Title</PopoverHeader> */}
                                          <PopoverBody>
                                            {" "}
                                            {item.reason}
                                          </PopoverBody>
                                        </UncontrolledPopover>
                                      </td>
                                    ) : (
                                        <td>{item.reason}</td>
                                      )}
                                       <td className="tbl-date"> <div className="customtooltip">
                                        <button
                                          className="btn btn-xs"
                                          type="button"
                                          onClick={() => this.showComment(item._id)}
                                          data-toggle="modal"
                                          data-target="#Chatrecord"
                                        >
                                          <i className="fa fa-comments font comment"></i>
                                        </button>
                                        <span className="tooltiptext">Comment</span>
                                      </div></td>
                                    <td className="tbl-date">
                                      <span className="badge badge-danger">
                                        {item.approval_status}
                                      </span>
                                      {/* <p>{item.message}</p> */}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                        <Pagination
                          className="justify-content-center"
                          activePage={this.state.activePagedec}
                          itemsCountPerPage={3}
                          totalItemsCount={100}
                          pageRangeDisplayed={3}
                          onChange={this.handleClickDeclinedPaged}
                          itemClass="page-item no-padding"
                          linkClass="page-link"
                          prevPageText="Previous"
                          nextPageText="Next"
                          totalItemsCount={this.state.declineLeave.length}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="ibox">
                  <div className="ibox-body">
                    <ul className="nav nav-tabs tabs-line">
                      <li className="nav-item">
                        <a
                          className="nav-link active approved"
                          href="#tab-3"
                          data-toggle="tab"
                          onClick={() => this.approvedWFHTabClick(this)}
                        >
                          Approved<i class="fa fa-check-circle-o"></i>
                        </a>
                      </li>
                      <li class="nav-item">
                        <a
                          className="nav-link decline"
                          href="#tab-4"
                          data-toggle="tab"
                          onClick={() => this.declineWFHTabClick(this)}
                        >
                          Declined<i class="fa fa-times-circle-o"></i>
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div className="tab-pane fade show active" id="tab-3">
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th className="tbl-date" width="91px">
                                  Start Date
                                </th>
                                <th className="tbl-date" width="91px">
                                  End Date
                                </th>
                                <th>Request</th>
                                <th>Days</th>
                                <th>Type</th>
                                <th>Details</th>
                                <th className="cmt-section">Reason</th>
                                <th className="cmt-section tbl-date">Comment</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.approvedWFHPaged.map(
                                (item, index) => (
                                  <tr key={item._id}>
                                    <td>{index + this.state.countApprove}</td>
                                    <td className="tbl-date">
                                      {item.person_name}
                                    </td>
                                    <td className="tbl-date">
                                      {item.start_date}
                                    </td>
                                    <td className="tbl-date">
                                      {item.end_date}
                                    </td>
                                    <td className="tbl-date">
                                      {item.requested_at}
                                    </td>

                                    <td className="tbl-date">
                                      {item.wfh_days}
                                    </td>
                                    <td className="tbl-date">
                                      {item.leave_type}
                                    </td>
                                    <td className="tbl-date">
                                      <button
                                        className="btn btn-outline-info"
                                        data-toggle="modal"
                                        data-target="#leaveDetails"
                                        aria-pressed="false"
                                        onClick={() => this.leaveDetails(item)}
                                      >
                                        <i className="fa fa-list list-status"></i>
                                        Details
                                      </button>
                                    </td>
                                    {item.reason.length > 10 ? (
                                      <td>
                                        <div
                                          id={"UncontrolledPopover-" + item._id}
                                          className="pointer"
                                        >
                                          {this.trimReason(
                                            item.reason,
                                            item._id
                                          )}
                                          ...
                                        </div>
                                        <UncontrolledPopover
                                          trigger="legacy"
                                          placement="bottom"
                                          target={
                                            "UncontrolledPopover-" + item._id
                                          }
                                        >
                                          {/* <PopoverHeader>Popover Title</PopoverHeader> */}
                                          <PopoverBody>
                                            {" "}
                                            {item.reason}
                                          </PopoverBody>
                                        </UncontrolledPopover>
                                      </td>
                                    ) : (
                                        <td>{item.reason}</td>
                                      )}
                                      <td className="tbl-date"> <div className="customtooltip">
                                        <button
                                          className="btn btn-xs"
                                          type="button"
                                          onClick={() => this.showWfhComment(item._id)}
                                          data-toggle="modal"
                                          data-target="#Chatrecord"
                                        >
                                          <i className="fa fa-comments font comment"></i>
                                        </button>
                                        <span className="tooltiptext">Comment</span>
                                      </div></td>
                                    <td className="tbl-date">
                                      <span className="badge badge-success">
                                        {item.approval_status}
                                      </span>
                                      {/* <p>{item.message}</p> */}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-page">
                          <Pagination
                            className="justify-content-center"
                            activePage={this.state.activePageapp}
                            itemsCountPerPage={3}
                            totalItemsCount={100}
                            pageRangeDisplayed={3}
                            onChange={this.handleClickWFHApprovedPaged}
                            itemClass="page-item no-padding"
                            linkClass="page-link"
                            prevPageText="Previous"
                            nextPageText="Next"
                            totalItemsCount={this.state.approvedWFH.length}
                          />
                        </div>
                      </div>
                      <div className="tab-pane fade " id="tab-4">
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th className="tbl-date" width="91px">
                                  Start Date
                                </th>
                                <th className="tbl-date" width="91px">
                                  End Date
                                </th>
                                <th>Request</th>
                                <th>Days</th>
                                <th>Type</th>
                                <th>Details</th>
                                <th className="cmt-section">Reason</th>
                                <th className="cmt-section tbl-date">Comment</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.declinedWFHPaged.map(
                                (item, index) => (
                                  <tr key={item._id}>
                                    <td>{index + this.state.countDecline}</td>
                                    <td className="tbl-date">
                                      {item.person_name}
                                    </td>
                                    <td className="tbl-date">
                                      {item.start_date}
                                    </td>
                                    <td className="tbl-date">
                                      {item.end_date}
                                    </td>
                                    <td className="tbl-date">
                                      {item.requested_at}
                                    </td>

                                    <td className="tbl-date">
                                      {item.wfh_days}
                                    </td>
                                    <td className="tbl-date">
                                      {item.leave_type}
                                    </td>
                                    <td className="tbl-date">
                                      <button
                                        className="btn btn-outline-info "
                                        data-toggle="modal"
                                        data-target="#leaveDetails"
                                        aria-pressed="false"
                                        onClick={() => this.leaveDetails(item)}
                                      >
                                        <i className="fa fa-list list-status"></i>
                                        Details
                                      </button>
                                    </td>
                                    {item.reason.length > 10 ? (
                                      <td>
                                        <div
                                          id={"UncontrolledPopover-" + item._id}
                                          className="pointer"
                                        >
                                          {this.trimReason(
                                            item.reason,
                                            item._id
                                          )}
                                          ...
                                        </div>
                                        <UncontrolledPopover
                                          trigger="legacy"
                                          placement="bottom"
                                          target={
                                            "UncontrolledPopover-" + item._id
                                          }
                                        >
                                          {/* <PopoverHeader>Popover Title</PopoverHeader> */}
                                          <PopoverBody>
                                            {" "}
                                            {item.reason}
                                          </PopoverBody>
                                        </UncontrolledPopover>
                                      </td>
                                    ) : (
                                        <td>{item.reason}</td>
                                      )}
                                     <td className="tbl-date"> <div className="customtooltip">
                                        <button
                                          className="btn btn-xs"
                                          type="button"
                                          onClick={() => this.showWfhComment(item._id)}
                                          data-toggle="modal"
                                          data-target="#Chatrecord"
                                        >
                                          <i className="fa fa-comments font comment"></i>
                                        </button>
                                        <span className="tooltiptext">Comment</span>
                                      </div></td>
                                    <td className="tbl-date">
                                      <span className="badge badge-danger">
                                        {item.approval_status}
                                      </span>
                                      {/* <p>{item.message}</p> */}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                        <Pagination
                          className="justify-content-center"
                          activePage={this.state.activePagedec}
                          itemsCountPerPage={3}
                          totalItemsCount={100}
                          pageRangeDisplayed={3}
                          onChange={this.handleClickWFHDeclinedPaged}
                          itemClass="page-item no-padding"
                          linkClass="page-link"
                          prevPageText="Previous"
                          nextPageText="Next"
                          totalItemsCount={this.state.declineWFH.length}
                        />
                      </div>
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
}

export default DetailPage;
