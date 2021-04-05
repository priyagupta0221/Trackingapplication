import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  Link,
  withRouter,
  Redirect
} from "react-router-dom";
import "./index.css";
import App from "./App";
import Login from "./login/login";
import ForgetPassword from "./login/forgetpassword";
import PasswordChange from "./login/passwordrecovery";
import LandingPage from "./maincontainer/LandingPage";
import AppDashboard from ".//trackerMaincontainer/TeqAppDashboard";
import * as serviceWorker from "./serviceWorker";
import AuthService from "./AuthService";
import Maincontainer from "./maincontainer/Maincontainer";
import NotFound from "./login/notFound";
// const Auth = new AuthService("http://10.2.0.232:9999/");

// const Last =  useLastLocation();

const Auth = new AuthService();
var headerContent;
var isResetPass = false;
var forgotPage;
var jwt = require("jsonwebtoken");
var token = window.location.pathname.slice(0, 15);

// Root() {
// constructor(props){
// super(props)
// //this.handleView =this.handleView.bind(this);
// this.getRoutes = this.getRoutes.bind(this);
// this.toggleView = this.toggleView.bind(this);
// }

// handleView (){

// }
export function getRoutes() {
  // this.setState({
  // routes:true
  // })
  isResetPass = true;
  forgotPage = toggleView(isResetPass);

  ReactDOM.render(
    <Router>
      <Switch>
        <div>
          <Route path={"/"} exact component={App} />
          {/* <Route path={"/forgetpassword"} component={ForgetPassword} /> */}
          {/* <Route path={"/login"} component={Login} /> */}
          {/* <Route exact path={"/dashboard"} component={Maincontainer} /> */}
          {forgotPage}
        </div>
      </Switch>
    </Router>,
    document.getElementById("root")
  );
}
// }
function toggleView(isResetPassbool) {
  if (isResetPassbool || window.location.pathname == "/forgetpassword") {
    headerContent = <ForgetPassword />;
    return headerContent;
  } else if (token == "/passwordchange") {
    headerContent = <PasswordChange />;
    token = "";
    return headerContent;
  } else {
    headerContent = <Login />;
    return headerContent;
  }
}

if (!Auth.loggedIn()) {
  // console.log(isResetPass);
  var x = toggleView(false);
  headerContent = x;
  // var loc = this.props.location.pathname;
} else {
  headerContent = <App />;
}

ReactDOM.render(
  <Router>
    <Switch>
      <div>
        <Route path={"/"} exact component={App} />
        {/* <Route path={"/forgetpassword"} component={ForgetPassword} /> */}
        {/* <Route path={"/login"} component={Login} /> */}
        {/* <Route exact path={"/dashboard"} component={Maincontainer} /> */}
        {headerContent}
      </div>
    </Switch>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
