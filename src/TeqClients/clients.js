import React, { Component } from "react";
import AuthService from "../AuthService";
import handleValidation from "../validation";
import Pagination from "react-js-pagination"
var Auth = new AuthService();
class Clients extends Component {
  constructor() {
    super();
    this.handleAddClient = this.handleAddClient.bind(this);
    this.handleUpdateClient = this.handleUpdateClient.bind(this);

    this.state = {
      clientname: "",
      clientemail: "",
      contact_person: "",
      clientDetails: [],
      clientValue: [],
      clientList: [],
      count: 1,
      defaultC_Value: [],
      errors: {},
      errorsdiv: false,
      selectValue: "",
      clientProjectList: [],
      showAlert: false,
      alertMessage: "",
      danger: false,
      clId: null,
      todos: [],
      activePage: 1,
      dataPerPage: [],
      currentPage: 1,
      todosPerPage: 3,
      userRole:"",
      count1:1,
      projects:[],
      client_job_role:"",
      client_comment:"",
      client_project:[],


    };
  }

  cancelForm = () => {
    this.setState({
      clientname: "",
      clientemail: "",
      contact_person: ""
    });
    this.refs.clientname.value = "";
    this.refs.clientemail.value = "";
    this.refs.contact_person.value = "";
  };
  handleAddClient = event => {
    event.preventDefault();
    var name = this.refs.clientname.value;
    var email = this.refs.clientemail.value;
    var contact_person = this.refs.contact_person.value;
    let formData = {
      name:this.refs.clientname.value,
      email:this.refs.clientemail.value
    };
    //var client_comment =
    var jobrole=this.refs.client_job_role.value;
    var proj=this.state.client_project;
    var remarks=this.refs.client_comment.value;
    let errors = handleValidation(formData);
    this.setState({ errors: errors });
    if (errors["valid"] == true) {
    Auth.addclient(name, email, contact_person,jobrole,proj,remarks).then(response => {
      console.log(response);
      if (response.status == 200) {
        this.setState({});
        document.getElementById("clientSuccess").style.display = "block";
        document.getElementById("clientSuccess").style.opacity = 10;
        document.getElementById("addClient").style.display = "none";
        document.getElementById("addClient").style.opacity = 0;
      } else {
        this.setState({
          showAlert: true,
          alertMessage: "Error Occcurs Please Re-Submit Form"
        });
      }
    });
  }
  else {
    this.setState({ errorsdiv: true });
    setTimeout(() => {
      this.setState({ errorsdiv: false });
    }, 4000);
   }
  
  };
  cancelModal() {
    document.getElementById("clientSuccess").style.display = "none";
    document.getElementById("clientSuccess").style.opacity = 0;
    let modal = document.querySelector(".modal-backdrop");
    // modal.style.display = "none";
   // this.setState({ errorsdiv: false });
    window.location.reload();
  }
  cancelUpdateModal(){
    document.getElementById("clientUpdateSuccess").style.display = "none";
    document.getElementById("clientUpdateSuccess").style.opacity = 0;
    let modal = document.querySelector(".modal-backdrop");
    window.location.reload();
  }
  getprojectlist(){
    alert("hello")
    Auth.getProjectList().then(response => {
      if (response.status == 200) {
        this.setState({
          projects: response.projects});
  }
});
  }
  clientView(id) {
    Auth.clientGetInfo(id).then(response => {
      console.log(response);
      this.setState({
        defaultC_Value: response.client[0].clientDetails[0],
        clientProjectList: response.client[0].client
      });
    });
  }

