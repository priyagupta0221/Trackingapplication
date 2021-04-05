import React, { Component } from 'react'
import AuthService from '../AuthService'
import Avatar from "../header/Avatar";
import Loader from "react-loader-spinner";
import Pagination from "react-js-pagination";
import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
  withRouter
} from "react-router-dom";

const Auth = new AuthService();
var empId = null;

class EmProfile1 extends Component {
    constructor(props){
        super(props);
        this.goBack = this.goBack.bind(this);
        this.state = {
          data: [],
          items: [],
          file: "",
          imagePreviewUrl: "",
          userId: "",
          showAlert: false,
          alertMessage: "",
          preview: null,
          defaultPreview: null,
          image: "",
          showpopup: false,
          loading: true,
          showAlert: false,
          leaveId: null,
          currentPage: 1,
          currentWFHPage: 1,
          todosPerPage: 3,
          activePage: 1,
          count: 1,
          dataPerPage: [],
          dataPerPage1:[],
          projects: [],
          assignedUser:[],
          userProjectList: [],
          userProjectListPaged: [],
          Validate: false,
          todos: [],
          todos1:[],
          userDetail: [],
          logger: ""
        };
        var x = props.location.pathname;
        empId = x.slice(18, 42);

    }
    onCropDefault = preview => {
      this.setState({ defaultPreview: preview, image: preview });
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

    _handleImageChange = e => {
        e.preventDefault();
    
        let reader = new FileReader();
        let file = this.state.defaultPreview;
        var ImageURL = this.state.defaultPreview;
        if (ImageURL != null) {
          var block = ImageURL.split(";");
    
          var contentType = block[0].split(":")[1];
    
          var realData = block[1].split(",")[1];
    
          var blob = this.b64toBlob(realData, contentType);
    
          var formDataToUpload = new FormData();
          formDataToUpload.append("file", blob);
          //  e.target.files[0];
    
          reader.onloadend = () => {
            this.setState({
              file: file,
              imagePreviewUrl: reader.result
            });
          };
    
          const data = new FormData();
          data.append("file", file);
          var token = window.localStorage.getItem("id_token");
          Auth.updateprofile(this.state.userId, formDataToUpload).then(res => {
            if (res.data.message == "Profile updated") {
              var token = window.localStorage.getItem("id_token");
              Auth.getUserData(token).then(response => {
                var base64Flag = "data:image/jpeg;base64,";
                if (file != undefined) {
                  reader.readAsDataURL(blob);
                }
                this.setState({
                  userRole: response.user.role,
                  logger: response.user.role,
                  data: response.user,
                  userId: response.user._id,
                  imagePreviewUrl: response.user.imageData.image
                });
                window.location.reload();
              });
            } else {
              this.setState({
                showAlert: true,
                alertMessage: res.data.message
              });
            }
          });
          setTimeout(() => {
            this.setState({ alertMessage: "", showAlert: false });
          }, 4000);
        } else {
          this.setState({
            showpopup: true,
            alertMessage: "Please select an image"
          });
          setTimeout(() => {
            this.setState({ alertMessage: "", showAlert: false });
          }, 4000);
        }
    };
    b64toBlob = (b64Data, contentType, sliceSize) => {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;
  
      var byteCharacters = atob(b64Data);
      var byteArrays = [];
  
      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
  
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
  
        var byteArray = new Uint8Array(byteNumbers);
  
        byteArrays.push(byteArray);
      }
  
      var blob = new Blob(byteArrays, { type: contentType });
      return blob;
    };
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
  

    getProjectList = (number) => {
      debugger
      this.setState({
        activePagee: number,
      });
      const indexOfLastTodo = number * this.state.todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
      this.setState({ projectCount: indexOfFirstTodo + 1 });
    
      const currentTodos = this.state.projects.slice(
        indexOfFirstTodo,
        indexOfLastTodo
      );
      this.setState({ count: indexOfFirstTodo + 1 });
      var arr = [];
      const renderTodos = currentTodos.map((todo, index) => {
        arr.push(todo);
        return arr;
      });
      this.setState({
        dataPerPage: arr,
      });
    }

    
    goBack() {
        this.props.history.goBack();
    }

