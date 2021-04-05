import React, { Component } from "react";
import AuthService from "./AuthService";
import LandingPage from "./maincontainer/LandingPage";
export default function withAuth(AuthComponent) {
 // const Auth = new AuthService("http://13.90.102.153/");
  const Auth = new AuthService("http://localhost:9999");
  return class AuthWrapped extends Component {
    constructor() {
    
      super();
      this.state = {
        user: null
      };
    }

    componentWillMount() {
      if (!Auth.loggedIn()) {
        var loc = this.props.location.pathname;
       this.props.history.replace("/login");
      } else {
        try {
          var x = window.location.pathname.split('/');
          if (x.length >4)
        {
            x[1]='notfound';
            var finalURL = x.slice(0,2).join('/');
            window.location = window.location.protocol+'//'+window.location.host + finalURL;
        }   
         
          if(this.props.location.pathname=="/" || this.props.location.pathname=="/login"){
            this.props.history.push("/dashboard");
            var str = this.props.location.pathname;
            var results = str.match("/");
          var a = this.props.location;
          }
          // else if(lastChar=="/"){
          //   str.lastChar('/', '');
          // }
          else{
            
            this.props.history.push(this.props.location);
          }
           
          const profile = Auth.getProfile();
          this.setState({
            user: profile
          });
        } catch (err) {
          Auth.logout();
          this.props.history.replace("/login");
          
        }
      }
    }
    render() {
      
      if (this.state.user) {
       
        return (
          
           <AuthComponent history={this.props.history} user={this.state.user} />
        );
      } else {
        return null;
      }
    }
  };
}