  clientEdit(id) {
    Auth.clientGetInfo(id).then(response => {
      var projid=[];
      for (var j = 0; j < response.client[0].client.length; j++) {
         projid.push(response.client[0].client[j].projectid) 
      }
      this.setState({
       clientList: response.client[0].clientDetails[0],
        clientname:response.client[0].clientDetails[0].client_name,
        clientemail: response.client[0].clientDetails[0].email,
        contact_person:response.client[0].clientDetails[0].contact_person,
         client_comment:response.client[0].clientDetails[0].remark,
        // client_project:response.client[0].clientDetails[0].projects,
         client_project:projid,
         client_job_role:response.client[0].clientDetails[0].client_job_role

      });
    });
  }
  handleClientName = event => {
    this.setState({
      clientname: event.currentTarget.value
    });
  };

  handleclientemail = event => {
    this.setState({
      clientemail: event.currentTarget.value
    });
  };

  handlecontactPerson = event => {
    this.setState({
      contact_person: event.currentTarget.value
    });
  };
  handeleClientDelete = id => {
    this.setState({
      clId: id
    });
  };
  handle_client_comment= event => {
    this.setState({
      client_comment: event.currentTarget.value
    });
  };
  handle_client_job_role= event => {
    this.setState({
      client_job_role: event.currentTarget.value
    });
  };
  clientDelete(id) {
    Auth.clientDelete(id).then(response => {
      console.log(response);
      this.componentDidMount();
      this.setState({
        show: false,
        alertMessage: "Deleted successfully",
        showAlert: true,
        danger: true
      });
      setTimeout(() => {
        this.setState({ alertMessage: "", showAlert: false });
      }, 4000);
    });
  }
  handleProjectNameChange(event){
    let value = Array.from(event.target.selectedOptions, option => option.value);
    this.setState({client_project: value});
   
  }
  handleClick = number => {
    this.setState({
      activePage: number,
      currentPage: number
    });
    const { currentPage, todosPerPage } = this.state;
    var todos = this.state.clientDetails;
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

  handleUpdateClient =event => {
    event.preventDefault();
    var id = this.state.clientList._id;
   // var id=response.client[0].clientDetails[0]._id;
    var clientname = this.state.clientname;
    var clientemail = this.state.clientemail;
    var contact_person = this.state.contact_person;
    var client_comment=this.state.client_comment;
    var client_project=this.state.client_project;
    var client_job_role=this.state.client_job_role
  //  var contact_person = this.refs.contact_person.value;
    let formData = {
      name:this.state.clientname,
      email:this.state.clientemail
    };
   
    let errors = handleValidation(formData);
    this.setState({ errors: errors });
    if (errors["valid"] == true) {
    Auth.updateclient(id, clientname, clientemail, contact_person,client_job_role,client_project,client_comment).then(
      response => {
        console.log(response);
        if (response.status == 200) {
          this.setState({});
          document.getElementById("clientUpdateSuccess").style.display = "block";
          document.getElementById("clientUpdateSuccess").style.opacity = 10;
          document.getElementById("updateClient").style.display = "none";
          document.getElementById("updateClient").style.opacity = 0;
          setTimeout(() => {
            this.setState({ alertMessage: "", showAlert: false });
          }, 4000);
          this.componentDidMount();
        } else {
          this.setState({
            showAlert: true,

            alertMessage: "Error Occcurs Please Re-Submit Form"
          });
        }
      }
    
    );  
    }
    else {
      this.setState({ errorsdiv: true });
      setTimeout(() => {
        this.setState({ errorsdiv: false });
      }, 4000);
     }
  }
  handleAlertClass() {
    let classes = "alertHeight ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
   componentDidMount() {
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
          imagePreviewUrl: response.user.imageData.image
        });
      }
    });
    Auth.getProjectList().then(response => {
      if (response.status == 200) {
        this.setState({
          projects: response.projects});
  }
});
    Auth.getClientList().then(response => {
     var t= this.state.clientProjectList
      if (response.status == 200) {
        response.clients.length != 0
          ? this.setState({
            clientDetails: response.clients,
            defaultC_Value: response.clients[0],
          //  clientProjectList:  response.client[0].client
          })
          : this.setState({
            clientDetails: response.clients,
            defaultC_Value: ""
          });
          var todos = this.state.clientDetails;
          const { currentPage, todosPerPage } = this.state;
          const indexOfLastTodo = currentPage * todosPerPage;
          const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
          const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
          var arr = [];
          const renderTodos = currentTodos.map((todo, index) => {
            arr.push(todo);
            return arr;
          });
          this.setState({
            dataPerPage: arr,
            loading: false
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

  render() {
    return (
      <div className="page-content fade-in-up">
        {this.state.showAlert == true ? (
          <div className={this.handleAlertClass()}>
            <button
              className="close"
              onClick={this.handleAlert}
              aria-label="Close"
            >
              ×
            </button>
            <strong> {this.state.alertMessage}</strong>
          </div>
        ) : (
            ""
          )}
        {/* On Submit Sucess */}
        <div className="modal fade" id="clientSuccess">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content ">
              <div className="modal-header ">
                <h4 className="modal-title ">Client has been added.</h4>
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
         {/* On Update Sucess */}
         <div className="modal fade" id="clientUpdateSuccess">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content ">
              <div className="modal-header ">
                <h4 className="modal-title ">Client has been updated.</h4>
                <button type="button" className="close " data-dismiss="modal">
                  &times;
                </button>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-success btn-circle"
                  onClick={this.cancelUpdateModal}
                >
                  <i className="fa fa-check"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Delete client */}
        <div className="modal fade" id="clientDelete">
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
                    You want to delete this Client!
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
                    onClick={() => this.clientDelete(this.state.clId)}
                  >
                    <i className="fa fa-check"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* UpdateClient */}
        <div className="modal fade" id="updateClient">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content addemployee">
              <div className="modal-header addemployee">
                <h4 className="modal-title addemployee">Update Client</h4>
                <button
                  type="button"
                  className="close updateClient "
                  data-dismiss="modal"
                  onClick={this.cancelForm}
                >
                  &times;
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-sm-6 form-group">
                      <label> Client Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Name"
                        ref="clientname"
                        value={this.state.clientname}
                        onChange={this.handleClientName}
                      />
                       {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["name"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="col-sm-6 form-group">
                      <label>Email Address</label>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        ref="clientemail"
                        value={this.state.clientemail}
                        onChange={this.handleclientemail}
                      />
                       {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["email"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="col-sm-6 form-group">
                      <label>Contact Person</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Contact Person"
                        ref="contact_person"
                        value={this.state.contact_person}
                        onChange={this.handlecontactPerson}
                      />
                    </div>
                    <div className="col-sm-6 form-group">
                    <div className="form-group">
                      <label>
                        Select Projects
                      </label>
                      <select
                        type="text"
                        id="projects"
                        ref="client_project"
                        className="form-control "
                        placeholder="Enter User Name" multiple
                        value={this.state.client_project}
                        onChange={this.handleProjectNameChange.bind(this)}
                      >
                         
                         {this.state.projects != undefined
                          ? this.state.projects.map(item => (
                            <option key={item._id} value={item._id}>
                              {item.project_name}
                            </option>
                          ))
                          : ""}
                      </select>
                      
                    </div>
                    </div>
                    <div className="col-sm-6 form-group">
                    <label className="font-normal">
                    Remark / comments 
                      </label>
                      <textarea
                        className="form-control"
                        maxlength="300"
                        rows="3"
                        ref="client_comment"
                        value={this.state.client_comment}
                        onChange={this.handle_client_comment}
                        
                      ></textarea>
                    </div>
                    <div className="col-sm-6 form-group">
                    <label className="font-normal">
                       Job Role 
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Job Role"
                        ref="client_job_role"
                        value={this.state.client_job_role}
                        onChange={this.handle_client_job_role}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger  btn-rounded btn-fix"
                    data-dismiss="modal"
                    onClick={this.cancelForm}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={this.handleUpdateClient}
                    className="btn btn-success  btn-rounded btn-fix"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add client */}
        <div className="modal fade" id="addClient">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content addemployee">
              <div className="modal-header addemployee">
              
                <h4 className="modal-title addemployee">Add Client</h4>
                {this.state.showAlert == true ? (
                  <div className="alertmessage">{this.state.alertMes} !</div>
                ) : (
                    ""
                  )}
                <button
                  type="button"
                  className="close addClient "
                  data-dismiss="modal"
                  onClick={this.cancelForm}
                >
                  &times;
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-sm-6 form-group">
                      <label> Client Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Name"
                        ref="clientname"
                      />
                        {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["name"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="col-sm-6 form-group">                  
                      <label>Email Address</label>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        ref="clientemail"
                      />
                       {this.state.errorsdiv == true ? (
                        <span className="error">
                          {this.state.errors["email"]}
                        </span>
                      ) : (
                          ""
                        )}
                    </div>
                    <div className="col-sm-6 form-group">
                      <label>Contact Person</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Contact Person"
                        ref="contact_person"
                      />
                    </div>
                    <div className="col-sm-6 form-group">
                    <div className="form-group">
                      <label>
                        Select Projects
                      </label>
                      <select
                        type="text"
                        ref="client_project"
                        className="form-control "
                        placeholder="Enter User Name" multiple
                        onChange={this.handleProjectNameChange.bind(this)}
                      //  value={this.state.user_name}
                       // onChange={this.handleUserNameChange.bind(this)}
                      >
                         
                         {this.state.projects != undefined
                          ? this.state.projects.map(item => (
                            <option key={item._id} value={item._id}>
                              {item.project_name}
                            </option>
                          ))
                          : ""}
                      </select>
                      
                    </div>
                    </div>
                    <div className="col-sm-6 form-group">
                    <label className="font-normal">
                    Remark / comments 
                      </label>
                      <textarea
                        className="form-control"
                        maxlength="300"
                        rows="3"
                        ref="client_comment"
                        value={this.state.client_comment}
                        onChange={this.handle_client_comment}
                        
                      ></textarea>
                    </div>
                    <div className="col-sm-6 form-group">
                    <label className="font-normal">
                       Job Role 
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Job Role"
                        ref="client_job_role"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger  btn-rounded btn-fix"
                    data-dismiss="modal"
                    onClick={this.cancelForm}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={this.handleAddClient}
                   
                    className="btn btn-success  btn-rounded btn-fix"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-5 col-lg-5">
            <div className="ibox">
              <div className="ibox-head  box-emp-mang ">
                <div className="ibox-title ">Clients</div>
                {this.state.userRole === "Admin" ||this.state.userRole === "SuperAdmin" ? (
                <div className="ibox-tools">
                  <button
                    className="btn btn-outline-info  btn-rounded addemployee-btn"
                    data-toggle="modal"
                    data-target="#addClient"
                    aria-pressed="false"
                  >
                    <i className="fa fa-user-plus"></i> Add Clients
                  </button>
                  </div>):(<div></div>)}
              </div> 
              <div className="ibox-body ibox-body-con">
                <ul className="list-group list-group-divider list-group-full">
                  {this.state.dataPerPage.map((item, index) => (
                    <li className="list-group-item d-flex teq-item-group" key={item._id}>
                      <div className="member-img">
                        <img
                          src="../assets/img/users/u8.jpg"
                          className="avat-img-icon img-circle "
                        />
                      </div>
                      <div className="flexbox flex-2">
                        <div className="member-info">
                          <div className="font-strong trq-info-name">
                            {item.client_name}
                          </div>
                          <small>{item.email}</small>
                          <div>
                          
                            <button
                              className="btn btn-primary btn-rounded "
                              onClick={() => this.clientView(item._id)}
                            >
                              View{" "}
                            </button>
                            &nbsp;
                            {this.state.userRole === "Admin" || this.state.userRole === "SuperAdmin"
                            ? (
                            <button
                              className="btn btn-success btn-rounded "
                              data-toggle="modal"
                              data-target="#updateClient"
                              aria-pressed="false"
                              onClick={() => this.clientEdit(item._id)}
                            >
                              Edit
                            </button>): ("")}
                            &nbsp;
                            {this.state.userRole === "Admin" || this.state.userRole === "SuperAdmin"
                              ? (  
                              <button
                              className="btn btn-danger btn-rounded"
                              onClick={() => this.handeleClientDelete(item._id)}
                              data-target="#clientDelete"
                              data-toggle="modal"
                            >
                              Delete
                            </button>): ("")}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                 </ul>                 
              </div>
              <div className="mt-page">
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={3}
                      totalItemsCount={100}
                      pageRangeDisplayed={3}
                      onChange={this.handleClick}
                      itemClass="page-item no-padding"
                      linkClass="page-link"
                      prevPageText="Previous"
                      nextPageText="Next"
                      totalItemsCount={this.state.clientDetails.length}
                    />
                  </div>
            </div>
          </div>

          <div className="col-md-7  col-lg-7">
            <div className="ibox">
              <div className="ibox-body">
                <div className="d-flex details">
                  <div className="member-img-details">
                    <img
                      src="../assets/img/users/u8.jpg"
                      className="avat-img-icon img-circle img-fluid "
                    />
                  </div>
                  <div className="flexbox flex-1">
                    <div className="member-info-details  pl-4">
                      <div className="font-strong member-info-detailsname">
                        {this.state.defaultC_Value.client_name}
                      </div>
                      {this.state.defaultC_Value.email}
                    </div>
                  </div>
                </div>
                <hr />
                <div className="flexbox flex-1 details">
                  <div className="container ">
                    <div className="row  pt-2 pb-2">
                      <div className="col-sm-6">
                        <div>
                          <span className=" font-strong trq-info-name">
                            Contact Person
                          </span>{" "}
                          :{" "}
                          <span className="xm-font font-strong color-text">
                            {this.state.defaultC_Value.contact_person}
                          </span>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div>
                          <span className=" font-strong trq-info-name">
                            {" "}
                            Email
                          </span>{" "}
                          :{" "}
                          <span className="xm-font font-strong color-text">
                            {this.state.defaultC_Value.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row  pt-2 pb-2">
                      <div className="col-sm-6">
                        <div>
                          <span className=" font-strong trq-info-name">
                            Client Job Role
                          </span>{" "}
                          :{" "}
                          <span className="xm-font font-strong color-text">
                            {this.state.defaultC_Value.client_job_role}
                          </span>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div>
                          <span className=" font-strong trq-info-name">
                            {" "}
                            Remark
                          </span>{" "}
                          :{" "}
                          <span className="xm-font font-strong color-text">
                            {this.state.defaultC_Value.remark}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {this.state.clientProjectList.length != "" ? (
                  <div className="col-lg-12 pt-3">
                    <div className="ibox">
                      <div className="ibox-head ">
                        <div className="ibox-title"> Projects</div>
                      </div>
                      <div className="ibox-body ">
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover">
                            <thead>
                              <tr>
                                <th>#</th>

                                <th className="tb-white-sp">Project Name</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.clientProjectList.map(
                                
                                (item, index) => (
                                  <tr key={item._id}>
                                    <td>{index + this.state.count1}</td>
                                    <td>{item.project_name}</td>
                                    <td>
                                      {" "}
                                      <div>
                                        {item.status == "Hold" ? (
                                          <div>
                                            <span className="badge badge-danger">
                                              Hold
                                            </span>
                                          </div>
                                        ) : (
                                            <div>
                                              {item.status == "Completed" ? (
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
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  handleAlertClass() {
    let classes = "alert alert-dismissable fade show alertpopup ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
}

export default Clients;
