import React, { Component } from "react";
import addDays from "date-fns/addDays";
import FullCalendar from "fullcalendar-reactwrapper";
import AuthService from "../AuthService";
const Auth = new AuthService();
var eventlist=[];
class TeqCalendar extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      defaultdate: new Date(),
      events: {},
    };
  }

  dateConvert(date) {
    var datearray = date.split("-");
    var newdate = datearray[2] + "-" + datearray[1] + "-" + datearray[0];
    return newdate;
  }

  componentDidMount() {
    eventlist=[];
    this.setState({ danger: false, showAlert: false });
    var token = window.localStorage.getItem("id_token");
 
    Auth.getUserData(token).then(response => {
      debugger
      this.setState({
        userRole: response.user.role,
        data: response.user
      });
      this.getworklogs(response.user.location);
    //  this.getholidaylistcalendar(response.user.location,eventlist);
    });
  }
  getworklogs=(location)=>{
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth()+1;
    Auth.getCalendarEmp(location,currentMonth).then((response) => {
     debugger
   var  len=response.events.length
      for (var i = 0; i < response.events.length-1; i++) {

        var tempObj = response.events[i];

        tempObj.date = this.dateConvert(tempObj.date);

        eventlist.push(tempObj);
        // console.log(JSON.stringify(tempObj) + ' --- '+JSON.stringify(response.events[i]));
      }
      var holidays=response.events[len-1]. holidays_li
       if(holidays.length>1){
      for (var i = 0; i < holidays.length-1; i++) {
        var obj={}
        // var name=response.holidays_li[i].name;
       //  var date=response.holidays_li[i].date;
       obj["title"]=holidays[i].name;
       obj["date"]=holidays[i].date.split("T")[0];
        
        
         eventlist.push(obj);

      }}
    //  debugger
      this.setState({
        events: eventlist,
      });
   // eventlist.push( response.events);
    });
    

  }

  render() {
    return (
      <FullCalendar
        id="your-custom-ID"
        header={{
          left: "prev,next today myCustomButton",
          center: "title",
          right: "month,basicWeek,basicDay",
        }}
        defaultDate={this.state.defaultdate}
        navLinks={true} // can click day/week names to navigate views
        editable={false}
        eventLimit={true} // allow "more" link when too many events
        events={this.state.events}
      />
    );
  }
}

export default TeqCalendar;
