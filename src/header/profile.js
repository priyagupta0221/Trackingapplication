import React, { Component } from "react";
import AuthService from "../AuthService";
import Axios from "axios";
import Avatar from "./Avatar";
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
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const Auth = new AuthService();
var empId = null;
class Profile extends Component {
  constructor(props) {
    super(props);
    this.onCrop = this.onCrop.bind(this);
    this.onCropDefault = this.onCropDefault.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onCloseDefault = this.onCloseDefault.bind(this);
    this.goBack = this.goBack.bind(this);
    this.approvedTabClick = this.approvedTabClick.bind(this);
    this.approvedWFHTabClick = this.approvedWFHTabClick.bind(this);
    this.handleClickDeclinedPaged = this.handleClickDeclinedPaged.bind(this);
    this.handleClickDeclinedWfhPaged = this.handleClickDeclinedWfhPaged.bind(this);
    this.declineTabClick = this.declineTabClick.bind(this);
    this.pendingTabClick = this.pendingTabClick.bind(this);
    this.declineWFHTabClick = this.declineWFHTabClick.bind(this);
    this.pendingWFHTabClick = this.pendingWFHTabClick.bind(this);
    this.handleClickApprovedPaged = this.handleClickApprovedPaged.bind(this);
    this.handleClickApprovedWfhPaged = this.handleClickApprovedWfhPaged.bind(this);
    this.pendingWfhHandleClick = this.pendingWfhHandleClick.bind(this);
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
      totalPending: "",
      totalRejected: "",
      loading: true,
      approveLeave: [],
      pendingLeave: [],
      rejectedLeave: [],
      approveWFH: [],
      pendingWFH: [],
      rejectedWFH: [],
      showAlert: false,
      leaveId: null,
      currentPage: 1,
      currentWFHPage: 1,
      todosPerPage: 3,
      activePage: 1,
      dataPerPage: [],
      Validate: false,
      todos: [],
      approvedLeave: [],
      approvedWFH: [],
      declineLeave: [],
      declineWFH: [],
      pendingWFH: [],
      balanceLeaves: [],
      userDetail: [],
      leaveDetails: [],
      leaveDetailss: [],
      pendingLeavePaged: [],
      approvedLeavePaged: [],
      declinedLeavePaged: [],
      pendingWfhPaged: [],
      approvedWFHPaged: [],
      declinedWFHPaged: [],
      countApprove: 1,
      countDecline: 1,
      countPending: 1,
      countWfhPending: 1,
      countWfhApprove: 1,
      countWfhDecline: 1,
      commentChat: [],
      logger: ""
    }
    var x = props.location.pathname;
    empId = x.slice(12, 37);
  }
  showComment = id => {

    Auth.getComment(id).then(response => {

      console.log(response)
      if (response.status == 200) {
        this.setState({
          commentChat: response.comment
        })
      }
    })
  }
  showWfhComment = id => {

    Auth.getWfhComment(id).then(response => {

      console.log(response)
      if (response.status == 200) {
        this.setState({
          commentChat: response.comment
        })
      }
    })
  }
  showComment = (id, leaveType) => {
    this.setState({
      empId: id,
      leaveType: leaveType
    });
    if (leaveType == "WFH") {
      Auth.getWfhComment(id).then(response => {

        console.log(response)
        if (response.status == 200) {
          this.setState({
            commentChat: response.comment
          })
        }
      })
    }
    else if (leaveType != "WFH") {
      Auth.getComment(id).then(response => {

        console.log(response)
        if (response.status == 200) {
          this.setState({
            commentChat: response.comment
          })
        }
      })
    }
  }
  pendingTabClick() {
    var tabA = document.getElementById("tab-3");
    if (tabA != null) {


      tabA.classList.remove("active");
      tabA.classList.remove("show");
    }
    var tabB = document.getElementById("tab-2"); if (tabB != null) {

      tabB.classList.remove("active");

      tabB.classList.remove("show");
    }
    var tabC = document.getElementById("tab-1");
    if (tabC != null) {

      tabC.classList.add("active");
      tabC.classList.add("show");
    }
    const todos = this.state.pendingLeave;
    const { currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    this.setState({ countPending: indexOfFirstTodo + 1 });
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
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
      else if (x == "CompoOff Leave") {
        arr[i].leave_type = "Comp Off";
      }
    }
    this.setState({
      pendingLeavePaged: arr
    });
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
      pageNumbers.push(i);
    }
    this.setState({
      number: pageNumbers,

    });
    // this.setState({
    //   activePagepen: 1
    // });

  }
  pendingWFHTabClick() {
    var tabA = document.getElementById("tab-6");
    if (tabA != null) {
      tabA.classList.remove("active");
      tabA.classList.remove("show");
    }
    var tabB = document.getElementById("tab-5"); if (tabB != null) {

      tabB.classList.remove("active");

      tabB.classList.remove("show");
    }
    var tabC = document.getElementById("tab-4");
    if (tabC != null) {

      tabC.classList.add("active");
      tabC.classList.add("show");
    }
    const { currentWFHPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentWFHPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    this.setState({ countWfhPending: indexOfFirstTodo + 1 });
    const currentTodos = this.state.pendingWFH.slice(indexOfFirstTodo, indexOfLastTodo);
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });
    this.setState({
      pendingWfhPaged: arr
    });
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(this.state.pendingWFH.length / todosPerPage); i++) {
      pageNumbers.push(i);
    }
    this.setState({
      number: pageNumbers,

    });
    // this.setState({
    //   activePagepen: 1
    // });

  }
  pendingHandleClick = (number) => {
    this.setState({
      activePagepen: number
    })
    // var todos = this.state.itemsPending;
    // const { todos, currentPage, todosPerPage } = this.state;


    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ countPending: indexOfFirstTodo + 1 });
    const currentTodos = this.state.pendingLeave.slice(indexOfFirstTodo, indexOfLastTodo);
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
      else if (x == "CompoOff Leave") {
        arr[i].leave_type = "Comp Off";
      }
    }
    this.setState({
      pendingLeavePaged: arr,
    })

  }
  pendingWfhHandleClick = (number) => {
    this.setState({
      activePage: number
    })
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ countWfhPending: indexOfFirstTodo + 1 });
    const currentTodos = this.state.pendingWFH.slice(indexOfFirstTodo, indexOfLastTodo);
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo)
      return arr;
    });
    this.setState({
      pendingWfhPaged: arr,
    })

  }

  approvedTabClick() {
    var tabA = document.getElementById("tab-1");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-3");
    tabB.classList.remove("active");
    tabB.classList.remove("show");
    var tabC = document.getElementById("tab-2");
    tabC.classList.add("active");
    tabC.classList.add("show");
    const todos = this.state.approvedLeave;
    const { currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    this.setState({ countApprove: indexOfFirstTodo + 1 });
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
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
      else if (x == "CompoOff Leave") {
        arr[i].leave_type = "Comp Off";
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
  }
  approvedWFHTabClick() {
    var tabA = document.getElementById("tab-4");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-6");
    tabB.classList.remove("active");
    tabB.classList.remove("show");
    var tabC = document.getElementById("tab-5");
    tabC.classList.add("active");
    tabC.classList.add("show");
    const todos = this.state.approvedWFH;
    const { currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    this.setState({ countWfhApprove: indexOfFirstTodo + 1 });
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });

    this.setState({
      approvedWFHPaged: arr
    });
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
      pageNumbers.push(i);
    }
    this.setState({
      number: pageNumbers
    });
  }
  declineTabClick() {
    var tabA = document.getElementById("tab-1");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-2");
    tabB.classList.remove("active");
    tabB.classList.remove("show");
    var tabC = document.getElementById("tab-3");
    tabC.classList.add("active");
    tabC.classList.add("show");
    const todos = this.state.declineLeave;
    const { currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    this.setState({ countDecline: indexOfFirstTodo + 1 });
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
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
      else if (x == "CompoOff Leave") {
        arr[i].leave_type = "Comp Off";
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
  declineWFHTabClick() {
    var tabA = document.getElementById("tab-4");
    tabA.classList.remove("active");
    tabA.classList.remove("show");
    var tabB = document.getElementById("tab-5");
    tabB.classList.remove("active");
    tabB.classList.remove("show");
    var tabC = document.getElementById("tab-6");
    tabC.classList.add("active");
    tabC.classList.add("show");
    const todos = this.state.declineWFH;
    const { currentPage, todosPerPage } = this.state;
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    this.setState({ countWfhDecline: indexOfFirstTodo + 1 });
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });
    this.setState({
      declinedWFHPaged: arr
    });
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
      pageNumbers.push(i);
    }
    this.setState({
      number: pageNumbers
    });
  }
  handleClickDeclinedPaged(number) {
    ;
    this.setState({
      activePagedec: number
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
      else if (x == "CompoOff Leave") {
        arr[i].leave_type = "Comp Off";
      }
    }
    this.setState({
      declinedLeavePaged: arr
    });
  }
  handleClickDeclinedWfhPaged(number) {
    ;
    this.setState({
      activePagedec: number
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
      declinedWFHPaged: arr
    });
  }
  handleClickApprovedPaged(number) {
    this.setState({
      activePageapp: number
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
      else if (x == "CompoOff Leave") {
        arr[i].leave_type = "Comp Off";
      }
    }
    this.setState({
      approvedLeavePaged: arr
    });
  }
  handleClickApprovedWfhPaged(number) {

    this.setState({
      activePageapp: number
    });
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ countWfhApprove: indexOfFirstTodo + 1 });
    const currentTodos = this.state.approvedWFH.slice(
      indexOfFirstTodo,
      indexOfLastTodo
    );
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });

    this.setState({
      approvedWFHPaged: arr
    });
  }
  goBack() {
    this.props.history.goBack();
  }
  onCropDefault = preview => {
    this.setState({ defaultPreview: preview, image: preview });
  }

  onCrop = preview => {

    this.setState({ preview })
  }

  onCloseDefault = () => {
    this.setState({ defaultPreview: null })
  }

  onClose = () => {
    this.setState({ preview: null })
  }
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

  cameraClick = () => {
    var input = document.querySelector("input[type=file]");
    input.click();
  };
  trimReason(e) {
    const res = arguments[0].slice(0, 10);
    return res;
  }
  componentDidMount() {
    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then(response => {
      var base64Flag = "data:image/jpeg;base64,";
      if (response.user.imageData == undefined) {
        this.setState({
          userRole: response.user.role,
          logger: response.user.role,
          data: response.user,
          userId: response.user._id,
          imagePreviewUrl: ""
        });             
        if (this.state.userRole == "Admin" || this.state.userRole == "SuperAdmin") {
          var dashEmp = document.getElementById("dash");
          dashEmp.classList.remove("active");
          var dashNotemp = document.getElementById("dashNotemployeemanagement");
          dashNotemp.classList.remove("active");
          var dashNotele = document.getElementById("dashNot");
          dashNotele.classList.remove("active");
          var dashNotwfh = document.getElementById("dashNotwfhrequest");
          dashNotwfh.classList.remove("active");
          var dashNotleave = document.getElementById("dashNotleavedetail");
          dashNotleave.classList.remove("active");
          var wfhdetails = document.getElementById("dashNotwfhdetails");
          wfhdetails.classList.remove("active");                   
          var dashNotleavereportAdmin = document.getElementById("dashNotleavereport");
          dashNotleavereportAdmin.classList.remove("active"); 
          var dashEmpabout = document.getElementById("dashNotabout");
          dashEmpabout.classList.remove("active"); 
        }
        else if (this.state.userRole == "HR") {         
          var dashadmin = document.getElementById("dash");
          dashadmin.classList.remove("active");
          var dashNotele = document.getElementById("dashNot");
          dashNotele.classList.remove("active");
          var dashNotemp = document.getElementById("dashNotemployeemanagement");
          dashNotemp.classList.remove("active");        
          var dashNotwfh = document.getElementById("dashNotwfhrequest");
          dashNotwfh.classList.remove("active");
          var dashNotleave = document.getElementById("dashNotleavedetail");
          dashNotleave.classList.remove("active");
          var wfhdetails = document.getElementById("dashNotwfhdetails");
          wfhdetails.classList.remove("active");
          var dashNotleavereportAdmin = document.getElementById("dashNotleavereport");
          dashNotleavereportAdmin.classList.remove("active");
          var dashEmpabout = document.getElementById("dashNotabout");
          dashEmpabout.classList.remove("active"); 
        }       
        else if (this.state.userRole == "Manager" || this.state.userRole == "TeamLead") {
          var dashEmp = document.getElementById("dash");
          dashEmp.classList.remove("active");
          var dashNotle = document.getElementById("dashNotleaverequest");
          dashNotle.classList.remove("active");
          var dashNotwfh = document.getElementById("dashNotwfhrequest");
          dashNotwfh.classList.remove("active");
          var dashNotleave = document.getElementById("dashNotleavedetail");
          dashNotleave.classList.remove("active");
          var wfhdetail = document.getElementById("dashNotwfhdetail");
          wfhdetail.classList.remove("active");
          var dashEmpabout = document.getElementById("dashNotabout");
          dashEmpabout.classList.remove("active"); 
        }
        else if (this.state.userRole == "Employee") {
          var dashEmp = document.getElementById("dash");
          dashEmp.classList.remove("active");
          var dashNotleave = document.getElementById("dashNotleavedetail");
          dashNotleave.classList.remove("active");
          var wfhdetail = document.getElementById("dashNotwfhdetail");
          wfhdetail.classList.remove("active");
          var dashNotaboutEmp = document.getElementById("dashNotabout");
          dashNotaboutEmp.classList.remove("active");          
        }
      } else {
        this.setState({
          userRole: response.user.role,
          logger: response.user.role,
          data: response.user,
          userId: response.user._id,
          imagePreviewUrl: response.user.imageData.image
        });
        if (this.state.userRole == "Admin" || this.state.userRole == "SuperAdmin") {
          var dashEmp = document.getElementById("dash");
          dashEmp.classList.remove("active");
          var dashNotemp = document.getElementById("dashNotemployeemanagement");
          dashNotemp.classList.remove("active");
          var dashNotele = document.getElementById("dashNot");
          dashNotele.classList.remove("active");
          var dashNotwfh = document.getElementById("dashNotwfhrequest");
          dashNotwfh.classList.remove("active");
          var dashNotleave = document.getElementById("dashNotleavedetail");
          dashNotleave.classList.remove("active");
          var wfhdetails = document.getElementById("dashNotwfhdetails");
          wfhdetails.classList.remove("active");                   
          var dashNotleavereportAdmin = document.getElementById("dashNotleavereport");
          dashNotleavereportAdmin.classList.remove("active"); 
          var dashEmpabout = document.getElementById("dashNotabout");
          dashEmpabout.classList.remove("active"); 
        }
        else if (this.state.userRole == "HR") {         
          var dashadmin = document.getElementById("dash");
          dashadmin.classList.remove("active");
          var dashNotele = document.getElementById("dashNot");
          dashNotele.classList.remove("active");
          var dashNotemp = document.getElementById("dashNotemployeemanagement");
          dashNotemp.classList.remove("active");        
          var dashNotwfh = document.getElementById("dashNotwfhrequest");
          dashNotwfh.classList.remove("active");
          var dashNotleave = document.getElementById("dashNotleavedetail");
          dashNotleave.classList.remove("active");
          var wfhdetails = document.getElementById("dashNotwfhdetails");
          wfhdetails.classList.remove("active");
          var dashNotleavereportAdmin = document.getElementById("dashNotleavereport");
          dashNotleavereportAdmin.classList.remove("active");
          var dashEmpabout = document.getElementById("dashNotabout");
          dashEmpabout.classList.remove("active"); 
        }       
        else if (this.state.userRole == "Manager" || this.state.userRole == "TeamLead") {
          var dashEmp = document.getElementById("dash");
          dashEmp.classList.remove("active");
          var dashNotle = document.getElementById("dashNotleaverequest");
          dashNotle.classList.remove("active");
          var dashNotwfh = document.getElementById("dashNotwfhrequest");
          dashNotwfh.classList.remove("active");
          var dashNotleave = document.getElementById("dashNotleavedetail");
          dashNotleave.classList.remove("active");
          var wfhdetail = document.getElementById("dashNotwfhdetail");
          wfhdetail.classList.remove("active");
          var dashEmpabout = document.getElementById("dashNotabout");
          dashEmpabout.classList.remove("active"); 
        }
        else if (this.state.userRole == "Employee") {
          var dashEmp = document.getElementById("dash");
          dashEmp.classList.remove("active");
          var dashNotleave = document.getElementById("dashNotleavedetail");
          dashNotleave.classList.remove("active");
          var wfhdetail = document.getElementById("dashNotwfhdetail");
          wfhdetail.classList.remove("active");
          var dashNotaboutEmp = document.getElementById("dashNotabout");
          dashNotaboutEmp.classList.remove("active");          
        }
       
      }
      Auth.getLeavesBalance().then(response => {
        if (response.balance.length > 0) {
          this.setState({
            items: response.balance[0],
            totalPending: response.total_pending,
            totalRejected: response.total_rejected,
            loading: false

          });
        }
      });
    });
    var token = window.localStorage.getItem("id_token");
    Auth.getProfileLeaveStatus().then(response => {

      if (response.leaves != undefined) {
        var leaveDetails = [];
        for (i = 0; i < response.leaves.length; i++) {
          if (response.leaves[i].leave_type != "WFH") {
            leaveDetails.push(response.leaves[i]);
          }
        }
        var approvedLeaves = [];
        var declineLeaves = [];
        var pendingLeaves = [];
        var approvedData = [];
        var declinedData = [];
        var pendingData = [];

        for (var i = 0; i < leaveDetails.length; i++) {
          if (leaveDetails[i].requested_by == this.state.userId) {
            var raisedOn = new Date(leaveDetails[i].requested_at)
              .toISOString()
              .substring(0, 10);
            var datestring = raisedOn.split("-");
            var finalRequestDate =
              datestring[2] + "-" + datestring[1] + "-" + datestring[0];

            leaveDetails[i].requested_at = finalRequestDate;

            if (leaveDetails[i].approval_status == "Approved") {
              // leaveDetails[i].countApprove = countApprove;
              approvedData.push(leaveDetails[i]);
              // countApprove = countApprove + 1;
            }
            if (leaveDetails[i].approval_status == "Rejected") {
              //leaveDetails[i].countDecline = countDecline;
              declinedData.push(leaveDetails[i]);
              // countDecline = countDecline + 1;
            }
            if (leaveDetails[i].approval_status == "Pending") {
              //leaveDetails[i].countPendinfg = countPendinfg;
              pendingData.push(leaveDetails[i]);
              // countPendinfg = countPendinfg + 1;
            }
          }
        }

        approvedLeaves = (approvedData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        declineLeaves = (declinedData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        pendingLeaves = (pendingData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

        this.setState({
          approvedLeave: approvedData,
          declineLeave: declinedData,
          pendingLeave: pendingData,
          // approvedLeavePaged: approvedData,
          // declinedLeavePaged: declinedData
        })
        const indexOfLastTodo = this.state.currentPage * this.state.todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
        this.setState({ countPending: indexOfFirstTodo + 1 });
        const currentTodos = pendingData.slice(
          indexOfFirstTodo,
          indexOfLastTodo
        );
        this.setState({
          activePagepen: 1
        })
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
          else if (x == "CompoOff Leave") {
            arr[i].leave_type = "Comp Off";
          }
        }
        this.setState({
          pendingLeavePaged: arr
        });
      }
      if (response.wfh != undefined) {
        var approvedWFH = [];
        var declineWFH = [];
        var pendingWFH = [];
        var approvedWFHData = [];
        var declinedWFHData = [];
        var pendingWFHData = [];

        for (var i = 0; i < response.wfh.length; i++) {
          if (response.wfh[i].requested_by == this.state.userId) {
            var raisedOn = new Date(response.wfh[i].requested_at)
              .toISOString()
              .substring(0, 10);
            var datestring = raisedOn.split("-");
            var finalRequestDate =
              datestring[2] + "-" + datestring[1] + "-" + datestring[0];

            response.wfh[i].requested_at = finalRequestDate;

            if (response.wfh[i].approval_status == "Approved") {
              // response.leaves[i].countApprove = countApprove;
              approvedWFHData.push(response.wfh[i]);
              // countApprove = countApprove + 1;
            }
            if (response.wfh[i].approval_status == "Rejected") {
              //response.leaves[i].countDecline = countDecline;
              declinedWFHData.push(response.wfh[i]);
              // countDecline = countDecline + 1;
            }
            if (response.wfh[i].approval_status == "Pending") {
              //response.leaves[i].countPendinfg = countPendinfg;
              pendingWFHData.push(response.wfh[i]);
              // countPendinfg = countPendinfg + 1;
            }
          }
        }

        approvedWFH = (approvedWFHData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        declineWFH = (declinedWFHData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();
        pendingWFH = (pendingWFHData.sort((a, b) => new Date(...a.requested_at.split('-').reverse()) - new Date(...b.requested_at.split('-').reverse()))).reverse();

        this.setState({
          approvedWFH: approvedWFHData,
          declineWFH: declinedWFHData,
          pendingWFH: pendingWFHData,
          // approvedLeavePaged: approvedData,
          // declinedLeavePaged: declinedData
        })

        const indexOfLastTodo = this.state.currentPage * this.state.todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
        this.setState({ countWfhPending: indexOfFirstTodo + 1 });
        const currentTodos = pendingWFHData.slice(
          indexOfFirstTodo,
          indexOfLastTodo
        );
        this.setState({
          activePage: 1
        })
        var arr = [];
        const renderTodos = currentTodos.map((todo, index) => {
          arr.push(todo);
          return arr;
        });
        this.setState({
          pendingWfhPaged: arr
        });
      }
    });
  }

  handleAlertClass() {
    let classes = "alert alert-dismissable fade show alertpopup ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }

  handleAlert = () => {
    this.setState({ showAlert: false, danger: false, alertMessage: "" })
  }
  leaveDetails = item => {
    this.setState({
      leaveDetails: item.leave_details
    });
  };
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
    this.setState({
      show: false,

    });
    idTestq = this.state.empId;
    var user = window.localStorage.getItem("id_token");
    if (this.state.leaveType != "WFH") {
      if (this.state.logger == "Admin" || this.state.logger == "SuperAdmin") {
        Auth.submitAdminComment(idTestq, this.state.comment).then(data => {
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
              danger: true
            });
          }
          setTimeout(() => {
            this.handleAlert();
          }, 4000);
        });
      } else if (this.state.logger == "HR") {
        
        Auth.submitHRComment(idTestq, this.state.comment).then(data => {
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
              danger: true
            });
          }
          setTimeout(() => {
            this.handleAlert();
          }, 4000);
        });
      }
      else if (this.state.logger == "Manager") {
        Auth.submitManagerComment(idTestq, this.refs.chatRec.value).then(data => {
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
              danger: true
            });
          }
          setTimeout(() => {
            this.handleAlert();
          }, 4000);
        });
      }
      else if (this.state.logger == "TeamLead") {
        Auth.submitTeamLeadComment(idTestq, this.state.comment).then(data => {
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
              danger: true
            });
          }
          setTimeout(() => {
            this.handleAlert();
          }, 4000);

        });
      } else if (this.state.logger == 'Employee') {
        Auth.submitEmployeeComment(idTestq, this.refs.chatRec.value).then(data => {

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


      }
    }
    else if (this.state.leaveType == "WFH") {
      
      if (this.state.logger == "Admin" || this.state.logger == "SuperAdmin") {
        Auth.submitAdminWFHComment(idTestq, this.state.comment).then(data => {
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
              danger: true
            });
          }
          setTimeout(() => {
            this.setState({ alertMessage: "", showAlert: false });
          }, 4000);
        });
      } else if (this.state.logger == "HR") {
        Auth.submitWfhHRComment(idTestq, this.state.comment).then(data => {
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
              danger: true
            });
          }
          setTimeout(() => {
            this.handleAlert();
          }, 4000);
        });
      }
      else if (this.state.logger == "Manager") {
        Auth.submitWFHManagerComment(idTestq, this.state.comment).then(data => {
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
              danger: true
            });
          }
          setTimeout(() => {
            this.handleAlert();
          }, 4000);
        });
      }
      else if (this.state.logger == "TeamLead") {
        Auth.submitWFHTeamLeadComment(idTestq, this.state.comment).then(data => {
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
              danger: true
            });
          }
          setTimeout(() => {
            this.handleAlert();
          }, 4000);
        });
      } else if (this.state.logger == 'Employee') {
        
        Auth.submitWFHEmployeeComment(idTestq, this.state.comment).then(data => {

          if (data.message == "WFH Request updated successfully") {
            this.setState({
              Validate: false,
            });
            this.showComment(idTestq, this.state.leaveType);
            this.refs.chatRec.value = "";
          } else {
            this.setState({
              alertMessage: data.message,
              showAlert: true,
              danger: true
            });
          }
          setTimeout(() => {
            this.handleAlert();
          }, 4000);
        });


      }
    }
  };
  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img className="img-circle img-height content-image" src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<img className="img-circle img-height content-image" src="./assets/img/users/u8.jpg" />);
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
          <div className="page-content fade-in-up profile">
            <div className="modal fade" id="leaveDetails">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Leave Type</h4>
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
                            <th>Leave Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.leaveDetails.map(item => (
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
                          <input className="form-control"
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
                          //width={390}
                          height={295}
                          onCrop={this.onCropDefault}
                          onClose={this.onCloseDefault}
                        // src={this.state.src}
                        />

                      </div>

                      {/* <div className="col-md-2">
                                            <h5>Preview</h5>
                                            <img alt="" style={{ width: '150px', height: '150px' }} src={this.state.defaultPreview} />
                                        </div> */}


                    </div>

                    <div className="modal-footer">
                      {/* <button type="button" className="btn btn-secondary btn-fix" onClick={this.closeAdd} data-dismiss="modal">Cancel</button> */}
                      <button type="button" className="btn btn-primary btn-fix" onClick={this._handleImageChange}>Upload</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="row profile-page">
              <div className="col-lg-4 col-md-4 pro-leave-info">
                <div className="ibox profile-leave-detail">
                  <div className="ibox-head">
                    <div className="ibox-title">Leave Info</div>
                  </div>
                  <div className="ibox-body">
                    <div className="row">
                      <div className="col-sm-12"><ul className="list-group list-group-full list-group-divider">
                        <li className="list-group-item">Casual Balance :
                                    <span className="pull-right color-green">{this.state.items.casual_balance}</span>
                        </li>
                        <li className="list-group-item">Sick Balance :
                                    <span className="pull-right color-red">{this.state.items.sick_balance}</span>
                        </li>
                        <li className="list-group-item">WFH Balance:
                                    <span className="pull-right color-orange">{this.state.items.wfh_balance}</span>
                        </li>
                        {this.state.data.teqFocusExp > 3 ? (
                          <li className="list-group-item">Privileged Balance:
                            <span className="pull-right color-bl">{this.state.items.privileged_balance}</span>
                          </li>
                        ) : (
                            <li className="list-group-item">Birthday Balance:
                              <span className="pull-right color-bl">{this.state.items.birthday_balance}</span>
                            </li>
                          )}
                        <li className="list-group-item">Comp Off:
                          <span className="pull-right color-bl">{this.state.items.compoOff_balance}</span>
                        </li>
                        <li className="list-group-item">Date Of Birth :  <span className="pull-right ">{this.state.data.birthday}
                        </span>
                        </li>
                        <li className="list-group-item">Location:  <span className="pull-right ">{this.state.data.location}
                        </span>
                        </li>
                        <li className="list-group-item">Date Of Joining :
                                            <span className="pull-right">{this.state.data.doj}</span>
                        </li>


                      </ul>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-8 pro-user-info">
                <div className="ibox">
                  <div className="ibox-head">
                    <div className="ibox-title">User Profile</div>
                    {this.state.showAlert == true ?
                      <div className="alert alert-dismissable fade show alertpopup alert-danger">
                        <button className="close" onClick={this.handleAlert} aria-label="Close">�</button><strong></strong> {this.state.alertMessage}
                      </div> : ""}
                  </div>
                  <div className="ibox-body pro-user">
                    <div className="row pro-details">
                      <div className="col-lg-6 col-md-6 pro-user-detail">
                        <ul className="list-group list-group-full list-group-divider">

                          <li className="list-group-item">Email :
                                            <span className="pull-right ">{this.state.data.email}</span>
                          </li>
                          {/* <li className="list-group-item">Mobile No :
                                            <span className="pull-right ">1234567890</span>
                                                </li> */}
                          <li className="list-group-item">Role :
                                            <span className="pull-right ">{this.state.data.role}</span>
                          </li>
                          <li className="list-group-item">Reporting Manager :
                                            <span className="pull-right ">{this.state.data.report_to}</span>
                          </li>
                          <li className="list-group-item">HR :
                                            <span className="pull-right ">{this.state.data.hr_name}</span>
                          </li>
                          <li className="list-group-item">Team Lead :
                                            <span className="pull-right ">{this.state.data.teamlead_name}</span>
                          </li>
                          <li className="list-group-item">Exp In Teq :
                                            <span className="pull-right">{this.state.data.teqFocusExp}</span>
                          </li>
                          <li className="list-group-item">Total Exp:
                                            <span className="pull-right">{this.state.data.teqFocusExp + this.state.data.experience}</span>
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
                              // onClick={this.cameraClick}
                              ></i>
                            </div>
                            <div class="font-strong profilename">{this.state.data.name}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="ibox">
                <div>
                  <div className="ibox-body">
                    <h4 className="text-info m-b-20 m-t-20">
                      <i className="fa fa-tasks"></i> Leave History
                    </h4>
                    <ul className="nav nav-tabs tabs-line">
                      <li className="nav-item detailspage">
                        <a
                          className="nav-link pending active"
                          onClick={this.pendingTabClick}
                          href="#tab-1"
                          data-toggle="tab"
                        >
                          Pending<i className="fa fa-clock-o"></i>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link approved"
                          href="#tab-2"
                          data-toggle="tab"
                          onClick={() => this.approvedTabClick(this)}
                        >
                          Approved<i class="fa fa-check-circle-o"></i>
                        </a>
                      </li>
                      <li class="nav-item">
                        <a
                          className="nav-link decline"
                          href="#tab-3"
                          data-toggle="tab"
                          onClick={() => this.declineTabClick(this)}
                        >
                          Declined<i class="fa fa-times-circle-o"></i>
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div className="tab-pane fade show active" id="tab-1">
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
                                  {this.state.pendingLeavePaged.map((item, index) =>
                                    <tr key={item._id}>
                                      <td className="tbl-date">{index + this.state.countPending}</td>
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
                                          onClick={() => this.showComment(item._id, item.leave_type)}
                                          data-toggle="modal"
                                          data-target="#Chatcmt"
                                        >
                                          <i className="fa fa-comments font comment"></i>
                                        </button>
                                        <span className="tooltiptext">Comment</span>
                                      </div></td>
                                      <td className="tbl-date"><span className="badge badge-warning badge-pill">{item.approval_status}</span>
                                        <p>{item.message}</p>
                                      </td>

                                    </tr>
                                  )}


                                </tbody>
                              </table>
                            </div>
                            <div className="mt-page">
                              <Pagination
                                className="justify-content-center"
                                activePage={this.state.activePagepen}
                                itemsCountPerPage={3}
                                totalItemsCount={100}
                                pageRangeDisplayed={3}
                                onChange={this.pendingHandleClick}
                                itemClass="page-item no-padding"
                                linkClass="page-link"
                                prevPageText="Previous"
                                nextPageText="Next"
                                totalItemsCount={this.state.pendingLeave.length}
                              />
                            </div>
                          </div>
                          {/* <div className="col-md-4">
                          <div className="pendingimage">
                            <img src='./assets/img/pendingimage.jpg' className='img-responsive pendingimage' alt="Pending Image" />
                          </div>
                        </div> */}
                        </div>
                      </div>
                      <div className="tab-pane fade show" id="tab-2">
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
                                <th className="cmt-section tbl-date">Comment</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.approvedLeavePaged.map(
                                (item, index) => (
                                  <tr key={item._id}>
                                    <td>{index + this.state.countApprove}</td>
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
                                      <div className="customtooltip">
                                        <button
                                          className="btn btn-xs"
                                          type="button"
                                          onClick={() => this.showComment(item._id, item.leave_type)}
                                          data-toggle="modal"
                                          data-target="#Chatcmt"
                                        >
                                          <i className="fa fa-comments font comment"></i>
                                        </button>
                                        <span className="tooltiptext">Comment</span>
                                      </div>
                                    </td>
                                    <td className="tbl-date">
                                      <span className="badge badge-success">
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
                        <div className="mt-page">
                          <Pagination
                            className="justify-content-center"
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
                      </div>
                      <div className="tab-pane fade " id="tab-3">
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
                                <th className="cmt-section tbl-date">Comment</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.declinedLeavePaged.map(
                                (item, index) => (
                                  <tr key={item._id}>
                                    <td>{index + this.state.countDecline}</td>
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
                                      {item.leave_days}
                                    </td>
                                    <td className="tbl-date">
                                      {item.leave_type}
                                    </td>
                                    <td className="tbl-date">
                                      <button
                                        className="btn btn-outline-info "
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
                                      <div className="customtooltip">
                                        <button
                                          className="btn btn-xs"
                                          type="button"
                                          onClick={() => this.showComment(item._id, item.leave_type)}
                                          data-toggle="modal"
                                          data-target="#Chatcmt"
                                        >
                                          <i className="fa fa-comments font comment"></i>
                                        </button>
                                        <span className="tooltiptext">Comment</span>
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
                        <div className="mt-page">
                          <Pagination
                            className="justify-content-center"
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
          </div>
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="ibox">
                <div>
                  <div className="ibox-body">
                    <h4 className="text-info m-b-20 m-t-20">
                      <i className="fa fa-tasks"></i> WFH History
                    </h4>
                    <ul className="nav nav-tabs tabs-line">
                      <li className="nav-item detailspage">
                        <a
                          className="nav-link pending active"
                          onClick={this.pendingWFHTabClick}
                          href="#tab-4"
                          data-toggle="tab"
                        >
                          Pending<i className="fa fa-clock-o"></i>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link approved"
                          href="#tab-5"
                          data-toggle="tab"
                          onClick={() => this.approvedWFHTabClick(this)}
                        >
                          Approved<i class="fa fa-check-circle-o"></i>
                        </a>
                      </li>
                      <li class="nav-item">
                        <a
                          className="nav-link decline"
                          href="#tab-6"
                          data-toggle="tab"
                          onClick={() => this.declineWFHTabClick(this)}
                        >
                          Declined<i class="fa fa-times-circle-o"></i>
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div className="tab-pane fade show active" id="tab-4">
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
                                    <th className="cmt-section">Reason</th>
                                    <th className="cmt-section tbl-date">Comment</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.pendingWfhPaged.map((item, index) =>
                                    <tr key={item._id}>
                                      <td className="tbl-date">{index + this.state.countWfhPending}</td>
                                      {/* <td className="tbl-date"><Link to={`/empProfile/${item.requested_by}`}>{item.person_name}</Link></td> */}
                                      {this.state.userRole != "Employee" ?
                                        <td className="tbl-date"><Link to={`/empProfile/${item.requested_by}`}>{item.person_name}</Link></td> : (
                                          <td className="tbl-date">{item.person_name}</td>
                                        )}
                                      <td className="tbl-date">{item.start_date}</td>
                                      <td className="tbl-date">{item.end_date}</td>
                                      <td className="tbl-date">{item.requested_at}</td>

                                      <td className="tbl-date">{item.wfh_days}</td>
                                      <td className="tbl-date">{item.leave_type}</td>
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

                                      <td className="tbl-date">
                                        <div className="customtooltip">
                                          <button
                                            className="btn btn-xs"
                                            type="button"
                                            onClick={() => this.showComment(item._id, item.leave_type)}
                                            data-toggle="modal"
                                            data-target="#Chatcmt"
                                          >
                                            <i className="fa fa-comments font comment"></i>
                                          </button>
                                          <span className="tooltiptext">Comment</span>
                                        </div></td>
                                      <td className="tbl-date"><span className="badge badge-warning badge-pill">{item.approval_status}</span>
                                        <p>{item.message}</p>
                                      </td>

                                    </tr>
                                  )}


                                </tbody>
                              </table>
                            </div>
                            <div className="mt-page">
                              <Pagination
                                className="justify-content-center"
                                activePage={this.state.activePage}
                                itemsCountPerPage={3}
                                totalItemsCount={100}
                                pageRangeDisplayed={3}
                                onChange={this.pendingWfhHandleClick}
                                itemClass="page-item no-padding"
                                linkClass="page-link"
                                prevPageText="Previous"
                                nextPageText="Next"
                                totalItemsCount={this.state.pendingWFH.length}
                              />
                            </div>
                          </div>
                          {/* <div className="col-md-4">
                          <div className="pendingimage">
                            <img src='./assets/img/pendingimage.jpg' className='img-responsive pendingimage' alt="Pending Image" />
                          </div>
                        </div> */}
                        </div>
                      </div>
                      <div className="tab-pane fade show" id="tab-5">
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
                                <th className="cmt-section tbl-date">Comment</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.approvedWFHPaged.map(
                                (item, index) => (
                                  <tr key={item._id}>
                                    <td>{index + this.state.countWfhApprove}</td>
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
                                      <div className="customtooltip">
                                        <button
                                          className="btn btn-xs"
                                          type="button"
                                          onClick={() => this.showWfhComment(item._id)}
                                          data-toggle="modal"
                                          data-target="#Chatcmt"
                                        >
                                          <i className="fa fa-comments font comment"></i>
                                        </button>
                                        <span className="tooltiptext">Comment</span>
                                      </div>
                                    </td>
                                    <td className="tbl-date">
                                      <span className="badge badge-success">
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
                        <div className="mt-page">
                          <Pagination
                            className="justify-content-center"
                            activePage={this.state.activePageapp}
                            itemsCountPerPage={3}
                            totalItemsCount={100}
                            pageRangeDisplayed={3}
                            onChange={this.handleClickApprovedWfhPaged}
                            itemClass="page-item no-padding"
                            linkClass="page-link"
                            prevPageText="Previous"
                            nextPageText="Next"
                            totalItemsCount={this.state.approvedWFH.length}
                          />
                        </div>
                      </div>
                      <div className="tab-pane fade " id="tab-6">
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
                                <th className="cmt-section tbl-date">Comment</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.declinedWFHPaged.map(
                                (item, index) => (
                                  <tr key={item._id}>
                                    <td>{index + this.state.countWfhDecline}</td>
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
                                      <div className="customtooltip">
                                        <button
                                          className="btn btn-xs"
                                          type="button"
                                          onClick={() => this.showWfhComment(item._id)}
                                          data-toggle="modal"
                                          data-target="#Chatcmt"
                                        >
                                          <i className="fa fa-comments font comment"></i>
                                        </button>
                                        <span className="tooltiptext">Comment</span>
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
                        <div className="mt-page">
                          <Pagination
                            className="justify-content-center"
                            activePage={this.state.activePagedec}
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
          </div>
        </div>
      );
    }
  }
}

export default Profile;
