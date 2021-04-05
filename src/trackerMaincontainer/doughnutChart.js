import React, { Component } from "react";
import CanvasJSReact from "./canvasjs.react";
import AuthService from "../AuthService";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const Auth = new AuthService();
export default class AttendanceChart extends Component {
  constructor() {
    super();
    this.state = {
      options: [],
      progress: [],
      completed: [],
      hold: [],
    };
  }
  componentDidMount() {
    Auth.getProjectStatus().then((response) => {
      if (response.status == 200) {
        this.setState({
          progress: response.projectstatus.data[0].y,
          completed: response.projectstatus.data[1].y,
          hold: response.projectstatus.data[2].y,
        });
      }
    });
  }
  render() {
    const options = {
    //  title: {
   //     text: "Project Statistics",
   //   },
     animationEnabled: true,
      

      data: [
        {
          type: "doughnut",

        //  indexLabel: "{name}: {y}",

          dataPoints: [
            { name: " Progress ", y: this.state.progress },
            { name: " Hold", y: this.state.hold },
            { name: " Completed", y: this.state.completed },
          ],
        },
      ],
    };
    return (
      <div>
        <CanvasJSChart options={options} />
      </div>
    );
  }
}
