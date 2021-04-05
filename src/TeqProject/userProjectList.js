import React, { Component } from 'react';
import AuthService from "../AuthService";
import Pagination from "react-js-pagination";
import Loader from 'react-loader-spinner';
var Auth = new AuthService();
class UserProjectList extends Component {
    constructor() {
        super();
        this.state = {
            userId: "",
            myhour: 0,
            start_date: new Date(),
            project_name: "",
            client_name: "",
            alertMessage: "",
            alertMes: "",
            showAlert: false,
            showAl: false,
            danger: false,
            defaultValue: "",
            category: "Web",
            loading: true,
            projects: [],
            count: 1,
            showmember: [],
            projetData: [],
            dataProject: [],
            pjname: [],
            user_name: "",
            usname: [],
            dataPerPage: [],
            deletemem: [],
            project_id: [],
            proid: null,
            status: "",
            currentPage: 1,
            todosPerPage: 8,
            todos: [],
            activePage: 1,
            numbers: [],
            clientDetails: [],
            userRole: "",
            userName: "",
            userId: ""
        };
    }
    handleClick = number => {
        this.setState({
          activePage: number,
          currentPage: number
        });
        const { currentPage, todosPerPage } = this.state;
        var todos = this.state.projetData;
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
    componentDidMount() {
        this.setState({
            projetData: [],
          });
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
                imagePreviewUrl: response.user.imageData.image,
                userId: response.user._id
              });
            }
          });
          Auth.getEmpWiseProjectList().then(response => {
              if (response.status == 200 && response.projects.length!=0)
              {
            for (var i = 0; i < response.projects.length; i++) {
              for (var j = 0; j < response.projects[i].assigned_user.length; j++) {
                if (response.projects[i].assigned_user[j].userid == this.state.userId) {
                  this.state.projetData.push(response.projects[i]);
                }
              }
            } 
        }
            this.setState({
              dataProject: this.state.projetData,
              pjname: response.projects,
              selectValue: response.projects[0]._id,
              defaultValue: response.projects[0]._id,
              loading: false
            });
            var todos = this.state.dataProject;
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
                    dataPerPage: arr
                });
                const pageNumbers = [];
                for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
                    pageNumbers.push(i);
                }
                this.setState({
                    numbers: pageNumbers
                });
             
            // this.setState({
            //   projects: response.projects,
            //   pjname: response.projects,
            //   selectValue: response.projects[0]._id,
            //   defaultValue: response.projects[0]._id
            // });
          });
    

    }
    render() {
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
                <div className="row">
                    <div className="col-lg-12">
                        <div className="ibox">
                            <div className="ibox-head box-emp-mang">
                                <div className="ibox-title">Projects List </div>
                                <div className="ibox-tools">
                                    {this.state.userRole === "Admin" ? (

                                        <button
                                            className="btn btn-outline-info  btn-rounded addemployee-btn"
                                            data-toggle="modal"
                                            data-target="#addproject"
                                            aria-pressed="false"
                                        >
                                            <i className="fa fa-plus-circle m-r-5"></i> Add Project
                                        </button>) : ("")}
                                    {/* <a
                    className=" color-white"
                    data-toggle="modal"
                    data-target="#addproject"
                  >
                    <i className="fa fa-plus-circle m-r-5"></i>Add Project
                  </a> */}
                                </div>
                            </div>
                            {/* <div className="navbar-search">
                <div className="rel">
                  <span className="search-icon">
                    <i className="ti-search"></i>
                  </span>
                  <input className="form-control" placeholder="Search here..." />
                </div>
              </div> */}
                            <div className="ibox-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Title</th>
                                                <th className="tb-white-sp">Client Name</th>
                                                <th className="tb-white-sp">Start Date</th>
                                                <th>Category</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.dataPerPage.map((item, index) => (
                                                <tr key={item._id}>
                                                    <td>{index + this.state.count}</td>
                                                    <td>{item.project_name} </td>
                                                    <td>{item.client_name}</td>
                                                    <td>{item.start_date}</td>
                                                    <td> {item.category} </td>
                                                    <td>
                                                        <div>
                                                            {item.status == "Hold" ? (
                                                                <div>
                                                                    <span className="badge badge-danger">
                                                                        Hold</span>
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
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="mt-page">
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={8}
                                totalItemsCount={100}
                                pageRangeDisplayed={3}
                                onChange={this.handleClick}
                                itemClass="page-item no-padding"
                                linkClass="page-link"
                                prevPageText="Previous"
                                nextPageText="Next"
                                totalItemsCount={this.state.projetData.length}
                            />
                        </div>
                    </div>
                </div>

                {/* 
                <div className="row">
                    <div className="col-lg-3">
                        <div className="ibox">
                            <div className="ibox-head second-sectio bg-success color-white">
                                <div className="ibox-title">All Task</div>

                            </div>
                            <div className="ibox-body">

                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="ibox">
                            <div className="ibox-head second-sectio bg-warning color-white">
                                <div className="ibox-title">All Projects</div>


                            </div>
                            <div className="ibox-body">

                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="ibox">
                            <div className="ibox-head badge-primary  color-white">
                                <div className="ibox-title">Project Member's</div>
                                <div className="ibox-tools">
                                    <a className="ibox-title color-white"><i className="fa fa-plus-circle m-r-5"></i>Add member</a>


                                </div>
                            </div>
                            <div className="ibox-body">
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <tbody>
                                            <tr>

                                                <td className="tbl-img">
                                                    <img src="./assets/img/admin-avatar.png" />
                                                    <span>Dhiraj Kumar</span>
                                                </td>
                                                <td>Web Developer</td>
                                                <td><span className="badge badge-primary badge-circle m-r-5 m-b-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil" aria-hidden="true"></i></span> Edit</td>
                                                <td><span className="badge badge-danger badge-circle m-r-5 m-b-5" data-toggle="tooltip" data-original-title="Delete"><i className="fa fa-trash" aria-hidden="true"></i></span> Delete</td>

                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="ibox-footer text-center">
                                <a href="#">View All Member's</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="ibox">
                            <div className="ibox-head badge-warning  color-white">
                                <div className="ibox-title">Overdue Tasks</div>
                          
                            </div>
                            <div className="ibox-body">
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th className="tb-white-sp">Overdue </th>
                                                <th className="tb-white-sp">Taks</th>
                                                <th>Deadlines</th>
                                                <th width="91px" className="tb-white-sp">Employee</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            <tr >
                                                <td> <span className="badge badge-danger m-b-5">1 Days</span></td>
                                                <td>Update Profile </td>
                                                <td>11-05-2019</td>
                                                <td>Dhiraj</td>

                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="ibox-footer text-center">
                                <a href="#">View All Project</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="ibox">
                            <div className="ibox-head badge-danger  color-white">
                                <div className="ibox-title">Upcoming Deadlines</div>
                            
                            </div>
                            <div className="ibox-body">
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th width="91px" className="tb-white-sp">Employee</th>
                                                <th className="tb-white-sp">Taks</th>
                                                <th>Deadlines</th>
                                                <th className="tb-white-sp">Workload</th>


                                            </tr>
                                        </thead>
                                        <tbody>

                                            <tr >
                                                <td>Dhiraj </td>
                                                <td>Update Profile  </td>
                                                <td>11-05-2019</td>
                                                <td><div className="progress">
                                                    <div className="progress-bar progress-bar-success" role="progressbar">25%</div>
                                                </div> </td>

                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="ibox-footer text-center">
                                <a href="#">View All Project</a>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="ibox">
                      
                            <div className="ibox-body">
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Title</th>
                                                <th className="tb-white-sp">Client Name</th>
                                                <th className="tb-white-sp">Start Date</th>
                                                <th>Deadlines</th>
                                                <th width="91px" className="tb-white-sp">Project Member's</th>
                                                <th width="91px" className="tb-white-sp">Past Month Hours</th>
                                                <th width="91px" className="tb-white-sp">Current Month Hours</th>
                                                <th>Status</th>
                                                <th className="text-center"><i className="ti-menu"></i></th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            <tr >
                                                <td> 1</td>
                                                <td>ALU </td>
                                                <td>ALU</td>
                                                <td>11-05-2019</td>
                                                <td>11-05-2019</td>
                                                <td>Dhiraj</td>
                                                <td>October | 25 Hrs</td>
                                                <td>November | 25 Hrs</td>
                                                <td>Open</td>
                                                <td className="text-center">
                                                    <button className="btn badge-primary btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14"></i></button>
                                                    <button className="btn badge-danger btn-xs" data-toggle="tooltip" data-original-title="Delete"><i className="fa fa-trash font-14"></i></button>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="ibox-footer text-center">
                                <a href="#">View All Project</a>
                            </div>
                        </div>
                    </div>
                </div> */}


            </div>
        );}
    }
}

export default UserProjectList;