    componentDidMount(){
        var token = window.localStorage.getItem("id_token");
        Auth.getUserData(token).then(response=>{
          debugger
            // console.log("User data",response)
            var base64Flag = "data:image/jpeg;base64,";
            if (response.user.imageData==undefined){
                this.setState({
                    userRole:response.user.role,
                    logger:response.user.role,
                    data:response.user,
                    userId:response.user._id,
                    imagePreviewUrl:""
                })
            }else{
                this.setState({
                    userRole: response.user.role,
                    logger: response.user.role,
                    data: response.user,
                    userId: response.user._id,
                    imagePreviewUrl: response.user.imageData.image
                });
            }
            this.getprojectList(response);
        })
        
      }
      getprojectList=(response)=>{
        if(response.user.role=="Admin"||response.user.role=="Manager"|| response.user.role=="SuperAdmin"){
          Auth.getProjectList().then(response => {
            debugger
            if(response.status==200 && response.projects.length!=0){
              for (var i = 0; i < response.projects.length; i++) {
                if (this.state.userRole == "Manager") {
      
                  if (response.projects[i].reporting_manger[0] == this.state.userId) {
                    this.state.projects.push(response.projects[i]);
      
                  }
      
                }
                else {
                  this.setState({
                    projects: response.projects,
                    pjname: response.projects,
                    project_name: response.projects[0]._id,
                    defaultValue: response.projects[0]._id
                  });
      
                }
      
              }
      
              var todos = this.state.projects;
              const { currentPage, todosPerPage } = this.state;
              const indexOfLastTodo = currentPage * todosPerPage;
              const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
              const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
              this.setState({ count: indexOfFirstTodo + 1 });
              var arr = [];
              const renderTodos = currentTodos.map((todo, index) => {
                arr.push(todo);
                return arr;
              });
              this.setState({
                dataPerPage: arr,
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
        else{
          Auth.getProjectDetailsWithoutId().then((response)=>{
            console.log(response)
            debugger
            // var assignedUser=[]
            // for (var i = 0; i < response.assignedUser.length; i++){
            //   for(var j=0; j<projects.length;i++){
            //     assignedUser.push({
            //       assignedUser
            //     })
            //   }
            // }
            this.setState({
              projects:response.assignedUser
            })
            var todos = this.state.projects;
            const { currentPage, todosPerPage } = this.state;
            const indexOfLastTodo = currentPage * todosPerPage;
            const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
            const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
            this.setState({ count: indexOfFirstTodo + 1 });
            var arr = [];
            const renderTodos = currentTodos.map((todo, index) => {
              arr.push(todo);
              return arr;
            });
            this.setState({
              dataPerPage: arr,
            });
            const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
              pageNumbers.push(i);
            }
            this.setState({
              numbers: pageNumbers
            });
          })

        }
      
       
      }

        // Auth.getUserAssignedProject1().then((response) => {
        //   console.log("Project List emp wise", response);
        //   debugger
        //   this.setState({
        //     userProjectList: response.UserAssignedProject,
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
        //     userProjectListPaged: arr,
        //   });
        //   const pageNumbers = [];
        //   for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
        //     pageNumbers.push(i);
        //   }
        //   this.setState({
        //     numbers: pageNumbers,
        //   });
        // });

        // this.getAllProjectList();
        // this.getProjectList();
    

    
    render() {
        // console.log("State",this.state)
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
          $imagePreview = (<img className="img-circle img-height content-image" src={imagePreviewUrl} />);
        } else {
          $imagePreview = (<img className="img-circle img-height content-image" src="../assets/img/users/u8.jpg" />);
        }
        if (this.state.loading){
        //     return(
        //         <div className="loader-align">
        //             <Loader
        //             type="ThreeDots"
        //             color="#00BFFF"
        //             height={100}
        //             width={100}
        //             timeout={3000} //3 secs
        //             />
        //         </div>
        //     );
        // }else{
            return (
                <div>
                    <div className="left left-paddi">
                    <button
                    className="btn btn-success btn-circle"
                    aria-pressed="false"
                    onClick={this.goBack}
                    >
                    <i className="fa fa-arrow-left"></i>
                    </button>
                    </div>

                    <div className="modal fade" id="profile">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title"></h4>
                                <button type="button" className="close" data-dismiss="modal" >&times;</button>
                            </div>

                            <div className="container">
                                {this.state.showpopup == true ?
                                <div className="alertmessage">
                                    {this.state.alertMessage}
                                </div> : ""}
                                <div className="row">

                                <div className="col-md-12">
                                    <Avatar
                                    width={390}
                                    height={295}
                                    onCrop={this.onCropDefault}
                                    onClose={this.onCloseDefault}
                                    src={this.state.src}
                                    />

                                </div>
                                </div>

                                <div className="modal-footer">
                                <button type="button" className="btn btn-primary btn-fix" onClick={this._handleImageChange}>Upload</button>
                                </div>
                            </div>

                            </div>
                        </div>
                        </div>
                    <div className="ibox">
                        <div className="ibox-head">
                            <div className="ibox-title">
                                User Profile
                            </div>
                        </div>
                        <div className="ibox-body pro-user">
                            <div className="row pro-details">
                                <div className="col-lg-6 col-md-6 pro-user-details">
                                    <ul className="list-group list-group-full list-group-divider">
                                        <li className="list-group-item">
                                            Email :
                                            <span className="pull-right ">
                                            {this.state.data.email}
                                            </span>
                                        </li>
                                        <li className="list-group-item">
                                            Role :
                                            <span className="pull-right ">
                                            {this.state.data.role}
                                            </span>
                                        </li>
                                        <li className="list-group-item">
                                            Reporting Manager :
                                            <span className="pull-right ">
                                            {this.state.data.report_to}
                                            </span>
                                        </li>
                                        <li className="list-group-item">
                                            HR :
                                            <span className="pull-right ">
                                            {this.state.data.hr_name}
                                            </span>
                                        </li>
                                        <li className="list-group-item">
                                            Team Lead :
                                            <span className="pull-right ">
                                            {this.state.data.teamlead_name}
                                            </span>
                                        </li>
                                        <li className="list-group-item">
                                            Exp In Teq :
                                            <span className="pull-right">
                                            {this.state.data.teqFocusExp}
                                            </span>
                                        </li>
                                        <li className="list-group-item">
                                            Total Exp:
                                            <span className="pull-right">
                                            {this.state.data.experience +
                                                this.state.data.teqFocusExp}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-lg-6 col-md-6 pro-img-detail">
                                  <div className="text-center">
                                    <div className="contentss">
                                      <div className="content-overlay"></div>
                                        {$imagePreview}
                                        <div className="content-details fadeIn-bottom">
                                          <input type="file" id="file1" name="file" capture className="camera" onChange={(e) => this._handleImageChange(e)} />
                                          <i className="fa fa-camera cameraIcon" aria-hidden="true" id="upfile1" data-toggle="modal" data-target="#profile"
                                            // onClick={this.cameraClick}`
                                          ></i>
                                          </div>
                                          <div class="font-strong profilename">
                                            {this.state.data.name} 
                                          </div>

                                      </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                   
                        <div className="col-lg-12 col-md-12">
                            <div className='ibox'>
                                <div className="ibox-body">
                                    <h4 className="text-info m-b-20 m-t-20">
                                      <i className="fa fa-tasks"></i>{""}
                                      Project List
                                    </h4>
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
                                                      {this.state.dataPerPage.map((item, index) => (
                                                        <tr key={item._id}>
                                                          <td>{index + this.state.count}</td>
                                                          <td>{item.project_name} </td>
                                                          <td>{item.client_name} </td>
                                                          <td>{item.reporting_manger_name}</td>
                                                          <td>{item.start_date} </td>
                                                          {/* <td>{item.end_date} </td> */}
                                                          <td>{item.category}</td>
                                                          <td>
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
                                                      ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mt-page">
                                              <Pagination
                                                activePage={this.state.activePagee}
                                                itemsCountPerPage={3}
                                                totalItemsCount={100}
                                                pageRangeDisplayed={3}
                                                onChange={this.getProjectList}
                                                itemClass="page-item no-padding"
                                                linkClass="page-link"
                                                prevPageText="Previous"
                                                nextPageText="Next"
                                                totalItemsCount={this.state.projects.length}
                                              />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                     
                    </div>
                </div>
            )
        }
        
    }
}

export default EmProfile1;
