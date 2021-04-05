import React, { Component } from 'react';
import AuthService from "./AuthService";
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
class ChartPage extends Component {
    constructor() {
        super();
        this.handleHrTypeOption = this.handleHrTypeOption.bind(this);
        this.state = {
            leavereport: [],
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
            hrRole: [],
            hr: "",
            location: '',
            locationchange: '',
            locationData: [],
            hr_name: "All"

        }
    }
    /* Start Search functionality Business Logic  */
    // handleSearch = e => {
    //     let indexOfFirstTodo = 0;
    //     var x = e.target.value;
    //     Auth.getLeaveReport(x).then(response => {
    //         if (response.users != undefined) {
    //             this.setState({
    //                 todos: response.users,
    //                 loading: false
    //             });
    //             const { todos, currentPage, todosPerPage } = this.state;
    //             const indexOfLastTodo = currentPage * todosPerPage;
    //             if (x != "") {
    //                 indexOfFirstTodo = 0;
    //             } else {
    //                 indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
    //             }
    //             this.setState({ count: indexOfFirstTodo + 1 });
    //             const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    //             var arr = [];
    //             const renderTodos = currentTodos.map((todo, index) => {
    //                 arr.push(todo);
    //                 return arr;
    //             });
    //             this.setState({
    //                 dataPerPage: arr
    //             });

    //             const pageNumbers = [];
    //             for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
    //                 pageNumbers.push(i);
    //             }
    //             this.setState({
    //                 numbers: pageNumbers
    //             });
    //         }
    //     });
    // };
    /* End Search functionality Business Logic  */

