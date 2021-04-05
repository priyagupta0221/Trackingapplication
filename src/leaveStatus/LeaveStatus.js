import React, { Component } from "react";
import ModalWindow from "../modal/ModalWindow";
import AuthService from "../AuthService";
import Pagination from "react-js-pagination";
import Loader from "react-loader-spinner";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
  withRouter
} from "react-router-dom";
const Auth = new AuthService();

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
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
export default class LeaveStatus extends Component {
  constructor(props) {
    super();
    this.handleShow = this.handleShow.bind(this);
    this.approveLeave = this.approveLeave.bind(this);
    this.declineLeave = this.declineLeave.bind(this);
    this.handleShowDecline = this.handleShowDecline.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.leaveDetails = this.leaveDetails.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLeaveTypeOption = this.handleLeaveTypeOption.bind(this);
    this.handleChangeReason = this.handleChangeReason.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.state = {
      items: [],
      empId: null,
      todos: [],
      dataPerPage: [],
      currentPage: 1,
      todosPerPage: 8,
      numbers: [],
      activePage: 1,
      leaveDetails: [],
      showAlert: false,
      alertMessage: "",
      loading: true,
      count: 1,
      message: "",
      Validate: false,
      leavetype: "",
      searchLeavevalue: "All",
      searchValue: "",
      adValue: "",
      superAdValue: "",
      logger: "",
      commentChat: [],
      userId: "",
      senderChat: []
    };
  }
  /* Start Show Comment on chat board */
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
  /* End Show Comment on chat board */

  /* Start Cancel Comment on chat board */
  cancelComment = () => {
    this.refs.chatRec.value = "";
    this.setState({
      Validate: false,
    })
  };
  /* End Cancel Comment on chat board */

  /* Start Show Edit Leave Type value on select box */
  editLeaveTypeChange(item) {
    this.setState({
      empId: item._id,
      leavetype: item.leave_type
    });
  }
  /* End Show Edit Leave Type value on select box */

  /* Start Change Leave Type value on select box */
  handleChangeLeaveType = event => {
    this.setState({
      leavetype: event.currentTarget.value
    });
  };
  /* End Change Leave Type value on select box */

