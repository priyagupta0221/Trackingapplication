import React, { Component } from "react";
import AuthService from "../AuthService";
import Pagination from "react-js-pagination";
import Loader from "react-loader-spinner";

import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
  withRouter
} from "react-router-dom";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
const Auth = new AuthService();
class WFHRequest extends Component {
  constructor() {
    super();
    this.handleShow = this.handleShow.bind(this);
    this.approveWFH = this.approveWFH.bind(this);
    this.declineWFH = this.declineWFH.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeReason = this.handleChangeReason.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      dataPerPage: [],
      count: 1,
      empId: null,
      showDec: false,
      todos: [],
      currentPage: 1,
      todosPerPage: 8,
      numbers: [],
      totalResponse: [],
      activePage: 1,
      loading: true,
      comment: '',
      Validate: false,
      showAlert: false,
      alertMessage: '',
      danger: false,
      todos: [],
      item: [],
      logger: '',
      commentChat: []
    };
  }
  /* Start Assign Id into Employee Id   */
  handleShow(id) {
    this.setState({
      empId: id
    });
  }
  /* End Assign Id into Employee Id   */
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
  /* End Close Comment Model window  */
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
  /* Start keyword Search Business Logic    */
  handleChange(event) {
    let indexOfFirstTodo = 0;
    var x = event.target.value;
    Auth.searchWFHByName(x).then(response => {
      if (response.status == 200) {
        var temObj = "";
        var sortedLeaves = [];
        for (var i = 0; i < response.wfh.length; i++) {
          var raisedOn = new Date(response.wfh[i].requested_at)
            .toISOString()
            .substring(0, 10);
          var datestring = raisedOn.split("-");
          var finalRequestDate =
            datestring[2] + "-" + datestring[1] + "-" + datestring[0];

          response.wfh[i].requested_at = finalRequestDate;

          if (response.wfh[i].approved_by.length > 0) {
            for (var j = 0; j < response.wfh[i].approved_by.length; j++) {
              if (response.wfh[i].approved_by[j] == "Admin") {
                response.wfh[i].message = "Approved By HR";
              } else if (response.wfh[i].approved_by[j] == "SuperAdmin") {
                response.wfh[i].message = "Approved By Delivery Head";
              }
              else if (response.wfh[i].approved_by[j] == "HR") {
                response.wfh[i].message = "Approved By HR";
              }
            }
          }
        }

        sortedLeaves = (response.wfh.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

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
  /* Start keyword Search Business Logic    */
  /* Start Approve WFH  Business Logic    */
  approveWFH(id) {
    Auth.approveWFHStatus(id).then(response => {
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
        if (response.message == "WFH Request approved by Admin") {
          this.setState({
            show: false,
            showAlert: true,
            danger: false,
            alertMessage: response.message
          });
          if (obj._id == id) {
            listOfLeaves[i].message = "Approved By HR";
          }
        } else if (response.message == "WFH Request approved by SuperAdmin") {
          this.setState({
            show: false,
            showAlert: true,
            danger: false,
            alertMessage: response.message
          });
          if (obj._id == id) {
            listOfLeaves[i].message = "Approved By Delivery Head";
          }
        }
        else if (response.message == "WFH Request approved by HR") {
          this.setState({
            show: false,
            showAlert: true,
            danger: false,
            alertMessage: response.message
          });
          if (obj._id == id) {
            listOfLeaves[i].message = "Approved By HR";
          }
        }

        if (obj._id == id && response.message == "WFH Request updated successfully") {
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
  /* End Approve WFH  Business Logic    */
  /* Start Decline WFH  Business Logic    */
  declineWFH(id) {
    Auth.declineWFHStatus(id).then(response => {
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
      danger: false,
      alertMessage: "Request declined successfully"
    });
    setTimeout(() => {
      this.setState({ alertMessage: "", showAlert: false });
    }, 4000);
  }
  /* End Decline WFH  Business Logic    */
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

  /* Start show Trim leave reason value */
  trimReason(e) {
    const res = arguments[0].slice(0, 10);
    return res;
  }
  /* End show Trim leave reason value */
  /* Start Pagination on Click Business Logic  */
  handleClick = number => {
    this.setState({
      activePage: number,
      currentPage: number
    });
    const { currentPage, todosPerPage } = this.state;
    var todos = this.state.totalResponse;
    const indexOfLastTodo = number * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    this.setState({ count: indexOfFirstTodo + 1 });
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });
    this.setState({
      dataPerPage: arr
    });
  };
  /* Start Pagination on Click Business Logic  */
  /* Start Main Business Logic when page load  */
  componentDidMount() {
   
    var dashNotwfh = document.getElementById("dashNotwfhrequest");
    dashNotwfh.classList.add("active");
    Auth.getwfhlist().then(response => {

      var sortedLeaves = [];
      for (var i = 0; i < response.wfh.length; i++) {
        var raisedOn = new Date(response.wfh[i].requested_at)
          .toISOString()
          .substring(0, 10);
        var datestring = raisedOn.split("-");
        var finalRequestDate =
          datestring[2] + "-" + datestring[1] + "-" + datestring[0];

        response.wfh[i].requested_at = finalRequestDate;
        if (response.wfh[i].approved_by.length > 0) {
          for (var j = 0; j < response.wfh[i].approved_by.length; j++) {
            if (response.wfh[i].approved_by[j] == "Admin") {
              response.wfh[i].message = "Approved By HR";
            } else if (response.wfh[i].approved_by[j] == "SuperAdmin") {
              response.wfh[i].message = "Approved By Delivery Head";
            }
            else if (response.wfh[i].approved_by[j] == "HR") {
              response.wfh[i].message = "Approved By HR";
            }
          }
        }
        // if (this.state.userRole == 'TeamLead') {
        //   if (response.wfh[i].teamlead_comment === "N/A") {
        //     item.push(response.wfh[i]);
        //   }
        // } else {
        //   if (response.wfh[i].leave_comment === "N/A") {
        //     item.push(response.wfh[i]);
        //   }
        // }
      }
      sortedLeaves = (response.wfh.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

      this.setState({
        totalResponse: sortedLeaves,
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
            timeout={5000} //3 secs
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
                      You want to approve this WFH Request!
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
                      onClick={() => this.approveWFH(this.state.empId)}
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
                      You want to decline this WFH Requests!
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
                      onClick={() => this.declineWFH(this.state.empId)}
                    >
                      <i className="fa fa-check"></i> Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ibox">
            <div className="ibox-head box-emp-mang">
              <div className="ibox-title">WFH Request</div>
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
                      <th className="cmt-section">Request</th>
                      <th className="cmt-section">Days</th>
                      <th className="cmt-section">Balance</th>
                      <th className="cmt-section">Type</th>
                      <th className="cmt-section">Reason</th>
                      <th className="cmt-section tbl-date">Comment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataPerPage.map((item, index) => (
                      <tr key={item._id}>
                        <td><td className="tbl-date details">{index + this.state.count}</td></td>

                        <td>
                          <Link to={`/empProfile/${item.requested_by}`}>
                            <td className="tbl-date details">  {item.person_name}</td>
                          </Link></td>

                        <td><td className="tbl-date details">{item.start_date}</td></td>

                        <td><td className="tbl-date details">{item.end_date}</td></td>
                        <td><td className="tbl-date details">{item.requested_at}</td></td>
                        <td><td className="tbl-date details">{item.wfh_days}</td></td>
                        <td><td className="tbl-date details">{item.balance.wfh}</td></td>
                        <td><td className="tbl-date details">{item.leave_type}</td></td>
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
                                {/* <PopoverHeader>Popover Title</PopoverHeader> */}
                                <PopoverBody> {item.reason}</PopoverBody>
                              </UncontrolledPopover>
                            </td></td>
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
                                  className="btn btn-xs m-r-5"
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
                                  className="btn btn-xs m-r-5"
                                  onClick={() => this.handleShow(item._id)}
                                  data-toggle="modal"
                                  data-target="#decline"
                                >
                                  <i className="fa fa-thumbs-down font decline"></i>
                                </button>
                                <span className="tooltiptext">Decline</span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              {item.message == "Approved By HR" ? (
                                <div className="float-right">
                                  <button className="btn btn-default btn-rounded tech">
                                    Tech
                                </button>
                                  <button className="btn btn-success hr btn-rounded">
                                    HR
                                </button>
                                </div>
                              ) : (
                                  <div>
                                    {item.message == "Approved By Delivery Head" ? (
                                      <div className="float-right">
                                        <button className="btn btn-success tech btn-rounded">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              totalItemsCount={this.state.totalResponse.length}
            />
          </div>
        </div>
      );
    }
  }
}

export default WFHRequest;
