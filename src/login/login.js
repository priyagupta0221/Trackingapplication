import React, { Component } from "react";
import AuthService from "../AuthService";
import handleValidation from "../validation";
import * as index from "../index";
import withAuth from "../withAuth";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
  withRouter
} from "react-router-dom";
//const routes = new LoginRoutes();
//const routes = new index();

class Login extends Component {
  constructor() {
    super();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.Auth = new AuthService();
    this.state = {
      flag: 0,
      user: [],
      showAlert: false,
      alertMessage: "",
      danger: false,
      errorsdiv: false,
      errors: {}
    };
  }
  componentWillMount() {
    if (this.Auth.loggedIn()) {
      this.props.history.replace("/");
    } else {
      this.props.history.replace("/login");
    }
  }
  render() {
    return (
      <div className="login-background">
        {/* {this.state.showAlert == true ? (
          <div className="alert alert-danger alertpopup">
            <button className="close" onClick={this.handleAlert} aria-label="Close">×</button><strong></strong> {this.state.alertMessage}
          </div>) : ""} */}
        <div className="content content-login">

          <div id="login-form" className="card">
            <div className="card-header login">
              <div className="brand">
                <img src="./assets/img/logos/Teqleave.png" width="200" />
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={this.handleFormSubmit}>
                <div className="form-group">
                  <div className="input-group-icon login">
                    <div className="input-icon login">
                      <i className="fa fa-envelope"></i>
                    </div>
                    <input
                      className="form-control login"
                      onChange={this.handleChange}
                      type="email"
                      name="username"
                      placeholder="Email"
                      autocomplete="off"
                    />
                    {this.state.errorsdiv == true ? (
                      <span className="error">{this.state.errors["email"]}</span>
                    ) : (
                        ""
                      )}
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group-icon login">
                    <div className="input-icon login">
                      <i className="fa fa-lock font-16"></i>
                    </div>
                    <input
                      className="form-control login"
                      onChange={this.handleChange}
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                    {this.state.errorsdiv == true ? (
                      <span className="error">{this.state.errors["password"]}</span>
                    ) : (
                        ""
                      )}
                  </div>
                  {this.state.showAlert == true ? (
                    <div className="alertmessage">
                      {/* <button className="close" onClick={this.handleAlert} aria-label="Close">×</button><strong></strong> */}
                      {this.state.alertMessage}
                    </div>
                  ) : (
                      ""
                    )}
                </div>
                <div className="form-group">
                  <button className="btn btn-info btn-block login-button" type="submit">
                    Login
              </button>
                </div>
              </form>
            </div>
            <div className="card-footer login">
              <span onClick={() => index.getRoutes()}>
                <Link to="/forgetpassword">Forget Your Password ?</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
      // <div className="content content-login" >
      //   <form onSubmit={this.handleFormSubmit}>
      //     <div className="brand"><img src="./assets/img/logos/Teqleave.png" /></div>
      //     <div className="form-group">
      //       <div className="input-group-icon right">
      //         <div className="input-icon"><i className="fa fa-envelope"></i></div>
      //         <input className="form-control" onChange={this.handleChange} type="email" name="username" placeholder="Email" autocomplete="off" />
      //       </div>
      //     </div>
      //     <div className="form-group">
      //       <div className="input-group-icon right">
      //         <div className="input-icon"><i className="fa fa-lock font-16"></i></div>
      //         <input className="form-control" onChange={this.handleChange} type="password" name="password" placeholder="Password" />
      //       </div>
      //     </div>
      //     <div className="form-group">
      //       <button className="btn btn-info btn-block" type="submit">Login</button>
      //     </div>
      //   </form>
      // </div>
    );
  }
  // getLoginClasses() {
  //     //;
  //     let classes = "maindiv ";
  //     classes += this.state.flag === 1 ? "hide" : "unhide";
  //     return classes;
  //   }
  //   getCrudClasses() {
  //     let classes = "App ";
  //     classes += this.state.flag === 0 ? "hide" : "unhide";
  //     return classes;
  //   }
  handleAlertClass() {
    let classes = "alertHeight ";
    classes += this.state.danger == true ? "alert-danger" : "alert-success";
    return classes;
  }
  handleFormSubmit(e) {
    e.preventDefault();
    let formData = {
      email: this.state.username,
      password: this.state.password
    };
    let errors = handleValidation(formData);
    this.setState({ errors: errors });
    if (errors["valid"] == true) {
      this.Auth.login(this.state.username, this.state.password)
        .then(res => {
          if (res.success == false) {
            this.setState({
              alertMessage: "Invalid Username or Password !",
              showAlert: true,
              danger: true
            });
            setTimeout(() => {
              this.setState({ alertMessage: "", showAlert: false });
            }, 4000);
          } else if (res.message == "User is inactive") {
            this.setState({
              alertMessage: "User has been deleted!",
              showAlert: true,
              danger: true
            });
            setTimeout(() => {
              this.setState({ alertMessage: "", showAlert: false });
            }, 4000);
          } else if (res.message == "User not found") {
            this.setState({
              alertMessage: "User not found..",
              showAlert: true,
              danger: true
            });
            setTimeout(() => {
              this.setState({ alertMessage: "", showAlert: false });
            }, 4000);
          } else if (
            res.success == true &&
            res.message == "logged in successfully"
          ) {
            this.props.history.replace("/dashboard");
            this.Auth.getHolidayList(res.user.location).then(response => {
              localStorage.setItem("dayArray", JSON.stringify(response.holidays));
            });
            window.location.reload();
            var dayArray;

          }
        })
        .catch(err => {
          alert(err);
        });
    } else {
      this.setState({ errorsdiv: true });
    }
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleAlert = () => {
    this.setState({ showAlert: false, alertMessage: "" });
  };
}
export default withRouter(Login);
