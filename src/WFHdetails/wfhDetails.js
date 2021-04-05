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
const Auth = new AuthService();
export default class WFHDetail extends Component {
  constructor() {
    super();
    this.handleShow = this.handleShow.bind(this);
    this.handleShowDecline = this.handleShowDecline.bind(this);
    this.declineLeave = this.declineLeave.bind(this);
    this.approveLeave = this.approveLeave.bind(this);
    this.getLeaveStatusDecline = this.getLeaveStatusDecline.bind(this);
    this.approveHandleClick = this.approveHandleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
      commentChat: [],
      Validate: false,
      comment: '',
      logger: ''
    };
  }
  /* Start Show Comment in Model window  */
  showComment = id => {
    this.setState({
      empId: id
    });
    Auth.getWfhComment(id).then(response => {

      console.log(response)
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
  /* End Show Comment in Model window  */
  /* Start Close Comment Model window  */
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
    idTestq = this.state.empId;
    if (this.state.logger == 'Admin' || this.state.logger == 'SuperAdmin') {
      Auth.submitAdminWFHComment(idTestq, this.refs.chatRec.value).then(data => {

        this.showComment(idTestq);
        console.log(data)
        if (data.message == "WFH request updated successfully") {
          this.setState({
            Validate: false,
          });
          this.refs.chatRec.value = "";
        } else {
          this.setState({
            alertMessage: data.message,
            showAlert: true,
            danger: true
          });
        }
        setTimeout(() => {
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);
      });


    } else if (this.state.logger == 'HR') {
      Auth.submitWfhHRComment(idTestq, this.state.comment).then(data => {
        if (data.message == "WFH request updated successfully") {

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
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);
      });
    }

  };
  /* End Submit comment  */
  /* Start Assign Id into Employee Id   */
  handleShow(id) {
    this.setState({
      empId: id
    });
  }

  handleShowDecline(id) {
    this.setState({
      empId: id
    });
  }
  /* End Assign Id into Employee Id   */
  /* Start Handle keywoard search filter functionality */
  handleChange(e) {
    let indexOfFirstTodo = 0;
    var sortedLeaves = [];
    var x = e.target.value;
    let TabApprove = document.getElementById("tab-7-2");
    let TabDecline = document.getElementById("tab-7-3");
    let divApprove = TabApprove.classList.contains("active");
    let divDecline = TabDecline.classList.contains("active");
    if (divApprove == true) {
      Auth.searchByWfhApproveDetails(x).then(response => {
        var temObj = "";
        var c = 1;
        if (response.wfh != undefined) {
          for (var i = 0; i < response.wfh.length; i++) {
            if (
              (response.wfh[i].start_date && response.wfh[i].end_date) !=
              undefined
            ) {
              if (
                (response.wfh[i].start_date &&
                  response.wfh[i].end_date) != undefined
              ) {
                var raisedOn = new Date(response.wfh[i].requested_at)
                  .toISOString()
                  .substring(0, 10);
                var datestring = raisedOn.split("-");
                var finalRequestDate =
                  datestring[2] + "-" + datestring[1] + "-" + datestring[0];

                response.wfh[i].requested_at = finalRequestDate;
              }
            }
          }
          // sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

          this.setState({
            itemsapproved: response.wfh,
            activePage: 1,
            userList: response.wfh
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
      Auth.searchByWfhDeclineDetails(x).then(response => {
        var temObj = "";
        var sortedLeaves = [];
        var c = 1;
        if (response.wfh != undefined) {
          for (var i = 0; i < response.wfh.length; i++) {
            // response.wfh[i].indexValue = c;
            // c = c + 1;
            if (
              (response.wfh[i].start_date && response.wfh[i].end_date) !=
              undefined
            ) {
              if (
                (response.wfh[i].start_date &&
                  response.wfh[i].end_date) != undefined
              ) {
                var raisedOn = new Date(response.wfh[i].requested_at)
                  .toISOString()
                  .substring(0, 10);
                var datestring = raisedOn.split("-");
                var finalRequestDate =
                  datestring[2] + "-" + datestring[1] + "-" + datestring[0];

                response.wfh[i].requested_at = finalRequestDate;
                if (response.wfh[i].approved_by.length > 0) {
                  for (
                    var j = 0;
                    j < response.wfh[i].approved_by.length;
                    j++
                  ) {
                    if (response.wfh[i].approved_by[j] == "Admin") {
                      response.wfh[i].message = "Approved By Admin";
                    } else if (
                      response.wfh[i].approved_by[j] == "SuperAdmin"
                    ) {
                      response.wfh[i].message = "Approved By SuperAdmin";
                    }
                  }
                }
              }
            }
          }
          // sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

          this.setState({
            itemsrejected: response.wfh,
            activePageDec: 1,
            userList: response.wfh
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
  /* End Handle keywoard search filter functionality */
  /* Start Approve Pagination on Click Business Logic  */
  approveHandleClick = number => {
    this.setState({
      activePage: number
    });
    Auth.getWFHDetail().then(response => {
      var approvedItem = [];
      var approvedResponseleaves = [];
      var rejectedItem = [];
      var userinfo = [];
      var tempObj = "";
      var c = 1;
      if (response.status == 200) {
        for (var i = 0; i < response.wfh.length; i++) {
          if (
            (response.wfh[i].start_date && response.wfh[i].end_date) !=
            undefined
          ) {
            if (
              (response.wfh[i].start_date &&
                response.wfh[i].end_date) != undefined
            ) {
              var raisedOn = new Date(response.wfh[i].requested_at)
                .toISOString()
                .substring(0, 10);
              var datestring = raisedOn.split("-");
              var finalRequestDate =
                datestring[2] + "-" + datestring[1] + "-" + datestring[0];

              response.wfh[i].requested_at = finalRequestDate;
            }
          }
          if (response.wfh[i].approval_status == "Approved") {
            approvedItem.push(response.wfh[i]);
          }
        }
        approvedResponseleaves = (approvedItem.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        this.setState({
          itemsapproved: approvedResponseleaves
        });
      }
    });

    var todos = this.state.itemsapproved;
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
    this.setState({
      dataPerPage: arr
    });
  };
  /* End Approve Pagination on Click Business Logic  */
  /* Start Decline Pagination on Click Business Logic  */
  declineHandleClick = number => {
    this.setState({
      activePageDec: number
    });
    Auth.getWFHDetail().then(response => {
      var approvedItem = [];
      var approvedResponseleaves = [];
      var rejectedItem = [];
      var userinfo = [];
      var tempObj = "";
      if (response.status == 200) {
        for (var i = 0; i < response.wfh.length; i++) {
          if (
            (response.wfh[i].start_date && response.wfh[i].end_date) !=
            undefined
          ) {
            if (
              (response.wfh[i].start_date &&
                response.wfh[i].end_date) != undefined
            ) {
              var raisedOn = new Date(response.wfh[i].requested_at)
                .toISOString()
                .substring(0, 10);
              var datestring = raisedOn.split("-");
              var finalRequestDate =
                datestring[2] + "-" + datestring[1] + "-" + datestring[0];

              response.wfh[i].requested_at = finalRequestDate;
            }
          }
          if (response.wfh[i].approval_status == "Rejected") {
            approvedItem.push(response.wfh[i]);
          }
        }
        approvedResponseleaves = (approvedItem.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        this.setState({
          itemsrejected: approvedResponseleaves
        });
      }
    });

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
    this.setState({
      declinePage: arr
    });
  };
  /* Start Decline Pagination on Click Business Logic  */
  /* Start Decline WFH on Click Decline Business Logic  */
  declineLeave(id) {
    this.setState({
      showDec: true,
      empId: id
    });
    var user = window.localStorage.getItem("id_token");
    Auth.declineWfhStatus(id).then(res => {
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
  /* End Decline WFH  on Click Decline Business Logic  */
  /* Start Approve WFH on Click Approve Business Logic  */
  approveLeave(id) {
    this.setState({
      showDec: true,
      idTest: id
    });

    var user = window.localStorage.getItem("id_token");
    Auth.approveWfhStatus(id).then(res => {
      listOfLeaves = this.state.declinePage;
      for (var i = 0; i < listOfLeaves.length; i++) {
        var obj = listOfLeaves[i];
        if (res.message == "WFH Request approved by Admin") {
          if (obj._id == id) {
            listOfLeaves[i].message = "Approved By HR";
          }
          this.setState({
            show: false,
            showAlert: true,
            alertMessage: res.message,
            declinePage: listOfLeaves
          });
        } else if (res.message == "WFH Request approved by SuperAdmin") {
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
        else if (res.message == "WFH Request approved by HR") {
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

      if (res.message == "WFH Request updated successfully") {
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
          alertMessage: "Request approved Successfully"
        });
      }
    });

    setTimeout(() => {
      this.setState({ alertMessage: "", showAlert: false });
    }, 4000);
  }
  /* End Approve WFH on Click Approve Business Logic  */
  /* Start Change Tab Approve   */
  testing = () => {

    var tabA = document.getElementById("tab-7-3");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-7-2");
    tabB.classList.add("active");
    tabB.classList.add("show");
    var element = document.getElementById("tab-7-2");
    element.classList.remove("mystyle");

    var name = this.state.searchValue;
    var sortedLeaves = [];
    Auth.getWfhDetailApproved().then(response => {
      var temObj = "";
      var c = 1;
      if (response.wfh != undefined) {
        for (var i = 0; i < response.wfh.length; i++) {

          if (
            (response.wfh[i].start_date && response.wfh[i].end_date) !=
            undefined
          ) {
            if (
              (response.wfh[i].start_date && response.wfh[i].end_date) !=
              undefined
            ) {
              var raisedOn = new Date(response.wfh[i].requested_at)
                .toISOString()
                .substring(0, 10);
              var datestring = raisedOn.split("-");
              var finalRequestDate =
                datestring[2] + "-" + datestring[1] + "-" + datestring[0];

              response.wfh[i].requested_at = finalRequestDate;
            }

          }
        }
        // sortedLeaves = (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        this.setState({
          itemsapproved: response.wfh,
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

    console.log(this.state.activePage);
    console.log(this.state.activePageDec);
  }
  /* End Change Tab Approve */
  /* Start Change Tab  Decline   */
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
    var name = this.state.searchValue;
    var sortedLeaves = [];
    Auth.getWfhDeclineData().then(response => {

      var temObj = "";
      if (response.wfh != undefined) {
        for (var i = 0; i < response.wfh.length; i++) {
          if (
            (response.wfh[i].start_date && response.wfh[i].end_date) !=
            undefined
          ) {
            if (
              (response.wfh[i].start_date && response.wfh[i].end_date) !=
              undefined
            ) {
              var raisedOn = new Date(response.wfh[i].requested_at)
                .toISOString()
                .substring(0, 10);
              var datestring = raisedOn.split("-");
              var finalRequestDate =
                datestring[2] + "-" + datestring[1] + "-" + datestring[0];

              response.wfh[i].requested_at = finalRequestDate;
              if (response.wfh[i].approved_by.length > 0) {
                for (
                  var j = 0;
                  j < response.wfh[i].approved_by.length;
                  j++
                ) {
                  if (response.wfh[i].approved_by[j] == "Admin") {
                    response.wfh[i].message = "Approved By HR";
                  } else if (
                    response.wfh[i].approved_by[j] == "SuperAdmin"
                  ) {
                    response.wfh[i].message = "Approved By Delivery Head";
                  }
                  else if (response.wfh[i].approved_by[j] == "HR") {
                    response.wfh[i].message = "Approved By HR";
                  }
                }
              }
            }

          }
        }


        this.setState({
          itemsrejected: response.wfh,
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
  /* Start Change Tab  Decline   */
  /* Start show Trim leave reason value */
  trimReason(e) {
    const res = arguments[0].slice(0, 10);
    return res;
  }
  /* End show Trim leave reason value */
  /* Start Show Alert toost Message on click Approve or Decline   */
  handleAlert = () => {
    this.setState({ showAlert: false, alertMessage: "", danger: false });
  };
  /* End Show Alert toost Message on click Approve or Decline   */
  /* Start Main Business Logic when page load  */
  componentDidMount() {
    var wfhdetails = document.getElementById("dashNotwfhdetails");
    wfhdetails.classList.add("active");
    Auth.getWFHDetail().then(response => {

      var approvedItem = [];
      var rejectedItem = [];
      var sortedLeaves = [];
      var approvedResponseleaves = [];
      var userinfo = [];
      var tempObj = "";
      var c = 1;
      if (response.wfh != undefined) {

        for (var i = 0; i < response.wfh.length; i++) {
          if (
            (response.wfh[i].start_date && response.wfh[i].end_date) !=
            undefined
          ) {
            if (
              (response.wfh[i].start_date && response.wfh[i].end_date) !=
              undefined
            ) {
              var raisedOn = new Date(response.wfh[i].requested_at)
                .toISOString()
                .substring(0, 10);
              var datestring = raisedOn.split("-");
              var finalRequestDate =
                datestring[2] + "-" + datestring[1] + "-" + datestring[0];

              response.wfh[i].requested_at = finalRequestDate;
            }
          }

          if (response.wfh[i].approval_status == "Approved") {
            approvedItem.push(response.wfh[i]);
          }
        }
        sortedLeaves = (response.wfh.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
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
        }, 1000);
        const { todos, currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = approvedItem.slice(
          indexOfFirstTodo,
          indexOfLastTodo
        );
        var arr = [];
        const renderTodos = currentTodos.map((todo, index) => {
          // return <li key={index}>{todo}</li>;
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
          number: pageNumbers
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
        // responseusers =  (response.users.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

        this.setState({
          userList: response.users,
          todos: response.users,
          dataUser: response.users,
          loading: false,
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
        numbers: pageNumbers,
      });
    });
  }
  /* Start Main Business Logic when page load  */

  render() {
    // for(var i =0;i< )
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
                      You want to decline this WFH Request!
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
          {/* ChatComment */}
          <div className="modal fade" id="Chatcmt" data-backdrop="static">
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
                      You want to approve this WFH Request!
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
          <div className="row">
            <div className="col-md-12">
              <div className="ibox">
                <div className="ibox-head box-emp-mang">
                  <div className="ibox-title page-head">
                    Employee WFH Status
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
                                <td className="tbl-date">{item.wfh_days}</td>
                                <td className="tbl-date">{item.leave_type}</td>
                                <td className="tbl-date">
                                  {item.balance.wfh}
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
                          pageRangeDisplayed={4}
                          onChange={this.approveHandleClick}
                          itemClass="page-item no-padding"
                          linkClass="page-link"
                          prevPageText="Previous"
                          nextPageText="Next"
                          totalItemsCount={this.state.itemsapproved.length}
                        />
                      </div>
                    </div>
                    <div className="tab-pane fade" id="tab-7-3">
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
                                  <td className="tbl-date">{item.wfh_days}</td>
                                  <td className="tbl-date">{item.leave_type}</td>
                                  <td className="tbl-date">
                                    {item.balance.wfh}
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
                                        <button className="btn btn-success btn-rounded hr leave-details ">
                                          HR
                                      </button>
                                      </div>
                                    ) : (
                                        <div>
                                          {item.message ==
                                            "Approved By Delivery Head" ? (
                                              <div>
                                                <button className="btn btn-success tech btn-rounded leave-details  m-r-20">
                                                  Tech
                                          </button>
                                                <button className="btn hr leave-details btn-rounded btn-default">
                                                  HR
                                          </button>
                                              </div>
                                            ) : (
                                              <div>
                                                <button className="btn tech leave-details btn-rounded btn-default m-r-20">
                                                  Tech
                                          </button>
                                                <button className="btn hr leave-details btn-rounded btn-default">
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
                            pageRangeDisplayed={4}
                            onChange={this.declineHandleClick}
                            itemClass="page-item no-padding"
                            linkClass="page-link"
                            prevPageText="Previous"
                            nextPageText="Next"
                            totalItemsCount={this.state.itemsrejected.length}
                          />
                        </div>
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
  handleAlertClass() {
    let classes = "alert alert-dismissable fade show alertpopup row toast-alert-pd ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
}
