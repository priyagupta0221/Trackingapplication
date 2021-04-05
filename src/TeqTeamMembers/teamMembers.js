import React, { Component } from 'react';
import AuthService from "../AuthService";
import Pagination from "react-js-pagination";
import Loader from 'react-loader-spinner';
var Auth = new AuthService();
class TeamMembers extends Component {
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
            loading:true,
            projects: [],
            count: 1,
            showmember: [],
            projetData: [],
            projetDatas: [],
            dataProjects: [],
            filterProject: [],
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
        this.handleSelectChangeProject = this.handleSelectChangeProject.bind(this);

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
    handleSelectChangeProject = event => {        
        this.setState({
            selectValue: event.currentTarget.value,
            projetName: event.currentTarget.value,
            projetData: [],
            todos: []
        });
        Auth.getEmpWiseTeamProjectList().then(response => {
            
            for (var i = 0; i < response.teamMembersRec.length; i++) {
                if (response.teamMembersRec[i].projectname == this.state.projetName && response.teamMembersRec[i].userIds !== this.state.userId) {
                    
                    this.state.projetData.push(response.teamMembersRec[i]);
                }
                else if (response.teamMembersRec[i].userIds !== this.state.userId && this.state.projetName == "All" || this.state.projetName == "Clear Filter" ) {
                    this.state.projetData.push(response.teamMembersRec[i]);
                }
            }
            this.setState({
                dataProject: this.state.projetData,

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
    };

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
                    imagePreviewUrl: response.user.imageData.image,
                    userId: response.user._id
                });
            }
            this.getEmpWiseProjectList(response);
        });
     
       
       


    }
    getEmpWiseProjectList=(response)=>{
        if (response.user._id!=''){
            Auth.getEmpWiseProjectList().then(response => {
               
                for (var i = 0; i < response.projects.length; i++) {
                    for (var j = 0; j < response.projects[i].assigned_user.length; j++) {
                        if (response.projects[i].assigned_user[j].userid == this.state.userId) {
                            this.state.projetDatas.push(response.projects[i]);
                        }
                    }
                }
                this.setState({
                    filterProject: this.state.projetDatas,
                    pjname: response.projects,
                  //  projetName: response.projects[0].project_name,
                   projetName: this.state.projetDatas[0],
                    //defaultValue: "Filter"
                });
            });
            var projectName = this.state.projetName;
            this.setState({           
                projetData: [],
                todos: []
            });
                        
                this.getEmpWiseTeamProjectList();
            
           
        }
    }
    getEmpWiseTeamProjectList=()=>{     
            Auth.getEmpWiseTeamProjectList().then(response => {
       
                            for (var i = 0; i < response.teamMembersRec.length; i++) {
                                if (this.state.projetName!=undefined && response.teamMembersRec[i].userIds !== this.state.userId && response.teamMembersRec[i].projectname == this.state.projetName.project_name) {
                                    
                                    this.state.projetData.push(response.teamMembersRec[i]);
                                }
                            }
                            this.setState({
                                dataProject: this.state.projetData,
                
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
                                dataPerPage: arr,
                                loading:false
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
                            // });}
                        
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
                                <div className="ibox-title">Team Members List </div>
                                <div className="ibox-tools-filter">
                                    {/* <span>{this.state.month}</span> */}
                                    {this.state.userRole !== "HR" ?
                                         
                                         <div className="form">
                                             {this.state.filterProject!="" ? (
                                                <div className="form-group leave-type-select">
                                                    <label></label>
                                                
                                                    <select id="projectName" ref="projectName"
                                                        className="form-control "
                                                        value={this.state.projectName}
                                                        onChange={this.handleSelectChangeProject.bind(this)}
                                                    >
                                                        {this.state.filterProject != undefined
                                                            ? this.state.filterProject.map(item => ( 
                                                                <option key={item._id} value={item.project_name}>
                                                                    {item.project_name}
                                                                </option>
                                                            ))
                                                            : ""}
                                                    </select>
                                                </div>
                                             ):("")}
                                             
                                            </div>                                     
                                        : ""}
                                    <div></div>
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
                                                <th className="tb-white-sp">Name</th>
                                                <th>Role</th>
                                                <th>Project Name</th>
                                                <th>Category</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.dataPerPage.map((item, index) => (
                                                <tr key={item._id}>
                                                    <td>{index + this.state.count}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.role}</td>
                                                    <td>{item.projectname} </td>
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
            </div>
        );
    }}
}

export default TeamMembers;