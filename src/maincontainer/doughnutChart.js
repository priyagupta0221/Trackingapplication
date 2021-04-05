import React, { Component } from "react";
import CanvasJSReact from "./assetscanvas/canvasjs.react";
import AuthService from "../AuthService";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const Auth = new AuthService();
export default class AttendanceChart extends Component {
  constructor() {
    super();
    this.state = {
      options: [],
      defaultdate: new Date(),
      absent: [],
      present: []
    };
  }
  componentDidMount() {
    Auth.getAttendance().then(response => {
      if (response.status == 200) {
        this.setState({
          absent: response.attendance.data[0].y,
          present: response.attendance.data[1].y
        });
      }
    });
  }
  render() {
    const options = {
      animationEnabled: true,
      //   title: {
      //     text: "Customer Satisfaction"
      //   },
      // subtitles: [{
      // 	text: "71% Positive",
      // 	verticalAlign: "center",
      // 	fontSize: 24,
      // 	dockInsidePlotArea: true
      // }],
      data: [
        {
          type: "doughnut",
          // showInLegend: true,
          indexLabel: "{name}: {y}",
          yValueFormatString: "#,###",
          dataPoints: [
            { name: "Absent", y: this.state.absent },
            { name: "Present", y: this.state.present }
          ]
        }
      ]
    };
    return (
      <div>
        <CanvasJSChart options={options} />
      </div>
    );
  }
}
