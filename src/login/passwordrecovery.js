import React, { Component } from "react";
import * as index from "../index";
import AuthService from "../AuthService";
import handleValidation from "../validation";
import withAuth from "../withAuth";
import queryString from 'query-string';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
  withRouter,
  useParams
} from "react-router-dom";
import { invalid } from "moment";
const Auth = new AuthService();
class PasswordChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorsdiv: false,
      errors: {},
      alertMessage: "",
      showAlert: false,
      danger: false
    };
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  componentDidMount() {
    try {
      var authtokenurl;
      var jwt = require("jsonwebtoken");
      var Cryptr = require('cryptr');
      const cryptr = new Cryptr('myTotalySecretKey');
      var params = queryString.parse(window.location.search);
      var  urlwithkey= window.location.pathname;
      var tokenlength = params.key;
      var authtokenurl = tokenlength.split("toke", 2);
       var emailname = cryptr.decrypt(authtokenurl[1]);
      this.setState({
        email: emailname,
      });
    } catch (exception) {     
      this.setState({
        showAlert: true,
        danger: true,
        alertMessage: "Invalid URL"
      });
      setTimeout(() => {
        this.setState({ alertMessage: "", showAlert: false });
      }, 4000);
    }
  }
  handleChangePassword = e => {
    e.preventDefault();
    let formData = {
      password: this.refs.password.value
    };
    let errors = handleValidation(formData);
    this.setState({ errors: errors });
    if (errors["valid"] == true) {
      if (this.refs.password.value.length < 8) {
        this.setState({
          showAlert: true,
          danger: true,
          alertMessage: "Password must contain more than 8 character"
        });
        setTimeout(() => {
          this.setState({ alertMessage: "", showAlert: false });
        }, 4000);
      } else {
        Auth.changepassword(this.state.email, this.refs.password.value).then(
          response => {
            if (response.status == 200) {
              // this.setState({
              //   alertMessage: response.message,
              //   show: true,
              //   danger: false,
              //   showAlert: true
              // });
              document.getElementById("success").style.display = "block";
              document.getElementById("success").style.opacity = 10;
              this.refs.password.value = "";
              // setTimeout(() => {
              //   this.setState({ alertMessage: "", showAlert: false });
              // }, 10000);
            } else {
              this.setState({
                alertMessage: response.message,
                danger: true,
                showAlert: true
              });
              setTimeout(() => {
                this.setState({ alertMessage: "", showAlert: false });
              }, 4000);
            }
          }
        );
      }
    } else {
      this.setState({ errorsdiv: true });
    }
  };
  closeModal = () => {
    document.getElementById("success").style.display = "none";
    document.getElementById("success").style.opacity = 0;
  };
  clickLogin = () => {
    this.props.history.push("/login");
    window.location.reload();
  };
  render() {
    return (
      <div className="login-background recovery">
        <div className="modal" id="success" data-backdrop="static">
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
                <h3 className="text-center">
                  Password has changed successfully!
                </h3>
              </div>
              <div className="modal-footer appr-center">
                <div>
                  <button
                    className="btn btn-danger btn-rounded"
                    data-dismiss="modal"
                    onClick={this.closeModal}
                  >
                    Cancel
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-success  btn-rounded"
                    data-dismiss="modal"
                    onClick={this.clickLogin}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.showAlert == true ? (
          <div className={this.handleAlertClass()}>
            <button
              className="close"
              onClick={this.handleAlert}
              aria-label="Close"
            >
              ×
            </button>
            <strong>{this.state.alertMessage}</strong>
          </div>
        ) : (
            ""
          )}
        <div className="content content-login">
          <div id="login-form" className="card">
            <div className="card-header login">
              <div className="brand">
                <img src="/assets/img/logos/Teqleave.png" width="200" />
              </div>
            </div>
            <div className="card-body">
              <form>
                <div className="form-group">
                  <div className="input-group-icon login">
                    <div className="input-icon login">
                      <i className="fa fa-lock font-16"></i>
                    </div>
                    <input
                      className="form-control login"
                      type="password"
                      ref="password"
                      pattern=".{6,}"
                      title="Eight or more characters"
                      placeholder="Enter New Password"
                    />
                    {this.state.errorsdiv == true ? (
                      <span className="error">{this.state.errors["password"]}</span>
                    ) : (
                        ""
                      )}
                  </div>
                </div>

                <div className="form-group">
                  <button
                    className="btn btn-info  btn-block"
                    type="button"
                    onClick={this.handleChangePassword}
                  >
                    Submit
              </button>
                </div>
              </form>
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

  handleAlert = () => {
    this.setState({ showAlert: false, alertMessage: "" });
  };
}

export default withRouter(PasswordChange);
