import React, { Component } from "react";
import AuthService from "../AuthService";
import Pagination from "react-js-pagination";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
  withRouter
} from "react-router-dom";
// import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
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
const Auth = new AuthService();
export default class LeaveDetail extends Component {
  constructor() {
    super();
    this.handleShow = this.handleShow.bind(this);
    this.handleShowDecline = this.handleShowDecline.bind(this);
    this.declineLeave = this.declineLeave.bind(this);
    this.approveLeave = this.approveLeave.bind(this);
    this.leaveDetails = this.leaveDetails.bind(this);
    this.getLeaveStatusDecline = this.getLeaveStatusDecline.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.approveHandleClick = this.approveHandleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLeaveTypeOption = this.handleLeaveTypeOption.bind(this);
    this.testing = this.testing.bind(this);
    this.state = {
      activeTab: "1",
      items: [],
      itemsPending: [],
      itemsrejected: [],
      itemsapproved: [],
      isLoaded: false,
      redirectToReferrer: false,
      token: "",
      numbers: [],
      number: [],
      activePage: 1,
      activePageDec: 1,
      todos: [],
      dataPerPage: [],
      currentPage: 1,
      todosPerPage: 8,
      approvePage: [],
      declinePage: [],
      empId: null,
      showAlert: false,
      alertMessage: "",
      danger: false,
      loading: true,
      tableloader: true,
      declinetable: false,
      leaveDetails: [],
      approve: 1,
      decline: 1,
      userList: [],
      dataUser: [],
      todos: [],
      dataPerPageUser: [],
      imagePreviewUrl: "",
      searchValue: "",
      searchLeavevalue: "All",
      commentChat: [],
      Validate: false,
      comment: '',
      limit: 8,
      page: 1,
      leavesCountApproved: "",
      totalApprovedLeave: [],
      leavesCountDecline: ""


    };
  }
  /* Start Show Comment in Model window  */
  showComment = id => {
    this.setState({
      empId: id
    });
    Auth.getComment(id).then(response => {

      if (response.status == 200) {
        this.setState({
          commentChat: response.comment
        })
      }
    })
  }
  /* End Show Comment in Model window  */
  /* Start Close Comment Model window  */
  cancelComment = () => {
    this.refs.chatRec.value = "";
    this.setState({
      Validate: false,
    })
  };
  /* End Close Comment Model window  */
  /* Start add comment  Business Logic */
  handleChangeReason = event => {
    this.setState({
      comment: event.target.value
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
  };
  /* Start add comment  Business Logic */
  /* Start Submit comment  */
  submitComment = event => {
    var idTestq = null;
    this.setState({
      show: false
    });
    idTestq = this.state.empId;
    var user = window.localStorage.getItem("id_token");
    if (this.state.logger == 'Admin' || this.state.logger == 'SuperAdmin') {
      Auth.submitAdminComment(idTestq, this.refs.chatRec.value).then(data => {
        if (data.message == "Leave updated successfully") {
          this.setState({
            Validate: false,
          });
          this.showComment(idTestq);
          this.refs.chatRec.value = "";
        } else {
          this.setState({
            alertMessage: data.message,
            showAlert: true,
            danger: true
          });
        }
        setTimeout(() => {
          this.handleAlert();
        }, 4000);
      });
    } else if (this.state.logger == 'HR') {
      Auth.submitHRComment(idTestq, this.state.comment).then(data => {
        if (data.message == "Leave updated successfully") {
          this.setState({
            Validate: false,
          });
          this.showComment(idTestq);
          this.refs.chatRec.value = "";
        } else {
          this.setState({
            alertMessage: data.message,
            showAlert: true,
            danger: true
          });
        }
        setTimeout(() => {
          this.handleAlert();
        }, 4000);
      });
    }
  };
  /* End Submit comment  */

  /* Start Leave Type Value Change  */
  handleLeaveTypeOption(e) {
    let indexOfFirstTodo = 0;
    var sortedLeaves = [];
    var x = e.target.value;
    var searchname = this.state.searchValue;
    this.setState({
      searchLeavevalue: e.target.value
    });
    let TabApprove = document.getElementById("tab-7-2");
    let TabDecline = document.getElementById("tab-7-3");
    let divApprove = TabApprove.classList.contains("active");
    let divDecline = TabDecline.classList.contains("active");

    if (divApprove == true) {
      Auth.searchByLeaveApproveDetails(x, searchname).then(response => {
        console.log(response);
        var temObj = "";
        var c = 1;
        if (response.leaves != undefined) {
          for (var i = 0; i < response.leaves.length; i++) {
            // response.leaves[i].indexValue = c;
            // c = c + 1;
            if (
              (response.leaves[i].start_date && response.leaves[i].end_date) !=
              undefined
            ) {
              if (
                (response.leaves[i].start_date &&
                  response.leaves[i].end_date) != undefined
              ) {
                // var startdateFormat = new Date(response.leaves[i].start_date);
                // var enddateformat = new Date(response.leaves[i].end_date);
                // var raisedOn = new Date(response.leaves[i].requested_at);
                // response.leaves[i].start_date = startdateFormat.getMonth() + 1 + '/' + startdateFormat.getDate() + '/' + startdateFormat.getFullYear();
                // response.leaves[i].end_date = enddateformat.getMonth() + 1 + '/' + enddateformat.getDate() + '/' + enddateformat.getFullYear();
                // response.leaves[i].requested_at = raisedOn.getMonth() + 1 + '/' + raisedOn.getDate() + '/' + raisedOn.getFullYear();
                var raisedOn = new Date(response.leaves[i].requested_at)
                  .toISOString()
                  .substring(0, 10);
                var datestring = raisedOn.split("-");
                var finalRequestDate =
                  datestring[2] + "-" + datestring[1] + "-" + datestring[0];

                response.leaves[i].requested_at = finalRequestDate;
              }
              if (response.leaves[i].leave_type == "Casual Leave") {
                temObj = response.leaves[i].balance.casual;
              } else if (response.leaves[i].leave_type == "Sick Leave") {
                temObj = response.leaves[i].balance.sick;
              }
              else if (response.leaves[i].leave_type == "Birthday Leave") {
                temObj = response.leaves[i].balance.birthday;
              }
              else if (response.leaves[i].leave_type == "Privileged Leave") {
                temObj = response.leaves[i].balance.privileged;
              }
              else if (response.leaves[i].leave_type == "CompoOff Leave") {
                temObj = response.leaves[i].balance.compoOff;
              }
              response.leaves[i].leaveBalance = temObj;
            }
          }
          // sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

          this.setState({
            itemsapproved: response.leaves,
            activePage: 1,
            userList: response.leaves
          });

          var todos1 = this.state.itemsapproved;
          const { currentPage, todosPerPage } = this.state;
          const indexOfLastTodo = currentPage * todosPerPage;
          if (x != "") {
            indexOfFirstTodo = 0;
          } else {
            indexOfFirstTodo = indexOfLastTodo - todosPerPage;
          }
          // const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
          this.setState({ approve: indexOfFirstTodo + 1 });
          const currentTodos = todos1.slice(indexOfFirstTodo, indexOfLastTodo);
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
            else if (x == "CompoOff Leave") {
              arr[i].leave_type = "Comp Off";
            }
          }
          this.setState({
            dataPerPage: arr
          });
          const pageNumbers = [];
          for (let i = 1; i <= Math.ceil(todos1.length / todosPerPage); i++) {
            pageNumbers.push(i);
          }
          this.setState({
            number: pageNumbers
          });
        }
      });
    } else if (divDecline == true) {
      Auth.searchByLeaveDeclineDetails(x, searchname).then(response => {
        console.log(response);
        var temObj = "";
        var sortedLeaves = [];
        var c = 1;
        if (response.leaves != undefined) {
          for (var i = 0; i < response.leaves.length; i++) {
            // response.leaves[i].indexValue = c;
            // c = c + 1;
            if (
              (response.leaves[i].start_date && response.leaves[i].end_date) !=
              undefined
            ) {
              if (
                (response.leaves[i].start_date &&
                  response.leaves[i].end_date) != undefined
              ) {
                var raisedOn = new Date(response.leaves[i].requested_at)
                  .toISOString()
                  .substring(0, 10);
                var datestring = raisedOn.split("-");
                var finalRequestDate =
                  datestring[2] + "-" + datestring[1] + "-" + datestring[0];

                response.leaves[i].requested_at = finalRequestDate;
                // var raisedOn = new Date(response.leaves[i].requested_at);
                // response.leaves[i].requested_at =
                //   raisedOn.getDate() +
                //   "-" +
                //   monthNames[raisedOn.getMonth()] +
                //   "-" +
                //   raisedOn.getFullYear();
                if (response.leaves[i].approved_by.length > 0) {
                  for (
                    var j = 0;
                    j < response.leaves[i].approved_by.length;
                    j++
                  ) {
                    if (response.leaves[i].approved_by[j] == "Admin") {
                      response.leaves[i].message = "Approved By Admin";
                    } else if (
                      response.leaves[i].approved_by[j] == "SuperAdmin"
                    ) {
                      response.leaves[i].message = "Approved By SuperAdmin";
                    }
                  }
                }
              }
              if (response.leaves[i].leave_type == "Casual Leave") {
                temObj = response.leaves[i].balance.casual;
              } else if (response.leaves[i].leave_type == "Sick Leave") {
                temObj = response.leaves[i].balance.sick;
              }
              else if (response.leaves[i].leave_type == "Birthday Leave") {
                temObj = response.leaves[i].balance.birthday;
              }
              else if (response.leaves[i].leave_type == "Privileged Leave") {
                temObj = response.leaves[i].balance.privileged;
              }
              else if (response.leaves[i].leave_type == "CompoOff Leave") {
                temObj = response.leaves[i].balance.compoOff;
              }
              response.leaves[i].leaveBalance = temObj;
            }
          }
          // sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

          this.setState({
            itemsrejected: response.leaves,
            activePageDec: 1,
            userList: response.leaves
          });
          var todoData = this.state.itemsrejected;
          const { todos, currentPage, todosPerPage } = this.state;
          const indexOfLastTodo = currentPage * todosPerPage;
          if (x != "") {
            indexOfFirstTodo = 0;
          } else {
            indexOfFirstTodo = indexOfLastTodo - todosPerPage;
          }
          // const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
          this.setState({ decline: indexOfFirstTodo + 1 });
          const currentTodos = todoData.slice(
            indexOfFirstTodo,
            indexOfLastTodo
          );
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
            else if (x == "CompoOff Leave") {
              arr[i].leave_type = "Comp Off";
            }
          }
          this.setState({
            declinePage: arr
          });
          const pageNumbers1 = [];
          for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
            pageNumbers1.push(i);
          }
          this.setState({
            numbers: pageNumbers1
          });
        }
      });
    }
  }
  /* End Leave Type Value Change  */

  /* Start search Value Leave type Tab Approve or Decline   */
  handleChange(e) {
    let indexOfFirstTodo = 0;
    var sortedLeaves = [];
    var x = e.target.value;
    var Leavevalue = this.state.searchLeavevalue;
    this.setState({
      searchValue: e.target.value
    });
    let TabApprove = document.getElementById("tab-7-2");
    let TabDecline = document.getElementById("tab-7-3");
    let divApprove = TabApprove.classList.contains("active");
    let divDecline = TabDecline.classList.contains("active");
    if (divApprove == true) {
      Auth.searchByApproveDetails(x, Leavevalue).then(response => {
        var temObj = "";
        var c = 1;
        if (response.leaves != undefined) {
          for (var i = 0; i < response.leaves.length; i++) {
            // response.leaves[i].indexValue = c;
            // c = c + 1;
            if (
              (response.leaves[i].start_date && response.leaves[i].end_date) !=
              undefined
            ) {
              if (
                (response.leaves[i].start_date &&
                  response.leaves[i].end_date) != undefined
              ) {
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
              }
              if (response.leaves[i].leave_type == "Casual Leave") {
                temObj = response.leaves[i].balance.casual;
              } else if (response.leaves[i].leave_type == "Sick Leave") {
                temObj = response.leaves[i].balance.sick;
              }
              else if (response.leaves[i].leave_type == "Birthday Leave") {
                temObj = response.leaves[i].balance.birthday;
              }
              else if (response.leaves[i].leave_type == "Privileged Leave") {
                temObj = response.leaves[i].balance.privileged;
              }
              else if (response.leaves[i].leave_type == "CompoOff Leave") {
                temObj = response.leaves[i].balance.compoOff;
              }
              response.leaves[i].leaveBalance = temObj;
            }
          }
          // sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

          this.setState({
            itemsapproved: response.leaves,
            activePage: 1,
            userList: response.leaves
          });
          var todos1 = this.state.itemsapproved;
          const { currentPage, todosPerPage } = this.state;
          const indexOfLastTodo = currentPage * todosPerPage;
          if (x != "") {
            indexOfFirstTodo = 0;
          } else {
            indexOfFirstTodo = indexOfLastTodo - todosPerPage;
          }
          // const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
          this.setState({ approve: indexOfFirstTodo + 1 });
          const currentTodos = todos1.slice(indexOfFirstTodo, indexOfLastTodo);
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
            else if (x == "CompoOff Leave") {
              arr[i].leave_type = "Comp Off";
            }
          }
          this.setState({
            dataPerPage: arr
          });
          const pageNumbersn = [];
          for (let i = 1; i <= Math.ceil(todos1.length / todosPerPage); i++) {
            pageNumbersn.push(i);
          }
          this.setState({
            number: pageNumbersn
          });
        }
      });
    } else if (divDecline == true) {
      Auth.searchByDeclineDetails(x, Leavevalue).then(response => {
        var temObj = "";
        var sortedLeaves = [];
        var c = 1;
        if (response.leaves != undefined) {
          for (var i = 0; i < response.leaves.length; i++) {
            // response.leaves[i].indexValue = c;
            // c = c + 1;
            if (
              (response.leaves[i].start_date && response.leaves[i].end_date) !=
              undefined
            ) {
              if (
                (response.leaves[i].start_date &&
                  response.leaves[i].end_date) != undefined
              ) {
                var raisedOn = new Date(response.leaves[i].requested_at)
                  .toISOString()
                  .substring(0, 10);
                var datestring = raisedOn.split("-");
                var finalRequestDate =
                  datestring[2] + "-" + datestring[1] + "-" + datestring[0];

                response.leaves[i].requested_at = finalRequestDate;
                // var raisedOn = new Date(response.leaves[i].requested_at);
                // response.leaves[i].requested_at =
                //   raisedOn.getDate() +
                //   "-" +
                //   monthNames[raisedOn.getMonth()] +
                //   "-" +
                //   raisedOn
                //     .getFullYear()
                //     .toString()
                //     .substr(-2)
                if (response.leaves[i].approved_by.length > 0) {
                  for (
                    var j = 0;
                    j < response.leaves[i].approved_by.length;
                    j++
                  ) {
                    if (response.leaves[i].approved_by[j] == "Admin") {
                      response.leaves[i].message = "Approved By Admin";
                    } else if (
                      response.leaves[i].approved_by[j] == "SuperAdmin"
                    ) {
                      response.leaves[i].message = "Approved By SuperAdmin";
                    }
                  }
                }
              }
              if (response.leaves[i].leave_type == "Casual Leave") {
                temObj = response.leaves[i].balance.casual;
              } else if (response.leaves[i].leave_type == "Sick Leave") {
                temObj = response.leaves[i].balance.sick;
              }
              else if (response.leaves[i].leave_type == "Birthday Leave") {
                temObj = response.leaves[i].balance.birthday;
              }
              else if (response.leaves[i].leave_type == "Privileged Leave") {
                temObj = response.leaves[i].balance.privileged;
              }
              else if (response.leaves[i].leave_type == "CompoOff Leave") {
                temObj = response.leaves[i].balance.compoOff;
              }
              response.leaves[i].leaveBalance = temObj;
            }
          }
          // sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

          this.setState({
            itemsrejected: response.leaves,
            activePageDec: 1,
            userList: response.leaves
          });
          var todoData = this.state.itemsrejected;
          const { todos, currentPage, todosPerPage } = this.state;
          const indexOfLastTodo = currentPage * todosPerPage;
          if (x != "") {
            indexOfFirstTodo = 0;
          } else {
            indexOfFirstTodo = indexOfLastTodo - todosPerPage;
          }
          // const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
          this.setState({ decline: indexOfFirstTodo + 1 });
          const currentTodos = todoData.slice(
            indexOfFirstTodo,
            indexOfLastTodo
          );
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
            else if (x == "CompoOff Leave") {
              arr[i].leave_type = "Comp Off";
            }
          }
          this.setState({
            declinePage: arr
          });
          const pageNumbers1 = [];
          for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
            pageNumbers1.push(i);
          }
          this.setState({
            numbers: pageNumbers1
          });
        }
      });
    }
  }
  /* End Change Leave type Tab Approve or Decline   */
  /* Start Assign Id into Employee Id   */
  handleShow(id) {
    this.setState({
      empId: id
    });
  }
  /* End Assign Id into Employee Id   */
  /* Start Assign value into Leave Details  */
  leaveDetails = item => {
    this.setState({
      leaveDetails: item.leave_details
    });
  };
  /* End Assign value into Leave Details  */
  /* Start Assign Decline id into empId  */
  handleShowDecline(id) {
    this.setState({
      empId: id
    });
  }
  /* End Assign Decline id into empId  */
  /* Start Aapprove on Click Business Logic  */
  approveHandleClick = number => {
    this.setState({
      activePage: number
    });
    if (this.state.searchValue == "" && this.state.searchLeavevalue == "All") {
      Auth.getLeavesDetail().then(response => {
        var approvedItem = [];
        var approvedResponseleaves = [];
        var rejectedItem = [];
        var userinfo = [];
        var tempObj = "";
        var c = 1;
        this.setState({
          totalApprovedLeave: response.leaves
        })
        if (response.status == 200) {
          for (var i = 0; i < response.leaves.length; i++) {
            if (
              (response.leaves[i].start_date && response.leaves[i].end_date) !=
              undefined
            ) {
              if (
                (response.leaves[i].start_date &&
                  response.leaves[i].end_date) != undefined
              ) {
                var raisedOn = new Date(response.leaves[i].requested_at)
                  .toISOString()
                  .substring(0, 10);
                var datestring = raisedOn.split("-");
                var finalRequestDate =
                  datestring[2] + "-" + datestring[1] + "-" + datestring[0];

                response.leaves[i].requested_at = finalRequestDate;
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
              }
            }
            if (response.leaves[i].approval_status == "Approved") {
              // response.leaves[i].indexValue = c;
              // c = c + 1;
              if (response.leaves[i].leave_type == "Casual Leave") {
                tempObj = response.leaves[i].balance.casual;
              } else if (response.leaves[i].leave_type == "Sick Leave") {
                tempObj = response.leaves[i].balance.sick;
              }
              else if (response.leaves[i].leave_type == "Birthday Leave") {
                tempObj = response.leaves[i].balance.birthday;
              }
              else if (response.leaves[i].leave_type == "Privileged Leave") {
                tempObj = response.leaves[i].balance.privileged;
              }
              else if (response.leaves[i].leave_type == "CompoOff Leave") {
                tempObj = response.leaves[i].balance.compoOff;
              }
              response.leaves[i].leaveBalance = tempObj;
              approvedItem.push(response.leaves[i]);
            }
          }
          approvedResponseleaves = (approvedItem.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
          this.setState({
            totalApprovedLeave: approvedResponseleaves
          });
        }


        var todos = this.state.totalApprovedLeave;
        const indexOfLastTodo = number * this.state.todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
        this.setState({ approve: indexOfFirstTodo + 1 });
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
          else if (x == "CompoOff Leave") {
            arr[i].leave_type = "Comp Off";
          }
        }
        this.setState({
          dataPerPage: arr
        });
      });
    }
  };
  /* End Aapprove on Click Business Logic  */

  /* Start Pagination on Click Business Logic  */
  handleClick = number => {
    this.setState({
      activePage: number,
      currentPage: number
    });

    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ count: indexOfFirstTodo + 1 });
    const currentTodos = this.state.userList.slice(
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
      else if (x == "CompoOff Leave") {
        arr[i].leave_type = "Comp Off";
      }
    }
    this.setState({
      dataPerPageUser: arr
    });
  };
  /* End Pagination on Click Business Logic  */
  /* Start Decline on Click Business Logic  */
  declineHandleClick = number => {
    this.setState({
      activePageDec: number
    });
    if (this.state.searchValue == "" && this.state.searchLeavevalue == "All") {
      Auth.getLeaveStatusDeclineData().then(response => {
        var approvedItem = [];
        var approvedResponseleaves = [];
        var rejectedItem = [];
        var userinfo = [];
        var tempObj = "";
        if (response.status == 200) {
          for (var i = 0; i < response.leaves.length; i++) {
            if (
              (response.leaves[i].start_date && response.leaves[i].end_date) !=
              undefined
            ) {
              if (
                (response.leaves[i].start_date &&
                  response.leaves[i].end_date) != undefined
              ) {
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
              }
            }
            if (response.leaves[i].approval_status == "Rejected") {
              if (response.leaves[i].leave_type == "Casual Leave") {
                tempObj = response.leaves[i].balance.casual;
              } else if (response.leaves[i].leave_type == "Sick Leave") {
                tempObj = response.leaves[i].balance.sick;
              }
              else if (response.leaves[i].leave_type == "Birthday Leave") {
                tempObj = response.leaves[i].balance.birthday;
              }
              else if (response.leaves[i].leave_type == "Privileged Leave") {
                tempObj = response.leaves[i].balance.privileged;
              }
              else if (response.leaves[i].leave_type == "CompoOff Leave") {
                tempObj = response.leaves[i].balance.compoOffOff;
              }
              response.leaves[i].leaveBalance = tempObj;

            }
            approvedItem.push(response.leaves[i]);

          }
          approvedResponseleaves = (approvedItem.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
          this.setState({
            itemsrejected: approvedResponseleaves
          });
        }

        var todos = this.state.itemsrejected;
        const indexOfLastTodo = number * this.state.todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
        this.setState({ decline: indexOfFirstTodo + 1 });
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
          else if (x == "CompoOff Leave") {
            arr[i].leave_type = "Comp Off";
          }
        }
        this.setState({
          declinePage: arr
        });
      });
    }
  };
  /* End Decline on Click Business Logic  */

  /* Start Decline Leave  on Click Business Logic  */
  declineLeave(id) {
    this.setState({
      showDec: true,
      empId: id
    });
    var user = window.localStorage.getItem("id_token");
    Auth.declineLeaveStatus(id).then(res => {
      this.apiResponse(res);
      var listOfLeaves = [];
      listOfLeaves = this.state.dataPerPage;
      for (var i = 0; i < listOfLeaves.length; i++) {
        var obj = listOfLeaves[i];
        if (obj._id == id) {
          this.state.dataPerPage.splice(i, 1);
          this.setState({
            dataPerPage: this.state.dataPerPage
          });
        }
      }
    });
    this.setState({
      showDec: false,
      showAlert: true,
      alertMessage: "Leave declined successfully"
    });
    setTimeout(() => {
      this.setState({ alertMessage: "", showAlert: false });
    }, 4000);
  }
  /* End Decline Leave  on Click Business Logic  */
  /* Start Change Leave type Tab Approve or Decline   */
  testing() {
    var tabA = document.getElementById("tab-7-3");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-7-2");
    tabB.classList.add("active");
    tabB.classList.add("show");
    var element = document.getElementById("tab-7-2");
    element.classList.remove("mystyle");
    var leave = this.state.searchLeavevalue;
    var name = this.state.searchValue;
    var sortedLeaves = [];
    Auth.getLeavesDetailApproved(leave, name, this.state.page, this.state.limit).then(response => {

      var temObj = "";
      var c = 1;
      if (response.leaves != undefined) {
        for (var i = 0; i < response.leaves.length; i++) {
          // response.leaves[i].indexValue = c;
          // c = c + 1;
          if (
            (response.leaves[i].start_date && response.leaves[i].end_date) !=
            undefined
          ) {
            if (
              (response.leaves[i].start_date && response.leaves[i].end_date) !=
              undefined
            ) {
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
            }
            if (response.leaves[i].leave_type == "Casual Leave") {
              temObj = response.leaves[i].balance.casual;
            } else if (response.leaves[i].leave_type == "Sick Leave") {
              temObj = response.leaves[i].balance.sick;
            }
            else if (response.leaves[i].leave_type == "Birthday Leave") {
              temObj = response.leaves[i].balance.birthday;
            }
            else if (response.leaves[i].leave_type == "Privileged Leave") {
              temObj = response.leaves[i].balance.privileged;
            }
            else if (response.leaves[i].leave_type == "CompoOff Leave") {
              temObj = response.leaves[i].balance.compoOff;
            }
            response.leaves[i].leaveBalance = temObj;
          }
        }
        // sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        this.setState({
          itemsapproved: response.leaves,
          activePage: 1
        });

        var todos1 = this.state.itemsapproved;
        const { todos, currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        this.setState({ approve: indexOfFirstTodo + 1 });
        const currentTodos = todos1.slice(indexOfFirstTodo, indexOfLastTodo);
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
          else if (x == "CompoOff Leave") {
            arr[i].leave_type = "Comp Off";
          }
        }
        this.setState({
          dataPerPage: arr,
          activePage: 1
        });
        const pageNumbersn = [];
        for (let i = 1; i <= Math.ceil(todos1.length / todosPerPage); i++) {
          pageNumbersn.push(i);
        }
        this.setState({
          number: pageNumbersn
        });
      }
    });

    console.log(this.state.activePage);
    console.log(this.state.activePageDec);
  }
  /* End Change Leave type Tab Approve or Decline   */
 
  getLeaveStatusDecline() {
    this.setState({
      declinetable: true
    }); setTimeout(() => {
      this.setState({ declinetable: false });
    }, 1000);
    var tabA = document.getElementById("tab-7-2");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-7-3");
    tabB.classList.add("active");
    tabB.classList.add("show");
    var leave = this.state.searchLeavevalue;
    var name = this.state.searchValue;
    var sortedLeaves = [];
    Auth.getLeaveStatusDeclineData(leave, name, this.state.page, this.state.limit).then(response => {
      var temObj = "";
      this.setState({
        leavesCountDecline: response.leavesCount
      })
      if (response.leaves != undefined) {
        for (var i = 0; i < response.leaves.length; i++) {
          if (
            (response.leaves[i].start_date && response.leaves[i].end_date) !=
            undefined
          ) {
            if (
              (response.leaves[i].start_date && response.leaves[i].end_date) !=
              undefined
            ) {
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
              if (response.leaves[i].approved_by.length > 0) {
                for (
                  var j = 0;
                  j < response.leaves[i].approved_by.length;
                  j++
                ) {
                  if (response.leaves[i].approved_by[j] == "Admin") {
                    response.leaves[i].message = "Approved By HR";
                  } else if (
                    response.leaves[i].approved_by[j] == "SuperAdmin"
                  ) {
                    response.leaves[i].message = "Approved By Delivery Head";
                  }
                  else if (response.leaves[i].approved_by[j] == "HR") {
                    response.leaves[i].message = "Approved By HR";
                  }
                }
              }
            }
            if (response.leaves[i].leave_type == "Casual Leave") {
              temObj = response.leaves[i].balance.casual;
            } else if (response.leaves[i].leave_type == "Sick Leave") {
              temObj = response.leaves[i].balance.sick;
            }
            else if (response.leaves[i].leave_type == "Birthday Leave") {
              temObj = response.leaves[i].balance.birthday;
            }
            else if (response.leaves[i].leave_type == "Privileged Leave") {
              temObj = response.leaves[i].balance.privileged;
            }
            else if (response.leaves[i].leave_type == "CompoOff Leave") {
              temObj = response.leaves[i].balance.compoOff;
            }
            response.leaves[i].leaveBalance = temObj;
          }
        }
        // sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

        this.setState({
          itemsrejected: response.leaves,
          activePageDec: 1
        });
        var todoData = this.state.itemsrejected;
        const { todos, currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        this.setState({ decline: indexOfFirstTodo + 1 });
        const currentTodos = todoData.slice(indexOfFirstTodo, indexOfLastTodo);
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
          else if (x == "CompoOff Leave") {
            arr[i].leave_type = "Comp Off";
          }
        }
        this.setState({
          declinePage: arr,
        });
        const pageNumbers1 = [];
        for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
          pageNumbers1.push(i);
        }
        this.setState({
          numbers: pageNumbers1
        });
      }
    });
  }

  /* Start Approve Leave on Click Business Logic  */
  approveLeave(id) {
    this.setState({
      showDec: true,
      idTest: id
    });

    var user = window.localStorage.getItem("id_token");
    Auth.approveLeaveStatus(id).then(res => {
      listOfLeaves = this.state.declinePage;
      for (var i = 0; i < listOfLeaves.length; i++) {
        var obj = listOfLeaves[i];
        if (res.message == "Leave approved by Admin") {
          if (obj._id == id) {
            listOfLeaves[i].message = "Approved By HR";
          }
          this.setState({
            show: false,
            showAlert: true,
            alertMessage: res.message,
            declinePage: listOfLeaves
          });
        } else if (res.message == "Leave approved by SuperAdmin") {
          if (obj._id == id) {
            listOfLeaves[i].message = "Approved By Delivery Head";
          }
          this.setState({
            show: false,
            showAlert: true,
            alertMessage: res.message,
            declinePage: listOfLeaves
          });
        }
        else if (res.message == "Leave approved by HR") {
          this.setState({
            show: false,
            showAlert: true,
            alertMessage: res.message
          });
          if (obj._id == id) {
            listOfLeaves[i].message = "Approved By HR";
          }
        }

        else {
          this.setState({
            show: false,
            showAlert: true,
            alertMessage: res.message
          });
        }
      }

      if (res.message == "Leave updated successfully") {
        var listOfLeaves = [];
        listOfLeaves = this.state.declinePage;
        for (var i = 0; i < listOfLeaves.length; i++) {
          var obj = listOfLeaves[i];

          if (obj._id == id) {
            this.state.declinePage.splice(i, 1);
            this.setState({
              declinePage: this.state.declinePage
            });
          }
        }
        this.setState({
          showDec: false,
          showAlert: true,
          alertMessage: "Leave approved Successfully"
        });
      }
      // else{
      //   this.setState({
      //     declinePage:listOfLeaves
      //   })
      // }
      // else {

      //   this.setState({
      //     showDec: false,
      //     showAlert: true,
      //     danger: true,
      //     alertMessage: data.message
      //   })
      // }
    });

    setTimeout(() => {
      this.setState({ alertMessage: "", showAlert: false });
    }, 4000);
  }
  /* End Approve Leave  on Click Business Logic  */
  apiResponse = data => {
    if (data.success == true) {
    } else {
    }
  };
  /* Start Show Alert toost Message on click Approve or Decline   */
  handleAlert = () => {
    this.setState({ showAlert: false, alertMessage: "", danger: false });
  };
  /* End Show Alert toost Message on click Approve or Decline   */
  /* Start Main Business Logic when page load  */

  componentDidMount() {
    var dashNotleave = document.getElementById("dashNotleavedetail");
    dashNotleave.classList.add("active");
    var leave = this.state.searchLeavevalue;
    var name = this.state.searchValue;
    var sortedLeaves = [];
    Auth.getLeavesDetail(leave, name, this.state.limit, this.state.page).then(response => {
      var approvedItem = [];
      var rejectedItem = [];
      var sortedLeaves = [];
      var approvedResponseleaves = [];
      var userinfo = [];
      var tempObj = "";
      var c = 1;
      if (response.leaves != undefined) {
        for (var i = 0; i < response.leaves.length; i++) {
          if ((response.leaves[i].start_date && response.leaves[i].end_date) != undefined) {
            if (
              (response.leaves[i].start_date && response.leaves[i].end_date) !=
              undefined
            ) {
              var raisedOn = new Date(response.leaves[i].requested_at)
                .toISOString()
                .substring(0, 10);
              var datestring = raisedOn.split("-");
              var finalRequestDate =
                datestring[2] + "-" + datestring[1] + "-" + datestring[0];
              response.leaves[i].requested_at = finalRequestDate;
            }
          }
          if (response.leaves[i].approval_status == "Approved") {
            if (response.leaves[i].leave_type == "Casual Leave") {
              tempObj = response.leaves[i].balance.casual;
            } else if (response.leaves[i].leave_type == "Sick Leave") {
              tempObj = response.leaves[i].balance.sick;
            }
            else if (response.leaves[i].leave_type == "Birthday Leave") {
              tempObj = response.leaves[i].balance.birthday;
            }
            else if (response.leaves[i].leave_type == "Privileged Leave") {
              tempObj = response.leaves[i].balance.privileged;
            }
            else if (response.leaves[i].leave_type == "CompoOff Leave") {
              tempObj = response.leaves[i].balance.compoOff;
            }
            response.leaves[i].leaveBalance = tempObj;
            approvedItem.push(response.leaves[i]);
          }
        }
        sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        approvedResponseleaves = (approvedItem.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        this.setState({
          items: sortedLeaves,
          todos: approvedResponseleaves,
          itemsapproved: approvedResponseleaves,
          dataPerPage: sortedLeaves,
          loading: false,
          tableloader: true
        }); setTimeout(() => {
          this.setState({ tableloader: false });
        }, 500);
        const { todos, currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = approvedItem.slice(
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
          else if (x == "CompoOff Leave") {
            arr[i].leave_type = "Comp Off";
          }
        }
        this.setState({
          dataPerPage: arr,
          leavesCountApproved: todos.length
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
    const profile = Auth.getProfile();
    this.setState({
      logger: profile.role
    })
    Auth.getUserList("").then(response => {
      var imagedata = [];
      var responseusers = [];
      if (response.status == 200) {
        for (var i = 0; i < response.users.length; i++) {
          response.users[i].index = i + 1;
          if (response.users[i].imageData != undefined) {
            imagedata = response.users[i].imageData;
          }
        }
        this.setState({
          userList: response.users,
          todos: response.users,
          dataUser: response.users,
          loading: false
        });
      }
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
        dataPerPageUser: arr
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
  /* End Main Business Logic when page load  */

  /* Start show Trim leave reason value */

  trimReason(e) {
    const res = arguments[0].slice(0, 10);
    return res;
  }
  /* End show Trim leave reason value */
  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
        <img className="img-circle small-image" src={imagePreviewUrl} />
      );
    } else {
      $imagePreview = (
        <img
          className="img-circle small-image"
          src="/assets/img/users/u8.jpg"
        />
      );
    }
    var approveAdd = this.state.approve;
    var declineAdd = this.state.decline;
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

          <div>
            <div className="modal fade" id="leaveDetails">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Leave Type</h4>
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
                            <th>Leave Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.leaveDetails.map(item => (
                            <tr key={item._id}>
                              <td className="tbl-date">{item.leave_date}</td>
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
          </div>

          <div className="modal fade" id="apporved">
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
          <div className="modal fade" id="decline">
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
          {/* ChatComment */}
          <div className="modal fade" id="Chatcmt" data-backdrop="static">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header applyleave">
                  <h4 className="modal-title applyleave">
                    Chat Window
                </h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    onClick={this.cancelComment}
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
                                <span><small>{item.Role}</small></span> <br></br>
                                <span>{item.Message}</span>
                              </div>
                            )}

                          </div>
                        </div>
                      </section>
                    </div>
                    <div className="modal-footer">
                      <div className="input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Type your text here"
                          ref="chatRec"
                          onChange={this.handleChangeReason}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={this.submitComment}
                        disabled={!this.state.Validate}
                        className="btn btn-primary btn-rounded">
                        <i className="fa fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>



              </div>
            </div>
          </div>
          {/* ChatRecord */}
          <div className="modal fade" id="Chatrecord" data-backdrop="static">
            <div className="modal-dialog">
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
                                <span><small>{item.Role}</small></span> <br></br>
                                <span>{item.Message}</span>
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
            <div className="col-md-12">
              <div className="ibox">
                <div className="ibox-head box-emp-mang">
                  <div className="form">
                    <div className="form-group leave-type-select">
                      <label></label>
                      <select
                        ref="leave_type"
                        className="form-control"
                        onChange={this.handleLeaveTypeOption}
                      >
                        <option>All</option>
                        <option value="Sick Leave">Sick</option>
                        <option value="Casual Leave">Casual</option>
                        <option value="Birthday Leave">Birthday</option>
                        <option value="Privileged Leave">Privileged</option>
                        <option value="CompoOff Leave">Comp Off</option>
                      </select>
                    </div>
                  </div>
                  <div className="ibox-title page-head">
                    Employee Leave Status
                  </div>
                  <div className="navbar-search empSearch  box-emp-search">
                    <div className="rel">
                      <span className="search-icon">
                        <i className="ti-search"></i>
                      </span>
                      <input
                        className="form-control"
                        placeholder="Search By Name..."
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="ibox-body">
                  <ul className="nav nav-tabs tabs-line">
                    <li className="nav-item">
                      <div>
                        <a
                          className="nav-link approved active"
                          onClick={() => this.testing(this)}
                          href="#tab-7-2"
                          data-toggle="tab"
                        >
                          Approved <i className="fa fa-check-circle-o"></i>
                        </a>
                      </div>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link decline"
                        onClick={() => this.getLeaveStatusDecline(this)}
                        href="#tab-7-3"
                        data-toggle="tab"
                      >
                        Declined<i className="fa fa-times-circle-o"></i>
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    {/* {this.state.tableloader == true ? (
                      <div className="table-loader">
                        <Loader
                          type="ThreeDots"
                          color="#00BFFF"
                          height={100}
                          width={100}
                          timeout={4000} //3 secs
                        />
                      </div>
                    ) : ( */}
                    <div className="tab-pane fade show active" id="tab-7-2">
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
                              <th>Balance</th>

                              <th className="cmt-section">Reason</th>
                              <th className="cmt-section">Comment</th>
                              <th>Status</th>
                              <th>Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.dataPerPage.map((item, index) => (
                              <tr key={item._id}>
                                <td className="tbl-date">{index + this.state.approve}</td>

                                {/* <td className="tbl-date">{item.name}</td> */}
                                {/* <td className="tbl-date">{item.email}</td> */}

                                <td className="tbl-date pointer">
                                  <Link to={`/empProfile/${item.requested_by}`}>
                                    {item.person_name}
                                  </Link>
                                </td>
                                <td className="tbl-date">{item.start_date}</td>
                                <td className="tbl-date">{item.end_date}</td>
                                <td className="tbl-date">
                                  {item.requested_at}
                                </td>
                                <td className="tbl-date">{item.leave_days}</td>
                                <td className="tbl-date">{item.leave_type}</td>
                                <td className="tbl-date">
                                  {item.leaveBalance}
                                </td>
                                {/*                               
                            <td className="tbl-date">
                                  <button className="btn btn-outline-info" data-toggle="modal" data-target="#leaveDetails" aria-pressed="false" onClick={() => this.leaveDetails(item)}><i className="fa fa-list list-status"></i>Details</button></td> */}

                                {item.reason.length > 10 ? (
                                  <td className="cmt-section">
                                    <div
                                      id={"UncontrolledPopover-" + item._id}
                                      className="pointer"
                                    >
                                      {this.trimReason(item.reason, item._id)}
                                          ...
                                    </div>
                                    <UncontrolledPopover
                                      trigger="legacy"
                                      placement="bottom"
                                      target={"UncontrolledPopover-" + item._id}
                                    >
                                      <PopoverBody> {item.reason}</PopoverBody>
                                    </UncontrolledPopover>
                                  </td>
                                ) : (
                                    <td className="cmt-section">{item.reason}</td>
                                  )}
                                <td className="tbl-date"><div className="customtooltip">
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
                                  </span>{" "}
                                  <div className="customtooltip">
                                    <button
                                      className="btn badge-primary btn-xs m-r-5"
                                      data-toggle="modal"
                                      data-target="#apporved"
                                      onClick={() => this.handleShow(item._id)}
                                    >
                                      <i
                                        className="fa fa-edit font comment"
                                        aria-hidden="true"
                                      ></i>{" "}
                                    </button>
                                    <span className="tooltiptext">Decline</span>
                                  </div>
                                </td>
                                <td>
                                  <Link to={`/empProfile/${item.requested_by}`}>
                                    <td className="tbl-date details tbl-padding">
                                      Details
                                    </td>
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-page">
                        <Pagination
                          activePage={this.state.activePage}
                          itemsCountPerPage={8}
                          totalItemsCount={100}
                          pageRangeDisplayed={3}
                          onChange={this.approveHandleClick}
                          itemClass="page-item no-padding"
                          linkClass="page-link"
                          prevPageText="Previous"
                          nextPageText="Next"
                          totalItemsCount={this.state.leavesCountApproved}
                        />
                      </div>
                    </div>
                    <div className="tab-pane fade" id="tab-7-3">
                      {/* {this.state.declinetable == true ? (
                        <div className="table-loader">
                          <Loader
                            type="ThreeDots"
                            color="#00BFFF"
                            height={100}
                            width={100}
                            timeout={3000} //3 secs
                          />
                        </div>
                      ) : ( */}
                      <div>
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
                                <th>Balance</th>

                                <th className="cmt-section">Reason</th>
                                <th className="cmt-section">Comment</th>
                                <th>Status</th>
                                <th>Details</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.declinePage.map((item, index) => (
                                <tr key={item._id}>
                                  <td className="tbl-date">
                                    {index + this.state.decline}
                                  </td>
                                  <td className="tbl-date pointer">
                                    <Link to={`/empProfile/${item.requested_by}`}>
                                      {item.person_name}
                                    </Link>
                                  </td>
                                  <td className="tbl-date">{item.start_date}</td>
                                  <td className="tbl-date">{item.end_date}</td>
                                  <td className="tbl-date">
                                    {item.requested_at}
                                  </td>
                                  <td className="tbl-date">{item.leave_days}</td>
                                  <td className="tbl-date">{item.leave_type}</td>
                                  <td className="tbl-date">
                                    {item.leaveBalance}
                                  </td>
                                  {/* <td className="tbl-date">
                                  <button className="btn btn-outline-info" data-toggle="modal" data-target="#leaveDetails" aria-pressed="false" onClick={() => this.leaveDetails(item)}><i className="fa fa-list list-status"></i>Details</button></td> */}

                                  {item.reason.length > 10 ? (
                                    <td className="cmt-section">
                                      <div
                                        id={"UncontrolledPopover-" + item._id}
                                        className="pointer"
                                      >
                                        {this.trimReason(item.reason, item._id)}
                                            ...
                                    </div>
                                      <UncontrolledPopover
                                        trigger="legacy"
                                        placement="bottom"
                                        target={"UncontrolledPopover-" + item._id}
                                      >
                                        {/* <PopoverHeader>Popover Title</PopoverHeader> */}
                                        <PopoverBody> {item.reason}</PopoverBody>
                                      </UncontrolledPopover>
                                    </td>
                                  ) : (
                                      <td className="cmt-section">{item.reason}</td>
                                    )}
                                  <td className="tbl-date"><div className="customtooltip">
                                    <button
                                      className="btn btn-xs"
                                      type="button"
                                      onClick={() => this.showComment(item._id)}
                                      data-toggle="modal"
                                      data-target="#Chatcmt"
                                    >
                                      <i className="fa fa-comments font comment"></i>
                                    </button>
                                    <span className="tooltiptext">Comment</span>
                                  </div></td>
                                  <td className="tbl-date">
                                    <span className="badge badge-danger">
                                      {item.approval_status}
                                    </span>{" "}
                                    <div className="customtooltip">
                                      <button
                                        className="btn badge-primary btn-xs m-r-5"
                                        onClick={() =>
                                          this.handleShowDecline(item._id)
                                        }
                                        data-toggle="modal"
                                        data-target="#decline"
                                        data-dismiss="modal"
                                      >
                                        <i
                                          className="fa fa-edit small-edit font comment"
                                          aria-hidden="true"
                                        ></i>
                                      </button>
                                      <span className="tooltiptext">Approve</span>
                                    </div>
                                    {/* <p>{item.message}</p> */}
                                    {item.message == "Approved By HR" ? (
                                      <div>
                                        <button className="btn btn-default tech leave-details btn-rounded m-r-20">
                                          Tech
                                      </button>
                                        <button className="btn btn-success hr leave-details btn-rounded">
                                          HR
                                      </button>
                                      </div>
                                    ) : (
                                        <div>
                                          {item.message ==
                                            "Approved By Delivery Head" ? (
                                              <div>
                                                <button className="btn btn-success tech leave-details btn-rounded m-r-20">
                                                  Tech
                                          </button>
                                                <button className="btn hr leave-details btn-default btn-rounded ">
                                                  HR
                                          </button>
                                              </div>
                                            ) : (
                                              <div>
                                                <button className="btn tech leave-details btn-default btn-rounded m-r-20">
                                                  Tech
                                          </button>
                                                <button className="btn hr leave-details btn-default btn-rounded">
                                                  HR
                                          </button>
                                              </div>
                                            )}
                                        </div>
                                      )}
                                  </td>
                                  <td>
                                    <Link to={`/empProfile/${item.requested_by}`}>
                                      <td className="tbl-date details tbl-padding">
                                        Details
                                    </td>
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-page">
                          <Pagination
                            activePage={this.state.activePageDec}
                            itemsCountPerPage={8}
                            totalItemsCount={100}
                            pageRangeDisplayed={3}
                            onChange={this.declineHandleClick}
                            itemClass="page-item no-padding"
                            linkClass="page-link"
                            prevPageText="Previous"
                            nextPageText="Next"
                            totalItemsCount={this.state.leavesCountDecline}
                          />
                        </div>
                      </div>
                      {/* )} */}
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
  handleAlertClass() {
    let classes = "alert alert-dismissable fade show alertpopup row toast-alert-pd ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
}
