import React, { Component } from "react";
import AuthService from "../AuthService";
import handleValidation from "../validation";
import withAuth from "../withAuth";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
  withRouter
} from "react-router-dom";
const Auth = new AuthService();
class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errorsdiv: false,
      errors: {},
      alertMessage: "",
      showAlert: false,
      danger: false
    };
  }

  handleSendMail = e => {
    e.preventDefault();
    let formData = {
      email: this.refs.email.value
    };
    let errors = handleValidation(formData);
    this.setState({ errors: errors });
    if (errors["valid"] == true) {
      Auth.sendmail(this.refs.email.value).then(response => {
        if (response.status == 200) {
          this.setState({
            alertMessage: response.message,
            show: true,
            danger: false,
            showAlert: true
          });
          this.refs.email.value = "";
          setTimeout(() => {
            this.setState({ alertMessage: "", showAlert: false });
          }, 6000);
        } else if (response.status == false) {
          this.setState({
            alertMessage: response.errors[0].msg,
            showAlert: true,
            danger: true
          });
          setTimeout(() => {
            this.setState({ alertMessage: "", showAlert: false });
          }, 4000);
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
        console.log(response);
      });
    } else {
      this.setState({ errorsdiv: true });
    }
  };
  // handleAlertClass() {
  //   let classes = "alertHeight ";
  //   classes += this.state.danger == true ? "alert-danger" : "alert-success";
  //   return classes;
  // }
  goBack = () => {
    this.props.history.push("/login");
    window.location.reload();
  };

  render() {
    return (
      <div className="login-background forget">
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
                <img src="./assets/img/logos/Teqleave.png" width="200" />
              </div>
            </div>
            <div className="card-body">
              <form>
                <div className="form-group">
                  <div className="input-group-icon login">
                    <div className="input-icon login">
                      <i className="fa fa-envelope"></i>
                    </div>
                    <input
                      className="form-control login"
                      type="email"
                      placeholder="Enter Your Email Address"
                      ref="email"
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
                  <button
                    className="btn btn-info btn-block "
                    type="button"
                    onClick={this.handleSendMail}
                  >
                    Send Mail
              </button>
                </div>

              </form>
            </div>
            <div className="card-footer login">
              <span className="back-to-login">
                Back to{" "}
                <Link to="/login">
                  <span onClick={this.goBack}>Login</span>
                </Link>
              </span>
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
export default withRouter(ForgetPassword);
