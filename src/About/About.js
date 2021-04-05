import React, { Component } from "react";
import ModalWindow from "../modal/ModalWindow";

var sick_leave_bg = {
  backgroundImage: "url(" + "./assets/img/sick_leave_bg.jpg" + ")",
  backgroundSize: "cover",
  position: "relative",
  width: "100%"
};
var casual_leave = {
  backgroundImage: "url(" + "./assets/img/casual_leave_bg.jpg" + ")",
  backgroundSize: "cover",
  position: "relative",
  width: "100%",
};
var birthday_leave = {
  backgroundImage: "url(" + "./assets/img/birthday_leave_bg.jpg" + ")",
  backgroundSize: "cover",
  position: "relative",
  width: "100%",
};
var privileged_leave = {
  backgroundImage: "url(" + "./assets/img/privilged_leave_bg.jpg" + ")",
  backgroundSize: "cover",
  position: "relative",
  width: "100%",
};
var work_from_home = {
  backgroundImage: "url(" + "./assets/img/teqleave_work_from_home.jpg" + ")",
  backgroundSize: "cover",
  position: "relative",
  width: "100%",
};
var teqleave_compoff = {
  backgroundImage: "url(" + "./assets/img/teqleave_compoff.jpg" + ")",
  backgroundSize: "cover",
  position: "relative",
  width: "100%",
};
export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    var dashEmpabout = document.getElementById("dashNotabout");
    dashEmpabout.classList.add("active");
  }
  render() {
    return (
      // <div className="page-content fade-in-up bg-gradient">
      <div className="page-content fade-in-up">
        {/* <div className="about-content"> */}
        <div className="">
          {/* <div className="text-center text-white mx-auto about-txt"><p className="mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tempus sed lectus a sodales.</p></div> */}

          <div className="about-mt">
            {/* <div className="about-mt"> */}
            <div className="col-md-5">
              <div className="ibox about-ibox">
                <div className="ibox-head about-head about-head-casual">
                  <div className="boxleave-box plane">
                    <i className="fa fa-plane plane-font-about"></i>
                  </div>
                  <div className="ibox-title head-col about-head-title">
                    Casual Leave
                  </div>
                </div>
                <div
                  className="ibox-body about-page casual-card"
                  style={casual_leave}
                >
                  <div className="about-bg-col">
                    Casual Leave(CL) are granted for certain unforeseen situation or where you are require to go for one or two days leaves to attend to personal matters. In case of casual leave normally company's strict maximum to 3 days in a month.
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="ibox about-ibox">
                <div className="ibox-head about-head about-head-sick">
                  <div className="boxleave-box plane">
                    <i className="fa fa-ambulance ambulance-font-about"></i>
                  </div>
                  <div className="ibox-title head-col about-head-title">
                    Sick Leave
                  </div>
                </div>
                <div
                  className="ibox-body about-page casual-card"
                  style={sick_leave_bg}
                >
                  <div className="about-bg-sick">
                    {" "}
                    Sick leave may be used for your own illness or
                    medical/dental appointments or for the illness or
                    medical/dental appointments of family members. Sick leave
                    can also be used to address the psychological, physical, or
                    legal aspects of domestic violence, sexual assault,
                    stalking, or other crime. You may not use sick leave for
                    vacation purposes.
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="ibox about-ibox">
                <div className="ibox-head about-head about-head-birthday">
                  <div className="boxleave-box plane">
                    <i className="fa fa-birthday-cake birthday-font-about"></i>
                  </div>
                  <div className="ibox-title head-col about-head-title">
                    Birthday Leave
                  </div>
                </div>
                <div
                  className="ibox-body about-page birthday-card"
                  style={birthday_leave}
                >
                  <div className="about-bg-col-birthday">
                    Employees are entitled to take one day leave with pay in the celebration of their birthday.Birthday leave is to be taken in full day increments, employees cannot take half day leave on their birthday.This leave can be taken on the birth date only.
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="ibox about-ibox">
                <div className="ibox-head about-head bg-warning">
                  <div className="boxleave-box plane">
                    <i className="fa fa-retweet privileged-font-about"></i>
                  </div>
                  <div className="ibox-title head-col about-head-title">
                    Privileged Leave
                  </div>
                </div>
                <div
                  className="ibox-body about-page birthday-card"
                  style={privileged_leave}
                >
                  <div className="about-bg-col-birthday">
                    Privileged Leave is additional 5 days paid leave for employees who have completed minimum 3 years and above in Teqfocus for travel or relaxation purpose. Eligible employees can avail it only once a year for maximum 5 days and need to apply atleast 21 days before to take this leave.                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="ibox about-ibox">
                <div className="ibox-head about-head bg-warning">
                  <div className="boxleave-box plane">
                    <i className="fa fa-laptop privileged-font-about"></i>
                  </div>
                  <div className="ibox-title head-col about-head-title">
                    Work From Home
                  </div>
                </div>
                <div
                  className="ibox-body about-page birthday-card"
                  style={work_from_home}
                >
                  <div className="about-bg-col-birthday">
                    Employees are eligible for work from home only when they are having some unavoidable situation at home or physically not fit to come to office. However, employees with infant child upto 2 years are eligible for 1 WFH every week. The mandatory criteria for work from home is proper power back and broadband connection. Please note, one will be able to Apply for Work From Home only if he/she has met all criteria.    </div>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="ibox about-ibox">
                <div className="ibox-head about-head bg-warning">
                  <div className="boxleave-box plane">
                    <i className="fa fa-clock-o privileged-font-about comoOff"></i>
                  </div>
                  <div className="ibox-title head-col about-head-title">
                    Compensatory Off
                  </div>
                </div>
                <div
                  className="ibox-body about-page birthday-card"
                  style={teqleave_compoff}
                >
                  <div className="about-bg-col-birthday">
                    It is an entitled leave that an employee can take on a working day as compensation for working at employers request on a holiday/weekend/non working hours. Please note that one will be able to Apply for a Compensatory Off only if he/she has met all criteria to get a credit of Compensatory Off. Compensatory leave has to be taken as a leave and it doesn't qualify for leave encashment.
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
