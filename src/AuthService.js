import React, { Component } from "react";
import decode from "jwt-decode";
import Axios from "axios";
import * as config from "./config";
export default class AuthService extends Component {
  // Initializing important variables
  constructor(domain) {
    super();
    this.domain = domain || config.ipConfig(); // API server domain
    this.fetch = this.fetch.bind(this); // React binding stuff
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.state = {
      flag: 0,
      user: []
    };
  }

  login(email, password) {
    // Get a token from api server using the fetch api
    // const cookies = new Cookies();
    return this.fetch(`${this.domain}/authenticate`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      })
    }).then(res => {
      //   cookies.set(res.user);
      this.setToken(res.token); // Setting the token in localStorage
      this.setState({
        user: res.user
      });
      return Promise.resolve(res);
    });
  }
  sendmail(email) {
    return this.fetch(`${this.domain}/forgot-password`, {
      method: "POST",
      body: JSON.stringify({
        email
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  changepassword(email, password) {
    return this.fetch(`${this.domain}/change-password`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  changeleavetype(id, switchMode) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/` + id, {
      method: "PUT",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        switchMode
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getUserData(token) {
    return this.fetch(`${this.domain}/profile`, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getLeaveStatus(leave_type, name) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/approval-status/pending/1`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        leave_type: leave_type,
        name: name
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getPendingStatus() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/wfh-status/pending/1`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getProfileLeaveStatus() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/wfh-status/all/1`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getWfhStatus() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/approval-status/pending/1`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  applywfh(start_date, end_date, reason,leave_days,leave_duration) {
    
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/add`, {
      method: "POST",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        start_date,
        end_date,
        reason,
        leave_days,
        leave_duration
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getwfhlist() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/approval-status/pending/1`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  approveWFHStatus(id){
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/` + id, {
      method: "PUT",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        approval_status: "Approved"
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  declineWFHStatus(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/` + id, {
      method: "PUT",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        approval_status: "Rejected"
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  approveLeaveStatus(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/` + id, {
      method: "PUT",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        approval_status: "Approved"
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  approveWfhStatus(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/` + id, {
      method: "PUT",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        approval_status: "Approved"
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  declineLeaveStatus(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/` + id, {
      method: "PUT",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        approval_status: "Rejected"
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  declineWfhStatus(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/` + id, {
      method: "PUT",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        approval_status: "Rejected"
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  addHoliday(date, name, number_of_days, location) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/holiday/create`, {
      method: "POST",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date,
        name,
        number_of_days,
        location
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  deleteHoliday(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/holiday/remove/` + id, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  submitManagerComment(id, comment) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/` + id, {
      method: "PUT",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        leave_comment: comment
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  submitWFHManagerComment(id, comment) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/` + id, {
      method: "PUT",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        leave_comment: comment
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  submitAdminComment(id, comment) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/` + id, {
      method: "PUT",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        admin_comment: comment
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  submitEmployeeComment(id, comment) {
    
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/` + id, {
      method: "PUT",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        employee_comment: comment
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  submitWFHEmployeeComment(id, comment) {
    
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/` + id, {
      method: "PUT",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        employee_comment: comment
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  submitAdminWFHComment(id, comment) {
    
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/` + id, {
      method: "PUT",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        admin_comment: comment
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getLeavesDetail(limit,page) {
    var dToken = decode(this.getToken());
    var token = window.localStorage.getItem("id_token");
    if(dToken.role =="Admin" || dToken.role =="SuperAdmin"){
      return this.fetch(`${this.domain}/leaves/approval-status/approved/1`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          limit: limit,
          page: page
        })
      }).then(response => {
        return Promise.resolve(response);
      });
    }else{
      return this.fetch(`${this.domain}/leaves/approval-status/All/1`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          limit: limit,
          page: page
        })
      }).then(response => {
        return Promise.resolve(response);
      });
    }
    
  }
  getWFHDetail() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/approval-status/all/1`, {
      method: "POST",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getLeaveStatusDeclineData(leave_type, name,page,limit) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/approval-status/rejected/1`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        leave_type: leave_type,
        name: name,
        page:page,
        limit:limit
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getWfhDeclineData() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/approval-status/rejected/1`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getLeavesDetailApproved(leave_type, name,page,limit) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/leaves/approval-status/approved/1
  `,
      {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          leave_type: leave_type,
          name: name,
          page:page,
          limit:limit
        })
      }
    ).then(response => {
      return Promise.resolve(response);
    });
  }
  getWfhDetailApproved() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/wfh/approval-status/approved/1
  `,
      {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
        })
      }
    ).then(response => {
      return Promise.resolve(response);
    });
  }
  getLeavesBalance() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/leaves/balance
    `,
      {
        method: "GET",
        headers: {
          Authorization: token
        }
      }
    ).then(response => {
      return Promise.resolve(response);
    });
  }
  getHolidayList(location) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/holiday/list
      `,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          location: location,
        })
      }
    ).then(response => {
      return Promise.resolve(response);
    });
  }

  getAttendance() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/attendance
      `,
      {
        method: "GET",
        headers: {
          Authorization: token
        }
      }
    ).then(response => {
      return Promise.resolve(response);
    });
  }

  getCalendar() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/leaves/leave-calendar
      `,
      {
        method: "GET",
        headers: {
          Authorization: token
        }
      }
    ).then(response => {
      return Promise.resolve(response);
    });
  }
  searchByLeavetype(leave_type, name) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/approval-status/pending/1`, {
      method: "POST",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        leave_type: leave_type,
        name: name
      })
    }).then(res => {
      return Promise.resolve(res);
    });
  }
  searchByName(name, leave_type) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/approval-status/pending/1`, {
      method: "POST",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        leave_type: leave_type
      })
    }).then(res => {
      return Promise.resolve(res);
    });
  }
  searchWFHByName(name) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/approval-status/pending/1`, {
      method: "POST",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
      })
    }).then(res => {
      return Promise.resolve(res);
    });
  }
  getComment(id){
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/leaveComment/` +id, {
      method: "GET",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    }).then(res => {
      return Promise.resolve(res);
    });
  }
  getWfhComment(id){
    
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/wfhComment/` +id, {
      method: "GET",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    }).then(res => {
      return Promise.resolve(res);
    });
  }
  applyLeave(
    leave_duration,
    leave_type,
    reason,
    start_date,
    end_date,
    leave_days
  ) {
    var user = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves`, {
      method: "POST",
      headers: {
        authorization: user,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        leave_durations: leave_duration,
        leave_type: leave_type,
        reason: reason,
        start_date: start_date,
        end_date: end_date,
        leave_days: leave_days
      })
    }).then(res => {
      return Promise.resolve(res);
    });
  }
  getLeaveReport() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/leaveReport`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getMonthReport(monthType){
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/getleaveReport`, {
      method: "POST",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        monthType: monthType,
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getUserSummary(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/user-summary/` + id, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(res => {
      return Promise.resolve(res);
    });
  }
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // GEtting token from localstorage
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        // Checking if token is expired. N
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  setToken(idToken) {
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
    localStorage.removeItem("clicked_link");
    localStorage.removeItem("dayArray");
  }

  getProfile() {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken());
  }

  fetch(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + this.getToken();
    }

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json());
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      // Success status lies between 200 to 300
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  cancel() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/users
    `,
      {
        method: "GET",
        headers: {
          Authorization: token
        }
      }
    ).then(response => {
      return Promise.resolve(response);
    });
  }

  deleteEmp(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/remove/` + id, {
      method: "PUT",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  editEmp(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/getinfo/` + id, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  UpdateDetails(
    id,
    name,
    email,
    experience,
    password,
    report,
    teamlead,
    hr,
    role,
    casual_balance,
    sick_balance,
    doj,
    location,
    birthday,
    wfh_balance,
    empPermanent,
    compoOff_balance,
    designation,
    category,
    skills,
    specialization,
    under_traning,
    remarks
  ) {
   
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/updateempinfo/` + id, {
      method: "PUT",
      body: JSON.stringify({
        name,
        email,
        experience,
        password,
        report,
        teamlead,
        hr,
        role,
        casual_balance,
        sick_balance,
        doj,
        location,
        birthday,
        wfh_balance,
        empPermanent,
        compoOff_balance,
        designation,
        category,
        skills,
        specialization,
       under_traning,
       remarks
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
 

  getReportingPersonForTracker(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/report-person-for-tracker`, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  getUserList(name) {
    
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        name: name
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  submitUserDetails(
    name,
    email,
    experience,
    password,
    report,
    teamlead,
    hr,
    role,
    casual_balance,
    sick_balance,
    wfh_balance,
    compoOff_balance,
    doj,
    location,
    birthday,
    empPermanent,
    category,
    skills,
    designation,
    specialization,
    under_traning,
    remarks
  ) {
   
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/register`, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        experience,
        password,
        report,
        teamlead,
        hr,
        role,
        casual_balance,
        sick_balance,
        wfh_balance,
        doj,
        location,
        birthday,
        empPermanent,
        compoOff_balance,
        category,
        skills,
        designation,
        specialization,
        under_traning,
        remarks
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  searchByEmpName(name) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/users`, {
      method: "POST",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name
      })
    }).then(res => {
      return Promise.resolve(res);
    });
  }
  searchByLeaveApproveDetails(leave_type, name) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/leaves/approval-status/approved/1
  `,
      {
        method: "POST",
        headers: {
          authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          leave_type: leave_type,
          name: name
        })
      }
    ).then(response => {
      return Promise.resolve(response);
    });
  }
  searchByLeaveDeclineDetails(leave_type, name) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/approval-status/rejected/1`, {
      method: "POST",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        leave_type: leave_type,
        name: name
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  searchByApproveDetails(name, leave_type) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/leaves/approval-status/approved/1
  `,
      {
        method: "POST",
        headers: {
          authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          leave_type: leave_type
        })
      }
    ).then(response => {
      return Promise.resolve(response);
    });
  }
  searchByDeclineDetails(name, leave_type) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/leaves/approval-status/rejected/1
  `,
      {
        method: "POST",
        headers: {
          authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          leave_type: leave_type
        })
      }
    ).then(response => {
      return Promise.resolve(response);
    });
  }
  searchByWfhApproveDetails(name) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/wfh/approval-status/approved/1
  `,
      {
        method: "POST",
        headers: {
          authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
        })
      }
    ).then(response => {
      return Promise.resolve(response);
    });
  }
  searchByWfhDeclineDetails(name) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/approval-status/rejected/1`, {
      method: "POST",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  searchByDetails(name) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/approval-status/all/1`, {
      method: "POST",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  searchByWfhDetails(name) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/approval-status/all/1`, {
      method: "POST",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  updateprofile(id, formData) {
    return Axios.post(`${this.domain}/update-profile/` + id, formData, {}).then(
      response => {
        return Promise.resolve(response);
      }
    );
  }
  addBalance(type, leaveamount, email) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/addcasualbalance`, {
      method: "POST",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type,
        leaveamount,
        email
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  pendingLeaveStatus(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/` + id, {
      method: "PUT",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        approval_status: "Pending"
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  getTeamLeader(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/teamlead-person`, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  submitTeamLeadComment(id, comment) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/` + id, {
      method: "PUT",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        teamlead_comment: comment
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  submitWFHTeamLeadComment(id, comment) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/` + id, {
      method: "PUT",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        teamlead_comment: comment
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getHRPerson(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/hr-person`, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  submitHRComment(id, comment) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/` + id, {
      method: "PUT",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hr_comment: comment
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  submitWfhHRComment(id, comment) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/wfh/` + id, {
      method: "PUT",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hr_comment: comment
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getAdminData(type) {
    var user = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/getAdminData`, {
      method: "POST",
      headers: {
        authorization: user,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: type,
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }


  getcasualBal(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/leaves/casualTotalStatus`, {
      method: "POST",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  BulkUpdateEmpTable(UserList){
   
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/bulkUpdate`, {
      method: "PUT",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userList: UserList
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  editEmpBulk() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/bulkinfo/`, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  //Start TeqTracker All Servicess
  addmember(project_id, user_id, role,hours_involved) {
    
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/add/member`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        project_id,
        user_id,
        role,
        hours_involved
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  addproject(project_name, clientid, start_date, category,description,nature_of_project) {
    
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        project_name,
        clientid,
        start_date,
        category,
        description,
        nature_of_project
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  addemployee(
    name,
    role,
    email,
    designation,
    password,
    skills,
    category,
    experience,
    report,
    joiningDate
  ) {
  
    var token = window.localStorage.getItem("id_token");
   // alert(name);
    return this.fetch(`${this.domain}/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        name,
        role,
        email,
        designation,
        password,
        skills,
        category,
        experience,
        report,
        joiningDate
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  addclient(client_name, email, contact_person,client_job_role,projects,remark) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/client/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        client_name,
        email,
        contact_person,
        client_job_role,
        projects,
        remark
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getProjectList() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/list`, {
      method: "POST",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  searchByProjName(name) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/list`, {
      method: "POST",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name
      })
    }).then(res => {
      return Promise.resolve(res);
    });
  }
  getEmployeeList(name) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        name: name
      })
    }).then(res => {
      return Promise.resolve(res);
    });
  }
  getReportingPerson() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/report-person`, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getClientList() {
    // 
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/client/list`, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  getEmployeeProjectReport(month) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/empReport`, {
      method: "POST",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        monthType: month,
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  clientGetInfo(id) {
    
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/client/getinfo/` + id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  editEmp(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/getinfo/` + id, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  editProject(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/find/` + id, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  UpdateEmpDetails(
    id,
    name,
    email,
    experience,
    password,
    report,
    role,
    designation,
    category,
    skills
  ) {
    
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/updateempinfo/` + id, {
      method: "PUT",
      body: JSON.stringify({
        name,
        email,
        experience,
        password,
        report,
        role,
        designation,
      category,
      skills
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  UpdateProjectDetails(project_id, project_name, category, status, start_date, manager_name,end_date,description,nature_of_project) {
    
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/update`, {
      method: "POST",
      body: JSON.stringify({
        project_id,
        project_name,
        category,
        status,
        start_date,
        manager_name,
        end_date,
        description,
        nature_of_project
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  updateclient(clientid, client_name, email, contact_person,client_job_role,projects,remark) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/client/update`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        clientid,
        client_name,
        email,
        contact_person,
        client_job_role,
        projects,
        remark
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  memberDelete(project_id, user_id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/remove/member`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        project_id,
        user_id
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  projectDelete(id) {
    
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/remove/` + id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  employeeDelete(id) {
    
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/remove/` + id, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  clientDelete(id) {
    
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/client/remove/` + id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  getEmpWiseProjectList() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/empprojectlist`, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  addHours(date, emphours, projectitem, description, project_type) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/statusEmp/create`, {
      method: "POST",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date: date,
        hours: emphours,
        project: projectitem,
        description: description,
        project_type: project_type
      })
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  getEmpWiseTeamProjectList() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/empteamwiselist`, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }
  
  getMgrWiseTeamProjectList() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/empmanagerwiselist`, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }).then(response => {
      return Promise.resolve(response);
    });
  }

  getProjectDetailsWithoutId(){
    var token = window.localStorage.getItem("id_token");
    debugger  
    return this.fetch(`${this.domain}/project/userassignedwithoutID`,{
      method:"GET",
      headers:{
        Authorization:token,
      },
    }).then((response)=>{
      return Promise.resolve(response)
    })
  }
  getProjectDetailsRoleWise(){
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/getprojectrolewise`,{
      method:"GET",
      headers:{
        Authorization:token,
      },
    }).then((response)=>{
      return Promise.resolve(response)
    })
  }

  getProjectDetails(id){
    var token = window.localStorage.getItem("id_token")

    return this.fetch(`${this.domain}/project/projectDetails/` +  id, {
      method:"GET",
      headers:{
        Authorization:token,
      },
    }).then((response)=>{
      return Promise.resolve(response)
    })
  }

  getUserAssignedProject(id) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/userassignedproject/` + id, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }).then((response) => {
      return Promise.resolve(response);
    });
  }

  getUserStatusLog(id, date,project_type,currentproject) {
   
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/usermultiplelog`, {
      method: "POST",
      headers: {
        authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
        date: date,
        project_type:project_type,
        currentproject:currentproject
      }),
    }).then((res) => {
      return Promise.resolve(res);
    });
  }
  getCalendarEmp(location,currentMonth) {
     var token = window.localStorage.getItem("id_token");
     return this.fetch(
       `${this.domain}/project/userstatuslog
       `,
       {
         method: "POST",
         headers: {
           Authorization: token,
           Accept: "application/json",
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
          location:location,
          month:currentMonth
         }),
       }
     ).then((response) => {
       return Promise.resolve(response);
     });
   }
  getTotalWorkingHours(){
   
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/project/getWorkingHours
      `,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    ).then((response) => {
      return Promise.resolve(response);
    });
  }
  getEmployeeReport(start_date,end_date,projectType,monthtype,currentproject) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/empReport`, {
      method: "POST",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date: start_date,
        end_date:end_date,
        monthType: monthtype,
        project_type:projectType,
        currentproject:currentproject
     
      }),
    }).then((response) => {
      return Promise.resolve(response);
    });
  }

  getRoleEmployeeList(role) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/users-role`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        role: role,
      }),
    }).then((res) => {
      return Promise.resolve(res);
    });
  }
  getProjectStatus() {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/project/getProjectStatus
      `,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    ).then((response) => {
      return Promise.resolve(response);
    });
  }
  getmonthlyholidaylist(location,month) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/holiday/list
      `,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          location: location,
          month:month
        })
      }
    ).then((response) => {
      return Promise.resolve(response);
    });

  }
  getResourceReport(name,under_traning,skills,specialization,project_name,nature_of_project,
    availability,hours_engaged,designation) {
    var token = window.localStorage.getItem("id_token");
    return this.fetch(`${this.domain}/project/resourcereport`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
       
      },
      body: JSON.stringify({
        name:name,
        under_traning:under_traning,
        skills:skills,
        specialization:specialization,
        project_id:project_name,
        nature_of_project:nature_of_project,       
        availability:availability,
        hours_engaged:hours_engaged,
        designation:designation
      })
     
    }).then((res) => {
      return Promise.resolve(res);
    });
  }
  getpastlogRequest(){
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/statusEmp/listapproval
      `,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    ).then((response) => {
      return Promise.resolve(response);
    });

  }
  approvePendingLog(status_id,user_id,status){
    var token = window.localStorage.getItem("id_token");
    return this.fetch(
      `${this.domain}/statusEmp/approvependinglogs
      `,
      {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status_id:status_id,
          user_id:user_id,
          status:status
        })
      }
    ).then((response) => {
      return Promise.resolve(response);
    });

  }
   //End TeqTracker All Servicess
}