  /* Start Change Leave Type functionality */
  changeLeaveType = () => {
    var id = this.state.empId;
    var switchMode = this.refs.leavetype.value + " " + "Leave";
    Auth.changeleavetype(id, switchMode).then(response => {
      if (response.status == 200) {
        this.setState({
          alertMessage: response.message,
          showAlert: true,
          danger: false,
          show: true
        });
        setTimeout(() => {
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);

        this.handleLeaveChange(this.state.searchLeavevalue);

        // this.componentDidMount();
      } else {
        this.setState({
          alertMessage: response.message,
          showAlert: true,
          danger: true,
          show: true
        });
        setTimeout(() => {
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);
      }
    });
  };
  /* End Change Leave Type functionality */

  /*Start Handal Change Leave Type With search functionality */
  handleLeaveChange(leaveType) {
   
    var searchname = this.state.searchValue;
    Auth.searchByLeavetype(leaveType, searchname).then(response => {
      if (response.status == 200) {
        var temObj = "";
        var sortedLeaves = [];
        for (var i = 0; i < response.leaves.length; i++) {
          for (var j = 0; j < response.leaves[i].leave_details.length; j++) {
            var date = new Date(response.leaves[i].leave_details[j].leave_date);
            var day = weekday[date.getDay()];
            if (j < response.leaves[i].leave_details.length) {
              response.leaves[i].leave_details[j].day = day;
            }
          }
          var raisedOn = new Date(response.leaves[i].requested_at)
            .toISOString()
            .substring(0, 10);
          var datestring = raisedOn.split("-");
          var finalRequestDate =
            datestring[2] + "-" + datestring[1] + "-" + datestring[0];

          response.leaves[i].requested_at = finalRequestDate;
          // raisedOn.getDate() +
          // "-" +
          // monthNames[raisedOn.getMonth()] +
          // "-" +
          // raisedOn.getFullYear();
          if (response.leaves[i].approved_by.length > 0) {
            for (var j = 0; j < response.leaves[i].approved_by.length; j++) {
              if (response.leaves[i].approved_by[j] == "Admin") {
                response.leaves[i].message = "Approved By HR";
              } else if (response.leaves[i].approved_by[j] == "SuperAdmin") {
                response.leaves[i].message = "Approved By Delivery Head";
              }
              else if (response.leaves[i].approved_by[j] == "HR") {
                response.leaves[i].message = "Approved By HR";
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
          response.leaves[i].leaveBalance = temObj;
        }
        sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

        this.setState({
          items: sortedLeaves,
          todos: sortedLeaves,
          loading: false
        });
        const { todos, currentPage, todosPerPage } = this.state;
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
          else if (x == "CompoOff Leave") {
            arr[i].leave_type = "Comp Off";
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
      }
      // this.setState({
      // dataPerPage: response.leaves
      // });
    });
  }
  /*End Handal Change Leave Type With search functionality */

  handleShow = id => {
    this.setState({
      empId: id
    });
  };
  /* Start send comment in chat window functionality */
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
  /* End send comment in chat window functionality */

  /* Start Handle leave request Responce functionality */
  apiresponce1 = () => {
    var leave = this.state.searchLeavevalue;
    var name = this.state.searchValue;
    Auth.getLeaveStatus(leave, name).then(response => {
      var temObj = "";
      var sortedLeaves = [];
      for (var i = 0; i < response.leaves.length; i++) {
        for (var j = 0; j < response.leaves[i].leave_details.length; j++) {
          var date = new Date(response.leaves[i].leave_details[j].leave_date);
          var day = weekday[date.getDay()];
          if (j < response.leaves[i].leave_details.length) {
            response.leaves[i].leave_details[j].day = day;
          }
        }

        var raisedOn = new Date(response.leaves[i].requested_at)
          .toISOString()
          .substring(0, 10);
        var datestring = raisedOn.split("-");
        var finalRequestDate =
          datestring[2] + "-" + datestring[1] + "-" + datestring[0];

        response.leaves[i].requested_at = finalRequestDate;
        if (response.leaves[i].approved_by.length > 0) {
          for (var j = 0; j < response.leaves[i].approved_by.length; j++) {
            if (response.leaves[i].approved_by[j] == "Admin") {
              response.leaves[i].message = "Approved By HR";
            } else if (response.leaves[i].approved_by[j] == "SuperAdmin") {
              response.leaves[i].message = "Approved By Delivery Head";
            }
            else if (response.leaves[i].approved_by[j] == "HR") {
              response.leaves[i].message = "Approved By HR";
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
        response.leaves[i].leaveBalance = temObj;
      }
      sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

      this.setState({
        items: sortedLeaves,
        todos: sortedLeaves,
        loading: false
      });
      const { todos, currentPage, todosPerPage } = this.state;
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
        else if (x == "CompoOff Leave") {
          arr[i].leave_type = "Comp Off";
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
  /* End Handle leave request Responce functionality */

  /* Start Handle Leave Type Option filter functionality */

  handleLeaveTypeOption(event) {
    let indexOfFirstTodo = 0;
    var x = event.target.value;
    var searchname = this.state.searchValue;
    this.setState({
      searchLeavevalue: event.target.value
    });
    Auth.searchByLeavetype(x, searchname).then(response => {
      if (response.leaves != undefined) {
        var temObj = "";
        var sortedLeaves = [];
        for (var i = 0; i < response.leaves.length; i++) {
          var raisedOn = new Date(response.leaves[i].requested_at)
            .toISOString()
            .substring(0, 10);
          var datestring = raisedOn.split("-");
          var finalRequestDate =
            datestring[2] + "-" + datestring[1] + "-" + datestring[0];
          response.leaves[i].requested_at = finalRequestDate;
          if (response.leaves[i].approved_by.length > 0) {
            for (var j = 0; j < response.leaves[i].approved_by.length; j++) {
              if (response.leaves[i].approved_by[j] == "Admin") {
                response.leaves[i].message = "Approved By HR";
              } else if (response.leaves[i].approved_by[j] == "SuperAdmin") {
                response.leaves[i].message = "Approved By Delivery Head";
              }
              else if (response.leaves[i].approved_by[j] == "HR") {
                response.leaves[i].message = "Approved By HR";
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
        sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

        this.setState({
          items: sortedLeaves,
          todos: sortedLeaves,
          loading: false
        });
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
        for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
          pageNumbers.push(i);
        }
        this.setState({
          numbers: pageNumbers
        });
      }
    });
  }
  /* End Handle Leave Type Option filter functionality */

  /* Start Handle keywoard search filter functionality */

  handleChange(event) {
    let indexOfFirstTodo = 0;
    var x = event.target.value;
    var Leavevalue = this.state.searchLeavevalue;
    this.setState({
      searchValue: event.target.value
    });
    Auth.searchByName(x, Leavevalue).then(response => {
      if (response.status == 200) {
        var temObj = "";
        var sortedLeaves = [];
        for (var i = 0; i < response.leaves.length; i++) {
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
            for (var j = 0; j < response.leaves[i].approved_by.length; j++) {
              if (response.leaves[i].approved_by[j] == "Admin") {
                response.leaves[i].message = "Approved By HR";
              } else if (response.leaves[i].approved_by[j] == "SuperAdmin") {
                response.leaves[i].message = "Approved By Delivery Head";
              }
              else if (response.leaves[i].approved_by[j] == "HR") {
                response.leaves[i].message = "Approved By HR";
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
          response.leaves[i].leaveBalance = temObj;
        }

        sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

        this.setState({
          items: sortedLeaves,
          todos: sortedLeaves,
          loading: false
        });

        const { todos, currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        if (x != "") {
          indexOfFirstTodo = 0;
        } else {
          indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        }
        // const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
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
          else if (x == "CompoOff Leave") {
            arr[i].leave_type = "Comp Off";
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
      }
    });
  }
  /* End Handle keywoard search filter functionality */
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
  /* End add comment  Business Logic */
  /* Start Main Business Logic when page load  */
  componentDidMount() {
    var dashNotele = document.getElementById("dashNot");
    dashNotele.classList.add("active");
    Auth.getLeaveStatus(
      this.state.searchLeavevalue,
      this.state.searchValue
    ).then(response => {
      if (response.status == 200) {
        var temObj = "";
        var sortedLeaves = [];
        for (var i = 0; i < response.leaves.length; i++) {
          for (var j = 0; j < response.leaves[i].leave_details.length; j++) {
            var date = new Date(response.leaves[i].leave_details[j].leave_date);
            var day = weekday[date.getDay()];
            if (j < response.leaves[i].leave_details.length) {
              response.leaves[i].leave_details[j].day = day;
            }
          }

          var raisedOn = new Date(response.leaves[i].requested_at)
            .toISOString()
            .substring(0, 10);
          var datestring = raisedOn.split("-");
          var finalRequestDate =
            datestring[2] + "-" + datestring[1] + "-" + datestring[0];

          response.leaves[i].requested_at = finalRequestDate;

          if (response.leaves[i].approved_by.length > 0) {
            for (var j = 0; j < response.leaves[i].approved_by.length; j++) {
              if (response.leaves[i].approved_by[j] == "Admin") {
                response.leaves[i].message = "Approved By HR";
              } else if (response.leaves[i].approved_by[j] == "SuperAdmin") {
                response.leaves[i].message = "Approved By Delivery Head";
              }
              else if (response.leaves[i].approved_by[j] == "HR") {
                response.leaves[i].message = "Approved By HR";
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

        sortedLeaves = response.leaves;
        //.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        console.log(sortedLeaves);
        this.setState({
          items: sortedLeaves,
          todos: sortedLeaves,
          loading: false
        });
        const { todos, currentPage, todosPerPage } = this.state;
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
          else if (x == "CompoOff Leave") {
            arr[i].leave_type = "Comp Off";
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
      }
    });
    this.permissionEnable();
  }
  /* End Main Business Logic when page load  */
  /* Start Permission Enable for Admin/SuperAdmin or HR Business Logic when page load  */
  permissionEnable() {
    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then(response => {
      this.setState({
        logger: response.user.role
      })
      console.log(response);
      if (response.user.role == "Admin") {
        this.setState({ adValue: "enable" });
      } else if (response.user.role == "SuperAdmin") {
        this.setState({ superAdValue: "enable" });
      }
      else if (response.user.role == "HR") {
        this.setState({ adValue: "enable" });
      }
    });
  }
  /* End Permission Enable for Admin/SuperAdmin or HR Business Logic when page load  */

  /* Start Approve Leave on Click Business Logic  */
  approveLeave(id) {
    Auth.approveLeaveStatus(id).then(response => {
      var listOfLeaves = [];
      var listOfAllLeaves = [];
      this.setState({
        show: false,
        showAlert: true,
        alertMessage: response.message
      });
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
          }
        } else if (response.message == "Leave approved by SuperAdmin") {
          this.setState({
            show: false,
            showAlert: true,
            alertMessage: response.message
          });
          if (obj._id == id) {
            listOfLeaves[i].message = "Approved By Delivery Head";
          }
        }
        else if (response.message == "Leave approved by HR") {
          this.setState({
            show: false,
            showAlert: true,
            alertMessage: response.message
          });
          if (obj._id == id) {
            listOfLeaves[i].message = "Approved By HR";
          }
        }

        if (obj._id == id && response.message == "Leave updated successfully") {
          this.state.dataPerPage.splice(i, 1);
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
    });
    setTimeout(() => {
      this.setState({ alertMessage: "", showAlert: false });
    }, 4000);
  }
  /* End Approve Leave on Click Business Logic  */
  /* Start Decline Leave on Click Business Logic  */
  declineLeave(id) {
    Auth.declineLeaveStatus(id).then(response => {
      this.apiResponse(response);
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
  /* End Decline Leave on Click Business Logic  */
  apiResponse = response => {
    if (response.success == true) {
    } else {
    }
  };

  /* Start Assign Id into Employee Id   */
  handleShow(id) {
    this.setState({
      empId: id
    });
  }
  /* End Assign Id into Employee Id   */
  /* Start Disapprove Leave on Click Disapprove button Business Logic  */
  pendingLeave(id) {
    Auth.pendingLeaveStatus(id).then(response => {
      this.setState({
        showAlert: true,
        alertMessage: "Leave disapprove successfully"
      });
      this.componentDidMount();
      setTimeout(() => {
        this.setState({ alertMessage: "", showAlert: false });
      }, 4000);
    });
  }
  /* End Disapprove Leave on Click Disapprove button Business Logic  */

  /* Start Open Modal Decline Leave on Click Decline button   */
  handleShowDecline(id) {
    this.setState({
      showDec: true,
      empId: id
    });
  }
  /* End Open Modal Decline Leave on Click Decline button   */
  /* Start Pagination on Click Business Logic  */
  handleClick = number => {
    if (this.state.searchValue == "" && this.state.searchLeavevalue == "All") {
      Auth.getLeaveStatus().then(response => {
        var temObj = "";
        var sortedLeaves = [];
        if (response.status == 200) {
          for (var i = 0; i < response.leaves.length; i++) {
            for (var j = 0; j < response.leaves[i].leave_details.length; j++) {
              var date = new Date(
                response.leaves[i].leave_details[j].leave_date
              );
              var day = weekday[date.getDay()];
              if (j < response.leaves[i].leave_details.length) {
                response.leaves[i].leave_details[j].day = day;
              }
            }

            var raisedOn = new Date(response.leaves[i].requested_at)
              .toISOString()
              .substring(0, 10);
            var datestring = raisedOn.split("-");
            var finalRequestDate =
              datestring[2] + "-" + datestring[1] + "-" + datestring[0];

            response.leaves[i].requested_at = finalRequestDate;
            if (response.leaves[i].approved_by.length > 0) {
              for (var j = 0; j < response.leaves[i].approved_by.length; j++) {
                if (response.leaves[i].approved_by[j] == "Admin") {
                  response.leaves[i].message = "Approved By HR";
                } else if (response.leaves[i].approved_by[j] == "SuperAdmin") {
                  response.leaves[i].message = "Approved By Delivery Head";
                }
                else if (response.leaves[i].approved_by[j] == "HR") {
                  response.leaves[i].message = "Approved By HR";
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
            response.leaves[i].leaveBalance = temObj;
          }
          sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
          this.setState({
            items: sortedLeaves,
            todos: sortedLeaves,
            loading: false
          });
        }
      });
    }
    // }

    this.setState({
      activePage: number,
      currentPage: number
    });
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ count: indexOfFirstTodo + 1 });
    const currentTodos = this.state.todos.slice(
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
      dataPerPage: arr
    });
  };
  /* End Pagination on Click Business Logic  */
  /* Start Show Alert toost Message on click Approve or Decline   */
  handleAlert = () => {
    this.setState({ showAlert: false, alertMessage: "" });
  };
  /* End Show Alert toost Message on click Approve or Decline   */
  /* Start Assign value into Leave Details  */
  leaveDetails = item => {
    this.setState({
      leaveDetails: item.leave_details
    });
  };
  /* End Assign value into Leave Details  */
  /* Start show Trim leave reason value */
  trimReason(e) {
    const res = arguments[0].slice(0, 10);
    return res;
  }
  /* End show Trim leave reason value */
  render() {
    var countAdd = this.state.count;
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
          <div className="modal fade" id="leavetype">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Change Leave Type</h4>
                  <button type="button" className="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>

                <div className="modal-body">
                  <div className="form-group">
                    <label>Select Type:</label>
                    <select
                      ref="leavetype"
                      className="form-control"
                      value={this.state.leavetype}
                      onChange={this.handleChangeLeaveType}
                    >
                      <option value="Casual">Casual</option>
                      <option value="Sick">Sick</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={this.changeLeaveType}
                    data-dismiss="modal"
                    className="btn btn-primary  btn-rounded btn-fix"
                  >
                    Save
                  </button>
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

          <div className="ibox">
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
                            <th>Day</th>
                            <th>Leave Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.leaveDetails.map(item => (
                            <tr key={item._id}>
                              <td className="tbl-date">{item.leave_date}</td>
                              <td className="tbl-date">{item.day}</td>
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
                        You want to approve this Leave Request!
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
                        onClick={() => this.approveLeave(this.state.empId)}
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
                        You want to decline this Leave Request!
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
                        onClick={() => this.declineLeave(this.state.empId)}
                      >
                        <i className="fa fa-check"></i> Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id="Correction">
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
                        You want to disapprove your approvel!
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
                        onClick={() => this.pendingLeave(this.state.empId)}
                      >
                        <i className="fa fa-check"></i> Disapprove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

              <div className="ibox-title page-headleaverequest">
                Leave Request
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
                      <th>Balance</th>
                      <th>Type</th>
                      {/* <th>Details</th> */}
                      <th className="cmt-section">Reason</th>
                      {/* <th className="cmt-section tbl-date">TL Comment</th>
                      <th className="cmt-section tbl-date">Manager Comment</th>
                      <th className="cmt-section tbl-date">HR Comment</th>
                      <th className="cmt-section tbl-date">Admin Comment</th>
                      <th className="cmt-section tbl-date">DH Comment</th> */}
                      <th className="cmt-section">Comment</th>
                      <th>Actions</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.loading ? (
                      <div className="loader-align">
                        <Loader
                          type="ThreeDots"
                          color="#00BFFF"
                          height={100}
                          width={100}
                          timeout={3000} //3 secs
                        />
                      </div>
                    ) : (
                        <div></div>
                      )}
                    {this.state.dataPerPage.map((item, index) => (
                      <tr key={item._id}>
                        <td > <td className="tbl-date details">{index + this.state.count}</td></td>

                        <td className="tbl-date">
                          <Link to={`/empProfile/${item.requested_by}`}>
                            <td className="tbl-date details">
                              {item.person_name}
                            </td>
                          </Link>
                        </td>

                        <td> <td className="tbl-date details">{item.start_date}</td></td>

                        <td> <td className="tbl-date details">{item.end_date}</td></td>
                        <td><td className="tbl-date details">{item.requested_at}</td></td>
                        <td><td className="tbl-date details">{item.leave_days}</td></td>
                        <td> <td className="tbl-date details">{item.leaveBalance}</td></td>
                        <td>
                          <td className="tbl-date details">
                            {item.leave_type}
                            {item.leave_type == "Casual" || item.leave_type == "Sick" ? (
                              <div className="customtooltip">
                                <button
                                  className="btn badge-primary btn-xs m-r-5"
                                  data-toggle="modal"
                                  data-target="#leavetype"
                                  onClick={() => this.editLeaveTypeChange(item)}
                                >
                                  <i
                                    className="fa fa-edit font comment"
                                    aria-hidden="true"
                                  ></i>{" "}
                                </button>
                                <span className="tooltiptext">Edit</span>
                              </div>
                            ) : ('')}

                          </td>
                        </td>
                        {item.reason.length > 10 ? (
                          <td>
                            <td className="tbl-date details">
                              <div
                                id={"UncontrolledPopover-" + item._id}
                                className="pointer"
                              >
                                {this.trimReason(item.reason, item._id)}...
                            </div>
                              <UncontrolledPopover
                                trigger="legacy"
                                placement="bottom"
                                target={"UncontrolledPopover-" + item._id}
                              >
                                <PopoverBody> {item.reason}</PopoverBody>
                              </UncontrolledPopover>
                            </td>
                          </td>
                        ) : (
                            <td><td className="tbl-date details">{item.reason}</td></td>
                          )}
                        <td><td className="tbl-date details"><div className="customtooltip">
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
                        </div></td></td>

                        <td className="tbl-date">
                          <div className='row'>
                            <div className='col-md-6'>
                              <div className="customtooltip action col-md-6 approve-thumb">
                                <button
                                  className="btn btn-xs"
                                  onClick={() => this.handleShow(item._id)}
                                  data-toggle="modal"
                                  data-target="#apporved"
                                >
                                  <i className="fa fa-thumbs-up font approve"></i>
                                </button>

                                <span className="tooltiptext">Approve</span>
                              </div>
                              <div className="customtooltip action col-md-6">
                                <button
                                  className="btn btn-xs"
                                  onClick={() => this.handleShowDecline(item._id)}
                                  data-toggle="modal"
                                  data-target="#decline"
                                >
                                  <i className="fa fa-thumbs-down font decline"></i>
                                </button>
                                <span className="tooltiptext">Decline</span>
                              </div>
                            </div>
                            <div className='col-md-6'>
                              {item.message == "Approved By HR" ? (
                                <div className="float-right">
                                  <button className="btn btn-default tech btn-rounded">
                                    Tech
                                </button>
                                  <button
                                    className="btn btn-success hr btn-rounded"
                                    data-toggle="modal"
                                    disabled={!this.state.adValue}
                                    data-target="#Correction"
                                    onClick={() => this.handleShow(item._id)}
                                  >
                                    HR
                                </button>
                                </div>
                              ) : (
                                  <div>
                                    {item.message == "Approved By Delivery Head" ? (
                                      <div className="float-right">
                                        <button
                                          className="btn btn-success tech btn-rounded"
                                          data-toggle="modal"
                                          disabled={!this.state.superAdValue}
                                          data-target="#Correction"
                                          onClick={() => this.handleShow(item._id)}
                                        >
                                          Tech
                                    </button>
                                        <button className="btn hr btn-default btn-rounded">
                                          HR
                                    </button>
                                      </div>
                                    ) : (
                                        <div className="float-right">
                                          <button className="btn tech btn-default btn-rounded">
                                            Tech
                                    </button>
                                          <button className="btn hr btn-default btn-rounded">
                                            HR
                                    </button>
                                        </div>
                                      )}
                                  </div>
                                )}
                            </div>
                          </div>
                        </td>
                        <td>
                          {" "}
                          <Link
                            to={`/detailspage/${item._id}/${item.requested_by}`}
                          >
                            <td className="tbl-date details">Details</td>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-page">
              <Pagination
                className="justify-content-center"
                activePage={this.state.activePage}
                itemsCountPerPage={8}
                totalItemsCount={100}
                pageRangeDisplayed={3}
                onChange={this.handleClick}
                itemClass="page-item no-padding"
                linkClass="page-link"
                prevPageText="Previous"
                nextPageText="Next"
                totalItemsCount={this.state.items.length}
              />
            </div>
          </div>

          <ModalWindow show={this.state.showModal} container={this} />
        </div>
      );
    }
  }
}
