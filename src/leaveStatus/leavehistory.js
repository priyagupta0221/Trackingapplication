import React, { Component } from "react";
import AuthService from "../AuthService";
import Pagination from "react-js-pagination";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";
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
var userId = null;
class LeaveHistory extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.declineLeave = this.declineLeave.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.approvedTabClick = this.approvedTabClick.bind(this);
    this.declineTabClick = this.declineTabClick.bind(this);
    this.leaveDetails = this.leaveDetails.bind(this);
    this.handleClickDeclinedPaged = this.handleClickDeclinedPaged.bind(this);
    this.handleClickApprovedPaged = this.handleClickApprovedPaged.bind(this);
    this.handleShowDecline = this.handleShowDecline.bind(this);
    this.approveLeave = this.approveLeave.bind(this);
    this.state = {
      approvedLeave: [],
      leaveDetails: [],
      leaveDetailss: [],
      declineLeave: [],
      balanceLeaves: [],
      userDetail: [],
      imagePreviewUrl: "",
      loading: true,
      approvedLeavePaged: [],
      declinedLeavePaged: [],
      currentPage: 1,
      todosPerPage: 3,
      numbers: [],
      activePage: 1,
      showAlert: false,
      approve: 1,
      decline: 1
    };
    var x = props.location.pathname;
    userId = x.slice(14, 38);
  }
  handleShowDecline(id) {
    this.setState({
      empId: id
    });
  }
  approveLeave(id) {
    this.setState({
      showDec: true,
      idTest: id
    });

    var user = window.localStorage.getItem("id_token");
    Auth.approveLeaveStatus(id).then(res => {
      listOfLeaves = this.state.declinedLeavePaged;
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
            declinedLeavePaged: listOfLeaves
          });
        } else if (res.message == "Leave approved by SuperAdmin") {
          if (obj._id == id) {
            listOfLeaves[i].message = "Approved By Delivery Head";
          }
          this.setState({
            show: false,
            showAlert: true,
            alertMessage: res.message,
            declinedLeavePaged: listOfLeaves
          });
        } else {
          this.setState({
            show: false,
            showAlert: true,
            alertMessage: res.message
          });
        }
      }

      if (res.message == "Leave updated successfully") {
        var listOfLeaves = [];
        listOfLeaves = this.state.declinedLeavePaged;
        for (var i = 0; i < listOfLeaves.length; i++) {
          var obj = listOfLeaves[i];

          if (obj._id == id) {
            this.state.declinedLeavePaged.splice(i, 1);
            this.setState({
              declinedLeavePaged: this.state.declinedLeavePaged
            });
          }
        }
        this.setState({
          showDec: false,
          showAlert: true,
          alertMessage: "Leave approved Successfully"
        });
      }
    });

    setTimeout(() => {
      this.setState({ alertMessage: "", showAlert: false });
    }, 4000);
  }
  declineLeave(id) {
    this.setState({
      showDec: true,
      empId: id
    });
    var user = window.localStorage.getItem("id_token");
    Auth.declineLeaveStatus(id).then(res => {
      // this.apiResponse(res);
      var listOfLeaves = [];
      listOfLeaves = this.state.approvedLeavePaged;
      for (var i = 0; i < listOfLeaves.length; i++) {
        var obj = listOfLeaves[i];

        if (obj._id == id) {
          this.state.approvedLeavePaged.splice(i, 1);
          this.setState({
            approvedLeavePaged: this.state.approvedLeavePaged
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
  handleShow(id) {
    this.setState({
      empId: id
    });
  }
  handleClickDeclinedPaged(number) {
    this.setState({
      activePagedec: number
    });
    var declineData = [];
    var countDecline = 1;

    Auth.getUserSummary(userId).then(response => {
      var temObj = "";
      if (response.status == 200) {
        for (var i = 0; i < response.leaves.length; i++) {
          if (response.leaves[i].approval_status == "Rejected") {
            if (response.leaves[i].approved_by.length > 0) {
              for (var j = 0; j < response.leaves[i].approved_by.length; j++) {
                if (response.leaves[i].approved_by[j] == "Admin") {
                  response.leaves[i].message = "Approved By HR";
                } else if (response.leaves[i].approved_by[j] == "SuperAdmin") {
                  response.leaves[i].message = "Approved By Delivery Head";
                }
              }
            }
            response.leaves[i].countDecline = countDecline;
            declineData.push(response.leaves[i]);
            countDecline = countDecline + 1;
          }
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
            if (response.leaves[i].leave_type == "Casual Leave") {
              temObj = response.leaves[i].balance.casual;
            } else if (response.leaves[i].leave_type == "Sick Leave") {
              temObj = response.leaves[i].balance.sick;
            }
            response.leaves[i].leaveBalance = temObj;
          }
        }
        this.setState({
          itemsapproved: response.leaves,
          activePage: 1,
          declineLeave: declineData
        });
      }
    });
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ decline: indexOfFirstTodo + 1 });
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
      } else {
        arr[i].leave_type = x.slice(0, 6);
      }
    }
    this.setState({
      declinedLeavePaged: arr
    });
  }
  leaveDetails = item => {
    this.setState({
      leaveDetailss: item.leave_details
    });
  };
  goBack() {
    this.props.history.replace("/leavedetail");
  }
  trimReason(e) {
    const res = arguments[0].slice(0, 10);
    return res;
  }
  approvedTabClick() {
    var tabA = document.getElementById("tab-2");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-1");
    tabB.classList.add("active");
    tabB.classList.add("show");
    Auth.getLeavesDetailApproved().then(response => {
      var temObj = "";
      if ((response.status = 200)) {
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
            if (response.leaves[i].leave_type == "Casual Leave") {
              temObj = response.leaves[i].balance.casual;
            } else if (response.leaves[i].leave_type == "Sick Leave") {
              temObj = response.leaves[i].balance.sick;
            }
            response.leaves[i].leaveBalance = temObj;
          }
        }
        this.setState({
          itemsapproved: response.leaves,
          activePage: 1
        });
      }
    });
  }
  declineTabClick() {
    var tabA = document.getElementById("tab-1");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-2");
    tabB.classList.add("active");
    tabB.classList.add("show");
    var countDecline = 1;
    var declinedData = [];
    Auth.getUserSummary(userId).then(response => {
      if (response.status == 200) {
        for (var i = 0; i < response.leaves.length; i++) {
          if (response.leaves[i].approval_status == "Rejected") {
            response.leaves[i].countDecline = countDecline;
            declinedData.push(response.leaves[i]);
            countDecline = countDecline + 1;
          }
          // response.leaves[i].countDecline =countDecline;
          // declinedData.push(response.leaves[i]);
          countDecline = countDecline + 1;
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
                }
              }
            }
          }
        }
        this.setState({
          declineLeave: declinedData,
          activePagedec: 1
        });
      }
    });
    const todos = this.state.declineLeave;
    const { currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    this.setState({ decline: indexOfFirstTodo + 1 });
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
      } else {
        arr[i].leave_type = x.slice(0, 6);
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
  handleClickApprovedPaged(number) {
    this.setState({
      activePageapp: number
    });
    var countApprove = 1;
    var approvedData = [];

    Auth.getUserSummary(userId).then(response => {
      var temObj = "";
      if (response.status == 200) {
        for (var i = 0; i < response.leaves.length; i++) {
          if (response.leaves[i].approval_status == "Approved") {
            if (response.leaves[i].approved_by.length > 0) {
              for (var j = 0; j < response.leaves[i].approved_by.length; j++) {
                if (response.leaves[i].approved_by[j] == "Admin") {
                  response.leaves[i].message = "Approved By HR";
                } else if (response.leaves[i].approved_by[j] == "SuperAdmin") {
                  response.leaves[i].message = "Approved By Delivery Head";
                }
              }
            }
            response.leaves[i].countApprove = countApprove;
            approvedData.push(response.leaves[i]);
            countApprove = countApprove + 1;
          }
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
            if (response.leaves[i].leave_type == "Casual Leave") {
              temObj = response.leaves[i].balance.casual;
            } else if (response.leaves[i].leave_type == "Sick Leave") {
              temObj = response.leaves[i].balance.sick;
            }
            response.leaves[i].leaveBalance = temObj;
          }
        }
        this.setState({
          itemsapproved: response.leaves,
          activePage: 1,
          approvedLeave: approvedData
        });
      }
    });

    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ approve: indexOfFirstTodo + 1 });
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
      } else {
        arr[i].leave_type = x.slice(0, 6);
      }
    }
    this.setState({
      approvedLeavePaged: arr
    });
  }
  componentDidMount() {
    Auth.getUserSummary(userId).then(res => {
      var countApprove = 1;
      var countDecline = 1;
      var approvedData = [];
      var declinedData = [];
      var pendingData = [];
      for (var i = 0; i < res.leaves.length; i++) {
        for (var j = 0; j < res.leaves[i].approved_by.length; j++) {
          if (res.leaves[i].approved_by[j] == "Admin") {
            res.leaves[i].message = "Approved By HR";
          } else if (res.leaves[i].approved_by[j] == "SuperAdmin") {
            res.leaves[i].message = "Approved By Delivery Head";
          }
        }
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
        if (res.leaves[i].approval_status == "Approved") {
          res.leaves[i].countApprove = countApprove;
          approvedData.push(res.leaves[i]);
          countApprove = countApprove + 1;
        }
        if (res.leaves[i].approval_status == "Rejected") {
          res.leaves[i].countDecline = countDecline;
          declinedData.push(res.leaves[i]);
          countDecline = countDecline + 1;
        }
        if (res.leaves[i].approval_status == "Pending") {
          pendingData.push(res.leaves[i]);
        }
      }
      this.setState({
        approvedLeave: approvedData,
        declineLeave: declinedData,
        balanceLeaves: res.balance[0],
        userDetail: res.user[0],
        loading: false
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
        } else {
          arr[i].leave_type = x.slice(0, 6);
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
    });
  }
  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
        <img className="img-circle image-history" src={imagePreviewUrl} />
      );
    } else {
      $imagePreview = (
        <img
          className="img-circle image-history"
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
          <div className="modal fade" id="leaveDetails">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title"></h4>
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
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="ibox leave-his-ibox">
                <div className="left left-paddi">
                  <button
                    className="btn btn-success btn-circle"
                    aria-pressed="false"
                    onClick={this.goBack}
                  >
                    <i className="fa fa-arrow-left"></i>
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
                      <div className="text-muted txt-wht-sp">
                        Casual Balance
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="font-24 profile-stat-count">
                        {this.state.balanceLeaves.sick_balance}
                      </div>
                      <div className="text-muted txt-wht-sp">Sick Balance</div>
                    </div>
                    <div className="col-4">
                      <div className="font-24 profile-stat-count">
                        {this.state.balanceLeaves.sick_balance +
                          this.state.balanceLeaves.casual_balance}
                      </div>
                      <div className="text-muted txt-wht-sp">Total Balance</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-12">
              {this.state.showAlert == true ? (
                <div className={this.handleAlertClass()}>
                  <button
                    className="close"
                    onClick={this.handleAlert}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <strong></strong> {this.state.alertMessage}
                </div>
              ) : (
                ""
              )}
              <div className="ibox leave-his-ibox">
                <div className="ibox-body">
                  <ul className="nav nav-tabs tabs-line">
                    <li className="nav-item">
                      <a
                        className="nav-link active approved"
                        href="#tab-1"
                        data-toggle="tab"
                        onClick={() => this.approvedTabClick(this)}
                      >
                        Approved<i className="fa fa-check-circle-o"></i>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link decline"
                        href="#tab-2"
                        data-toggle="tab"
                        onClick={() => this.declineTabClick(this)}
                      >
                        Declined<i className="fa fa-times-circle-o"></i>
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
                              <th className="cmt-section tbl-date">
                                TL Comment
                              </th>
                              <th className="cmt-section tbl-date">
                                Manager Comment
                              </th>
                              <th className="cmt-section tbl-date">
                                HR Comment
                              </th>
                              <th className="cmt-section tbl-date">
                                DH Comment
                              </th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.approvedLeavePaged.map(
                              (item, index) => (
                                <tr key={item._id}>
                                  <td>{index + this.state.approve}</td>
                                  <td className="tbl-date">
                                    {item.person_name}
                                  </td>
                                  <td className="tbl-date">
                                    {item.start_date}
                                  </td>
                                  <td className="tbl-date">{item.end_date}</td>
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
                                        {this.trimReason(item.reason, item._id)}
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

                                  {item.teamlead_comment.length > 10 ? <td>
                                  <div id={'teamLeadUncontrolledPopover-' + item._id} className="pointer" >
                                    {this.trimReason(item.teamlead_comment, item._id)}...
                                  </div>
                                  <UncontrolledPopover trigger="legacy" placement="bottom" target={'teamLeadUncontrolledPopover-' + item._id}>
                                    {/* <PopoverHeader>Popover Title</PopoverHeader> */}
                                    <PopoverBody>  {item.teamlead_comment}</PopoverBody>
                                  </UncontrolledPopover>
                                </td> : <td>
                                    {item.teamlead_comment}
                                  </td>}

                                  {item.leave_comment.length > 10 ? (
                                    <td>
                                      <div
                                        id={
                                          "CommentUncontrolledPopover-" +
                                          item._id
                                        }
                                        className="pointer"
                                      >
                                        {this.trimReason(
                                          item.leave_comment,
                                          item._id
                                        )}
                                        ...
                                      </div>
                                      <UncontrolledPopover
                                        trigger="legacy"
                                        placement="bottom"
                                        target={
                                          "CommentUncontrolledPopover-" +
                                          item._id
                                        }
                                      >
                                        {/* <PopoverHeader>Popover Title</PopoverHeader> */}
                                        <PopoverBody>
                                          {" "}
                                          {item.leave_comment}
                                        </PopoverBody>
                                      </UncontrolledPopover>
                                    </td>
                                  ) : (
                                    <td>{item.leave_comment}</td>
                                  )}
                                  {item.admin_comment.length > 10 ? (
                                    <td className="cmt-section">
                                      <div
                                        id={
                                          "adminUncontrolledPopover-" + item._id
                                        }
                                        className="pointer"
                                      >
                                        {this.trimReason(
                                          item.admin_comment,
                                          item._id
                                        )}
                                        ...
                                      </div>
                                      <UncontrolledPopover
                                        trigger="legacy"
                                        placement="bottom"
                                        target={
                                          "adminUncontrolledPopover-" + item._id
                                        }
                                      >
                                        <PopoverBody>
                                          {" "}
                                          {item.admin_comment}
                                        </PopoverBody>
                                      </UncontrolledPopover>
                                    </td>
                                  ) : (
                                    <td className="cmt-section">
                                      {item.admin_comment}
                                    </td>
                                  )}

                                  {item.superadmin_comment.length > 10 ? (
                                    <td className="cmt-section">
                                      <div
                                        id={
                                          "superadminUncontrolledPopover-" +
                                          item._id
                                        }
                                        className="pointer"
                                      >
                                        {this.trimReason(
                                          item.superadmin_comment,
                                          item._id
                                        )}
                                        ...
                                      </div>
                                      <UncontrolledPopover
                                        trigger="legacy"
                                        placement="bottom"
                                        target={
                                          "superadminUncontrolledPopover-" +
                                          item._id
                                        }
                                      >
                                        <PopoverBody>
                                          {" "}
                                          {item.superadmin_comment}
                                        </PopoverBody>
                                      </UncontrolledPopover>
                                    </td>
                                  ) : (
                                    <td className="cmt-section">
                                      {item.superadmin_comment}
                                    </td>
                                  )}
                                  {/* <td className="tbl-date">
                                  <span className="badge badge-success">
                                    {item.approval_status}
                                  </span> */}
                                  {/* <p>{item.message}</p> */}
                                  {/* </td> */}
                                  <td className="tbl-date">
                                    <span className="badge badge-success">
                                      {item.approval_status}
                                    </span>{" "}
                                    <div className="customtooltip">
                                      <button
                                        className="btn badge-primary btn-xs btn-rounded m-r-5"
                                        data-toggle="modal"
                                        data-target="#apporved"
                                        onClick={() =>
                                          this.handleShow(item._id)
                                        }
                                      >
                                        <i
                                          className="fa fa-edit font comment"
                                          aria-hidden="true"
                                        ></i>{" "}
                                      </button>
                                      <span className="tooltiptext">
                                        Decline
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                      <Pagination
                        className="justify-content-center pegination-bottom"
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
                              <th className="cmt-section tbl-date">
                                TL Comment
                              </th>
                             <th className="cmt-section tbl-date">
                                Manager Comment
                              </th>
                              <th className="cmt-section tbl-date">
                                HR Comment
                              </th>
                              <th className="cmt-section tbl-date">
                                DH Comment
                              </th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.declinedLeavePaged.map(
                              (item, index) => (
                                <tr key={item._id}>
                                  <td>{index + this.state.decline}</td>
                                  <td className="tbl-date">
                                    {item.person_name}
                                  </td>
                                  <td className="tbl-date">
                                    {item.start_date}
                                  </td>
                                  <td className="tbl-date">{item.end_date}</td>
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
                                        {this.trimReason(item.reason, item._id)}
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
                                    {item.teamlead_comment.length > 10 ? <td>
                                  <div id={'teamLeadUncontrolledPopover-' + item._id} className="pointer" >
                                    {this.trimReason(item.teamlead_comment, item._id)}...
                                  </div>
                                  <UncontrolledPopover trigger="legacy" placement="bottom" target={'teamLeadUncontrolledPopover-' + item._id}>
                                    {/* <PopoverHeader>Popover Title</PopoverHeader> */}
                                    <PopoverBody>  {item.teamlead_comment}</PopoverBody>
                                  </UncontrolledPopover>
                                </td> : <td>
                                    {item.teamlead_comment}
                                  </td>}

                                  {item.leave_comment.length > 10 ? (
                                    <td>
                                      <div
                                        id={
                                          "CommentUncontrolledPopover-" +
                                          item._id
                                        }
                                        className="pointer"
                                      >
                                        {this.trimReason(
                                          item.leave_comment,
                                          item._id
                                        )}
                                        ...
                                      </div>
                                      <UncontrolledPopover
                                        trigger="legacy"
                                        placement="bottom"
                                        target={
                                          "CommentUncontrolledPopover-" +
                                          item._id
                                        }
                                      >
                                        {/* <PopoverHeader>Popover Title</PopoverHeader> */}
                                        <PopoverBody>
                                          {" "}
                                          {item.leave_comment}
                                        </PopoverBody>
                                      </UncontrolledPopover>
                                    </td>
                                  ) : (
                                    <td>{item.leave_comment}</td>
                                  )}
                                  {item.admin_comment.length > 10 ? (
                                    <td className="cmt-section">
                                      <div
                                        id={
                                          "adminUncontrolledPopover-" + item._id
                                        }
                                        className="pointer"
                                      >
                                        {this.trimReason(
                                          item.admin_comment,
                                          item._id
                                        )}
                                        ...
                                      </div>
                                      <UncontrolledPopover
                                        trigger="legacy"
                                        placement="bottom"
                                        target={
                                          "adminUncontrolledPopover-" + item._id
                                        }
                                      >
                                        <PopoverBody>
                                          {" "}
                                          {item.admin_comment}
                                        </PopoverBody>
                                      </UncontrolledPopover>
                                    </td>
                                  ) : (
                                    <td className="cmt-section">
                                      {item.admin_comment}
                                    </td>
                                  )}
                                  {item.superadmin_comment.length > 10 ? (
                                    <td className="cmt-section">
                                      <div
                                        id={
                                          "superadminUncontrolledPopover-" +
                                          item._id
                                        }
                                        className="pointer"
                                      >
                                        {this.trimReason(
                                          item.superadmin_comment,
                                          item._id
                                        )}
                                        ...
                                      </div>
                                      <UncontrolledPopover
                                        trigger="legacy"
                                        placement="bottom"
                                        target={
                                          "superadminUncontrolledPopover-" +
                                          item._id
                                        }
                                      >
                                        <PopoverBody>
                                          {" "}
                                          {item.superadmin_comment}
                                        </PopoverBody>
                                      </UncontrolledPopover>
                                    </td>
                                  ) : (
                                    <td className="cmt-section">
                                      {item.superadmin_comment}
                                    </td>
                                  )}
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
                                          className="fa fa-edit font comment"
                                          aria-hidden="true"
                                        ></i>
                                      </button>
                                      <span className="tooltiptext">
                                        Approve
                                      </span>
                                    </div>
                                    <p>{item.message}</p>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                      <Pagination
                        className="justify-content-center pegination-bottom"
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
        </div>
      );
    }
  }
  handleAlertClass() {
    let classes = "alert alert-dismissable fade show alertpopup ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
}

export default LeaveHistory;
