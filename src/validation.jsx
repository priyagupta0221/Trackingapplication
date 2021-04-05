import React, { Component } from "react";


const handleValidation = value => {
    let errors = {};
    let formIsValid = true;

    //password
    if (value.hasOwnProperty("password")) {
        if (!value["password"]) {
            formIsValid = false;
            errors["password"] = "Please enter Password ";
        }
    }

    // if (typeof fields["name"] !== "undefined") {
    //   if (!fields["name"].match(/^[a-zA-Z]+$/)) {
    //     formIsValid = false;
    //     errors["name"] = "Only letters";
    //   }
    // }

    //Email

    if (value.hasOwnProperty("email")) {
        if (!value["email"]) {
            formIsValid = false;
            errors["email"] = "Please enter a valid Email";
        } else {
            if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test( value["email"])
            && (value["email"].endsWith(".com")||value["email"].endsWith(".in") ))
            {
                formIsValid = true;
            }
            else
            {
                formIsValid = false;
                errors["email"] = "Email is not valid";
            }
          /*  if (typeof value["email"] !== "") {
                let lastAtPos = value["email"].lastIndexOf("@");
                let lastDotPos = value["email"].lastIndexOf(".");

                if (
                    !(
                        lastAtPos < lastDotPos &&
                        lastAtPos > 0 &&
                        value["email"].indexOf("@@") == -1 &&
                        lastDotPos > 2 &&
                        value["email"].length - lastDotPos > 2
                    )
                ) {
                    formIsValid = false;
                    errors["email"] = "Email is not valid";
                }
            }*/
        }
    }
    //name
    //console.log(value.indexof("name"));
    if (value.hasOwnProperty("name")) {
        if (!value["name"]) {
            formIsValid = false;
            errors["name"] = "Cannot be empty";
        } else {
            if (typeof value["name"] !== "undefined") {
                if (!value["name"].match(/^[a-zA-Z ]+$/)) {
                    formIsValid = false;
                    errors["name"] = "Only letters";
                }
            }
        }
    }
    if (value.hasOwnProperty("project_type")) {
        if (!value["project_type"]) {
            formIsValid = false;
            errors["project_type"] = "Cannot be empty";
        } 
    }
    if (value.hasOwnProperty("user_name")) {
        if (!value["user_name"]) {
            formIsValid = false;
            errors["user_name"] = "Cannot be empty";
        } 
    }
     //password
     if (value.hasOwnProperty("role")) {
        if (!value["role"]) {
            formIsValid = false;
            errors["role"] = "Please enter role ";
        }
    }
    //contact
    // if (value.hasOwnProperty("role")) {
    //     if (!value["contact"]) {
    //         formIsValid = false;
    //         errors["contact"] = "Cannot be empty";
    //     }
    // }
    // else {
    //   if (typeof value["contact"] !== "undefined") {
    //     if (!value["contact"].match(/^[a-zA-Z]+$/)) {
    //       formIsValid = false;
    //       errors["contact"] = "Only letters";
    //     }
    //   }
    // }

    //otp
    if (value.hasOwnProperty("exp")) {
        if (!value["exp"]) {
            formIsValid = false;
            errors["exp"] = "Cannot be empty";
        }
    }
    if (value.hasOwnProperty("project_name")) {
        if (!value["project_name"]) {
            formIsValid = false;
            errors["project_name"] = "Cannot be empty";
        } else {
            if (typeof value["project_name"] !== "undefined") {
                if (!value["project_name"].match(/^[a-zA-Z ]+$/)) {
                    formIsValid = false;
                    errors["project_name"] = "Please enter valid Project Name";
                }
            }
        }
    }
    if (value.hasOwnProperty("projectname")) {
        if (!value["projectname"]) {
            formIsValid = false;
            errors["projectname"] = "Cannot be empty";
        } 
    }
    if (value.hasOwnProperty("log_hours")) {
        if (!value["log_hours"]) {
            formIsValid = false;
            errors["log_hours"] = "Cannot be empty";
        } else {
            if (typeof value["log_hours"] !== "undefined") {
                if (!value["log_hours"].match(/^[0-9]+([,.][0-9]+)?$/g)) {
                    formIsValid = false;
                    errors["log_hours"] = "Log hours must be only number";
                }
            }
            var x=value["log_hours"]-Math.floor( value["log_hours"] );
            if ( x!= 0.5 && x!=0 ) {
                    formIsValid = false;
                    errors["log_hours"] = "Put proper decimals";
                
            }
        }
    }
    if (value.hasOwnProperty("task_name")) {
        if (!value["task_name"]) {
            formIsValid = false;
            errors["task_name"] = "Cannot be empty";
        } 
    }
    //confirm password
    // if (value.hasOwnProperty("ConfirmPassword")) {
    //     if (!value["ConfirmPassword"]) {
    //         formIsValid = false;
    //         errors["confirmPassword"] = "Cannot be empty";
    //     }
    // }
    if (value.hasOwnProperty("start_date")) {
        debugger
        var start_date=value["start_date"]
        if (value.hasOwnProperty("end_date")){
            var end_date=value["end_date"]
        }
        if (start_date > end_date) {
            formIsValid = false;
            errors["start_date"] = "*Start date must be smaller than end date";}
    }    
    if (value.hasOwnProperty("DOJ")) {
        if (!value["DOJ"]) {
            formIsValid = false;
            errors["DOJ"] = "Please enter the Joining date ";
        }
    }

    errors["valid"] = formIsValid;

    //this.setState({ errors: errors });
    return errors;
};
export default handleValidation;
