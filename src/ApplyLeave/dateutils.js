import addDays from "date-fns/addDays";
import endOfMonth from "date-fns/endOfMonth";
import decode from "jwt-decode";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import dfIsSameMonth from "date-fns/isSameMonth";
import { subDays } from "date-fns/esm";
import isWithinInterval from "date-fns/isWithinInterval";
import Axios from 'axios';
import AuthService from "../AuthService";
const Auth = new AuthService();
export function excludePublicHolidaysDays() {
  var x = []
  var token = localStorage.getItem("id_token")
  var decodetoken = decode(token);
  var userlocation = decodetoken.location
  var holidaylist = JSON.parse(localStorage.getItem("dayArray"));
  var tempHolidaysList = [];
  if (holidaylist != undefined) {
    for (var i = 0; i < holidaylist.length; i++) {
      holidaylist[i].date = holidaylist[i].date
        .toString()
        .substring(0, 10);
    }
    for (var j = 0; j < holidaylist.length; j++) {
      if (userlocation == holidaylist[j].location) {
        var date = new Date(holidaylist[j].date);
        date.setDate(date.getDate(date) + 1)
        console.log("date" + date);        
        tempHolidaysList.push(date);
      }
      x = tempHolidaysList
    }
  }
  return x;
}
export function excludeEvenSaturdaysAndSundays() {
  var monthStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  var endDate = endOfMonth(new Date(new Date().getFullYear(), new Date().getMonth() + 3, 1));
  var saturdays = [];
  var sundays = [];
  var differenceInDays = differenceInCalendarDays(endDate, monthStartDate);
  var tempNumber = 0;
  for (var i = 0; i <= differenceInDays; i++) {
    var tempDate = addDays(monthStartDate, i);
    var X_1_dayBeforeDate = subDays(tempDate, 1);
    tempNumber = !dfIsSameMonth(tempDate, X_1_dayBeforeDate) ? 0 : tempNumber;

    if (tempDate.getDay() === 6) {
      tempNumber++;
      if (tempNumber % 2 === 0) saturdays.push(tempDate);
    }
    else if (tempDate.getDay() === 0) {
      sundays.push(tempDate);
    }
  }
  return saturdays.concat(sundays);
}
export function excludeAllSaturdaysAndSundays() {
  var monthStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  var endDate = endOfMonth(new Date(new Date().getFullYear(), new Date().getMonth() + 3, 1));
  var allSaturdaysSundays = [];
  var differenceInDays = differenceInCalendarDays(endDate, monthStartDate);
  for (var i = 0; i <= differenceInDays; i++) {
    var tempDate = addDays(monthStartDate, i);

    if (tempDate.getDay() === 6 || tempDate.getDay() === 0) allSaturdaysSundays.push(tempDate);
  }
  return excludePublicHolidaysDays().concat(allSaturdaysSundays);
}

export function combinedDays() {
  var x = excludePublicHolidaysDays().concat(excludeEvenSaturdaysAndSundays());
  return x;
}

export function combinedDaysWithEvenSaturdaysAndSundays() {
  var x = excludePublicHolidaysDays().concat(excludeEvenSaturdaysAndSundays());
  return x;
}

export function combinedDaysWithexcludeAllSaturdaysAndSundays() {
  var x = excludePublicHolidaysDays().concat(excludeAllSaturdaysAndSundays());
  return x;
}

export function days60FromToday() {
  return addDays(new Date(), 120);
}
export function isDayInRange(day, startDate, endDate) {
  let valid;
  try {
    valid = isWithinInterval(day, { start: startDate, end: endDate });
  } catch (err) {
    valid = false;
  }
  return valid;
}
export function numOfEvenSatAndSundaysInThisRange(startDate, endDate) {
  let numOfDays = 0;
  var tempVar = excludeEvenSaturdaysAndSundays();
  try {
    for (var i = 0; i < tempVar.length; i++) {
      if (tempVar[i] > startDate && tempVar[i] < endDate) {
        numOfDays++;
      }
    }
  } catch (err) {
    numOfDays = 0;
  }
  return numOfDays;
}
export function numOfPublicHolidaysInThisRange(startDate, endDate) {
  let numOfDays = 0;
  var tempVar = excludePublicHolidaysDays();
  try {
    for (var i = 0; i < tempVar.length; i++) {
      if (tempVar[i] > startDate && tempVar[i] < endDate) {
        numOfDays++;
      }
    }
  } catch (err) {
    numOfDays = 0;
  }
  return numOfDays;
}
export function numOfAllSatAndSundaysInThisRange(startDate, endDate) {
  let numOfDays = 0;
  var differenceInDays = differenceInCalendarDays(endDate, startDate);
  try {
    for (var i = 0; i <= differenceInDays; i++) {
      var tempDate = addDays(startDate, i);
      if (tempDate.getDay() === 6 || tempDate.getDay() === 0) numOfDays++;
    }
  } catch (err) {
    numOfDays = 0;
  }
  return numOfDays;
}