import React, { Component } from "react";
import Avatar from "../header/Avatar";
import AuthService from "../AuthService";
import Loader from "react-loader-spinner";
import Pagination from "react-js-pagination";
import DatePicker from "react-datepicker";
import handleValidation from "../validation";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
  withRouter,
} from "react-router-dom";
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
  "Dec",
];
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
const Auth = new AuthService();
var empId = null;
class EmProfile extends Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.goBack = this.goBack.bind(this);
    this.declineLeave = this.declineLeave.bind(this);
    this.approveLeave = this.approveLeave.bind(this);
    this.handleShowDecline = this.handleShowDecline.bind(this);
    // this.approvedTabClick = this.approvedTabClick.bind(this);
    //this.handleClickDeclinedPaged = this.handleClickDeclinedPaged.bind(this);
    this.handleClickDeclinedWfhPaged = this.handleClickDeclinedWfhPaged.bind(
      this
    );
    //this.declineTabClick = this.declineTabClick.bind(this);
    //this.declineWfhTabClick = this.declineWfhTabClick.bind(this);
    this.handleClickApprovedPaged = this.handleClickApprovedPaged.bind(this);
    // this.handleClickApprovedWfhPaged = this.handleClickApprovedWfhPaged.bind(
    //   this
    // );
    //this.getProject = this.getProject.bind(this);
    //this.getUserProjectList = this.getUserProjectList.bind(this);
    this.getProjectList = this.getProjectList.bind(this);
    this.handleAddmember = this.handleAddmember.bind(this);
    this.handleRoleUserList = this.handleRoleUserList.bind(this);
    this.state = {
      emp: [],
      items: [],
      totalPending: "",
      totalRejected: "",
      loading: true,
      approveLeave: [],
      pendingLeave: [],
      rejectedLeave: [],
      approvedWFH: [],
      pendingWFH: [],
      declineWFH: [],
      showAlert: false,
      showAlertupdate: false,
      leaveId: null,
      currentPage: 1,
      todosPerPage: 3,
      activePage: 1,
      activePagee: 1,
      dataPerPage: [],
      Validate: false,
      todos: [],
      approvedLeave: [],
      pendingLeave: [],
      declineLeave: [],
      balanceLeaves: [],
      userDetail: [],
      leaveDetails: [],
      leaveDetailss: [],
      approvedLeave: [],
      approvedLeavePaged: [],
      declinedLeavePaged: [],
      declinedWfhPaged: [],
      approvedWfhPaged: [],
      adValue: "",
      superAdValue: "",
      logger: "",
      comment: "",
      countApprove: 1,
      countDecline: 1,
      countWfhApprove: 1,
      countWfhDecline: 1,
      projectCount: 1,
      pending: 1,
      expInTeq: "",
      leaveType: "",
      commentChat: [],
      projectList: [],
      userProjectList: [],
      userProjectListPaged: [],
      userProjectListPage: [],
      idealEmployee: 0,
      engagedEmployee: 0,
      WebProjects: 0,
      SalesProjects: 0,
      showmember: [],
      project_id: [],
      project_name: "",
      count: 1,
      deletemem: [],
      user_name: "",
      usnamerole: [],
      role: "",
    };
    var x = props.location.pathname;
    empId = x.slice(18, 42);
  }

  getEmployeeList() {
    Auth.getEmployeeList("").then((response) => {
      let ideal = 0;
      let engaged = 0;
      if (response.status == 200) {
        for (var i = 0; i < response.users.length; i++) {
          if (response.users[i].status == "Ideal") {
            ideal++;
          } else if (response.users[i].status == "Busy") {
            engaged++;
          }
        }
        this.setState({
          idealEmployee: ideal,
          engagedEmployee: engaged,
        });
      }
    });
  }
  getAllProjectList() {
    Auth.getProjectList().then((response) => {
      let webProjects = 0;
      let SalesProjects = 0;
      let totalProjects = 0;
      if (response.status == 200) {
        for (var i = 0; i < response.projects.length; i++) {
          totalProjects++;
          if (response.projects[i].category == "Web") {
            webProjects++;
          } else if (response.projects[i].category == "Salesforce") {
            SalesProjects++;
          }
        }
        this.setState({
          totalProjects: totalProjects,
          WebProjects: webProjects,
          SalesProjects: SalesProjects,
        });
      }
    });
  }

  showComment = (id, leaveType) => {
    this.setState({
      empId: id,
      leaveType: leaveType,
    });
    if (leaveType == "WFH") {
      Auth.getWfhComment(id).then((response) => {
        console.log(response);
        if (response.status == 200) {
          this.setState({
            commentChat: response.comment,
          });
        }
      });
    } else if (leaveType != "WFH") {
      Auth.getComment(id).then((response) => {
        console.log(response);
        if (response.status == 200) {
          this.setState({
            commentChat: response.comment,
          });
        }
      });
    }
  };
  cancelComment = () => {
    this.refs.chatRec.value = "";
    this.setState({
      Validate: false,
    });
  };

  handleClickDeclinedPaged(number) {
    this.setState({
      activePagedec: number,
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
      } else if (x == "Birthday Leave") {
        arr[i].leave_type = x.slice(0, 8);
      } else if (x == "Privileged Leave") {
        arr[i].leave_type = x.slice(0, 10);
      } else if (x == "CompoOff Leave") {
        arr[i].leave_type = "Comp Off";
      }
    }
    this.setState({
      declinedLeavePaged: arr,
    });
  }
  handleClickDeclinedWfhPaged(number) {
    this.setState({
      activeWfhPagedec: number,
    });
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ countWfhDecline: indexOfFirstTodo + 1 });
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
      declinedWfhPaged: arr,
    });
  }
  handleClick = (number) => {
    this.setState({
      activePage: number,
    });
    var todos = this.state.pendingLeave;
    // const { todos, currentPage, todosPerPage } = this.state;

    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ pending: indexOfFirstTodo + 1 });
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
      } else if (x == "Birthday Leave") {
        arr[i].leave_type = x.slice(0, 8);
      } else if (x == "Privileged Leave") {
        arr[i].leave_type = x.slice(0, 10);
      } else if (x == "CompoOff Leave") {
        arr[i].leave_type = "Comp Off";
      }
    }
    this.setState({
      dataPerPage: arr,
    });
  };

  getProjectList(number) {
    this.setState({
      activePagee: number,
    });
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ projectCount: indexOfFirstTodo + 1 });
    const currentTodos = this.state.userProjectList.slice(
      indexOfFirstTodo,
      indexOfLastTodo
    );
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });
    this.setState({
      userProjectListPaged: arr,
    });
  }

  // getUserProjectList(numbers) {
  //   debugger;
  //   this.setState({
  //     activepagee: numbers,
  //   });
  //   const { currentPage, todosPerPage } = this.state;
  //   const todos = this.state.userProjectList;
  //   const indexOfLastTodo = currentPage * todosPerPage;
  //   const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  //   this.setState({ projectCount: indexOfFirstTodo + 1 });
  //   const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
  //   var arr = [];
  //   const renderTodos = currentTodos.map((todo, index) => {
  //     arr.push(todo);
  //     return arr;
  //   });
  //   this.setState({
  //     userProjectListPage: arr,
  //   });
  // }

  handleClickApprovedPaged(number) {
    this.setState({
      activePageapp: number,
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

    this.setState({
      approvedLeavePaged: arr,
    });
  }
  goBack() {
    this.props.history.goBack();
  }
  handleChangeReason = (event) => {
    this.setState({
      comment: event.target.value,
    });
    if (event.target.value.trim().length === 0) {
      this.setState({
        Validate: false,
      });
    } else {
      this.setState({
        Validate: true,
      });
    }
  };
  declineLeave(id) {
    if (this.state.leaveType != "WFH") {
      Auth.declineLeaveStatus(id).then((response) => {
        this.apiResponse(response);
        var listOfLeaves = [];
        listOfLeaves = this.state.dataPerPage;
        for (var i = 0; i < listOfLeaves.length; i++) {
          var obj = listOfLeaves[i];

          if (obj._id == id) {
            this.state.dataPerPage.splice(i, 1);
            this.setState({
              dataPerPage: this.state.dataPerPage,
            });
          }
        }
      });
      this.setState({
        showDec: false,
        showAlert: true,
        alertMessage: "Leave declined successfully",
      });
      setTimeout(() => {
        this.setState({ alertMessage: "", showAlert: false });
      }, 4000);
    } else if (this.state.leaveType == "WFH") {
      Auth.declineWfhStatus(id).then((response) => {
        this.apiResponse(response);
        var listOfLeaves = [];
        listOfLeaves = this.state.dataPerPage;
        for (var i = 0; i < listOfLeaves.length; i++) {
          var obj = listOfLeaves[i];

          if (obj._id == id) {
            this.state.dataPerPage.splice(i, 1);
            this.setState({
              dataPerPage: this.state.dataPerPage,
            });
          }
        }
      });
      this.setState({
        showDec: false,
        showAlert: true,
        alertMessage: "Request declined successfully",
      });
      setTimeout(() => {
        this.setState({ alertMessage: "", showAlert: false });
      }, 4000);
    }
  }
  apiResponse = (response) => {
    if (response.success == true) {
    } else {
    }
  };
  approveLeave(id) {
    if (this.state.leaveType != "WFH") {
      Auth.approveLeaveStatus(id).then((response) => {
        var listOfLeaves = [];
        var listOfAllLeaves = [];
        this.setState({
          show: false,
          showAlert: true,
          alertMessage: response.message,
        });
        listOfLeaves = this.state.dataPerPage;
        listOfAllLeaves = this.state.todos;
        for (var i = 0; i < listOfLeaves.length; i++) {
          var obj = listOfLeaves[i];
          if (response.message == "Leave approved by Admin") {
            this.setState({
              show: false,
              showAlert: true,
              alertMessage: response.message,
            });
            if (obj._id == id) {
              listOfLeaves[i].message = "Approved By HR";
            }
          } else if (response.message == "Leave approved by SuperAdmin") {
            this.setState({
              show: false,
              showAlert: true,
              alertMessage: response.message,
            });
            if (obj._id == id) {
              listOfLeaves[i].message = "Approved By Delivery Head";
            }
          } else if (response.message == "Leave approved by HR") {
            this.setState({
              show: false,
              showAlert: true,
              alertMessage: response.message,
            });
            if (obj._id == id) {
              listOfLeaves[i].message = "Approved By HR";
            }
          }

          if (
            obj._id == id &&
            response.message == "Leave updated successfully"
          ) {
            this.state.dataPerPage.splice(i, 1);
            this.setState({
              dataPerPage: this.state.dataPerPage,
              todos: listOfAllLeaves,
            });
          } else {
            this.setState({
              dataPerPage: listOfLeaves,
            });
          }
        }
      });
      setTimeout(() => {
        this.setState({ alertMessage: "", showAlert: false });
      }, 4000);
    } else if (this.state.leaveType == "WFH") {
      Auth.approveWfhStatus(id).then((response) => {
        var listOfLeaves = [];
        var listOfAllLeaves = [];
        this.setState({
          show: false,
          showAlert: true,
          alertMessage: response.message,
        });
        listOfLeaves = this.state.dataPerPage;
        listOfAllLeaves = this.state.todos;
        for (var i = 0; i < listOfLeaves.length; i++) {
          var obj = listOfLeaves[i];
          if (response.message == "WFH Request approved by Admin") {
            this.setState({
              show: false,
              showAlert: true,
              alertMessage: response.message,
            });
            if (obj._id == id) {
              listOfLeaves[i].message = "Approved By HR";
            }
          } else if (response.message == "WFH Request approved by SuperAdmin") {
            this.setState({
              show: false,
              showAlert: true,
              alertMessage: response.message,
            });
            if (obj._id == id) {
              listOfLeaves[i].message = "Approved By Delivery Head";
            }
          } else if (response.message == "WFH Request approved by HR") {
            this.setState({
              show: false,
              showAlert: true,
              alertMessage: response.message,
            });
            if (obj._id == id) {
              listOfLeaves[i].message = "Approved By HR";
            }
          }

          if (
            obj._id == id &&
            response.message == "WFH Request updated successfully"
          ) {
            this.state.dataPerPage.splice(i, 1);
            this.setState({
              dataPerPage: this.state.dataPerPage,
              todos: listOfAllLeaves,
            });
          } else {
            this.setState({
              dataPerPage: listOfLeaves,
            });
          }
        }
      });
      setTimeout(() => {
        this.setState({ alertMessage: "", showAlert: false });
      }, 4000);
    }
  }
  handleShow = (id, leaveType) => {
    this.setState({
      empId: id,
      leaveType: leaveType,
    });
  };

  pendingLeave(id) {
    Auth.pendingLeaveStatus(id).then((response) => {
      this.componentDidMount();
      this.setState({
        showAlert: true,
        alertMessage: "Leave disapproved successfully",
      });
      setTimeout(() => {
        this.setState({ alertMessage: "", showAlert: false });
      }, 4000);
    });
  }
  handleShowDecline(id) {
    this.setState({
      showDec: true,
      empId: id,
    });
  }
  submitComment = (event) => {
    var idTestq = null;
    this.setState({
      show: false,
    });
    idTestq = this.state.empId;
    var user = window.localStorage.getItem("id_token");
    if (this.state.leaveType != "WFH") {
      if (this.state.logger == "Admin" || this.state.logger == "SuperAdmin") {
        Auth.submitAdminComment(idTestq, this.state.comment).then((data) => {
          if (data.message == "Leave updated successfully") {
            this.showComment(idTestq, this.state.leaveType);
            this.setState({
              comment: "",
              Validate: false,
            });
            this.refs.chatRec.value = "";
          } else {
            this.setState({
              alertMessage: data.message,
              showAlert: true,
              danger: true,
            });
          }
          setTimeout(() => {
            this.handleAlert();
          }, 4000);
        });
      } else if (this.state.logger == "HR") {
        Auth.submitHRComment(idTestq, this.state.comment).then((data) => {
          if (data.message == "Leave updated successfully") {
            this.showComment(idTestq, this.state.leaveType);
            this.setState({
              comment: "",
              Validate: false,
            });
            this.refs.chatRec.value = "";
          } else {
            this.setState({
              alertMessage: data.message,
              showAlert: true,
              danger: true,
            });
          }
          setTimeout(() => {
            this.handleAlert();
          }, 4000);
        });
      } else if (this.state.logger == "Manager") {
        Auth.submitManagerComment(idTestq, this.state.comment).then((data) => {
          if (data.message == "Leave updated successfully") {
            this.setState({
              comment: "",
              Validate: false,
            });
            this.showComment(idTestq, this.state.leaveType);
            this.refs.chatRec.value = "";
          } else {
            this.setState({
              alertMessage: data.message,
              showAlert: true,
              danger: true,
            });
          }
          setTimeout(() => {
            this.handleAlert();
          }, 4000);
        });
      } else if (this.state.logger == "TeamLead") {
        Auth.submitTeamLeadComment(idTestq, this.state.comment).then((data) => {
          if (data.message == "Leave updated successfully") {
            this.setState({
              comment: "",
              Validate: false,
            });
            this.showComment(idTestq, this.state.leaveType);
            this.refs.chatRec.value = "";
          } else {
            this.setState({
              alertMessage: data.message,
              showAlert: true,
              danger: true,
            });
          }
          setTimeout(() => {
            this.handleAlert();
          }, 4000);
        });
      }
    } else if (this.state.leaveType == "WFH") {
      if (this.state.logger == "Admin" || this.state.logger == "SuperAdmin") {
        Auth.submitAdminWFHComment(idTestq, this.state.comment).then((data) => {
          this.showComment(idTestq, this.state.leaveType);
          if (data.message == "WFH request updated successfully") {
            this.refs.chatRec.value = "";
            this.setState({
              comment: "",
              Validate: false,
            });
          } else {
            this.setState({
              alertMessage: data.message,
              showAlert: true,
              danger: true,
            });
          }
          setTimeout(() => {
            this.setState({ alertMessage: "", showAlert: false });
          }, 4000);
        });
      } else if (this.state.logger == "HR") {
        Auth.submitWfhHRComment(idTestq, this.state.comment).then((data) => {
          if (data.message == "WFH request updated successfully") {
            this.showComment(idTestq, this.state.leaveType);
            this.refs.chatRec.value = "";
            this.setState({
              comment: "",
              Validate: false,
            });
          } else {
            this.setState({
              alertMessage: data.message,
              showAlert: true,
              danger: true,
            });
          }
          setTimeout(() => {
            this.handleAlert();
          }, 4000);
        });
      } else if (this.state.logger == "Manager") {
        Auth.submitWFHManagerComment(idTestq, this.state.comment).then(
          (data) => {
            if (data.message == "WFH Request updated successfully") {
              this.showComment(idTestq, this.state.leaveType);
              this.refs.chatRec.value = "";
              this.setState({
                comment: "",
                Validate: false,
              });
            } else {
              this.setState({
                alertMessage: data.message,
                showAlert: true,
                danger: true,
              });
            }
            setTimeout(() => {
              this.handleAlert();
            }, 4000);
          }
        );
      } else if (this.state.logger == "TeamLead") {
        Auth.submitWFHTeamLeadComment(idTestq, this.state.comment).then(
          (data) => {
            if (data.message == "WFH Request updated successfully") {
              this.showComment(idTestq, this.state.leaveType);
              this.refs.chatRec.value = "";
              this.setState({
                comment: "",
                Validate: false,
              });
            } else {
              this.setState({
                alertMessage: data.message,
                showAlert: true,
                danger: true,
              });
            }
            setTimeout(() => {
              this.handleAlert();
            }, 4000);
          }
        );
      }
    }
  };

  apiresponce1 = () => {
    Auth.getLeaveStatus().then((response) => {
      var temObj = "";
      var sortedLeaves = [];
      if (response.status == 200) {
        for (var i = 0; i < response.leaves.length; i++) {
          if (response.leaves[i].requested_by == empId) {
            for (var j = 0; j < response.leaves[i].leave_details.length; j++) {
              var date = new Date(
                response.leaves[i].leave_details[j].leave_date
              );
              var day = weekday[date.getDay()];
              if (j < response.leaves[i].leave_details.length) {
                response.leaves[i].leave_details[j].day = day;
              }
            }
            //var raisedOn = new Date(response.leaves[i].requested_at);
            // var raisedOnMonth = raisedOn.getMonth();
            // var raisedOnYear = raisedOn.getFullYear();
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
              for (var j = 0; j < response.leaves[i].approved_by.length; j++) {
                if (response.leaves[i].approved_by[j] == "Admin") {
                  response.leaves[i].message = "Approved By HR";
                } else if (response.leaves[i].approved_by[j] == "SuperAdmin") {
                  response.leaves[i].message = "Approved By Delivery Head";
                } else if (response.leaves[i].approved_by[j] == "HR") {
                  response.leaves[i].message = "Approved By HR";
                }
              }
            }
            if (response.leaves[i].leave_type == "Casual Leave") {
              temObj = response.leaves[i].balance.casual;
            } else if (response.leaves[i].leave_type == "Sick Leave") {
              temObj = response.leaves[i].balance.sick;
            } else if (response.leaves[i].leave_type == "Birthday Leave") {
              temObj = response.leaves[i].balance.birthday;
            } else if (response.leaves[i].leave_type == "Privileged Leave") {
              temObj = response.leaves[i].balance.privileged;
            } else if (response.leaves[i].leave_type == "CompoOff Leave") {
              temObj = response.leaves[i].balance.compoOff;
            }
            response.leaves[i].leaveBalance = temObj;
          }
        }
      }

      sortedLeaves = response.leaves
        .sort(
          (a, b) =>
            new Date(...a.requested_at.split("-").reverse()) -
            new Date(...b.requested_at.split("-").reverse())
        )
        .reverse();

      this.setState({
        items: sortedLeaves,
        todos: sortedLeaves,
        loading: false,
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
        } else if (x == "Birthday Leave") {
          arr[i].leave_type = x.slice(0, 8);
        } else if (x == "Privileged Leave") {
          arr[i].leave_type = x.slice(0, 10);
        } else if (x == "CompoOff Leave") {
          arr[i].leave_type = "Comp Off";
        }
      }
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
    });
  };
  trimReason(e) {
    const res = arguments[0].slice(0, 10);
    return res;
  }

  handleAlert = () => {
    this.setState({ showAlert: false, alertMessage: "", danger: false });
  };
  handleAlertClass() {
    let classes =
      "alert alert-dismissable fade show alertpopup row toast-alert-pd ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
  componentDidMount() {
    var sortedLeaves = [];
    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then((response) => {
      this.setState({
        userRole: response.user.role,
        data: response.user,
      });
      console.log("===== " + this.state.emp.empPermanent);
      // if (
      //   this.state.userRole == "Admin" ||
      //   this.state.userRole == "SuperAdmin" ||
      //   this.state.userRole == "HR"
      // ) {
      //   var dashNotemp = document.getElementById("dashNotemployeemanagement");
      //   dashNotemp.classList.remove("active");
      //   var dashNotele = document.getElementById("dashNot");
      //   dashNotele.classList.remove("active");
      //   var dashNotwfh = document.getElementById("dashNotwfhrequest");
      //   dashNotwfh.classList.remove("active");
      //   var dashNotleave = document.getElementById("dashNotleavedetail");
      //   dashNotleave.classList.remove("active");
      //   var wfhdetails = document.getElementById("dashNotwfhdetails");
      //   wfhdetails.classList.remove("active");
      // } else if (
      //   this.state.userRole == "Manager" ||
      //   this.state.userRole == "TeamLead"
      // ) {
      //   var dashNotle = document.getElementById("dashNotleaverequest");
      //   dashNotle.classList.remove("active");
      //   // var dashNotemp = document.getElementById("dashNotemployeemanagement");
      //   // dashNotemp.classList.remove("active");
      //   var dashNotwfh = document.getElementById("dashNotwfhrequest");
      //   dashNotwfh.classList.remove("active");
      //   var dashNotleave = document.getElementById("dashNotleavedetail");
      //   dashNotleave.classList.remove("active");
      //   var wfhdetail = document.getElementById("dashNotwfhdetail");
      //   wfhdetail.classList.remove("active");
      // }
    });
    Auth.getUserAssignedProject(empId).then((response) => {
      //console.log("Project List emp wise", response);
      debugger
      this.setState({
        userProjectList: response.UserAssignedProject,
      });

      const { currentPage, todosPerPage } = this.state;
      const todos = this.state.userProjectList;
      const indexOfLastTodo = currentPage * todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
      this.setState({ projectCount: indexOfFirstTodo + 1 });
      const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
      var arr = [];
      const renderTodos = currentTodos.map((todo, index) => {
        arr.push(todo);
        return arr;
      });
      this.setState({
        userProjectListPaged: arr,
      });
      console.log("user with pagination", this.state.userProjectListPaged);
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
        pageNumbers.push(i);
      }
      this.setState({
        numbers: pageNumbers,
      });
    });
    Auth.getReportingPerson().then((response) => {
      if (response.message != "Permission required") {
        this.setState({
          manager: response.users,
          report_to: response.users[0]._id,
        });
      } else {
      }
    });
    Auth.getTeamLeader().then((response) => {
      var defaultHRValue = { _id: "", name: "Select any value" };
      if (response.message != "Permission required" && response.users != "") {
        response.users.unshift(defaultHRValue);
        this.setState({
          teamLeader: response.users,
          teamlead_name: response.users[0]._id,
        });
      } else {
      }
    });

    Auth.getHRPerson().then((response) => {
      var defaultHRValue = { _id: "", name: "Select any value" };
      if (response.message != "Permission required" && response.users != "") {
        response.users.unshift(defaultHRValue);
        this.setState({
          hrPerson: response.users,
          hr_name: response.users[0]._id,
        });
      } else {
      }
    });
    Auth.editEmp(empId).then((response) => {
      if (response.status == 200) {
        var date = response.user[0].doj;
        var datestring = date.split("/");
        var finaldoj =
          datestring[0] + "-" + datestring[1] + "-" + datestring[2];
        response.user[0].doj = finaldoj;
        var birthdate = response.user[0].birthday;
        var datestring = birthdate.split("/");
        var finaldob =
          datestring[0] + "-" + datestring[1] + "-" + datestring[2];
        response.user[0].birthday = finaldob;
        if (response.user[0].birthday == "Invalid date-undefined-undefined") {
          response.user[0].birthday = "N/A";
        }
        this.setState({
          emp: response.user[0],
          expInTeq: response.techFocusExp,
        });
      }
      //   if (response.user[0].imageData == undefined) {
      //     this.setState({
      //       imagePreviewUrl: "",
      //     });
      //   } else {
      //     this.setState({
      //       imagePreviewUrl: response.user[0].imageData.image,
      //     });
      //   }
    });
    // Auth.getLeavesBalance().then(response => {

    //   if (response.status == 200) {
    //     this.setState({
    //       items: response.balance[0],
    //       totalPending: response.total_pending,
    //       totalRejected: response.total_rejected,
    //       loading: false
    //     })
    //   }
    // })
    Auth.getUserSummary(empId).then((res) => {
      if (res.status == 200) {
        this.setState({
          items: res.balance[0],
          totalPending:
            res.balance[0].casual_pending + res.balance[0].sick_pending,
          totalRejected: res.balance[0].total_rejected,
          loading: false,
        });
      }
    });

    Auth.getPendingStatus().then((response) => {
      var pendingLeaves = [];
      var updatedPendingLeaves = [];
      var sortedLeaves = [];
      var temObj = "";
      var count = 1;
      if (response.status == 200) {
        for (var i = 0; i < response.leaves.length; i++) {
          if (response.leaves[i].requested_by == empId) {
            pendingLeaves.push(response.leaves[i]);
            updatedPendingLeaves = pendingLeaves
              .sort(
                (a, b) =>
                  new Date(...a.requested_at.split("-").reverse()) -
                  new Date(...b.requested_at.split("-").reverse())
              )
              .reverse();
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
                } else if (response.leaves[i].approved_by[j] == "HR") {
                  response.leaves[i].message = "Approved By HR";
                }
              }
            }
            if (response.leaves[i].leave_type == "Casual Leave") {
              temObj = response.leaves[i].balance.casual;
            } else if (response.leaves[i].leave_type == "Sick Leave") {
              temObj = response.leaves[i].balance.sick;
            } else if (response.leaves[i].leave_type == "Birthday Leave") {
              temObj = response.leaves[i].balance.birthday;
            } else if (response.leaves[i].leave_type == "Privileged Leave") {
              temObj = response.leaves[i].balance.privileged;
            } else if (response.leaves[i].leave_type == "WFH") {
              temObj = response.leaves[i].balance.wfh;
            } else if (response.leaves[i].leave_type == "CompoOff Leave") {
              temObj = response.leaves[i].balance.compoOff;
            }
            response.leaves[i].leaveBalance = temObj;
            response.leaves[i].number = count;
            count++;
          }
        }

        sortedLeaves = response.leaves
          .sort(
            (a, b) =>
              new Date(...a.requested_at.split("-").reverse()) -
              new Date(...b.requested_at.split("-").reverse())
          )
          .reverse();

        this.setState({
          todos: sortedLeaves,
        });
        this.state.pendingLeave = updatedPendingLeaves;
        const { currentPage, todosPerPage } = this.state;
        const todos = this.state.pendingLeave;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        this.setState({ pending: indexOfFirstTodo + 1 });
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
          } else if (x == "Birthday Leave") {
            arr[i].leave_type = x.slice(0, 8);
          } else if (x == "Privileged Leave") {
            arr[i].leave_type = x.slice(0, 10);
          } else if (x == "CompoOff Leave") {
            arr[i].leave_type = "Comp Off";
          }
        }
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

    Auth.getUserSummary(empId).then((response) => {
      if (response.wfhs != undefined) {
        var approvedWFH = [];
        var declineWFH = [];
        var pendingWFH = [];
        var approvedWFHData = [];
        var declinedWFHData = [];
        var pendingWFHData = [];

        for (var i = 0; i < response.wfhs.length; i++) {
          if (response.wfhs[i].requested_by == empId) {
            var raisedOn = new Date(response.wfhs[i].requested_at)
              .toISOString()
              .substring(0, 10);
            var datestring = raisedOn.split("-");
            var finalRequestDate =
              datestring[2] + "-" + datestring[1] + "-" + datestring[0];

            response.wfhs[i].requested_at = finalRequestDate;

            if (response.wfhs[i].approval_status == "Approved") {
              // response.leaves[i].countApprove = countApprove;
              approvedWFHData.push(response.wfhs[i]);
              // countApprove = countApprove + 1;
            }
            if (response.wfhs[i].approval_status == "Rejected") {
              //response.leaves[i].countDecline = countDecline;
              declinedWFHData.push(response.wfhs[i]);
              // countDecline = countDecline + 1;
            }
            if (response.wfhs[i].approval_status == "Pending") {
              //response.leaves[i].countPendinfg = countPendinfg;
              pendingWFHData.push(response.wfhs[i]);
              // countPendinfg = countPendinfg + 1;
            }
          }
        }

        approvedWFH = approvedWFHData
          .sort(
            (a, b) =>
              new Date(...a.requested_at.split("-").reverse()) -
              new Date(...b.requested_at.split("-").reverse())
          )
          .reverse();
        declineWFH = declinedWFHData
          .sort(
            (a, b) =>
              new Date(...a.requested_at.split("-").reverse()) -
              new Date(...b.requested_at.split("-").reverse())
          )
          .reverse();
        pendingWFH = pendingWFHData
          .sort(
            (a, b) =>
              new Date(...a.requested_at.split("-").reverse()) -
              new Date(...b.requested_at.split("-").reverse())
          )
          .reverse();

        this.setState({
          approvedWFH: approvedWFHData,
          declineWFH: declinedWFHData,
          pendingWFH: pendingWFHData,
          // approvedLeavePaged: approvedData,
          // declinedLeavePaged: declinedData
        });

        const indexOfLastTodo =
          this.state.currentPage * this.state.todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
        this.setState({ countWfhPending: indexOfFirstTodo + 1 });
        const currentTodos = approvedWFHData.slice(
          indexOfFirstTodo,
          indexOfLastTodo
        );
        this.setState({
          activePage: 1,
        });
        var arr = [];
        const renderTodos = currentTodos.map((todo, index) => {
          arr.push(todo);
          return arr;
        });
        this.setState({
          approvedWfhPaged: arr,
        });
      }
      if (response.leaves != undefined) {
        var approvedData = [];
        var updatedApprovedLeaves = [];
        var updatedDeclineLeaves = [];
        var declinedData = [];
        var pendingData = [];

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
              // response.leaves[i].requested_at = raisedOn.getMonth() + 1 + '-' + raisedOn.getDate() + '-' + raisedOn.getFullYear();
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
          // var StartOn = new Date(response.leaves[i].start_date);
          // response.leaves[i].start_date = StartOn.getDate() + '-' + monthNames[StartOn.getMonth()] + '-' + StartOn.getFullYear();

          // var endOn = new Date(response.leaves[i].end_date);
          // response.leaves[i].end_date = endOn.getDate() + '-' + monthNames[endOn.getMonth()] + '-' + endOn.getFullYear();

          if (response.leaves[i].approval_status == "Approved") {
            //response.leaves[i].countApprove = countApprove;
            approvedData.push(response.leaves[i]);
            // countApprove = countApprove + 1;
          }
          if (response.leaves[i].approval_status == "Rejected") {
            // response.leaves[i].countDecline = countDecline;
            declinedData.push(response.leaves[i]);
            // countDecline = countDecline + 1;
          }
          if (response.leaves[i].approval_status == "Pending") {
            pendingData.push(response.leaves[i]);
          }
        }

        updatedApprovedLeaves = approvedData
          .sort(
            (a, b) =>
              new Date(...a.requested_at.split("-").reverse()) -
              new Date(...b.requested_at.split("-").reverse())
          )
          .reverse();
        updatedDeclineLeaves = declinedData
          .sort(
            (a, b) =>
              new Date(...a.requested_at.split("-").reverse()) -
              new Date(...b.requested_at.split("-").reverse())
          )
          .reverse();

        this.setState({
          approvedLeave: updatedApprovedLeaves,
          declineLeave: updatedDeclineLeaves,
          balanceLeaves: response.balance[0],
          userDetail: response.user[0],
        });
        if (response.user[0].imageData == undefined) {
          this.setState({
            imagePreviewUrl: "",
          });
        } else {
          this.setState({
            imagePreviewUrl: response.user[0].imageData.image,
          });
        }
        const todos = this.state.approvedLeave;

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
        for (var i = 0; i < arr.length; i++) {
          var x = arr[i].leave_type;
          if (x == "Sick Leave") {
            arr[i].leave_type = x.slice(0, 4);
          } else if (x == "Casual Leave") {
            arr[i].leave_type = x.slice(0, 6);
          } else if (x == "Birthday Leave") {
            arr[i].leave_type = x.slice(0, 8);
          } else if (x == "Privileged Leave") {
            arr[i].leave_type = x.slice(0, 10);
          } else if (x == "CompoOff Leave") {
            arr[i].leave_type = "Comp Off";
          }
        }
        this.setState({
          approvedLeavePaged: arr,
        });
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
          pageNumbers.push(i);
        }
        this.setState({
          number: pageNumbers,
        });
      }
    });

    this.permissionEnable();
    this.getEmployeeList("");
    this.getAllProjectList();
    this.getProjectList();
  }
  showMember = (item) => {
    this.setState({
      showmember: item.projects.assigned_user,
      project_id: item.projects._id,
      project_name: item.projects.project_name,
    });
  };
  hadleShow = (item) => {
    this.setState({
      deletemem: item.userid,
    });
  };
  memeberDelete() {
    var project_id = this.state.project_id;
    var deletemem = this.state.deletemem;
    Auth.memberDelete(project_id, deletemem).then((response) => {
      console.log(response);
      var listofMember = [];
      listofMember = this.state.showmember;
      for (var i = 0; i < listofMember.length; i++) {
        var obj = listofMember[i];
        if (obj.userid == deletemem) {
          this.state.showmember.splice(i, 1);
        }
        this.setState({
          showmember: this.state.showmember,
        });
      }
    });
    this.setState({
      show: false,
      alertMessage: "Deleted successfully",
      showAlert: true,
      danger: true,
    });
    setTimeout(() => {
      this.setState({ alertMessage: "", showAlert: false });
    }, 4000);
  }
  handleUserNameChange = (event) => {
    this.setState({ user_name: event.currentTarget.value });
  };
  handleProjectNameChange = (event) => {
    this.setState({ project_name: event.currentTarget.value });
  };
  handleAddmember(event) {
    event.preventDefault();
    var project_name = this.state.project_id;
    var user_name = this.state.user_name;
    var role = this.refs.role.value;

    Auth.addmember(project_name, user_name, role).then((response) => {
      console.log(response);
      if (response.status == 200) {
        this.setState({
          alertMessage: "You Request is Submitted",
          showAlert: true,
        });
        window.location.reload();
      } else {
        this.setState({
          showAlert: true,
          danger: true,
          alertMessage: "Error Occcurs Please Re-Submit Form",
        });
      }
    });
  }
  handleRole = (event) => {
    this.setState({ role: event.target.value });
    this.handleRoleUserList(event.target.value);
  };
  handleRoleUserList = (role) => {
    Auth.getRoleEmployeeList(role).then((response) => {
      console.log("fetch user by role", response);
      if (response.status == 200) {
        this.setState({
          usnamerole: response.users,
        });
      } else {
        this.setState({
          showAlert: true,
          danger: true,
          alertMessage: "Error Occcurs User is not present in the database",
        });
      }
    });
  };

  permissionEnable() {
    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then((response) => {
      this.setState({
        logger: response.user.role,
      });
      console.log(response);
      if (response.user.role == "Admin") {
        this.setState({ adValue: "enable" });
      } else if (response.user.role == "SuperAdmin") {
        this.setState({ superAdValue: "enable" });
      } else if (response.user.role == "HR") {
        this.setState({ adValue: "enable" });
      }
    });
  }
  leaveDetails = (item) => {
    this.setState({
      leaveDetails: item.leave_details,
    });
  };

  //Update Employeee detail
  editEmp(empId) {
    this.setState({
      update: 1,
    });
    Auth.editEmp(empId).then((response) => {
      //;
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
      if (response.user[0].teamlead.length != 0) {
        this.setState({
          teamLead: response.user[0].teamlead_name,
          teamlead_name: response.user[0].teamlead[0],
        });
      } else {
        Auth.getTeamLeader().then((response) => {
          var defaultHRValue = { _id: "", name: "Select any value" };
          if (
            response.message != "Permission required" &&
            response.users != ""
          ) {
            response.users.unshift(defaultHRValue);
            this.setState({
              teamLeader: response.users,
              teamlead_name: response.users[0]._id,
            });
          } else {
          }
        });
      }
      if (response.user[0].hr.length != 0) {
        this.setState({
          hr: response.user[0].hr_name,
          hr_name: response.user[0].hr[0],
        });
      } else {
        Auth.getHRPerson().then((response) => {
          var defaultHRValue = { _id: "", name: "Select any value" };
          if (
            response.message != "Permission required" &&
            response.users != ""
          ) {
            response.users.unshift(defaultHRValue);
            this.setState({
              hrPerson: response.users,
              hr_name: response.users[0]._id,
            });
          } else {
          }
        });
      }
      this.setState({
        userList: response.user[0],
        name: response.user[0].name,
        email: response.user[0].email,
        role: response.user[0].role,
        experiance: response.user[0].experience,
        reportingManager: response.user[0].report_to,
        SickBalance: response.user[0].sick_balance,
        CasualBalance: response.user[0].casual_balance,
        report_to: response.user[0].report[0],
        location: response.user[0].location,
        joiningDate: response.user[0].doj,
        birthdate: response.user[0].birthday,
        WfhBalance: response.user[0].wfh_balance,
        empPermanent: response.user[0].empPermanent,
        compoOff_balance: response.user[0].compoOff_balance,
      });
    });
    // setTimeout(() => {
    //   document.getElementById("updEmp").style.display = "block";
    //   document.getElementById("updEmp").style.opacity = 1;
    //   document.getElementById("updEmp").style.overflow = "inherit";
    //   document.getElementById("updEmp").style.top = "25%";
    //   //document.getElementById('updEmp').style.background = "rgba(0,0,0,0.4)";

    //   var iDiv = document.createElement("div");
    //   iDiv.id = "backdrop";
    //   iDiv.className = "modal-backdrop fade show";
    //   document.getElementsByTagName("body")[0].appendChild(iDiv);
    // }, 500);
    this.refs.password.value = "";
  }

  handleOption = (event) => {
    this.setState({
      role: event.currentTarget.value,
    });
  };
  handlelocation = (event) => {
    this.setState({
      location: event.currentTarget.value,
    });
  };
  handleOptionExperiance = (event) => {
    this.setState({
      experiance: event.currentTarget.value,
    });
  };

  handleOptionReportingManager = (event) => {
    this.setState({
      reportingManager: event.currentTarget.value,
      report_to: event.currentTarget.value,
    });
  };

  handleOptionTeamLead = (event) => {
    this.setState({
      teamLead: event.currentTarget.value,
      teamlead_name: event.currentTarget.value,
    });
  };

  handleOptionHr = (event) => {
    this.setState({
      hr: event.currentTarget.value,
      hr_name: event.currentTarget.value,
    });
  };

  handleOptionSickBalance = (event) => {
    this.setState({
      SickBalance: event.currentTarget.value,
    });
  };
  handleOptioncompoOff_balanceance = (event) => {
    this.setState({
      compoOff_balance: event.currentTarget.value,
    });
  };
  handleOptionCasualBalance = (event) => {
    this.setState({
      CasualBalance: event.currentTarget.value,
    });
  };
  handleOptionWfhBalance = (event) => {
    this.setState({
      WfhBalance: event.currentTarget.value,
    });
  };
  handleempPermanent = (event) => {
    this.setState({
      empPermanent: event.currentTarget.value,
    });
  };
  handleEmailOption = (event) => {
    this.setState({
      email: this.refs.email.value,
    });
  };

  handleNameOption = (event) => {
    this.setState({
      name: this.refs.name.value,
    });
  };

  UpdateDetails(id) {
    let formData = {
      email: this.state.email,
      name: this.state.name,
      DOJ: this.state.joiningDate,
    };
    let errors = handleValidation(formData);
    this.setState({ errors: errors });
    if (errors["valid"] == true) {
      Auth.UpdateDetails(
        id,
        this.state.name,
        this.state.email,
        this.state.experiance,
        this.refs.password.value,
        this.state.report_to,
        this.state.teamlead_name,
        this.state.hr_name,
        this.state.role,
        this.state.CasualBalance,
        this.state.SickBalance,
        this.state.joiningDate,
        this.refs.location.value,
        this.state.birthdate,
        this.state.WfhBalance,
        this.state.empPermanent,
        this.state.compoOff_balance
      ).then((data) => {
        if (data.message != "Successfully updated") {
          this.setState({
            showAlertupdate: true,
            alertMessage: data.message,
            danger: true,
          });
          setTimeout(() => {
            this.setState({ alertMessage: "", showAlertupdate: false });
          }, 3000);
          this.componentDidMount();
        } else {
          this.setState({
            showAlertupdate: true,
            alertMessage: data.message,
            danger: false,
          });
          setTimeout(() => {
            this.setState({
              alertMessage: "Updated successfully",
              showAlertupdate: false,
            });
          }, 3000);
          //
          this.componentDidMount();
        }
      });
      this.cancelModal();
      // document.getElementById("updEmp").style.display = "none";
      // document.getElementById("updEmp").style.opacity = 0;
      // var elem = document.getElementById("backdrop");
      // elem.remove();
      // this.refs.password.value = "";
    } else {
      this.setState({ errorsdiv: true });
      setTimeout(() => {
        this.setState({ errorsdiv: false });
      }, 4000);
    }
  }
  cancelModal = () => {
    // document.getElementById("updEmp").style.display = "none";
    // document.getElementById("updEmp").style.opacity = 0;
    // var elem = document.getElementById("backdrop");
    // elem.remove();
    this.refs.password.value = "";
  };

  //close updeate employee detail
  // Make As Permanent employee

  //Make Employeee as Permanent

  permanentEmp(empId) {
    this.setState({
      update: 1,
    });
    Auth.editEmp(empId).then((response) => {
      //;
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
      if (response.user[0].teamlead.length != 0) {
        this.setState({
          teamLead: response.user[0].teamlead_name,
          teamlead_name: response.user[0].teamlead[0],
        });
      } else {
        Auth.getTeamLeader().then((response) => {
          var defaultHRValue = { _id: "", name: "Select any value" };
          if (
            response.message != "Permission required" &&
            response.users != ""
          ) {
            response.users.unshift(defaultHRValue);
            this.setState({
              teamLeader: response.users,
              teamlead_name: response.users[0]._id,
            });
          } else {
          }
        });
      }
      if (response.user[0].hr.length != 0) {
        this.setState({
          hr: response.user[0].hr_name,
          hr_name: response.user[0].hr[0],
        });
      } else {
        Auth.getHRPerson().then((response) => {
          var defaultHRValue = { _id: "", name: "Select any value" };
          if (
            response.message != "Permission required" &&
            response.users != ""
          ) {
            response.users.unshift(defaultHRValue);
            this.setState({
              hrPerson: response.users,
              hr_name: response.users[0]._id,
            });
          } else {
          }
        });
      }
      this.setState({
        userList: response.user[0],
        name: response.user[0].name,
        email: response.user[0].email,
        role: response.user[0].role,
        experiance: response.user[0].experience,
        reportingManager: response.user[0].report_to,
        SickBalance: response.user[0].sick_balance,
        CasualBalance: response.user[0].casual_balance,
        report_to: response.user[0].report[0],
        location: response.user[0].location,
        joiningDate: response.user[0].doj,
        birthdate: response.user[0].birthday,
        WfhBalance: response.user[0].wfh_balance,
        empPermanent: response.user[0].empPermanent,
        compoOff_balance: response.user[0].compoOff_balance,
      });
    });
    // setTimeout(() => {
    //   document.getElementById("updEmp").style.display = "block";
    //   document.getElementById("updEmp").style.opacity = 1;
    //   document.getElementById("updEmp").style.overflow = "inherit";
    //   document.getElementById("updEmp").style.top = "25%";
    //   //document.getElementById('updEmp').style.background = "rgba(0,0,0,0.4)";

    //   var iDiv = document.createElement("div");
    //   iDiv.id = "backdrop";
    //   iDiv.className = "modal-backdrop fade show";
    //   document.getElementsByTagName("body")[0].appendChild(iDiv);
    // }, 500);
    this.refs.password.value = "";
  }

  handleOption = (event) => {
    this.setState({
      role: event.currentTarget.value,
    });
  };
  handlelocation = (event) => {
    this.setState({
      location: event.currentTarget.value,
    });
  };
  handleOptionExperiance = (event) => {
    this.setState({
      experiance: event.currentTarget.value,
    });
  };

  handleOptionReportingManager = (event) => {
    this.setState({
      reportingManager: event.currentTarget.value,
      report_to: event.currentTarget.value,
    });
  };

  handleOptionTeamLead = (event) => {
    this.setState({
      teamLead: event.currentTarget.value,
      teamlead_name: event.currentTarget.value,
    });
  };

  handleDateChange = (date) => {
    const profile = Auth.getProfile();
    if (date != null) {
      this.setState({
        joiningDate: date,
      });
    } else {
      this.setState({
        joiningDate: "",
      });
    }
  };
  handleBirthdateChange = (date) => {
    const profile = Auth.getProfile();
    if (date != null) {
      this.setState({
        birthdate: date,
      });
    } else {
      this.setState({
        birthdate: "",
      });
    }
  };

  handleOptionHr = (event) => {
    this.setState({
      hr: event.currentTarget.value,
      hr_name: event.currentTarget.value,
    });
  };

  handleOptionSickBalance = (event) => {
    this.setState({
      SickBalance: event.currentTarget.value,
    });
  };
  handleOptioncompoOff_balanceance = (event) => {
    this.setState({
      compoOff_balance: event.currentTarget.value,
    });
  };
  handleOptionCasualBalance = (event) => {
    this.setState({
      CasualBalance: event.currentTarget.value,
    });
  };
  handleOptionWfhBalance = (event) => {
    this.setState({
      WfhBalance: event.currentTarget.value,
    });
  };
  handleempPermanent = (event) => {
    this.setState({
      empPermanent: event.currentTarget.value,
    });
  };
  handleEmailOption = (event) => {
    this.setState({
      email: this.refs.email.value,
    });
  };

  handleNameOption = (event) => {
    this.setState({
      name: this.refs.name.value,
    });
  };

  UpdateDetails(id) {
    let formData = {
      email: this.state.email,
      name: this.state.name,
      DOJ: this.state.joiningDate,
    };
    let errors = handleValidation(formData);
    this.setState({ errors: errors });
    if (errors["valid"] == true) {
      Auth.UpdateDetails(
        id,
        this.state.name,
        this.state.email,
        this.state.experiance,
        this.refs.password.value,
        this.state.report_to,
        this.state.teamlead_name,
        this.state.hr_name,
        this.state.role,
        this.state.CasualBalance,
        this.state.SickBalance,
        this.state.joiningDate,
        this.refs.location.value,
        this.state.birthdate,
        this.state.WfhBalance,
        this.state.empPermanent,
        this.state.compoOff_balance
      ).then((data) => {
        if (data.message != "Successfully updated") {
          this.setState({
            showAlertupdate: true,
            alertMessage: data.message,
            danger: true,
          });
          setTimeout(() => {
            this.setState({ alertMessage: "", showAlertupdate: false });
          }, 3000);
          this.componentDidMount();
        } else {
          this.setState({
            showAlertupdate: true,
            alertMessage: data.message,
            danger: false,
          });
          setTimeout(() => {
            this.setState({
              alertMessage: "Employee status successfully Changed",
              showAlertupdate: false,
            });
          }, 3000);
          //
          this.componentDidMount();
        }
      });
      this.cancelModal();
      // document.getElementById("updEmp").style.display = "none";
      // document.getElementById("updEmp").style.opacity = 0;
      // var elem = document.getElementById("backdrop");
      // elem.remove();
      // this.refs.password.value = "";
    } else {
      this.setState({ errorsdiv: true });
      setTimeout(() => {
        this.setState({ errorsdiv: false });
      }, 4000);
    }
  }
  cancelModal = () => {
    // document.getElementById("updEmp").style.display = "none";
    // document.getElementById("updEmp").style.opacity = 0;
    // var elem = document.getElementById("backdrop");
    // elem.remove();
    this.refs.password.value = "";
  };

  render() {
    const isWeekday = (date) => {
      const day = date.getDay();
      return day !== 0 && day !== 6;
    };
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
        <img
          className="img-circle img-height content-image"
          src={imagePreviewUrl}
        />
      );
    } else {
      $imagePreview = (
        <img
          className="img-circle img-height content-image"
          src="/assets/img/users/u8.jpg"
        />
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
          <div
            className="modal fade update-Emp"
            id="updateEmp"
            data-backdrop="static"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Update User Profile</h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    onClick={this.cancelModal}
                  >
                    &times;
                  </button>
                </div>
                <form onSubmit={this.handleFormSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-sm-4 form-group">
                        <label>Name</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Name"
                          value={this.state.name}
                          ref="name"
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
                      <div className="col-sm-4 form-group">
                        <label>Email Address</label>
                        <input
                          className="form-control"
                          type="email"
                          placeholder="Email"
                          value={this.state.email}
                          ref="email"
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
                      <div className="col-sm-4 form-group">
                        <label>Password</label>
                        <input
                          className="form-control"
                          type="password"
                          placeholder="Password"
                          ref="password"
                          //defaultValue={this.state.userList.password}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4 form-group">
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
                      <div className="col-sm-4 form-group">
                        <label>Before Teq Experience</label>
                        <input
                          ref="exp"
                          className="form-control"
                          value={this.state.experiance}
                          onChange={this.handleOptionExperiance}
                        />
                      </div>
                      <div className="col-sm-4 form-group">
                        <label>Reporting Manager</label>
                        <select
                          ref="reportingManager"
                          className="form-control"
                          value={this.state.report_to}
                          onChange={this.handleOptionReportingManager}
                        >
                          {this.state.manager != undefined
                            ? this.state.manager.map((item) => (
                                <option key={item._id} value={item._id}>
                                  {item.name}
                                </option>
                              ))
                            : ""}
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-4 form-group">
                        <label>Casual Leave Balance</label>
                        <input
                          className="form-control"
                          ref="casual"
                          value={this.state.CasualBalance}
                          onChange={this.handleOptionCasualBalance}
                        ></input>
                      </div>
                      <div className="col-sm-4 form-group">
                        <label>Sick Leave Balance</label>
                        <input
                          className="form-control"
                          ref="sick"
                          value={this.state.SickBalance}
                          onChange={this.handleOptionSickBalance}
                        ></input>
                      </div>
                      <div className="col-sm-4 form-group">
                        <label>Comp Off Balance</label>
                        <input
                          className="form-control"
                          ref="como"
                          value={this.state.compoOff_balance}
                          onChange={this.handleOptioncompoOff_balanceance}
                        ></input>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-4 form-group">
                        <label className="font-normal">Date of Joining </label>
                        <div className="input-group date">
                          <span className="input-group-addon bg-white">
                            <i className="fa fa-calendar"></i>
                          </span>
                          <DatePicker
                            // customInput={<CustomInput />}
                            dateFormat="dd/MM/yyyy"
                            //  minDate={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
                            maxDate={new Date(+new Date() + 2592000000)}
                            ref="startdate"
                            className="form-control date-picker-date"
                            selected={this.state.joiningDate}
                            onChange={this.handleDateChange}
                            filterDate={isWeekday}
                            //excludeDates={this.test()}
                          />
                          {this.state.errorsdiv == true ? (
                            <span className="error">
                              {this.state.errors["DOJ"]}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="col-sm-4 form-group">
                        <label>Location</label>
                        <select
                          ref="location"
                          value={this.state.location}
                          onChange={this.handlelocation.bind(this)}
                          className="form-control"
                        >
                          <option>Ranchi</option>
                          <option>Pune</option>
                          <option>Canada</option>
                        </select>
                      </div>
                      {this.state.role == "Employee" ? (
                        <div className="col-sm-4 form-group">
                          <label>Team Leader</label>
                          <select
                            ref="teamLead"
                            className="form-control"
                            value={this.state.teamlead_name}
                            onChange={this.handleOptionTeamLead}
                          >
                            {this.state.teamLeader != undefined
                              ? this.state.teamLeader.map((item) => (
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
                    </div>
                    <div className="row">
                      {this.state.role != "HR" ? (
                        <div className="col-sm-4 form-group">
                          <label>HR</label>
                          <select
                            ref="hr"
                            className="form-control"
                            value={this.state.hr_name}
                            onChange={this.handleOptionHr}
                          >
                            {this.state.hrPerson != undefined
                              ? this.state.hrPerson.map((item) => (
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
                        <input
                          className="form-control"
                          ref="casual"
                          value={this.state.WfhBalance}
                          onChange={this.handleOptionWfhBalance}
                        ></input>
                      </div>
                    </div>
                  </div>

                  {/* Modal footer */}
                  <div className="modal-footer">
                    <button
                      type="button"
                      data-dismiss="modal"
                      className="btn btn-danger btn-rounded btn-fix"
                      onClick={this.cancelModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-success btn-rounded btn-fix"
                      data-toggle="modal"
                      data-target="#successupdate"
                      data-dismiss="modal"
                      onClick={() =>
                        this.UpdateDetails(this.state.userList._id)
                      }
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div
            className="modal fade update-Emp"
            id="updateEmpPermanent"
            data-backdrop="static"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Update Employee Status</h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    onClick={this.cancelModal}
                  >
                    &times;
                  </button>
                </div>
                <form onSubmit={this.handleFormSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-sm-6 form-group">
                        <label>Employee Status</label>
                      </div>
                      <div className="col-sm-6 form-group">
                        <select
                          className="form-control"
                          value={this.state.emp.empPermanent}
                          ref="empPermanent"
                          value={this.state.empPermanent}
                          onChange={this.handleempPermanent}
                        >
                          <option>Select Employee Status</option>
                          <option value="1">Permanent Employee</option>
                          <option value="0">Probation Period</option>
                          <option value="2">Contract Employee</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Modal footer */}
                  <div className="modal-footer">
                    <button
                      type="button"
                      data-dismiss="modal"
                      className="btn btn-danger btn-rounded btn-fix"
                      onClick={this.cancelModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-success btn-rounded btn-fix"
                      data-toggle="modal"
                      data-target="#successupdate"
                      data-dismiss="modal"
                      onClick={() =>
                        this.UpdateDetails(this.state.userList._id)
                      }
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal fade" id="leaveDetails">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Leave Type</h4>
                  <button type="button" className="close" data-dismiss="modal">
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
                        {this.state.leaveDetails.map((item) => (
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
          {/* ChatComment */}
          <div className="modal fade" id="Chatcmt" data-backdrop="static">
            <div className="modal-dialog ">
              <div className="modal-content">
                <div className="modal-header applyleave">
                  <h4 className="modal-title applyleave">Chat Window</h4>
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
                            {this.state.commentChat.map((item) => (
                              <div className="msg_cotainer_send bg-primary">
                                <span>
                                  <small>{item.Role}</small>
                                </span>{" "}
                                <br></br>
                                <span>{item.Message}</span>
                              </div>
                            ))}
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
                        className="btn btn-primary btn-rounded"
                      >
                        <i className="fa fa-paper-plane"></i>
                      </button>
                    </div>
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
                  <h4 className="modal-title applyleave">Chat Window</h4>
                  <button type="button" className="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>
                <div className="row chat-window">
                  <div className="col-sm-12">
                    <div className="modal-body chat-background">
                      <section id="tab1">
                        <div className="row">
                          <div className="col-sm-12">
                            {this.state.commentChat.map((item) => (
                              <div className="msg_cotainer_send bg-primary">
                                <span>
                                  <small>{item.Role}</small>
                                </span>{" "}
                                <br></br>
                                <span>{item.Message}</span>
                              </div>
                            ))}
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
                        className="btn btn-primary btn-rounded"
                      >
                        <i className="fa fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="left left-paddi">
            <button
              className="btn btn-success btn-circle"
              aria-pressed="false"
              onClick={this.goBack}
            >
              <i className="fa fa-arrow-left"></i>
            </button>
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
                    <p className="text-center mt-txt">
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
                    <p className="text-center mt-txt">
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
                      You want to disapproved your approval!
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
                      <i className="fa fa-check"></i> Disapproved
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
                      You want to decline this Leave Requests!
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
          <div className="modal fade" id="apporvedTab">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body appr-model sweet-alert showSweetAlert visible">
                  <div className="sa-icon sa-success animate">
                    <span className="sa-line sa-tip animateSuccessTip"></span>
                    <span className="sa-line sa-long animateSuccessLong"></span>
                    <div className="sa-placeholder"></div>
                    <div className="sya-fix"></div>
                  </div>
                </div>
                <div className="appr-model">
                  <h3 className="text-center">Are you sure?</h3>
                  <div>
                    <p className="text-center mt-txt">
                      You want to approve this Leave Requests!
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
          <div className="page-content fade-in-up">
            <div className="modal fade" id="profile">
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

                  <div className="container">
                    {this.state.showpopup == true ? (
                      <div className="alertmessage">
                        {this.state.alertMessage}
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="row">
                      <div className="col-md-12">
                        <Avatar
                          //width={390}
                          height={295}
                          onCrop={this.onCropDefault}
                          onClose={this.onCloseDefault}
                          // src={this.state.src}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row profile-page">
              {/* <div className="col-lg-4 col-md-4 pro-leave-info">
                <div className="ibox profile-leave-detail">
                  <div className="ibox-head">
                    <div className="ibox-title">All Info</div>
                  </div>
                  <div className="ibox-body">
                    <div className="row">
                      <div className="col-sm-12">
                        <ul className="list-group list-group-full list-group-divider">
                          <li className="list-group-item">
                            Ideal Employee:
                            <span className="pull-right color-green">
                              {this.state.idealEmployee}
                            </span>
                          </li>
                          <li className="list-group-item">
                            Engage Employee:
                            <span className="pull-right color-red">
                              {this.state.engagedEmployee}
                            </span>
                          </li>
                          <li className="list-group-item">
                            Salesforce Project:
                            <span className="pull-right color-orange">
                              {this.state.SalesProjects}
                            </span>
                          </li>

                          <li className="list-group-item">
                            Web-Dev Project:
                            <span className="pull-right ">
                              {this.state.WebProjects}
                            </span>
                          </li>
                          <li className="list-group-item">
                            Total Working Project:
                            <span className="pull-right ">
                              {this.state.totalProjects}
                            </span>
                          </li>
                          <li className="list-group-item">
                            Location:{" "}
                            <span className="pull-right ">
                              {this.state.emp.location}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* <div className="row">
                      <div className="col-sm-12">
                        <ul className="list-group list-group-full list-group-divider">
                          <li className="list-group-item">Date Of Birth :  <span className="pull-right ">{this.state.emp.birthday}
                          </span>
                          </li>
                          <li className="list-group-item">Location:  <span className="pull-right ">{this.state.emp.location}
                          </span>
                          </li>
                          <li className="list-group-item">Date Of Joining :
                                    <span className="pull-right">{this.state.emp.doj}</span>
                          </li>
                        </ul>

                      </div>
                    </div> 
                  </div>
                </div>
              </div> */}
              <div className="col-lg-12 col-md-12 pro-user-info">
                {this.state.showAlertupdate == true ? (
                  <div
                    //  className="alert alert-success alert-dismissable fade show alertpopup"
                    className={this.handleAlertClass()}
                  >
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
                <div className="ibox">
                  <div className="ibox-head">
                    <div className="ibox-title">User Profile</div>

                    {this.state.userRole !== "TeamLead" &&
                    this.state.userRole !== "Manager" ? (
                      <div>
                        {/* <button
                          className="btn btn-outline-info  btn-rounded addemployee-btn"
                          data-toggle="modal"
                          data-target="#updateEmp"
                          aria-pressed="false"
                          onClick={() => this.editEmp(empId)}
                        >
                          <i class="fa fa-user-plus"></i> Update Profile
                        </button> */}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="ibox-body pro-user">
                    <div className="row pro-details">
                      <div className="col-lg-6 col-md-6 pro-user-detail">
                        <ul className="list-group list-group-full list-group-divider">
                          <li className="list-group-item">
                            Email :
                            <span className="pull-right ">
                              {this.state.emp.email}
                            </span>
                          </li>
                          {/* <li className="list-group-item">Mobile No :
                                    <span className="pull-right ">1234567890</span>
                                        </li> */}
                          <li className="list-group-item">
                            Role :
                            <span className="pull-right ">
                              {this.state.emp.role}
                            </span>
                          </li>
                          <li className="list-group-item">
                            Reporting Manager :
                            <span className="pull-right ">
                              {this.state.emp.report_to}
                            </span>
                          </li>
                          <li className="list-group-item">
                            HR :
                            <span className="pull-right ">
                              {this.state.emp.hr_name}
                            </span>
                          </li>
                          <li className="list-group-item">
                            Team Lead :
                            <span className="pull-right ">
                              {this.state.emp.teamlead_name}
                            </span>
                          </li>
                          <li className="list-group-item">
                            Exp In Teq :
                            <span className="pull-right">
                              {this.state.emp.teqFocusExp}
                            </span>
                          </li>
                          <li className="list-group-item">
                            Total Exp:
                            <span className="pull-right">
                              {this.state.emp.experience +
                                this.state.emp.teqFocusExp}
                            </span>
                          </li>
                          {this.state.emp.empPermanent == 1 ? (
                            <li className="list-group-item">
                              Empoyee Status :
                              <span className="pull-right">
                                Permanent Employee
                              </span>
                            </li>
                          ) : (
                            ""
                          )}
                          {this.state.emp.empPermanent == 0 ? (
                            <li className="list-group-item">
                              Empoyee Status :
                              <span className="pull-right">
                                Probation Period
                              </span>
                            </li>
                          ) : (
                            ""
                          )}
                          {this.state.emp.empPermanent == 2 ? (
                            <li className="list-group-item">
                              Empoyee Status :
                              <span className="pull-right">
                                Contract Employee
                              </span>
                            </li>
                          ) : (
                            ""
                          )}
                        </ul>
                      </div>
                      <div className="col-lg-6 col-md-6 pro-img-detail">
                        <div className="text-center">
                          <div className="contentss">
                            {/* <div className="content-overlay"></div> */}
                            {$imagePreview}
                            {/* <div className="content-details fadeIn-bottom">
                                                        <input type="file" id="file1" name="file" capture className="camera" onChange={(e) => this._handleImageChange(e)} />
                                                        <i className="fa fa-camera cameraIcon" aria-hidden="true" id="upfile1" data-toggle="modal" data-target="#profile"
                                                        ></i>
                                                    </div> */}
                            <div class="font-strong profilename">
                              {this.state.emp.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                          {this.state.leaveDetailss.map((item) => (
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

            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="ibox">
                  <div className="ibox-body">
                    <h4 className="text-info m-b-20 m-t-20">
                      <i className="fa fa-tasks"></i> {""}Project List
                    </h4>
                    {/* </div>
                <div > */}
                    <div className="tab-content">
                      <div className="tab-pane fade show active" id="tab-3">
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Project Name</th>
                                <th className="tbl-date" width="91px">
                                  Client Name
                                </th>
                                <th className="tbl-date" width="91px">
                                  Project Manager
                                </th>
                                <th>Start Date</th>
                                <th>Category</th>
                                {/* <th width="91px" className="tb-white-sp">
                                  Project Member's
                                </th> */}
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.userProjectListPaged.map(
                                (item, index) => (
                                  <tr key={item._id}>
                                    <td>{index + this.state.projectCount}</td>
                                    <td className="tbl-date">
                                      {item.projects.project_name}
                                    </td>
                                    <td className="tbl-date">
                                      {item.projects.client_name}
                                    </td>
                                    <td className="tbl-date">
                                      {item.projects.reporting_manger_name}
                                    </td>
                                    <td className="tbl-date">
                                      {item.projects.start_date}
                                    </td>
                                    <td className="tbl-date">
                                      {item.projects.category}
                                    </td>
                                    {/* <td>
                                      {" "}
                                      <button
                                        className="btn btn-outline-info"
                                        data-toggle="modal"
                                        data-target="#memberdetails"
                                        aria-pressed="false"
                                        onClick={() => this.showMember(item)}
                                      >
                                        <i className="fa fa-list list-status"></i>
                                        Members
                                      </button>
                                    </td> */}

                                    <td>
                                      <div>
                                        {item.projects.status == "Hold" ? (
                                          <div>
                                            <span className="badge badge-danger">
                                              Hold
                                            </span>
                                          </div>
                                        ) : (
                                          <div>
                                            {item.projects.status == "Completed" ? (
                                              <div>
                                                <span className="badge badge-success">
                                                  Completed
                                                </span>
                                              </div>
                                            ) : (
                                              <div>
                                                <span className="badge badge-warning">
                                                  Progress
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
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
                            activePage={this.state.activePagee}
                            itemsCountPerPage={3}
                            totalItemsCount={100}
                            pageRangeDisplayed={3}
                            onChange={this.getProjectList}
                            itemClass="page-item no-padding"
                            linkClass="page-link"
                            prevPageText="Previous"
                            nextPageText="Next"
                            totalItemsCount={this.state.userProjectList.length}
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
                                <th className="cmt-section">Reason</th>
                                <th className="cmt-section tbl-date">
                                  Comment
                                </th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.declinedWfhPaged.map(
                                (item, index) => (
                                  <tr key={item._id}>
                                    <td>
                                      {index + this.state.countWfhDecline}
                                    </td>
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
                                    <td className="tbl-date">
                                      {" "}
                                      <div className="customtooltip">
                                        <button
                                          className="btn btn-xs"
                                          type="button"
                                          onClick={() =>
                                            this.showComment(
                                              item._id,
                                              item.leave_type
                                            )
                                          }
                                          data-toggle="modal"
                                          data-target="#Chatrecord"
                                        >
                                          <i className="fa fa-comments font comment"></i>
                                        </button>
                                        <span className="tooltiptext">
                                          Comment
                                        </span>
                                      </div>
                                    </td>
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
                          activePage={this.state.activeWfhPagedec}
                          itemsCountPerPage={3}
                          totalItemsCount={100}
                          pageRangeDisplayed={3}
                          onChange={this.handleClickDeclinedWfhPaged}
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
          {/* member Details */}
          <div className="modal fade" id="memberdetails">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 class="modal-title addemployee">Member Details</h4>
                  <button type="button" className="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th className="mem-details-table">Member Name</th>
                          <th className="mem-details-table">Role</th>
                          <th className="text-center">
                            <i className="ti-menu"></i>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.showmember.map((item, index) => (
                          <tr>
                            <td>{index + this.state.count}</td>
                            <td className="mem-details-table">{item.name}</td>
                            <td className="mem-details-table">{item.role}</td>
                            <td className="text-center">
                              {this.state.userRole === "Admin" ||
                              this.state.userRole == "Manager" ||
                              this.state.userRole === "SuperAdmin" ? (
                                <button
                                  className="btn badge-danger"
                                  data-toggle="modal"
                                  data-original-title="Delete"
                                  data-target="#memDelete"
                                  onClick={() => this.hadleShow(item)}
                                >
                                  <i className="fa fa-trash font-14"></i>
                                </button>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  {this.state.userRole === "Admin" ||
                  this.state.userRole == "Manager" ||
                  this.state.userRole === "SuperAdmin" ? (
                    <button
                      type="button"
                      className="btn btn-rounded btn-primary"
                      data-toggle="modal"
                      data-target="#addmember"
                    >
                      Add Member
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
          {/*Delete member */}
          <div className="modal fade" id="memDelete">
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
                      You want to delete this Member!
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
                      onClick={() => this.memeberDelete()}
                    >
                      <i className="fa fa-check"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <Member Add> */}
          <div className="modal fade" id="addmember">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Add Member</h4>
                  {/* {this.state.showAlert == true ? (
                <div className="alertmessage">
                  {this.state.alertMessage} !
                </div>
              ) : (
                  ""
                )} */}
                  <button
                    type="button"
                    className="close"
                    onClick={this.cancelForm}
                    data-dismiss="modal"
                  >
                    &times;
                  </button>
                </div>
                <div className="form">
                  <form onSubmit={this.handleAddmember}>
                    <div className="modal-body">
                      <div className="form-group">
                        <label>
                          Project Name: <span className="star symbol">*</span>
                        </label>
                        <input
                          type="text"
                          ref="project_name"
                          className="form-control "
                          placeholder="Enter Project Name"
                          value={this.state.project_name}
                          onChange={this.handleProjectNameChange.bind(this)}
                        >
                          {/* {this.state.pjname != undefined
                        ? this.state.pjname.map(item => (
                            <option key={item._id} value={item._id}>
                              {item.project_name}
                            </option>
                          ))
                        : ""} */}
                        </input>
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <select
                          ref="role"
                          className="form-control"
                          value={this.state.role}
                          onChange={this.handleRole}
                          // onClick={this.handleRoleUserList(this.state.role)}
                        >
                          <option value="Developer">Developer</option>
                          <option value="Tester">Tester</option>
                          {/* <option value="Manager">Manager</option> */}
                        </select>
                      </div>
                    
                      <div className="form-group">
                        <label>
                          User Name: <span className="star symbol">*</span>
                        </label>
                        <select
                          type="text"
                          ref="user_name"
                          className="form-control "
                          placeholder="Enter User Name"
                          value={this.state.user_name}
                          onChange={this.handleUserNameChange.bind(this)}
                        >
                          {this.state.usnamerole != undefined
                            ? this.state.usnamerole.map((item) => (
                                <option key={item._id} value={item._id}>
                                  {item.name}
                                </option>
                              ))
                            : ""}
                        </select>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-primary btn-rounded btn-fix"
                        data-dismiss="modal"
                        onClick={this.cancelForm}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success btn-rounded btn-fix"
                        id="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default EmProfile;
