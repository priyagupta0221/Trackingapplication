import React, { Component } from 'react';
import CanvasJSReact from './assetscanvas/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Chart extends Component {
	render() {
		const options = {
			theme: "light2",
			animationEnabled: true,
			title: {
				text: ""
			},
			subtitles: [{
				text: ""
			}],
			axisY: {
				includeZero: false,
				prefix: ""
			},
			toolTip: {
				shared: true
			},
			data: [
				{
					type: "area",
					name: "GBP",
					showInLegend: true,
					xValueFormatString: "MMM YYYY",
					yValueFormatString: "₹#,##0.##",
					dataPoints: [
						{ x: new Date("2017- 01- 01"), y: 50.927 },
						{ x: new Date("2017- 02- 01"), y: 62.609 },
						{ x: new Date("2017- 03- 01"), y: 71.428 },
						{ x: new Date("2017- 04- 01"), y: 53.259 },
						{ x: new Date("2017- 05- 01"), y: 33.153 },
						{ x: new Date("2017- 06- 01"), y: 44.180 },
						{ x: new Date("2017- 07- 01"), y: 64.840 },
						{ x: new Date("2017- 08- 01"), y: 62.671 },
						{ x: new Date("2017- 09- 01"), y: 87.496 },
						{ x: new Date("2017- 10- 01"), y: 76.007 },
						{ x: new Date("2017- 11- 01"), y: 47.233 },
						{ x: new Date("2017- 12- 01"), y: 96.276 }
					]
				},
				{
					type: "area",
					name: "USD",
					showInLegend: true,
					xValueFormatString: "MMM YYYY",
					yValueFormatString: "₹#,##0.##",
					dataPoints: [
						{ x: new Date("2017- 01- 01"), y: 30.515 },
						{ x: new Date("2017- 02- 01"), y: 31.725 },
						{ x: new Date("2017- 03- 01"), y: 32.86 },
						{ x: new Date("2017- 04- 01"), y: 34.29 },
						{ x: new Date("2017- 05- 01"), y: 34.51 },
						{ x: new Date("2017- 06- 01"), y: 44.62 },
						{ x: new Date("2017- 07- 01"), y: 54.2 },
						{ x: new Date("2017- 08- 01"), y: 63.935 },
						{ x: new Date("2017- 09- 01"), y: 75.31 },
						{ x: new Date("2017- 10- 01"), y: 84.75 },
						{ x: new Date("2017- 11- 01"), y: 54.49 },
						{ x: new Date("2017- 12- 01"), y: 53.84 }
					]
				}
			]
		}

		return (
			<div>
				<h1>React Multi Series Area Chart</h1>
				<CanvasJSChart options={options}
				/* onRef={ref => this.chart = ref} */
				/>
				{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
			</div>
		);
	}
}

export default Chart;