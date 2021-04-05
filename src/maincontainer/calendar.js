import React, { Component } from 'react';
import addDays from "date-fns/addDays";
import endOfMonth from "date-fns/endOfMonth";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import dfIsSameMonth from "date-fns/isSameMonth";
import { subDays } from "date-fns/esm";
import isWithinInterval from "date-fns/isWithinInterval";
import Axios from 'axios';
import FullCalendar from 'fullcalendar-reactwrapper';
import AuthService from "../AuthService";
const Auth = new AuthService();

class Calendar extends Component {
    constructor(){
        super();
        this.state = {
          items:[],
            defaultdate: new Date(),
            events:[]
            }
      }

      getEndDateForEvents(endDate)
      {
        var dt = new Date(endDate);
        
        var nextDay = addDays(dt,1);
        var mm = nextDay.getMonth() + 1;
        var dd = nextDay.getDate().toString().length === 2 ? nextDay.getDate().toString() : '0'+nextDay.getDate().toString();
        mm = mm.toString().length === 2 ? mm.toString() : '0'+mm.toString();
        var yyyy = nextDay.getFullYear().toString();
        return (yyyy+'-'+mm+'-'+dd);
      }

      componentDidMount(){
        
        var events1 =[];
        this.setState({ danger: false, showAlert: false })
        Auth.getCalendar().then(response => {
          
          
            for( var i=0;i< response.events.length;i++){
               var tempObj = response.events[i];
               if (tempObj.start !== tempObj.end)
               {
                 tempObj.end = this.getEndDateForEvents(tempObj.end);
               }
              // events1.push(tempObj);
              // console.log(JSON.stringify(tempObj) + ' --- '+JSON.stringify(response.events[i]));
            }
            

            this.setState({
              events:response.events
             })
        });
        
      }
    render() { 
        return ( 
<FullCalendar
             id = "your-custom-ID"
         header = {{
            left: 'prev,next today myCustomButton',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        }}
         defaultDate={this.state.defaultdate}
        navLinks= {true} // can click day/week names to navigate views
        editable= {false}
        eventLimit= {true} // allow "more" link when too many events
        events = {this.state.events}	
    />
         );
    }
}
 
export default Calendar;