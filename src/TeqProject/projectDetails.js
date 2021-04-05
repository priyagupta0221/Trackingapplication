import React, { Component } from 'react'
import AuthService from "../AuthService";
import Loader from "react-loader-spinner";
import Pagination from "react-js-pagination";
import DatePicker from "react-datepicker";
import handleValidation from "../validation";
var Auth = new AuthService();
var proId = null;

class ProjectDetails extends Component {

    constructor(props){
        super(props)
        this.goBack = this.goBack.bind(this);
        this.state={
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
        }
        var x = props.location.pathname;
        proId = x.slice(23, 47);
    }

    // getEmpWiseTeamProjectList=()=>{     
    //   Auth.getProjectDetails().then(response => {
    //     console.log("employe",response)
    //     debugger
    //     // for (var i = 0; i < response.teamMembersRec.length; i++) {
    //     //   // if (this.state.projetName!=undefined && response.teamMembersRec[i].userIds !== this.state.userId && response.teamMembersRec[i].projectname == this.state.projetName.project_name) {
    //     //   //     this.state.projetData.push(response.teamMembersRec[i]);
    //     //   //   }
    //     //   if(response.teamMembersRec[i].projectname != response.teamMembersRec[i].projectname){
    //     //     this.state.projetData.push(response.teamMembersRec[i])
    //     //   }
            
    //     // }
    //     //   this.setState({
    //     //     dataProject: this.state.projetData,
    //     //   });
    //     //   var todos = this.state.dataProject;
    //     //   const { currentPage, todosPerPage } = this.state;
    //     //   const indexOfLastTodo = currentPage * todosPerPage;
    //     //   const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    //     //   const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    //     //   var arr = [];
    //     //   const renderTodos = currentTodos.map((todo, index) => {
    //     //     arr.push(todo);
    //     //     return arr;
    //     //   });
    //     //   this.setState({
    //     //     dataPerPage: arr
    //     //   });
    //     //   const pageNumbers = [];
    //     //   for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
    //     //     pageNumbers.push(i);
    //     //   }
    //     //   this.setState({
    //     //     numbers: pageNumbers
    //     //   });
        
    //     });
    //   }
    goBack() {
      this.props.history.goBack();
  }
    componentDidMount(){
        var token = window.localStorage.getItem("id_token")
        Auth.getUserData(token).then(response => {  
          console.log(response)
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
      Auth.getProjectDetails(proId).then(response=>{
        console.log(response)
        this.setState({
          dataProject: response.ProjectDetails,
          projectmember: response.ProjectDetails[0].projects.assigned_user,
       
        });
        var todos = this.state.projectmember;
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
      })
      // this.getEmpWiseTeamProjectList();   
    }

    render() {
        return ( 
           <div>
             <div className="row">
             <div className="left left-paddi">
                    <button
                    className="btn btn-success btn-circle"
                    aria-pressed="false"
                    onClick={this.goBack}
                    >
                    <i className="fa fa-arrow-left"></i>
                    </button>
                    </div>

             <div className="col-lg-12">
             <div className="ibox">
             <div className="ibox-head bg-tbl-header  color-white">
                    <div className="ibox-title">Project Details</div>
                  </div>
                  <div className="ibox-body">
                  <div className="tab-content">
                                        <div className="tab-pane fade show active" id="tab-3">
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Project Name </th>
                                                            <th>Client Name</th>
                                                            <th>Project Manager</th>
                                                            <th>Start Date</th>
                                                            <th>Category</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                      {this.state.dataProject.map((item, index) => (
                                                        <tr key={item._id}>
                                                          <td>{index + this.state.count}</td>
                                                          <td>{item.projects.project_name} </td>
                                                          <td>{item.projects.client_name} </td>
                                                          <td>{item.projects.reporting_manger_name}</td>
                                                          <td>{item.projects.start_date} </td>
                                                          {/* <td>{item.end_date} </td> */}
                                                          <td>{item.projects.category}</td>
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
                                                      ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            </div>
                                            </div>
                  </div>
               </div>
             </div>
             </div>
               <div className="row">
              <div className="col-lg-12">
                <div className="ibox">
                  <div className="ibox-head bg-tbl-header  color-white">
                    <div className="ibox-title">Project Members</div>
                  </div>
                  <div className="ibox-body">
                    <div className="table-responsive">
                    <div className="tab-content">
                    <div className="tab-pane fade show active" id="tab-3">

                    </div>
                    </div>
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th className="tb-white-sp">Name</th>
                            <th className="tb-white-sp">Role</th>
                            {/* <th>Project Name</th>
                            <th>Category</th>
                            <th>Status</th> */}
                          </tr>
                        </thead>
                        <tbody>
                        {this.state.dataPerPage.map((item, index) => (
                                                <tr key={item._id}>
                                                    <td>{index + this.state.count}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.role}</td>
                                                    {/* <td>{item.project_name} </td>
                                                    <td> {item.category} </td> */}

                                                    {/* <td>
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
                                                    </td> */}
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
                        onChange={this.handleClick}
                        itemClass="page-item no-padding"
                        linkClass="page-link"
                        prevPageText="Previous"
                        nextPageText="Next"
                        totalItemsCount={this.state.dataPerPage.length}
                      />
                    </div>

                  </div>
                </div>
              </div>
            </div>
           </div>
        )
    }
}

export default ProjectDetails
