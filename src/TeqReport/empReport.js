import React, { Component } from 'react';
import AuthService from "../AuthService";
import Pagination from "react-js-pagination";
import { months } from 'moment';
import Loader from 'react-loader-spinner';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
const Auth = new AuthService();
const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
var dateHash = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11
};
var empProjetData =[];

class empReport extends Component {
    constructor() {
        super();
        this.state = {
            empReport: [],
            empWorkReport: [],
            todos: [],
            currentPage: 1,
            todosPerPage: 8,
            dataPerPage: [],
            count: 1,
            numbers: [],
            activePage: 1,
            month: "",
            loading: true,
            noDataFound: false,
            hrArr: [],
            empProjetData: [],
            hrRole: [],
            hr: "",
            location: '',
            locationchange: '',
            locationData: [],
            hr_name: "All"

        }
    }
    /* Start when Month Change Business Logic  */
    handleMonthChange = (event) => {
        var selectedMonth = event.currentTarget.value;
        var monthName;
        this.setState({
            monthName: selectedMonth,
            noDataFound: false,
        });
        var month = dateHash[selectedMonth];
        Auth.getEmployeeProjectReport(month).then(response => {
            response.monthlyRepo.sort((a, b) => new Date(a) < new Date(b) ? 1 : -1);
            this.setState({
                  empReport: response.monthlyRepo,
                  todos: response.monthlyRepo,
              })
            const { todos, currentPage, todosPerPage } = this.state;
            const indexOfLastTodo = currentPage * todosPerPage;
            const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
            const currentTodos = todos.slice(
                indexOfFirstTodo,
                indexOfLastTodo
            );
            var arr = [];
            const renderTodos = currentTodos.map((todo, index) => {
                // return <li key={index}>{todo}</li>;
                arr.push(todo);
                return arr;
            });
            this.setState({
                dataPerPage: arr,
                loading: false
            });
            const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
                pageNumbers.push(i);
            }
            this.setState({
                number: pageNumbers
            });
        })

    }
    /* End when Month Change Business Logic  */
    /* Start Pagination Business Logic */
    handleClick = number => {

        this.setState({
            activePage: number,
            currentPage: number
        });
        const indexOfLastTodo = number * this.state.todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
        this.setState({ count: indexOfFirstTodo + 1 });
        const currentTodos = this.state.todos.slice(
            indexOfFirstTodo,
            indexOfLastTodo
        );
        var arr = [];
        const renderTodos = currentTodos.map((todo, index) => {
            arr.push(todo);
            return arr;
        });
        this.setState({
            dataPerPage: arr
        });

    };
    /* End Pagination Business Logic */
    /* Start Main Business Logic when page load  */

    componentDidMount() {
        var x = new Date();
        var monthName = monthNames[x.getMonth()]
        var month = dateHash[monthName];
        var empWorkReport;
        this.setState({
            hrArr: [],
            month: month,
            monthName: monthName,
            empProjetData: [],
        })
        
        var token = window.localStorage.getItem("id_token");
        Auth.getUserData(token).then(response => {

            this.setState({
                userRole: response.user.role,
                userName: response.user.name
            });
        });

        Auth.getEmployeeProjectReport(month).then(response => {
        
            for (var i = 0; i < response.monthlyRepo.length; i++) {
               
                  if (response.monthlyRepo[i].name == this.state.userName) {
                    this.state.empProjetData.push(response.monthlyRepo[i]);
                  
                }
              }
            // response.monthlyRepo.sort((a, b) => new Date(a) < new Date(b) ? 1 : -1);
         
            this.setState({
                empReport: empProjetData,
                todos: empProjetData,
            })
            const { todos, currentPage, todosPerPage } = this.state;
            const indexOfLastTodo = currentPage * todosPerPage;
            const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
            const currentTodos = todos.slice(
                indexOfFirstTodo,
                indexOfLastTodo
            );
            var arr = [];
            const renderTodos = currentTodos.map((todo, index) => {
                // return <li key={index}>{todo}</li>;
                arr.push(todo);
                return arr;
            });
            this.setState({
                dataPerPage: arr,
                loading: false
            });
            const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
                pageNumbers.push(i);
            }
            this.setState({
                number: pageNumbers
            });
        })

    }
    /* End Main Business Logic when page load  */
    render() {
        return (<div className="page-content fade-in-up">
            <div className="ibox">
                <div className="ibox-head bg-tbl-header  color-white">
                    <div className="ibox-tools">
                        <div className="ibox-title bg-tbl-header  color-white">Report</div>
                    </div>
                    <div className="ibox-tools-filter">
                        <div className="form">
                            <div className="form-group leave-type-select">
                                <label></label>
                                <select
                                    ref="leave_type"
                                    className="form-control"
                                    onChange={this.handleMonthChange}
                                    value={this.state.monthName}>
                                    <option>January</option>
                                    <option>February</option>
                                    <option>March</option>
                                    <option>April</option>
                                    <option>May</option>
                                    <option>June</option>
                                    <option>July</option>
                                    <option>August</option>
                                    <option>September</option>
                                    <option>October</option>
                                    <option>November</option>
                                    <option>December</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ibox-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th className="tbl-date">Role</th>
                                    <th className="tbl-date">Project Name</th>
                                    <th className="tbl-date">Working Hours</th>
                                    <th className="tbl-date">Spend Hours</th>
                                    {/* <th className="tbl-date">Status</th>
                                    <th className="tbl-date">Hours</th> */}
                                    <th className="tbl-date">Date</th>
                                </tr>
                            </thead>
                            {this.state.noDataFound === true ? (
                                <tbody></tbody>
                            ) : (
                                    <tbody>
                                        {this.state.dataPerPage.map((item, index) => (
                                            <tr key={item._id} >
                                                <td className="tbl-date">{index + this.state.count}
                                                </td>
                                                <td className="tbl-date">{item.name}
                                                </td>
                                                <td className="tbl-date">{item.role}</td>
                                                <td className="tbl-date">{item.projectName}</td>
                                                <td className="tbl-date">{item.totalWorkingHours}</td>
                                                <td className="tbl-date">{item.workingHour}</td>
                                                <td className="tbl-date">{item.statusDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>

                                )}
                        </table>
                    </div>
                    {this.state.noDataFound === true ? (
                        ""
                    ) : (
                            <div className="mt-page">
                                <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={8}
                                    totalItemsCount={100}
                                    pageRangeDisplayed={3}
                                    onChange={this.handleClick}
                                    itemClass="page-item no-padding"
                                    linkClass="page-link"
                                    prevPageText="Previous"
                                    nextPageText="Next"
                                    totalItemsCount={this.state.empReport.length}
                                />
                            </div>
                        )}
                </div>
            </div>
            <div>
                <table className="table table-bordered table-hover leave-report" id="table-to-xls">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th className="tbl-date">Role</th>
                            <th className="tbl-date">Project Name</th>
                            <th className="tbl-date">Working Hours</th>
                            <th className="tbl-date">Spend Hours</th>
                            {/* <th className="tbl-date">Status</th>
                                    <th className="tbl-date">Hours</th> */}
                            <th className="tbl-date">Date</th>
                        </tr>
                    </thead>
                    {this.state.noDataFound === true ? (
                        <tbody></tbody>
                    ) : (
                            <tbody>
                                {this.state.todos.map((item, index) => (
                                    <tr key={item._id} >
                                        <td className="tbl-date">{index + this.state.count}
                                        </td>
                                        <td className="tbl-date">{item.name}
                                        </td>
                                        <td className="tbl-date">{item.role}</td>
                                        <td className="tbl-date">{item.projectName}</td>
                                        <td className="tbl-date">{item.statusDate}</td>
                                        <td className="tbl-date">{item.workingHour}</td>
                                        <td className="tbl-date">{item.statusDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                </table>
                {this.state.noDataFound === true ? (
                    ""
                ) : (
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="btn btn-primary btn-rounded"
                            table="table-to-xls"
                            filename={"Project_Report_" + this.state.monthName}
                            sheet="tablexls"
                            buttonText="Export Excel" />)}
            </div>

        </div >
        )
    }
}
export default empReport;