import React, { Component } from "react";
//import { tab, tabs } from "react-bootstrap";
import classnames from "classnames";
import AuthService from "../AuthService";
import Axios from "axios";
import Pagination from "react-js-pagination";
import { Button, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import Loader from 'react-loader-spinner'
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,

  withRouter
} from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
  "July", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const Auth = new AuthService();
class MyRequest extends Component {
  constructor(props) {

    super(props);
    this.toggle = this.toggle.bind(this);
    this.pendingTabClick = this.pendingTabClick.bind(this);
    this.approveTabClick = this.approveTabClick.bind(this);
    this.declineTabClick = this.declineTabClick.bind(this);
    this.leaveDetails = this.leaveDetails.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      loading: true,
      activetab: "1",
      items: [],
      itemsPending: [],
      itemsrejected: [],
      itemsapproved: [],
      isLoaded: false,
      redirectToReferrer: false,
      token: "",
      itemsCountPerPage: 1,
      totalItemsCount: 1,
      pageRangeDisplayed: 1,
      todos: [],
      dataPerPage: [],
      currentPage: 1,
      todosPerPage: 8,
      numbers: [],
      activePage: 1,
      activePageDec: 1,
      activePagepen: 1,
      pendingTodo: [],
      pendingPage: [],
      declinePage: [],
      approvePage: [],
      leaveDetails: [],
      approve: 1,
      decline: 1,
      pending: 1,
      userRole: "",
      tableloader: true,
      approvetable: false,
      declinetable: false,
      commentChat:[],
      Validate:false,
      empId:''
    };
  }
  showComment=id=>{
    this.setState({
      empId: id
    });
    Auth.getComment(id).then(response=>{
      
      console.log(response)
      if(response.status==200){
        this.setState({
          commentChat:response.comment
        })
      }
    })
  }
  cancelComment = () => {
    this.refs.chatRec.value = "";
    this.setState({
      Validate: false,
    })
  };
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
  submitComment = event => {
    
    var idTestq = null;
    idTestq = this.state.empId;
    var user = window.localStorage.getItem("id_token");
    if (this.state.userRole == 'Employee') {
      Auth.submitEmployeeComment(idTestq,  this.refs.chatRec.value).then(data => {
        
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
        // setTimeout(() => {
        //   this.handleAlert();
        // }, 4000);
      });


    } else if (this.state.userRole == 'Manager') {
      Auth.submitManagerComment(idTestq, this.refs.chatRec.value).then(data => {
        
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

      });
    }
    else if (this.state.userRole == 'TeamLead') {
      Auth.submitTeamLeadComment(idTestq, this.refs.chatRec.value).then(data => {
        
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
      });
    }
  };
  handleChange(e) {
    let indexOfFirstTodo = 0;
    var x = e.target.value;
    let TabPending = document.getElementById('tab-8-1');
    let TabApprove = document.getElementById('tab-8-2');
    let TabDecline = document.getElementById('tab-8-3');
    let divPending = TabPending.classList.contains("active");
    let divApprove = TabApprove.classList.contains("active");
    let divDecline = TabDecline.classList.contains("active");
    if (divPending == true) {
      Auth.searchByDetails(x).then(response => {
        var pendingData = [];
        var sortedLeaves = [];
        var pendingResponseData =[];
        if (response.leaves != undefined) {
          for (var i = 0; i < response.leaves.length; i++) {
            if ((response.leaves[i].start_date && response.leaves[i].end_date) != undefined) {
              // var requestdate = new Date
              //   (response.leaves[i].requested_at)
              // response.leaves[i].requested_at = requestdate.getMonth() + 1 + '/' + requestdate.getDate() + '/' + requestdate.getFullYear();
              // var raisedOn = new Date(response.leaves[i].requested_at);
              // response.leaves[i].requested_at = raisedOn.getDate() + '-' + monthNames[raisedOn.getMonth()] + '-' + raisedOn.getFullYear().toString().substr(-2);
              var raisedOn = new Date(response.leaves[i].requested_at)
                .toISOString()
                .substring(0, 10);
              var datestring = raisedOn.split("-");
              var finalRequestDate =
                datestring[2] + "-" + datestring[1] + "-" + datestring[0];

              response.leaves[i].requested_at = finalRequestDate;
            }

            if (response.leaves[i].approval_status == "Pending") {
              pendingData.push(response.leaves[i]);
            }
          }

          sortedLeaves =  (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
          pendingResponseData =  (pendingData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();


          this.setState({
            items: sortedLeaves,
            todos: sortedLeaves,
            itemsPending: pendingResponseData,
            loading: false
          })
          var todos1 = this.state.itemsPending;
          const { todos, currentPage, todosPerPage } = this.state;
          const indexOfLastTodo = currentPage * todosPerPage;
          if (x != "") {
            indexOfFirstTodo = 0;
          } else {
            indexOfFirstTodo = indexOfLastTodo - todosPerPage;
          }
          // const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
          const currentTodos = todos1.slice(indexOfFirstTodo, indexOfLastTodo);
          var arr = [];
          const renderTodos = currentTodos.map((todo, index) => {
            // return <li key={index}>{todo}</li>;

            arr.push(todo)
            return arr;
          });
          for (var i = 0; i < arr.length; i++) {
            var x = arr[i].leave_type;
            if (x == 'Sick Leave') {
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
          })
          const pageNumbers = [];
          if (todos != undefined) {
            for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
              pageNumbers.push(i);
            }
          }
          this.setState({
            numbers: pageNumbers
          })
        }

      });
    } else if (divApprove == true) {
      Auth.searchByDetails(x).then(response => {
        // if(response.leaves.length>0){
        if (response.leaves != undefined) {
          var approvedData = [];
          for (var i = 0; i < response.leaves.length; i++) {
            // var raisedOn = new Date(response.leaves[i].requested_at);
            // response.leaves[i].requested_at =
            //   raisedOn.getMonth() +
            //   1 +
            //   "/" +
            //   raisedOn.getDate() +
            //   "/" +
            //   raisedOn.getFullYear();
            // var raisedOn = new Date(response.leaves[i].requested_at);
            // response.leaves[i].requested_at = raisedOn.getDate() + '-' + monthNames[raisedOn.getMonth()] + '-' + raisedOn.getFullYear().toString().substr(-2);
            var raisedOn = new Date(response.leaves[i].requested_at)
              .toISOString()
              .substring(0, 10);
            var datestring = raisedOn.split("-");
            var finalRequestDate =
              datestring[2] + "-" + datestring[1] + "-" + datestring[0];

            response.leaves[i].requested_at = finalRequestDate;
            if (response.leaves[i].approval_status == "Approved") {
              approvedData.push(response.leaves[i]);
            }
          }
          this.setState({
            itemsapproved: approvedData,
            activePage: 1
          });
          var todos1 = this.state.itemsapproved;
          const { todos, currentPage, todosPerPage } = this.state;
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
            arr.push(todo);
            return arr;
          });
          for (var i = 0; i < arr.length; i++) {
            var x = arr[i].leave_type;
            if (x == 'Sick Leave') {
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
            approvePage: arr
          });
          const pageNumbers = [];
          for (let i = 1; i <= Math.ceil(todos1.length / todosPerPage); i++) {
            pageNumbers.push(i);
          }
          this.setState({
            numbers: pageNumbers
          });
        }
      });
    } else if (divDecline == true) {
      Auth.searchByDetails(x).then(response => {
        if (response.leaves != undefined) {
          var rejectedData = [];
          for (var i = 0; i < response.leaves.length; i++) {
            if (
              (response.leaves[i].start_date && response.leaves[i].end_date) !=
              undefined
            ) {
              if (
                (response.leaves[i].start_date && response.leaves[i].end_date) !=
                undefined
              ) {
                // var startdateFormat = new Date(response.leaves[i].start_date);
                // var enddateformat = new Date(response.leaves[i].end_date);
                // var raisedOn = new Date(response.leaves[i].requested_at);
                // response.leaves[i].start_date = startdateFormat.getMonth() + 1 + '/' + startdateFormat.getDate() + '/' + startdateFormat.getFullYear();
                // response.leaves[i].end_date = enddateformat.getMonth() + 1 + '/' + enddateformat.getDate() + '/' + enddateformat.getFullYear();
                // response.leaves[i].requested_at =
                //   raisedOn.getMonth() +
                //   1 +
                //   "/" +
                //   raisedOn.getDate() +
                //   "/" +
                //   raisedOn.getFullYear();
                // var raisedOn = new Date(response.leaves[i].requested_at);
                // response.leaves[i].requested_at = raisedOn.getDate() + '-' + monthNames[raisedOn.getMonth()] + '-' + raisedOn.getFullYear().toString().substr(-2);
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
              rejectedData.push(response.leaves[i]);
            }
          }
          this.setState({
            itemsrejected: rejectedData,
            activePageDec: 1
          });
          var todos1 = this.state.itemsrejected;
          const { todos, currentPage, todosPerPage } = this.state;
          const indexOfLastTodo = currentPage * todosPerPage;
          if (x != "") {
            indexOfFirstTodo = 0;
          } else {
            indexOfFirstTodo = indexOfLastTodo - todosPerPage;
          }
          // const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
          this.setState({ decline: indexOfFirstTodo + 1 });
          const currentTodos = todos1.slice(indexOfFirstTodo, indexOfLastTodo);
          var arr = [];
          const renderTodos = currentTodos.map((todo, index) => {
            // return <li key={index}>{todo}</li>;

            arr.push(todo);
            return arr;
          });
          for (var i = 0; i < arr.length; i++) {
            var x = arr[i].leave_type;
            if (x == 'Sick Leave') {
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
            declinePage: arr
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

  }
  leaveDetails = item => {
    this.setState({
      leaveDetails: item.leave_details
    });
  };
  declineHandleClick = number => {
    this.setState({
      activePageDec: number
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
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i].leave_type;
      if (x == 'Sick Leave') {
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
      declinePage: arr
    });
  };

  pendingTabClick() {

    var tabA = document.getElementById("tab-8-2");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-8-1");
    tabB.classList.add("active");
    tabB.classList.add("show");
    var tabC = document.getElementById("tab-8-3");
    tabC.classList.remove("active");
    tabC.classList.remove("show");
    this.setState({
      activePagepen: 1
    });
    Auth.getLeavesDetail().then(response => {
      // if(response.leaves.length>0){
      var pendingData = [];
      var pendingResponseItem = [];
      for (var i = 0; i < response.leaves.length; i++) {
        // var raisedOn = new Date(response.leaves[i].requested_at);
        // response.leaves[i].requested_at =
        //   raisedOn.getMonth() +
        //   1 +
        //   "/" +
        //   raisedOn.getDate() +
        //   "/" +
        //   raisedOn.getFullYear();
        // var raisedOn = new Date(response.leaves[i].requested_at);
        // response.leaves[i].requested_at = raisedOn.getDate() + '-' + monthNames[raisedOn.getMonth()] + '-' + raisedOn.getFullYear().toString().substr(-2);
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
          }
        }
        if (response.leaves[i].approval_status == "Pending") {
          pendingData.push(response.leaves[i]);
        }
      }

      pendingResponseItem = (pendingData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();


      this.setState({
        itemsPending: pendingResponseItem,
        activePage: 1
      });
      var todos1 = this.state.itemsPending;
      const { todos, currentPage, todosPerPage } = this.state;
      const indexOfLastTodo = currentPage * todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
      this.setState({ approve: indexOfFirstTodo + 1 });
      const currentTodos = todos1.slice(indexOfFirstTodo, indexOfLastTodo);
      var arr = [];
      const renderTodos = currentTodos.map((todo, index) => {
        arr.push(todo);
        return arr;
      });
      for (var i = 0; i < arr.length; i++) {
        var x = arr[i].leave_type;
        if (x == 'Sick Leave') {
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
      for (let i = 1; i <= Math.ceil(todos1.length / todosPerPage); i++) {
        pageNumbers.push(i);
      }
      this.setState({
        numbers: pageNumbers
      });
    });
  }
  approveTabClick() {
    this.setState({
      approvetable: true
    }); setTimeout(() => {
      this.setState({ approvetable: false });
    }, 1000);
    var tabA = document.getElementById("tab-8-1");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-8-2");
    tabB.classList.add("active");
    tabB.classList.add("show");
    var tabC = document.getElementById("tab-8-3");
    tabC.classList.remove("active");
    tabC.classList.remove("show");

    Auth.getLeavesDetail().then(response => {
      // if(response.leaves.length>0){
      var approvedData = [];
      var approveResponseItem = [];
      for (var i = 0; i < response.leaves.length; i++) {
        // var raisedOn = new Date(response.leaves[i].requested_at);
        // response.leaves[i].requested_at =
        //   raisedOn.getMonth() +
        //   1 +
        //   "/" +
        //   raisedOn.getDate() +
        //   "/" +
        //   raisedOn.getFullYear();
        // var raisedOn = new Date(response.leaves[i].requested_at);
        // response.leaves[i].requested_at = raisedOn.getDate() + '-' + monthNames[raisedOn.getMonth()] + '-' + raisedOn.getFullYear().toString().substr(-2);
        var raisedOn = new Date(response.leaves[i].requested_at)
          .toISOString()
          .substring(0, 10);
        var datestring = raisedOn.split("-");
        var finalRequestDate =
          datestring[2] + "-" + datestring[1] + "-" + datestring[0];

        response.leaves[i].requested_at = finalRequestDate;
        if (response.leaves[i].approval_status == "Approved") {
          approvedData.push(response.leaves[i]);
        }
      }

      approveResponseItem =  (approvedData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

      this.setState({
        itemsapproved: approveResponseItem,
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
        arr.push(todo);
        return arr;
      });
      for (var i = 0; i < arr.length; i++) {
        var x = arr[i].leave_type;
        if (x == 'Sick Leave') {
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
        approvePage: arr
      });
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(todos1.length / todosPerPage); i++) {
        pageNumbers.push(i);
      }
      this.setState({
        numbers: pageNumbers
      });
    });
  }
  declineTabClick() {
    this.setState({
      declinetable: true
    }); setTimeout(() => {
      this.setState({ declinetable: false });
    }, 1000);
    var tabA = document.getElementById("tab-8-1");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-8-2");
    tabB.classList.remove("active");
    tabB.classList.remove("show");
    var tabC = document.getElementById("tab-8-3");
    tabC.classList.add("active");
    tabC.classList.add("show");

    Auth.getLeavesDetail().then(response => {
      var rejectedData = [];
      var rejectedResponseItem = [];
      for (var i = 0; i < response.leaves.length; i++) {
        if (
          (response.leaves[i].start_date && response.leaves[i].end_date) !=
          undefined
        ) {
          if (
            (response.leaves[i].start_date && response.leaves[i].end_date) !=
            undefined
          ) {
            // var startdateFormat = new Date(response.leaves[i].start_date);
            // var enddateformat = new Date(response.leaves[i].end_date);
            // var raisedOn = new Date(response.leaves[i].requested_at);
            // response.leaves[i].start_date = startdateFormat.getMonth() + 1 + '/' + startdateFormat.getDate() + '/' + startdateFormat.getFullYear();
            // response.leaves[i].end_date = enddateformat.getMonth() + 1 + '/' + enddateformat.getDate() + '/' + enddateformat.getFullYear();
            // response.leaves[i].requested_at =
            //   raisedOn.getMonth() +
            //   1 +
            //   "/" +
            //   raisedOn.getDate() +
            //   "/" +
            //   raisedOn.getFullYear();
            // var raisedOn = new Date(response.leaves[i].requested_at);
            // response.leaves[i].requested_at = raisedOn.getDate() + '-' + monthNames[raisedOn.getMonth()] + '-' + raisedOn.getFullYear().toString().substr(-2);
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
          rejectedData.push(response.leaves[i]);
        }
      }

      rejectedResponseItem =  (rejectedData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

      this.setState({
        itemsrejected: rejectedResponseItem,
        activePageDec: 1
      });
      var todos1 = this.state.itemsrejected;
      const { todos, currentPage, todosPerPage } = this.state;
      const indexOfLastTodo = currentPage * todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
      this.setState({ decline: indexOfFirstTodo + 1 });
      const currentTodos = todos1.slice(indexOfFirstTodo, indexOfLastTodo);
      var arr = [];
      const renderTodos = currentTodos.map((todo, index) => {
        // return <li key={index}>{todo}</li>;

        arr.push(todo);
        return arr;
      });
      for (var i = 0; i < arr.length; i++) {
        var x = arr[i].leave_type;
        if (x == 'Sick Leave') {
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
        declinePage: arr
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
  pendingHandleClick = (number) => {
    this.setState({
      activePagepen: number
    })
    var todos = this.state.itemsPending;
    // const { todos, currentPage, todosPerPage } = this.state;


    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ pending: indexOfFirstTodo + 1 })
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo)
      return arr;
    });
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i].leave_type;
      if (x == 'Sick Leave') {
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
      dataPerPage: arr,

    })

  }
  declinedHandleClick = (number) => {
    this.setState({
      activePage: number
    })
    var todos = this.state.itemsrejected;
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ decline: indexOfFirstTodo + 1 })
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo)
      return arr;
    });
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i].leave_type;
      if (x == 'Sick Leave') {
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
      declinePage: arr,


    })

  }
  approveHandleClick = (number) => {
    this.setState({
      activePage: number
    })
    var todos = this.state.itemsapproved;
    const { currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ approve: indexOfFirstTodo + 1 })
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      // return <li key={index}>{todo}</li>;

      arr.push(todo)
      return arr;
    });
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
      pageNumbers.push(i);
    }
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i].leave_type;
      if (x == 'Sick Leave') {
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
      approvePage: arr,
      numbers: pageNumbers
    })

  }
  toggle(tab) {

    if (this.state.activetab !== tab) {
      this.setState({
        activetab: tab
      });
    }
  }


  handleSelectPending = (data) => {
    var todos = data;
    const { currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo)
    });
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
      pageNumbers.push(i);
    }
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i].leave_type;
      if (x == 'Sick Leave') {
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
      numbers: pageNumbers,
      pendingPage: arr

    })
  }
  handleSelectdecline = (data) => {
    var todos = data;
    const { currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo)
    });
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
      pageNumbers.push(i);
    }
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i].leave_type;
      if (x == 'Sick Leave') {
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
      activePageDec: pageNumbers,
      declinePage: arr

    })
  }
  handleSelectApprove = (data) => {

    // if(data.length>0){
    var todos = this.state.itemsapproved;
    const { currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo)
    });
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
      pageNumbers.push(i);
    }
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i].leave_type;
      if (x == 'Sick Leave') {
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
      activePage: pageNumbers,
      approvePage: arr
    });
    //}
  };
  componentDidMount() {
  var dashNotleave = document.getElementById("dashNotleavedetail");
  dashNotleave.classList.add("active");
    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then(response => {
      this.setState({
        userRole: response.user.role,
        data: response.user
      });
    });
    Auth.getLeavesDetail().then(response => {   
      if (response.leaves != undefined) {
        var approvedData = [];
        var declinedData = [];
        var pendingData = [];
        var sortedLeaves = [];
        var approvedResponseData = [];
        var declineResponseData = [];
        var pendingResponseData = [];
        for (var i = 0; i < response.leaves.length; i++) {
          if (
            (response.leaves[i].start_date && response.leaves[i].end_date) !=
            undefined
          ) {
            // var requestdate = new Date(response.leaves[i].requested_at);
            // response.leaves[i].requested_at =
            //   requestdate.getMonth() +
            //   1 +
            //   "/" +
            //   requestdate.getDate() +
            //   "/" +
            //   requestdate.getFullYear();
            // var raisedOn = new Date(response.leaves[i].requested_at);
            // response.leaves[i].requested_at = raisedOn.getDate() + '-' + monthNames[raisedOn.getMonth()] + '-' + raisedOn.getFullYear().toString().substr(-2);
            var raisedOn = new Date(response.leaves[i].requested_at)
              .toISOString()
              .substring(0, 10);
            var datestring = raisedOn.split("-");
            var finalRequestDate =
              datestring[2] + "-" + datestring[1] + "-" + datestring[0];

            response.leaves[i].requested_at = finalRequestDate;
          }
          if (response.leaves[i].approved_by.length > 0) {
            for (var j = 0; j < response.leaves[i].approved_by.length; j++) {
              if (response.leaves[i].approved_by[j] == "Admin") {
                response.leaves[i].message = "Approved By HR";
              } else if (response.leaves[i].approved_by[j] == "SuperAdmin") {
                response.leaves[i].message = "Approved By Delivery Head";
              }
            }
          }
          if (response.leaves[i].approval_status == "Approved") {
            approvedData.push(response.leaves[i]);
          }
          if (response.leaves[i].approval_status == "Rejected") {
            declinedData.push(response.leaves[i]);
          }
          if (response.leaves[i].approval_status == "Pending") {
            pendingData.push(response.leaves[i]);
          }
        }
        sortedLeaves =  (response.leaves.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        approvedResponseData =  (approvedData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        declineResponseData =  (declinedData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        pendingResponseData =  (pendingData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();


        this.setState({
          items: sortedLeaves,
          todos: sortedLeaves,
          itemsapproved: approvedResponseData,
          itemsrejected: declineResponseData,
          itemsPending: pendingResponseData,
          loading: false,
          tableloader: true
        }); setTimeout(() => {
          this.setState({ tableloader: false });
        }, 1000);
        var todos1 = this.state.itemsPending;
        const { todos, currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = todos1.slice(indexOfFirstTodo, indexOfLastTodo);
        var arr = [];
        const renderTodos = currentTodos.map((todo, index) => {
          // return <li key={index}>{todo}</li>;

          arr.push(todo)
          return arr;
        });
        for (var i = 0; i < arr.length; i++) {
          var x = arr[i].leave_type;
          if (x == 'Sick Leave') {
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
        })
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
          pageNumbers.push(i);
        }
        this.setState({
          numbers: pageNumbers
        })
      }
      //   this.handleSelectPending(pendingData);
      //   this.handleSelectdecline(declinedData);
      //   this.handleSelectApprove(approvedData);
    });

  }

  trimReason(e) {
    const res = arguments[0].slice(0, 10)
    return res;
  }
  render() {
    var approveAdd = this.state.approve;
    var declineAdd = this.state.decline;
    var pendingAdd = this.state.pending;
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

    }
    else {
      return (
        <div className="page-content fade-in-up">
          <div className="ibox">
            <div className="modal fade" id="leaveDetails">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Leave Type</h4>
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                  </div>
                  <div className="modal-body">
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th width="91px" className="tb-leave-ty">Date</th>
                            <th>Leave Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.leaveDetails.map(item =>
                            <tr key={item._id}>
                              <td className="tbl-date">{item.leave_date}</td>
                              <td className="tbl-date"> {item.leave_type}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>

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
            <div className="ibox-head ">
              <div className="ibox-title">List of Request</div>
             
            </div>
            <div className="ibox-body">
              <ul className="nav nav-tabs tabs-line">
                <li className="nav-item detailspage">
                  <a className="nav-link pending active" onClick={this.pendingTabClick} href="#tab-8-1" data-toggle="tab">Pending<i className="fa fa-clock-o"></i></a>
                </li>
                <li className="nav-item detailspage">
                  <a className="nav-link approved" href="#tab-8-2" onClick={this.approveTabClick} data-toggle="tab">Approved <i className="fa fa-check-circle-o"></i></a>
                </li>
                <li className="nav-item detailspage">
                  <a className="nav-link decline" href="#tab-8-3" onClick={this.declineTabClick} data-toggle="tab">Declined<i className="fa fa-times-circle-o"></i></a>
                </li>

              </ul>
              <div className="tab-content">
                {this.state.tableloader == true ? (
                  <div className="table-loader">
                    <Loader
                      type="ThreeDots"
                      color="#00BFFF"
                      height={100}
                      width={100}
                      timeout={4000} //3 secs
                    />
                  </div>
                ) : (
                    <div className="tab-pane fade show active" id="tab-8-1">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Name</th>
                                  <th className="tbl-date" width="91px">Start Date</th>
                                  <th className="tbl-date" width="91px">End Date</th>
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
                                {this.state.dataPerPage.map((item, index) =>
                                  <tr key={item._id}>
                                    <td className="tbl-date">{index + this.state.pending}</td>
                                    {/* <td className="tbl-date"><Link to={`/empProfile/${item.requested_by}`}>{item.person_name}</Link></td> */}
                                    {this.state.userRole != "Employee" ?
                                      <td className="tbl-date"><Link to={`/empProfile/${item.requested_by}`}>{item.person_name}</Link></td> : (
                                        <td className="tbl-date">{item.person_name}</td>
                                      )}
                                    <td className="tbl-date">{item.start_date}</td>
                                    <td className="tbl-date">{item.end_date}</td>
                                    <td className="tbl-date">{item.requested_at}</td>

                                    <td className="tbl-date">{item.leave_days}</td>
                                    <td className="tbl-date">{item.leave_type}</td>



                                    <td className="tbl-date">
                                      <button className="btn btn-outline-info" data-toggle="modal" data-target="#leaveDetails" aria-pressed="false" onClick={() => this.leaveDetails(item)}>
                                        <i className="fa fa-list list-status"></i>Details</button></td>
                                    {item.reason.length > 10 ? <td>

                                      <div id={'UncontrolledPopover-' + item._id} className="pointer" >
                                        {this.trimReason(item.reason, item._id)}...
                                  </div>
                                      <UncontrolledPopover trigger="legacy" placement="bottom" target={'UncontrolledPopover-' + item._id}>
                                        {/* <PopoverHeader>Popover Title</PopoverHeader> */}
                                        <PopoverBody> {item.reason}</PopoverBody>
                                      </UncontrolledPopover>
                                    </td> : <td>

                                        {item.reason}
                                      </td>}
                                     <td className="tbl-date "><div className="customtooltip">
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

                                    <td className="tbl-date"><span className="badge badge-warning badge-pill">{item.approval_status}</span>
                                      {/* <p>{item.message}</p> */}
                                      {item.message == "Approved By HR" ? (
                                        <div className="hr-mang-ld">

                                          <div className=" btn-default tech leave-details m-r-20 btn-rounded">
                                            Tech
                                </div>
                                          <div className=" hr-mang btn-success btn-rounded">
                                            HR
                                </div>
                                        </div>
                                      ) : (
                                          <div >
                                            {item.message == "Approved By Delivery Head" ? (
                                              <div className="hr-mang-ld">
                                                <div className=" btn-success tech leave-details m-r-20 btn-rounded">
                                                  Tech
                                    </div>
                                                <div className=" hr-mang btn-rounded btn-default">
                                                  HR
                                    </div>
                                              </div>
                                            ) : (
                                                <div className="hr-mang-ld">
                                                  <div className=" tech leave-details btn-default m-r-20 btn-rounded">
                                                    Tech
                                    </div>
                                                  <div className=" hr-mang btn-default btn-rounded">
                                                    HR
                                    </div>
                                                </div>
                                              )}
                                          </div>
                                        )}
                                    </td>

                                  </tr>
                                )}


                              </tbody>
                            </table>

                          </div>
                          <div className="mt-page">
                            <Pagination
                              activePage={this.state.activePagepen}
                              itemsCountPerPage={8}
                              totalItemsCount={100}
                              pageRangeDisplayed={4}
                              onChange={this.pendingHandleClick}
                              itemClass="page-item no-padding"
                              linkClass="page-link"
                              prevPageText="Previous"
                              nextPageText="Next"
                              totalItemsCount={this.state.itemsPending.length}
                            />
                          </div>
                        </div>

                      </div>
                    </div>)}

                <div className="tab-pane" id="tab-8-2">
                  {this.state.approvetable == true ? (
                    <div className="table-loader">
                      <Loader
                        type="ThreeDots"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        timeout={3000} //3 secs
                      />
                    </div>
                  ) : (
                      <div className="row">
                        <div className="col-md-12">
                          <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Name</th>
                                  <th className="tbl-date" width="91px">Start Date</th>
                                  <th className="tbl-date" width="91px">End Date</th>
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
                                {this.state.approvePage.map((item, index) =>
                                  <tr key={item._id}>
                                    <td className="tbl-date">{index + this.state.approve}</td>
                                    {/* <td className="tbl-date"><Link to={`/empProfile/${item.requested_by}`}>{item.person_name}</Link></td> */}
                                    {this.state.userRole != "Employee" ?
                                      <td className="tbl-date"><Link to={`/empProfile/${item.requested_by}`}>{item.person_name}</Link></td> : (
                                        <td className="tbl-date">{item.person_name}</td>
                                      )}
                                    <td className="tbl-date">{item.start_date}</td>
                                    <td className="tbl-date">{item.end_date}</td>
                                    <td className="tbl-date">{item.requested_at}</td>

                                    <td className="tbl-date">{item.leave_days}</td>
                                    <td className="tbl-date">{item.leave_type}</td>
                                   <td className="tbl-date">
                                      <button className="btn btn-outline-info" data-toggle="modal" data-target="#leaveDetails" aria-pressed="false" onClick={() => this.leaveDetails(item)}>
                                        <i className="fa fa-list list-status"></i>Details</button></td>
                                    {item.reason.length > 10 ? <td>

                                      <div id={'UncontrolledPopover-' + item._id} className="pointer" >
                                        {this.trimReason(item.reason, item._id)}...
                              </div>
                                      <UncontrolledPopover trigger="legacy" placement="bottom" target={'UncontrolledPopover-' + item._id}>
                                        {/* <PopoverHeader>Popover Title</PopoverHeader> */}
                                        <PopoverBody> {item.reason}</PopoverBody>
                                      </UncontrolledPopover>
                                    </td> : <td>

                                        {item.reason}
                                      </td>}
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
                                    <td className="tbl-date"><span className="badge badge-success badge-pill">{item.approval_status}</span></td>

                                  </tr>
                                )}
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
                              totalItemsCount={this.state.itemsapproved.length}

                            />
                          </div>
                        </div>

                      </div>)}
                </div>

                <div className="tab-pane fade"
                  id="tab-8-3">
                  {this.state.declinetable == true ? (
                    <div className="table-loader">
                      <Loader
                        type="ThreeDots"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        timeout={3000} //3 secs
                      />
                    </div>
                  ) : (
                      <div className="row">
                        <div className="col-md-12">
                          <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Name</th>
                                  <th className="tbl-date" width="91px">Start Date</th>
                                  <th className="tbl-date" width="91px">End Date</th>
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
                                {this.state.declinePage.map((item, index) =>
                                  <tr key={item._id}>
                                    <td className="tbl-date">{index + this.state.decline}</td>
                                    {/* <td className="tbl-date"><Link to={`/empProfile/${item.requested_by}`}>{item.person_name}</Link></td> */}
                                    {this.state.userRole != "Employee" ?
                                      <td className="tbl-date"><Link to={`/empProfile/${item.requested_by}`}>{item.person_name}</Link></td> : (
                                        <td className="tbl-date">{item.person_name}</td>
                                      )}
                                    <td className="tbl-date">{item.start_date}</td>
                                    <td className="tbl-date">{item.end_date}</td>
                                    <td className="tbl-date">{item.requested_at}</td>

                                    <td className="tbl-date">{item.leave_days}</td>
                                    <td className="tbl-date">{item.leave_type}</td>



                                    <td className="tbl-date">
                                      <button className="btn btn-outline-info" data-toggle="modal" data-target="#leaveDetails" aria-pressed="false" onClick={() => this.leaveDetails(item)}>
                                        <i className="fa fa-list list-status"></i>Details</button></td>
                                    {item.reason.length > 10 ? <td>

                                      <div id={'UncontrolledPopover-' + item._id} className="pointer" >
                                        {this.trimReason(item.reason, item._id)}...
</div>
                                      <UncontrolledPopover trigger="legacy" placement="bottom" target={'UncontrolledPopover-' + item._id}>
                                        {/* <PopoverHeader>Popover Title</PopoverHeader> */}
                                        <PopoverBody> {item.reason}</PopoverBody>
                                      </UncontrolledPopover>
                                    </td> : <td>

                                        {item.reason}
                                      </td>}
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
                                    <td className="tbl-date"><span className="badge badge-danger badge-pill ">{item.approval_status}</span></td>

                                  </tr>
                                )}


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

                      </div>)}
                </div>
              </div>
            </div>
          </div>
        </div >



      );
    }

  }
}
export default MyRequest;