    /* Start when Month Change Business Logic  */
    handleMonthChange = (event) => {

        var selectedMonth = event.currentTarget.value;
        this.setState({
            month: selectedMonth,
            noDataFound: false,
            hr: "Filter",
            hr_name: "Filter",
        });
        var month = dateHash[selectedMonth];
        Auth.getMonthReport(month).then(response => {
            if (response.monthlyRepo.length === 0 && response.activeUsername.length === 0) {

                this.setState({
                    noDataFound: true
                });
            } else {

                this.setState({
                    noDataFound: false
                });
                if (response.activeUsername.length != 0) {

                    for (var i = 0; i < response.activeUsername.length; i++) {
                        var casual = response.activeUsername[i].balance[0].casual_balance;
                        var sick = response.activeUsername[i].balance[0].sick_balance;
                        if (casual < 0) {
                            response.activeUsername[i].balance[0].casual_balance = response.activeUsername[i].balance[0].casual_balance;
                        }
                        else {
                            response.activeUsername[i].balance[0].casual_balance = 0
                        }
                        if (sick < 0) {
                            response.activeUsername[i].balance[0].sick_balance = response.activeUsername[i].balance[0].sick_balance;
                        }
                        else {
                            response.activeUsername[i].balance[0].sick_balance = 0
                        }
                        // if (compoOff < 0) {
                        //     response.activeUsername[i].balance[0].sick_balance = response.activeUsername[i].balance[0].sick_balance;
                        // }
                        // else {
                        //     response.activeUsername[i].balance[0].sick_balance = 0
                        // }
                    }
                    this.setState({
                        todos: response.activeUsername,
                        leavereport: response.activeUsername,
                    })
                }
                else {
                    this.setState({
                        noDataFound: false
                    });
                    for (var i = 0; i < response.monthlyRepo[0].balance_record.length; i++) {
                        var casual = response.monthlyRepo[0].balance_record[i].balance[0].casual_balance;
                        var sick = response.monthlyRepo[0].balance_record[i].balance[0].sick_balance;
                        if (casual < 0) {
                            response.monthlyRepo[0].balance_record[i].balance[0].casual_balance = response.monthlyRepo[0].balance_record[i].balance[0].casual_balance;
                        }
                        else {
                            response.monthlyRepo[0].balance_record[i].balance[0].casual_balance = 0
                        }
                        if (sick < 0) {
                            response.monthlyRepo[0].balance_record[i].balance[0].sick_balance = response.monthlyRepo[0].balance_record[i].balance[0].sick_balance;
                        }
                        else {
                            response.monthlyRepo[0].balance_record[i].balance[0].sick_balance = 0
                        }
                    }

                    this.state.todos = [];
                    this.setState({
                        todos: response.monthlyRepo[0].balance_record,
                        leavereport: response.monthlyRepo[0].balance_record,
                    })
                }
                const { todos, currentPage, todosPerPage } = this.state;
                const indexOfLastTodo = currentPage * todosPerPage;
                const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
                const currentTodos = todos.slice(
                    indexOfFirstTodo,
                    indexOfLastTodo
                );
                var arr = [];
                const renderTodos = currentTodos.map((todo, index) => {
                    //  return <li key={index}>{todo}</li>;
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
            }
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
        var month = monthNames[x.getMonth()]
        var dashNotleavereportAdmin = document.getElementById("dashNotleavereport");
        dashNotleavereportAdmin.classList.add("active");
        //  document.getElementsByClassName("myform").reset();
        this.setState({
            hrArr: [],
            month: month
        })
        Auth.getLeaveReport().then(response => {
            console.log(response);
            for (var i = 0; i < response.userRec.length; i++) {
                var casual = response.userRec[i].balance[0].casual_balance;
                var sick = response.userRec[i].balance[0].sick_balance;
                if (casual < 0) {
                    response.userRec[i].balance[0].casual_balance = response.userRec[i].balance[0].casual_balance;
                }
                else {
                    response.userRec[i].balance[0].casual_balance = 0
                }
                if (sick < 0) {
                    response.userRec[i].balance[0].sick_balance = response.userRec[i].balance[0].sick_balance;
                }
                else {
                    response.userRec[i].balance[0].sick_balance = 0
                }
            }
            this.setState({
                leavereport: response.userRec,
                todos: response.userRec,
            });

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
        Auth.getHRPerson().then(response => {
            // var defaultHRValue = { _id: "", name: "Filter Accoding to HR " };
            if (response.message != "Permission required" && response.users != '') {
                //response.users.unshift(defaultHRValue);
                this.setState({
                    hrPerson: response.users,
                    hr_name: response.users[0]._id
                });
            } else {
            }
        });
        var token = window.localStorage.getItem("id_token");
        Auth.getUserData(token).then(response => {

            this.setState({
                userRole: response.user.role,
                userName: response.user.name
            });
        });
    }
    /* End Main Business Logic when page load  */
    /* Start Filter HR wise and location wise Business Logic */
    handleHrTypeOption = event => {
        var month = this.state.month;
        this.setState({
            hrRole: [],
            hr: event.currentTarget.value,
            hr_name: event.currentTarget.value,
            currentPage: 1,
            todos: [],
            dataUser: [],
            dataPerPage: [],

        });
        var month = dateHash[month];
        let indexOfFirstTodo = 0;
        var token = window.localStorage.getItem("id_token");
        Auth.getMonthReport(month).then(response => {
            for (var i = 0; i < response.activeUsername.length; i++) {
                if (response.activeUsername[i].hr == this.state.hr_name) {

                    this.state.hrRole.push(response.activeUsername[i]);
                }
                else if (response.activeUsername[i].location == this.state.hr_name) {
                    this.state.hrRole.push(response.activeUsername[i]);
                }
                else if (this.state.hr_name == "All" || this.state.hr_name == "Clear Filter") {
                    this.state.hrRole.push(response.activeUsername[i]);
                    //document.getElementById('idotion'). = "Filter";
                }

            }
            this.setState({
                leavereport: this.state.hrRole,
                todos: this.state.hrRole,
            });
            const { todos, currentPage, todosPerPage } = this.state;
            const indexOfLastTodo = currentPage * todosPerPage;
            const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
            this.setState({ count: indexOfFirstTodo + 1 });
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
                loading: false,
                activePage: 1,
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
    /* End Filter HR wise and location wise Business Logic */

    render() {
        if (this.state.loading) {
            return (
                <div className="loader-align">
                    <Loader
                        type="ThreeDots"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        timeout={3000} //3 secs
                    />
                </div>
            );
        } else {
            return (<div className="page-content fade-in-up">
                <div className="ibox">
                    <div className="ibox-head box-emp-mang">
                        <div className="ibox-tools">
                            <div className="ibox-title"> Leave Report</div>

                        </div>
                        <div className="ibox-tools-filter">
                            {/* <span>{this.state.month}</span> */}
                            {this.state.userRole !== "HR" ?
                                <div className="btn-withdrop">
                                    <div className="myformHr">
                                        <div className="form-group leave-type-select">
                                            <label></label>
                                            <select id="hr-ref" ref="hr"
                                                className="form-control menu-item filter-menu-item"
                                                value={this.state.hr_name}
                                                onChange={this.handleHrTypeOption}>
                                                <option className="menu-clear menu-icon option-change" id="check2" value="Clear Filter">&#xf0b0; Filter</option>
                                                <option className="menu-clear menu-icon option-change" value="Clear Filter">&#xf00d; Clear Filter</option>
                                                <option className="menu-clear menu-icon option-change" value="All" selected>&#xf00c; All</option>
                                                <option disabled className="menu-title option-change">&#xf007; HR Wise</option>
                                                {this.state.hrPerson != undefined
                                                    ? this.state.hrPerson.map(item => (
                                                        <option key={item._id} value={item.name} className="option-change">
                                                            {item.name}
                                                        </option>

                                                    ))
                                                    : ""}



                                                <option disabled className="menu-title option-change">&#xf041; Location Wise</option>
                                                <option className="option-change">Ranchi</option>
                                                <option className="option-change">Pune</option>
                                                <option className="option-change">Canada</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>
                                : ""}
                            <div className="form">
                                <div className="form-group leave-type-select">
                                    <label></label>
                                    <select
                                        ref="leave_type"
                                        className="form-control"
                                        onChange={this.handleMonthChange}
                                        value={this.state.month}>
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
                            <div></div>
                        </div>
                    </div>

                    <div className="ibox-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th className="tbl-date">Unpaid Casual</th>
                                        <th className="tbl-date">Unpaid Sick</th>
                                        <th className="tbl-date">Total Working Days</th>
                                        <th className="tbl-date">Present Days</th>
                                        <th className="tbl-date">Absent Days</th>
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
                                                    <td className="tbl-date">{item.unpaid_CasualLeave}</td>
                                                    <td className="tbl-date">{item.unpaid_SickLeave}</td>
                                                    <td className="tbl-date">{item.totalWorkingDays}</td>
                                                    <td className="tbl-date">{item.totalPresentDays}</td>
                                                    <td className="tbl-date">{item.totalAbsentDays}</td>
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
                                        totalItemsCount={this.state.leavereport.length}
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
                                <th className="tbl-date">Unpaid Casual</th>
                                <th className="tbl-date">Unpaid Sick</th>
                                <th className="tbl-date">Total Working Days</th>
                                <th className="tbl-date">Present Days</th>
                                <th className="tbl-date">Absent Days</th>
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
                                            <td className="tbl-date">{item.unpaid_CasualLeave}</td>
                                            <td className="tbl-date">{item.unpaid_SickLeave}</td>
                                            <td className="tbl-date">{item.totalWorkingDays}</td>
                                            <td className="tbl-date">{item.totalPresentDays}</td>
                                            <td className="tbl-date">{item.totalAbsentDays}</td>
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
                                filename={"Leave_Report_" + this.state.month}
                                sheet="tablexls"
                                buttonText="Export Excel" />)}
                </div>
            </div >
            )
        };
    }
}

export default ChartPage;