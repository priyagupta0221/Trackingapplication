import React, { Component } from "react";
import ModalWindow from "../modal/ModalWindow";
import AuthService from "../AuthService";
import Axios from "axios";
import Pagination from "react-js-pagination";
import axios from "axios";
import Loader from "react-loader-spinner";
import DatePicker from "react-datepicker";
import * as datesUtil from "../ApplyLeave/dateutils";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import handleValidation from "../validation";
import EditableTable from "./editabletable"
import { throwStatement } from "../../node_modules/@babel/types";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
  withRouter
} from "react-router-dom";
const Auth = new AuthService();
const edtitabletable = new EditableTable();
var storecheck = [];
export default class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleHrTypeOption = this.handleHrTypeOption.bind(this);
    this.state = {
      joiningDate: null,
      birthdate: null,
      loading: true,
      showModal: false,
      userList: [],
      emp: 0,
      update: 0,
      empId: null,
      fields: {},
      errors: {},
      todos: [],
      dataPerPage: [],
      currentPage: 1,
      todosPerPage: 8,
      numbers: [],
      hrArr: [],
      hrRoleData: [],
      hrRoleWiseData: [],
      allDataArr: [],
      hrDataArr: [],
      managerDataArr: [],
      teamLeadDataArr: [],
      users: [],
      managerArr: [],
      teamLeadArr: [],
      activePage: 1,
      showAlert: false,
      alertMessage: "",
      role: "",
      experiance: "",
      reportingManager: "",
      teamLead: "",
      hr: "",
      danger: false,
      errors: {},
      errorsdiv: false,
      dataUser: [],
      manager: [],
      teamLeader: [],
      hrPerson: [],
      hrPersonFilter: [],
      selectValue: "",
      report_to: "",
      name: "",
      email: "",
      CasualBalance: "",
      SickBalance: "",
      WfhBalance: '',
      count: 1,
      teamlead_name: "",
      hr_name: "",
      checkbox: false,
      addbalance: '',
      Validate: false,
      ValidateLeave: false,
      selectedemail: [],
      addcasual: false,
      addsick: false,
      addwfh: false,
      addcompo: false,
      leavetype: '',
      showalluser: false,
      alluser: [],
      location: "",
      empPermanent: "",
      compoOff_balance: "",
      showallEditTableform: false,
      showallMangTLTableform: false,
      editTableform: false,
      myArray: []
    };
  }
  cancelCheckbox = () => {
    var alluser = []
    this.setState({
      alluser: [],
      //userList: [],
      checkbox: false,
      ValidateLeave: false,
      addcasual: false,
      addsick: false,
      addwfh: false,
      addcompo: false,
      showalluser: false
    })
    this.componentDidMount()
  }
  cancelAddcasual = () => {
    document.getElementById("addcasual").style.display = "none";
    document.getElementById("addcasual").style.opacity = 10;
    this.setState({
      addbalance: '',
      Validate: false
    })
    this.refs.addbalance.value = ''
    this.componentDidMount()
  }
  handleChangeBalance = (event) => {
    this.setState({
      addbalance: event.target.value
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
  }
  SelectedCheckbox = () => {
    var selectbox = [];
    var checkboxes = document.getElementsByName("check");
    if (storecheck.length != 0) {
      for (var i = 0, n = storecheck.length; i < n; i++) {
        selectbox.push(storecheck[i].value);
        document.getElementById("addcasual").style.display = "block";
        document.getElementById("addcasual").style.opacity = 10;
      }
    }
    var result = [];
    result = selectbox.filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    })
    var items = result.map((item) =>
      item
    );
    this.setState({
      selectedemail: items
    })
    if (this.state.addcasual == true) {
      this.setState({
        leavetype: "Casual"
      })
    }
    else if (this.state.addsick == true) {
      this.setState({
        leavetype: "Sick"
      })
    }
    else if (this.state.addwfh == true) {
      this.setState({
        leavetype: "WFH"
      })
    }
    else if (this.state.addcompo == true) {
      this.setState({
        leavetype: "Compo Off"
      })
    }

  }
  handleAddCasualBalance = () => {

    Auth.addBalance(this.state.leavetype,
      this.state.addbalance,
      this.state.selectedemail,
    ).then(response => {

      if (response.message == "Leave updated successfully") {
        this.setState({
          showAlert: true,
          alertMessage: "Leave Balance Added Successfully",
          danger: false,
          checkbox: false,
          ValidateLeave: false
        });
        setTimeout(() => {
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);
        document.getElementById("addcasual").style.display = "none";
        document.getElementById("addcasual").style.opacity = 10;
        this.refs.addbalance.value = ''
        this.componentDidMount()
      }
      else if (response.message == "WFH request updated successfully") {
        this.setState({
          showAlert: true,
          alertMessage: "WFH Balance Added Successfully",
          danger: false,
          checkbox: false,
          ValidateLeave: false
        });
        setTimeout(() => {
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);
        document.getElementById("addcasual").style.display = "none";
        document.getElementById("addcasual").style.opacity = 10;
        this.refs.addbalance.value = ''
        this.componentDidMount()
      }
      else if (response.message == "Compo updated successfully") {
        this.setState({
          showAlert: true,
          alertMessage: "Comp Balance Added Successfully",
          danger: false,
          checkbox: false,
          ValidateLeave: false
        });
        setTimeout(() => {
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);
        document.getElementById("addcasual").style.display = "none";
        document.getElementById("addcasual").style.opacity = 10;
        this.refs.addbalance.value = ''
        this.componentDidMount()
      }
      else {
        this.setState({
          showAlert: true,
          alertMessage: response.message,
          danger: true
        });
        setTimeout(() => {
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);
      }
    });
  }
  casualcheckBoxshow = () => {

    var alluser = [];

    for (var i = 0; i < this.state.userList.length; i++) {
      if (this.state.userList[i].role != "SuperAdmin" && this.state.userList[i].teqFocusExp > 0.6) {
        this.setState({
          checkbox: true,
          addcasual: true,
          showalluser: true,
          addsick: false,
          addcompo: false,
        })
        alluser.push(this.state.userList[i])
        this.setState({
          userList: alluser
        })

      }
    }
  }
  sickcheckBoxshow = () => {
    
    var alluser = [];
    for (var i = 0; i < this.state.userList.length; i++) {
      if (this.state.userList[i].role != "SuperAdmin") {
        this.setState({
          checkbox: true,
          addsick: true,
          addcasual: false,
          addcompo: false,
          showalluser: true
        })
        alluser.push(this.state.userList[i])
        this.setState({
          userList: alluser
        })
      }
    }
  }
  wfhcheckBoxshow = () => {
    var alluser = [];
    for (var i = 0; i < this.state.userList.length; i++) {
      this.setState({
        checkbox: true,
        addwfh: true,
        showalluser: true,
        addcasual: false,
        addsick: false,
        addcompo: false
      })
      if (this.state.userList[i].role != "SuperAdmin") {
        alluser.push(this.state.userList[i])
        this.setState({
          userList: alluser
        })
      }
    }

  }
  compocheckBoxshow = () => {
    var alluser = [];
    for (var i = 0; i < this.state.userList.length; i++) {
      if (this.state.userList[i].role != "SuperAdmin") {
        this.setState({
          checkbox: true,
          addcompo: true,
          showalluser: true,
          addwfh: false,
          addcasual: false,
          addsick: false,
        })
        alluser.push(this.state.userList[i])
        this.setState({
          userList: alluser
        })
      }
    }

  }
  CheckUncheckAll = () => {
    //;
    var selectAllCheckbox = document.getElementById("selectall");
    if (selectAllCheckbox.checked == true) {
      var checkboxes = document.getElementsByName("check");
      this.setState({
        ValidateLeave: true
      })
      for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = true;
        storecheck.push(checkboxes[i])
      }
    } else {
      var checkboxes = document.getElementsByName("check");
      this.setState({
        ValidateLeave: false
      })
      for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = false;
        // storecheck.splice(0, 1)
      }
      for (var j = 0, n = storecheck.length; j < n; j++) {
        storecheck.splice(0, 1)
      }
    }
  }
  SingleCheck = (event) => {
    var selectbox = [];
    var selectAllCheckbox = document.getElementById("selectall");
    var isActive = event.target.checked;
    var currentvalue = event.target.value;
    var checkboxes = document.getElementsByName("check");
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      if (checkboxes[i].checked == true) {
        selectbox.push(checkboxes[i].checked);
        if (checkboxes[i].value == currentvalue) {
          storecheck.push(checkboxes[i])
        }
      }
      else if (checkboxes[i].checked == false) {
        for (var j = 0; j < storecheck.length; j++) {
          if (checkboxes[i].value == storecheck[j].value) {
            storecheck.splice(j, 1)
          }
        }
      }
    }
    if (isActive == true || selectbox[0] == true) {
      this.setState({
        ValidateLeave: true
      });
    } else {
      this.setState({
        ValidateLeave: false
      });
    }

    for (var k = 0; k < checkboxes.length; k++) {
      if (checkboxes[k].checked == false) {
        selectAllCheckbox.checked = false
        break;
      }
      selectAllCheckbox.checked = true
    }
  }
  test() {
    //const profile = Auth.getProfile();
    return datesUtil.excludeAllSaturdaysAndSundays();
  }
  handleDateChange = date => {
    const profile = Auth.getProfile();
    if (date != null) {
      this.setState({
        joiningDate: date
      });
    } else {
      this.setState({
        joiningDate: ""
      });
    }
  };
  handleBirthdateChange = date => {
    const profile = Auth.getProfile();
    if (date != null) {
      this.setState({
        birthdate: date
      });
    } else {
      this.setState({
        birthdate: ""
      });
    }
  };
  handleSearch = e => {

    this.setState({
      hrRoleWiseData: [],
      hrDataArr: [],
      managerDataArr: [],
      teamLeadDataArr: [],
      allDataArr: [],
      hr: "Filter",
      hr_name: "Filter",
    });
    if (this.state.showalluser == false) {
      let indexOfFirstTodo = 0;
      var x = e.target.value;
      Auth.searchByEmpName(x).then(response => {
        this.setState({
          hrRoleWiseData: [],
          hrDataArr: [],
          managerDataArr: [],
          teamLeadDataArr: [],
          allDataArr: []
        });


        for (var i = 0; i < response.users.length; i++) {
          // if (this.state.userRole == "Admin" || this.state.userRole == "SuperAdmin") {

          //   if (response.users[i].hr_name === this.state.hr_name) {
          //     this.state.hrRoleWiseData.push(response.users[i]);
          //   } else {
          //     this.state.allDataArr.push(response.users[i]);
          //   }
          // }        

          if (this.state.userRole == "HR") {

            if (response.users[i].hr_name == this.state.userName) {
              this.state.hrDataArr.push(response.users[i]);
            }
          }
          else if (this.state.userRole == "Manager") {
            if (response.users[i].report_to == this.state.userName) {
              this.state.managerDataArr.push(response.users[i]);
            }
          }
          else if (this.state.userRole == "TeamLead") {
            if (response.users[i].teamlead_name == this.state.userName) {
              this.state.teamLeadDataArr.push(response.users[i]);
            }

          }
          else if (response.users[i].birthday == undefined || response.users[i].birthday == "Invalid date") {
            response.users[i].birthday = "N/A"
          }


        }
        if (response.users != undefined) {
          //   if (this.state.userRole == "Admin" || this.state.userRole == "SuperAdmin") {

          //     this.setState({
          //       userList: this.state.hrRoleWiseData,
          //       todos: this.state.hrRoleWiseData,
          //       dataUser: this.state.hrRoleWiseData,
          //       loading: false

          //     });
          //   }
          //   else
          if (this.state.userRole == "HR") {
            this.setState({
              userList: this.state.hrDataArr,
              todos: this.state.hrDataArr,
              dataUser: this.state.hrDataArr,
              loading: false
            });
          }
          else if (this.state.userRole == "Manager") {
            this.setState({
              userList: this.state.managerDataArr,
              todos: this.state.managerDataArr,
              dataUser: this.state.managerDataArr,
              loading: false,
              showallMangTLTableform: true
            });
          }
          else if (this.state.userRole == "TeamLead") {
            this.setState({
              userList: this.state.teamLeadDataArr,
              todos: this.state.teamLeadDataArr,
              dataUser: this.state.teamLeadDataArr,
              loading: false,
              showallMangTLTableform: true
            });
          }

          else {
            this.setState({
              userList: response.users,
              todos: response.users,
              dataUser: response.users,
              loading: false
            });
          }


          const { todos, currentPage, todosPerPage } = this.state;
          const indexOfLastTodo = currentPage * todosPerPage;
          if (x != "") {

            indexOfFirstTodo = 0;

          } else {
            indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
          }
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
    else if (this.state.showalluser == true) {
      //;
      var x = e.target.value;
      var selectAllCheckbox = document.getElementById("selectall");
      Auth.searchByEmpName(x).then(response => {
        //;
        for (var i = 0; i < response.users.length; i++) {
          if (response.users[i].birthday == undefined || response.users[i].birthday == "Invalid date") {
            response.users[i].birthday = "N/A"
          }
        }
        if (response.users != undefined) {
          //;
          var alluser = [];
          for (var i = 0; i < response.users.length; i++) {
            if (response.users[i].role != "SuperAdmin" && response.users[i].teqFocusExp > 0.6) {
              console.log(response.users[i].teqFocusExp);
              alluser.push(response.users[i])
              this.setState({
                userList: alluser
              })
            }
          }
          if (alluser.length != 0) {
            //;
            var checkboxes = document.getElementsByName("check");
            for (var i = 0, n = checkboxes.length; i < n; i++) {
              if (storecheck.length != 0) {
                for (var j = 0, c = storecheck.length; j < c; j++) {
                  if (storecheck[j].value == alluser[i].email) {
                    checkboxes[i].checked = true
                  }
                }
              }
            }
            for (var i = 0; i < checkboxes.length; i++) {
              if (checkboxes[i].checked == true) {
                this.setState({
                  ValidateLeave: true
                })
              }
            }
            for (var k = 0; k < checkboxes.length; k++) {
              if (checkboxes[k].checked == false) {
                selectAllCheckbox.checked = false;
                break;
              }
              selectAllCheckbox.checked = true;
            }
          }
        }
      });
    }
  };
  handleClick = number => {
    this.setState({
      activePage: number,
      currentPage: number
    });
    const indexOfLastTodo = number * this.state.todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    this.setState({ count: indexOfFirstTodo + 1 });
    const currentTodos = this.state.todos.slice(
      indexOfFirstTodo,
      indexOfLastTodo
    );
    var arr = [];
    const renderTodos = currentTodos.map((todo, index) => {
      arr.push(todo);
      return arr;
    });
    this.setState({
      dataPerPage: arr
    });

  };
  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }
  handleClose() {
    this.setState({
      show: false
    });
  }

  handleShow(id) {
    this.setState({
      show: true,
      empId: id
    });
  }
  addEmp = event => {
    this.setState({
      emp: 1
    });
  };
  cancel = event => {
    this.setState({ danger: false, showAlert: false });
    Auth.cancel().then(response => {
      this.setState({
        userList: response.data.users,
        emp: 0,
        update: 0,
        errors: {}
      });
    });
  };

  deleteEmp(id) {
    Auth.deleteEmp(id).then(data => {
      var listOfLeaves = [];
      listOfLeaves = this.state.userList;
      for (var i = 0; i < listOfLeaves.length; i++) {
        var obj = listOfLeaves[i];

        if (obj._id == id) {
          this.state.userList.splice(i, 1);
        }
        this.setState({
          userList: this.state.userList
        });
        var todo = [];
        todo = this.state.userList;
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
      }
    });

    this.setState({
      show: false,
      alertMessage: "Deleted successfully",
      danger: false,
      showAlert: true
    });
    setTimeout(() => {
      this.setState({ alertMessage: "", showAlert: false });
    }, 4000);
    // if (document.getElementById('successupdate').style.display == 'none') {
    //     document.getElementById('successupdate').style.display = 'block';
    //     //document.getElementById('successupdate').style.display = 'none';
    //   }
  }

  editEmp(id) {
    this.setState({
      update: 1
    });
    Auth.editEmp(id).then(response => {

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
      }
      else {
        Auth.getTeamLeader().then(response => {

          var defaultHRValue = { _id: "", name: "Select any value" };
          if (response.message != "Permission required" && response.users != '') {
            response.users.unshift(defaultHRValue);
            this.setState({
              teamLeader: response.users,
              teamlead_name: response.users[0]._id
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
        Auth.getHRPerson().then(response => {
          var defaultHRValue = { _id: "", name: "Select any value" };
          if (response.message != "Permission required" && response.users != '') {
            response.users.unshift(defaultHRValue);
            this.setState({
              hrPerson: response.users,
              hr_name: response.users[0]._id
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
        compoOff_balance: response.user[0].compoOff_balance

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

  handleOption = event => {
    this.setState({
      role: event.currentTarget.value
    });
  };
  handleOptionTab = event => {

    this.setState({
      role: event.currentTarget.value
    });
  };
  handlelocation = event => {
    this.setState({
      location: event.currentTarget.value
    });
  };
  handleOptionExperiance = event => {
    this.setState({
      experiance: event.currentTarget.value
    });
  };

  handleOptionReportingManager = event => {
    this.setState({
      reportingManager: event.currentTarget.value,
      report_to: event.currentTarget.value
    });
  };

  handleOptionTeamLead = event => {
    this.setState({
      teamLead: event.currentTarget.value,
      teamlead_name: event.currentTarget.value
    });
  };

  handleOptionHr = event => {
    this.setState({
      hr: event.currentTarget.value,
      hr_name: event.currentTarget.value
    });
  };

  handleOptionSickBalance = event => {
    this.setState({
      SickBalance: event.currentTarget.value
    });
  };
  handleOptioncompoOff_balanceance = event => {
    this.setState({
      compoOff_balance: event.currentTarget.value
    });
  };
  handleOptionCasualBalance = event => {
    this.setState({
      CasualBalance: event.currentTarget.value
    });
  };
  handleOptionWfhBalance = event => {
    this.setState({
      WfhBalance: event.currentTarget.value
    });
  };
  handleEmailOption = event => {
    this.setState({
      email: this.refs.email.value
    });
  };

  handleNameOption = event => {
    this.setState({
      name: this.refs.name.value
    });
  };

  UpdateDetails(id) {

    let formData = {
      email: this.state.email,
      name: this.state.name,
      DOJ: this.state.joiningDate
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
      ).then(data => {
        if (data.message != "Successfully updated") {
          this.setState({
            showAlert: true,
            alertMessage: data.message,
            danger: true
          });
          setTimeout(() => {
            this.setState({ alertMessage: "", showAlert: false });
          }, 3000);
        } else {
          this.apiResponse1(data);
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

  apiResponse1 = data => {

    if (data.status == 200) {
      this.setState({
        flaglog: 1,
        hrArr: [],
        managerArr: [],
        teamLeadArr: []
      });

      this.setState({
        alertMessage: "Your Request has been submitted",
        showAlert: true
      });

      var token = window.localStorage.getItem("id_token");
      Auth.getUserList("").then(response => {
        for (var i = 0; i < response.users.length; i++) {
          if (response.users[i].birthday == undefined || response.users[i].birthday == "Invalid date") {
            response.users[i].birthday = "N/A"
          }
          else if (this.state.userRole == "HR") {
            if (response.users[i].hr_name == this.state.userName) {
              this.state.hrArr.push(response.users[i]);
            }
          }
          else if (this.state.userRole == "Manager" || this.state.userRole == "TeamLead") {
            if (response.users[i].report_to == this.state.userName || response.users[i].teamlead_name == this.state.userName) {
              this.state.managerArr.push(response.users[i]);
            }
          }

        }
        if (this.state.userRole == "HR") {
          this.setState({
            userList: this.state.hrArr,
            todos: this.state.hrArr
          });
        }
        else if (this.state.userRole == "Manager" || this.state.userRole == "TeamLead") {
          this.setState({
            userList: this.state.managerArr,
            todos: this.state.managerArr,
            dataUser: this.state.managerArr,
            loading: false
          });
        }
        else {
          this.setState({
            userList: response.users,
            todos: response.users
          });
        }
        var todo = [];
        todo = this.state.userList;
        const { todos, currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = todo.slice(indexOfFirstTodo, indexOfLastTodo);
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
    } else {
    }
    this.setState({ alertMessage: "Updated successfully", danger: false });
    setTimeout(() => {
      this.setState({ alertMessage: "", showAlert: false });
    }, 4000);
  };

  handleAlert = () => {
    this.setState({ showAlert: false, danger: false });
    if (this.state.alertMessage == "Your Request has been submitted") {
      this.setState({ emp: 0, update: 0, errors: {} });
    }
    this.setState({
      alertMessage: "",
      dataPerPage: this.state.dataPerPage
    });
  };
  handleAlertClass() {
    let classes = "alertHeight ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }

  SubmitDetails = (
    name,
    email,
    experiance,
    password,
    reportingManager,
    role,
    teamlead,
    hr,
    casual,
    sick,
    wfh,
    joiningDate,
    location,
    birthday,
    empPermanent,
    compoOff_balance,
    category,
    skills,
    designation,
    specialization,
    training,
    remarks
  ) => {

    var user = window.localStorage.getItem("id_token");
    return Auth.submitUserDetails(
      name,
      email,
      experiance,
      password,
      reportingManager,
      teamlead,
      hr,
      role,
      casual,
      sick,
      wfh,
      joiningDate,
      location,
      birthday,
      empPermanent,
      compoOff_balance,
      category,
      skills,
      designation,
      specialization,
      training,
      remarks
    ).then(data => {
      return Promise.resolve(data);
    });
  };
  apiResponse = data => {
    var token = window.localStorage.getItem("id_token");
    Auth.getUserList("").then(response => {
      for (var i = 0; i < response.users.length; i++) {
        if (response.users[i].birthday == undefined || response.users[i].birthday == "Invalid date") {
          response.users[i].birthday = "N/A"
        }
        if (this.state.userRole == "HR") {
          if (response.users[i].hr_name == this.state.userName) {
            this.state.hrArr.push(response.users[i]);
          }
        }
        else if (this.state.userRole == "Manager" || this.state.userRole == "TeamLead") {
          if (response.users[i].report_to == this.state.userName || response.users[i].teamlead_name == this.state.userName) {
            this.state.managerArr.push(response.users[i]);
          }
        }

      }
      if (this.state.userRole == "HR") {
        this.setState({
          userList: this.state.hrArr,
          todos: this.state.hrArr
        });
      }
      else if (this.state.userRole == "Manager" || this.state.userRole == "TeamLead") {
        this.setState({
          userList: this.state.managerArr,
          todos: this.state.managerArr,
          dataUser: this.state.managerArr,
          loading: false
        });
      }
      else {
        this.setState({
          userList: response.users,
          todos: response.users,
          dataUser: response.users,
          loading: false
        });
      }
      var todo = [];
      todo = this.state.userList;
      const { todos, currentPage, todosPerPage } = this.state;
      const indexOfLastTodo = currentPage * todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
      const currentTodos = todo.slice(indexOfFirstTodo, indexOfLastTodo);
      var arr = [];
      const renderTodos = currentTodos.map((todo, index) => {
        arr.push(todo);
      });
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
        pageNumbers.push(i);
      }
      this.setState({
        numbers: pageNumbers,
        dataPerPage: arr
      });
    });
  };
  handleSelectChange = event => {
    this.setState({ selectValue: event.currentTarget.value });
  };
  componentDidMount() {
    var dashNotemp = document.getElementById("dashNotemployeemanagement");
    dashNotemp.classList.add("active");
    this.setState({
      hrRoleData: [],
      hrArr: [],
      managerArr: [],
      teamLeadArr: []
    });
    Auth.getReportingPerson().then(response => {
      var defaultHRValue = { _id: "", name: "Select any value" };
      if (response.message != "Permission required" && response.users != '') {
        response.users.unshift(defaultHRValue);
        this.setState({
          manager: response.users,
          report_to: response.users[0]._id
        });
      } else {
      }
    });
    Auth.getTeamLeader().then(response => {
      var defaultHRValue = { _id: "", name: "Select any value" };
      if (response.message != "Permission required" && response.users != '') {
        response.users.unshift(defaultHRValue);
        this.setState({
          teamLeader: response.users,
          teamlead_name: response.users[0]._id
        });
      } else {
      }
    });

    Auth.getHRPerson().then(response => {
      var defaultHRValue = { _id: "", name: "Select any value" };
      if (response.message != "Permission required" && response.users != '') {
        response.users.unshift(defaultHRValue);
        this.setState({
          hrPerson: response.users,
          hr_name: response.users[0]._id
        });
      } else {
      }
    });
    Auth.getHRPerson().then(response => {
      if (response.message != "Permission required" && response.users != '') {
        this.setState({
          hrPersonFilter: response.users,
          hr_name: response.users[0]._id
        });
      } else {
      }
    });
    var token = window.localStorage.getItem("id_token");
    Auth.getUserData(token).then(response => {
      
      this.setState({
        userRole: response.user.role,
        userName: response.user.name
      });
    });

    var token = window.localStorage.getItem("id_token");
    Auth.getUserList("").then(response => {

      for (var i = 0; i < response.users.length; i++) {
        if (response.users[i].birthday == undefined || response.users[i].birthday == "Invalid date") {
          response.users[i].birthday = "N/A"
        }
        if (this.state.userRole == "HR") {
          if (response.users[i].hr_name == this.state.userName) {
            this.state.hrArr.push(response.users[i]);
          }
        }
        else if (this.state.userRole == "Manager" || this.state.userRole == "TeamLead") {
          if (response.users[i].report_to == this.state.userName || response.users[i].teamlead_name == this.state.userName) {

            this.state.managerArr.push(response.users[i]);
          }
        }


      }
      if (this.state.userRole == "HR") {
        this.setState({
          userList: this.state.hrArr,
          todos: this.state.hrArr,
          dataUser: this.state.hrArr,
          loading: false,
          showalluser: false,
          showallMangTLTableform: false
        });
      } else if (this.state.userRole === "Manager" || this.state.userRole === "TeamLead") {

        this.setState({
          userList: this.state.managerArr,
          todos: this.state.managerArr,
          dataUser: this.state.managerArr,
          loading: false,
          showalluser: false,
          showallEditTableform: false,
          showallMangTLTableform: true
        });

      } else {
        this.setState({
          userList: response.users,
          todos: response.users,
          dataUser: response.users,
          loading: false,
          showalluser: false,
          showallEditTableform: false,
          showallMangTLTableform: false
        });
      }
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
  }
  editEmpHandleChange() {

    var alluser = [];
    this.setState({
      update: 1,
      showallEditTableform: true,
      showallMangTLTableform: false,
      editTableform: true,

    });
    edtitabletable.editEmployeeTable();
    // Auth.editEmpBulk().then(response => {
    //  
    //   response.user = response.user.slice(0,5)
    //   this.setState({
    //     empUserList: response.user,
    //     todos: response.user
    //     // showallEditTableform: true,
    //     // editTableform: true,

    //   });
    //   console.log(this.state.myArray);
    //   this.setState({
    //     myArray:this.state.empUserList
    //   })
    //   console.log(this.state.myArray);
    // });
    this.refs.password.value = "";
  }

  handlelocation = event => {
    this.setState({
      location: event.currentTarget.value
    });
  };
  handleOptionExperiance = event => {
    this.setState({
      experiance: event.currentTarget.value
    });
  };

  handleOptionReportingManager = event => {
    this.setState({
      reportingManager: event.currentTarget.value,
      report_to: event.currentTarget.value
    });
  };

  handleOptionTeamLead = event => {
    this.setState({
      teamLead: event.currentTarget.value,
      teamlead_name: event.currentTarget.value
    });
  };

  handleOptionHr = event => {
    this.setState({
      hr: event.currentTarget.value,
      hr_name: event.currentTarget.value
    });
  };

  handleOptionSickBalance = event => {
    this.setState({
      SickBalance: event.currentTarget.value
    });
  };
  handleOptioncompoOff_balanceance = event => {
    this.setState({
      compoOff_balance: event.currentTarget.value
    });
  };
  handleOptionCasualBalanceTab = event => {
    this.setState({
      CasualBalance: event.currentTarget.value
    });
  };
  handleOptionWfhBalanceTab = event => {
    this.setState({
      WfhBalance: event.currentTarget.value
    });
  };
  handleEmailOption = event => {
    this.setState({
      email: this.refs.email.value
    });
  };

  handleNameOption = event => {
    this.setState({
      name: this.refs.name.value
    });
  };
  handleHrTypeOption = event => {
    
    this.setState({
      hrRoleData: [],
      hr: event.currentTarget.value,
      hr_name: event.currentTarget.value,
      currentPage: 1,
      todos: [],
      dataUser: [],
      dataPerPage: [],
      
      
    });
    let indexOfFirstTodo = 0;
    var token = window.localStorage.getItem("id_token");
    Auth.getUserList("").then(response => {
      for (var i = 0; i < response.users.length; i++) {
        if (response.users[i].hr_name == this.state.hr_name) {
          this.state.hrRoleData.push(response.users[i]);
        }
        else if (response.users[i].location == this.state.hr_name) {
          this.state.hrRoleData.push(response.users[i]);
        }

        else if (this.state.hr_name == "All" || this.state.hr_name == "Clear Filter") {
          this.state.hrRoleData.push(response.users[i]);
        }

      }
      this.setState({
        userList: this.state.hrRoleData,
        todos: this.state.hrRoleData,
        dataUser: this.state.hrRoleData,
        loading: false,
        showalluser: false,
        showallMangTLTableform: false
      });

      const { todos, currentPage, todosPerPage } = this.state;
      const indexOfLastTodo = currentPage * todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
      this.setState({ count: indexOfFirstTodo + 1 });
      const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
      var arr = [];
      const renderTodos = currentTodos.map((todo, index) => {
        arr.push(todo);
        return arr;
      });

      this.setState({
        activePage: 1,
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
  }
  render() {
    const CustomInput = props => {
      return (
        <input
          className="form-control"
          onClick={props.onClick}
          value={props.value}
          type="text"
          readOnly={true}
        />
      );
    };
    const isWeekday = date => {
      const day = date.getDay();
      return day !== 0 && day !== 6;
    };
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
          <ModalWindow
            show={this.state.showModal}
            container={this}
            userList={this.state.userList}
            submitUser={this.SubmitDetails}
            errorsdiv={this.state.errorsdiv}
            errors={this.state.errors}
          />

          {this.state.showAlert == true ? (
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
                <strong>{this.state.alertMessage}</strong></div>
            </div>
          ) : (
              ""
            )}
          {/* Add Leave */}
          <div className="modal" id="addcasual" data-backdrop="static">
            <div className="modal-dialog">
              <div className="modal-content addholiday">
                <div className="modal-header addholiday">
                  <h4 className="modal-title addholiday">Add Balance</h4>
                  <button
                    type="button"
                    className="close addholiday"
                    data-dismiss="modal"
                    onClick={this.cancelAddcasual}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <from className="addholiday">
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Leave Type:</label>
                          <input
                            ref="leavetype"
                            className="form-control"
                            value={this.state.leavetype}
                          >
                          </input>
                        </div></div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Add Balance</label>
                          <input
                            type="number"
                            onChange={this.handleChangeBalance}
                            value={this.addbalance}
                            className="form-control"
                            ref="addbalance"
                          />
                        </div>
                      </div>
                    </div>
                  </from>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={this.handleAddCasualBalance}
                    className="btn btn-success  btn-rounded btn-fix save"
                    data-dismiss="modal"
                    disabled={!this.state.Validate}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* delete emp */}
          <div className="modal fade" id="empDelete">
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
                      You want to delete this Employee!
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
                      onClick={() => this.deleteEmp(this.state.empId)}
                    >
                      <i className="fa fa-check"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal fade update-Emp" id="updEmp" data-backdrop="static" >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Update Employee Profile</h4>
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

                      {/* <div className="col-sm-4 form-group">
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
                      */}
                      <div className="col-sm-4 form-group">
                        <label>Role</label>

                        {this.state.userRole != "HR" ? <select
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
                          : <select
                            ref="role"
                            value={this.state.role}
                            className="form-control"
                            onChange={this.handleOption}
                          >
                            <option>Employee</option>
                            <option>TeamLead</option>
                            <option>Manager</option>


                          </select>
                        }
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
                            ? this.state.manager.map(item => (
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
                        <label>Comp OFF Balance</label>
                        <input
                          className="form-control"
                          ref="sick"
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
                        <select ref="location"
                          value={this.state.location}
                          onChange={this.handlelocation.bind(this)}
                          className="form-control">

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
                              ? this.state.teamLeader.map(item => (
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
                              ? this.state.hrPerson.map(item => (
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


          {/* Employee list */}
          <div>
            {this.state.showallEditTableform === true && this.state.editTableform === true ? (

              <div className="ibox">
                <EditableTable></EditableTable>
              </div>

            ) : (
                < div >
                  {this.state.showallEditTableform === true && this.state.editTableform === true ? (

                    <div className="ibox">
                      <EditableTable></EditableTable>
                    </div>

                  ) : (
                      <div className="ibox">
                        <div className="ibox-head box-emp-mang">
                          <div className="ibox-tools">
                            {" "}
                            {this.state.showallMangTLTableform === false ? (
                              <div className="btn-withdrop">
                                <div>  <button
                                  className="btn btn-outline-info  btn-rounded addemployee-btn"
                                  data-toggle="modal"
                                  data-target="#addEmp"
                                  aria-pressed="false"
                                >
                                  <i className="fa fa-user-plus"></i> Add Employee
                </button>
                                </div>
                                <div>
                                  <button
                                    className="btn btn-outline-info  btn-rounded addemployee-btn"
                                    onClick={() => this.editEmpHandleChange()}>
                                    <i class="fa fa-edit font comment"></i> Edit Employee</button>
                                </div>
                              </div>
                            ) : (
                                <div className="ibox-title"> Employee List</div>
                              )}
                          </div>
                          {this.state.showallMangTLTableform === false ? (
                            <div className="ibox-title"> Employee List</div>
                          ) : ("")}
                          <div className="btn-withdrop withdrop-option">
                            {this.state.userRole == "Manager" || this.state.userRole == "TeamLead" || this.state.userRole === "HR" ? (
                              ""
                            ) : (
                                <div className="myformHr">
                                  <div className="form-group leave-type-select">
                                    <label></label>

                                    <select id="hr-ref" ref="hr"
                                      className="form-control menu-item filter-menu-item"
                                      value={this.state.hr_name}
                                      onChange={this.handleHrTypeOption}>
                                      <option className="menu-clear menu-icon option-change" id="check2" value="Clear Filter">&#xf0b0; Filter</option>
                                      <option className="menu-clear menu-icon option-change" value="Clear Filter">&#xf00d; Clear Filter</option>
                                      <option className="menu-clear menu-icon option-change" value="All" selected>&#xf00c; All</option>
                                      <option disabled className="menu-title option-change">&#xf007; HR Wise</option>
                                      {this.state.hrPersonFilter != undefined
                                        ? this.state.hrPersonFilter.map(item => (
                                          <option key={item._id} value={item.name} className="option-change">
                                            {item.name}
                                          </option>

                                        ))
                                        : ""}
                                      <option disabled className="menu-title option-change">&#xf041; Location Wise</option>
                                      <option className="option-change">Ranchi</option>
                                      <option className="option-change">Pune</option>
                                      <option className="option-change">Canada</option>
                                    </select>

                                  </div>
                                </div>)}
                            <div className="empSearch  box-emp-search">
                              <div className="navbar-search search-emp search-nav">
                                <div className="rel ">
                                  <span className="search-icon">
                                    <i className="ti-search"></i>
                                  </span>
                                  <input
                                    className="form-control"
                                    placeholder="Search By Name..."
                                    onChange={this.handleSearch}
                                  />
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                        {this.state.showalluser == true ? (
                          <div className="ibox-body">
                            {this.state.checkbox == true ? (
                              <div className="check-form">
                                <form>
                                  <div className="form-check">
                                    <input type="checkbox" className="form-check-input" onClick={this.CheckUncheckAll} id="selectall" ></input>
                                    <label className="form-check-label" for="addcasual" >Select All</label>
                                  </div>
                                </form>
                                <div className="add-casual-button">
                                  <button type="button" className="btn btn-xs btn-rounded btn-primary add-casual" id="btnSubmit" onClick={this.SelectedCheckbox} disabled={!this.state.ValidateLeave} >Add Leave</button>
                                  <button type="button" className="btn btn-xs btn-rounded btn-danger cancel-add-casual" onClick={this.cancelCheckbox}  >Cancel</button>
                                </div>
                              </div>
                            ) : (
                                <div></div>
                              )}

                            <div className="table-responsive">
                              <table className="table table-bordered table-hover">
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>Name</th>

                                    <th>D-O-J</th>
                                    <th className="tbl-date">Exp In Teq</th>
                                    <th className="tbl-date">Total Exp</th>
                                    <th>Hr</th>
                                    <th>Manager</th>
                                    <th className="tbl-date">Team Leader</th>

                                    <th>Location</th>
                                    <th className="tbl-date">Casual {this.state.userRole == "Admin" || this.state.userRole == "HR" ? (<i onClick={this.casualcheckBoxshow} className="fa fa-plus add-casual-leave"></i>) : (<div></div>)}
                                    </th>
                                    <th className="tbl-date">Sick {this.state.userRole == "Admin" || this.state.userRole == "HR" ? (<i onClick={this.sickcheckBoxshow} className="fa fa-plus add-casual-leave"></i>) : (<div></div>)}</th>
                                    <th className="tbl-date">WFH {this.state.userRole == "Admin" || this.state.userRole == "HR" ? (<i onClick={this.wfhcheckBoxshow} className="fa fa-plus add-casual-leave"></i>) : (<div></div>)}</th>
                                    <th className="tbl-date">Comp {this.state.userRole == "Admin" || this.state.userRole == "HR" ? (<i onClick={this.compocheckBoxshow} className="fa fa-plus add-casual-leave"></i>) : (<div></div>)}</th>
                                    <th className="tbl-date">D-O-B</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>

                                  {this.state.userList.map((item, index) => (
                                    <tr key={item._id}>
                                      <td className="tbl-date">
                                        {this.state.checkbox == true ? (<div>
                                          <form>
                                            <div className="form-check">
                                              <input type="checkbox" name="check" className="form-check-input multiple" id="selectone" value={item.email} onClick={this.SingleCheck} ></input>
                                            </div>
                                          </form>
                                        </div>
                                        ) : (
                                            index + this.state.count)}
                                      </td>
                                      <td className="tbl-date">
                                        <Link to={`/empProfile/${item._id}`}>
                                          {item.name}
                                        </Link>
                                      </td>
                                      {/* <td className="tbl-date">{item.email}</td> */}
                                      <td className="tbl-date">{item.doj}</td>
                                      <td className="tbl-date">{item.teqFocusExp}</td>
                                      <td className="tbl-date">{item.experience + item.teqFocusExp}</td>
                                      <td className="tbl-date">{item.hr_name}</td>
                                      <td className="tbl-date">{item.report_to}</td>
                                      <td className="tbl-date">{item.teamlead_name}</td>
                                      {/* <td className="tbl-date">{item.role}</td> */}
                                      <td className="tbl-date">{item.location}</td>
                                      <td className="tbl-date">{item.casual_balance}</td>
                                      <td className="tbl-date">{item.sick_balance}</td>
                                      <td className="tbl-date">{item.wfh_balance}</td>
                                      <td className="tbl-date">{item.compoOff_balance}</td>
                                      <td className="tbl-date">{item.birthday}</td>
                                      <td className="tbl-date">
                                        <div className="customtooltip">
                                          <button
                                            className="btn badge-info btn-xs m-r-5"
                                            data-toggle="modal"
                                            data-target="#updEmp"
                                            onClick={() => this.editEmp(item._id)}
                                          >
                                            <i className="fa fa-pencil font comment"></i>
                                          </button>
                                          <span className="tooltiptext">Edit</span>
                                        </div>
                                        <div className="customtooltip">
                                          <button
                                            className="btn badge-danger btn-xs"
                                            data-toggle="modal"
                                            data-target="#empDelete"
                                            onClick={() => this.handleShow(item._id)}
                                          >
                                            <i className="fa fa-trash font decline"></i>
                                          </button>
                                          <span className="tooltiptext">Delete</span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                            <div className="ibox-body">
                              {this.state.checkbox == true ? (
                                <div className="check-form">
                                  <form>
                                    <div className="form-check">
                                      <input type="checkbox" className="form-check-input" onClick={this.CheckUncheckAll} id="selectall" ></input>
                                      <label className="form-check-label" for="addcasual" >Select All</label>
                                    </div>
                                  </form>
                                  <div className="add-casual-button">
                                    <button type="button" className="btn btn-xs btn-rounded btn-primary add-casual" id="btnSubmit" onClick={this.SelectedCheckbox} disabled={!this.state.ValidateLeave} >Add Leave</button>
                                    <button type="button" className="btn btn-xs btn-rounded btn-danger cancel-add-casual" onClick={this.cancelCheckbox}  >Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                  <div></div>
                                )}

                              <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>Name</th>
                                      {this.state.showallMangTLTableform === false ? (
                                        <th className="tbl-date">D-O-J</th>
                                      ) : (
                                          ""
                                        )}
                                      {this.state.showallMangTLTableform === false ? (
                                        <th className="tbl-date">Exp In Teq</th>) : (
                                          ""
                                        )}
                                      <th className="tbl-date">Total Exp</th>
                                      <th>Hr</th>
                                      <th>Manager</th>
                                      <th className="tbl-date">Team Leader</th>
                                      <th>Location</th>
                                      {this.state.userRole == "Admin" || this.state.userRole == "HR" ? (<th className="tbl-date add-casual" onClick={this.casualcheckBoxshow}>Casual <i className="fa fa-plus add-casual-leave"></i> </th>) : (<th className="tbl-date">Casual</th>)}
                                      {this.state.userRole == "Admin" || this.state.userRole == "HR" ? (<th className="tbl-date add-casual" onClick={this.sickcheckBoxshow}>Sick <i className="fa fa-plus add-casual-leave"></i></th>) : (<th className="tbl-date">Sick</th>)}
                                      {this.state.userRole == "Admin" || this.state.userRole == "HR" ? (<th className="tbl-date add-casual" onClick={this.wfhcheckBoxshow}>WFH <i className="fa fa-plus add-casual-leave"></i></th>) : (<th className="tbl-date">WFH</th>)}
                                      {this.state.userRole == "Admin" || this.state.userRole == "HR" ? (<th className="tbl-date add-casual" onClick={this.compocheckBoxshow}>Comp <i className="fa fa-plus add-casual-leave"></i></th>) : (<th className="tbl-date">Comp</th>)}
                                      {this.state.showallMangTLTableform === false ? (

                                        <th className="tbl-date">D-O-B</th>
                                      ) : (
                                          ""
                                        )}
                                      {this.state.showallMangTLTableform === false ? (
                                        <th className="tbl-date">Actions</th>
                                      ) : (
                                          ""
                                        )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.dataPerPage.map((item, index) => (
                                      <tr key={item._id}>
                                        <td className="tbl-date">
                                          {this.state.checkbox == true ? (<div>
                                            <form>
                                              <div className="form-check">
                                                <input type="checkbox" name="check" className="form-check-input multiple" id="selectone" value={item.email} onClick={this.SingleCheck} ></input>
                                              </div>
                                            </form>
                                          </div>
                                          ) : (
                                              index + this.state.count)}
                                        </td>
                                        <td className="tbl-date">
                                          <Link to={`/empProfile/${item._id}`}>
                                            {item.name}
                                          </Link>
                                        </td>

                                        {/* <td className="tbl-date">{item.email}</td> */}
                                        {this.state.showallMangTLTableform === false ? (
                                          <td className="tbl-date">{item.doj}</td>
                                        ) : ("")}
                                        {this.state.showallMangTLTableform === false ? (
                                          <td className="tbl-date">{item.teqFocusExp}</td>) : ("")}
                                        <td className="tbl-date">{item.experience + item.teqFocusExp}</td>
                                        <td className="tbl-date">{item.hr_name}</td>
                                        <td className="tbl-date">{item.report_to}</td>
                                        <td className="tbl-date">{item.teamlead_name}</td>
                                        {/* <td className="tbl-date">{item.role}</td> */}
                                        <td className="tbl-date">{item.location}</td>
                                        <td className="tbl-date">{item.casual_balance}</td>
                                        <td className="tbl-date">{item.sick_balance}</td>
                                        <td className="tbl-date">{item.wfh_balance}</td>
                                        <td className="tbl-date">{item.compoOff_balance}</td>
                                        {this.state.showallMangTLTableform === false ? (
                                          <td className="tbl-date">{item.birthday}</td>) : ("")}
                                        {this.state.showallMangTLTableform === false ? (
                                          <td className="tbl-date">
                                            <div className="customtooltip">
                                              <button
                                                className="btn badge-info btn-xs m-r-5"
                                                onClick={() => this.editEmp(item._id)}
                                                data-toggle="modal"
                                                data-target="#updEmp"
                                              >
                                                <i className="fa fa-pencil font comment"></i>
                                              </button>
                                              <span className="tooltiptext">Edit</span>
                                            </div>
                                            <div className="customtooltip">
                                              <button
                                                className="btn badge-danger btn-xs"
                                                data-toggle="modal"
                                                data-target="#empDelete"
                                                onClick={() => this.handleShow(item._id)}
                                              >
                                                <i className="fa fa-trash font decline"></i>
                                              </button>
                                              <span className="tooltiptext">Delete</span>
                                            </div>
                                          </td>
                                        ) : ("")}

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
                                  totalItemsCount={this.state.dataUser.length}
                                />
                              </div>
                            </div>
                          )}
                      </div>
                    )
                  }
                </div>
              )
            }
          </div>
          {/* )
          } */}
        </div >
      );
    }
  }
  handleAlertClass() {

    let classes = "alert alert-dismissable fade show alertpopup row toast-alert-pd ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
}

