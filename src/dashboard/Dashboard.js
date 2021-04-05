import React, { Component } from 'react';

export default class LeaveDetail extends Component {
    render() {
        return (
            <div className="page-content fade-in-up">
                <div className="row">
                    <div className="col-md-12">
                        <div className="ibox">
                            <div className="ibox-head">
                                <div className="ibox-title">Employee Leave Status</div>
                            </div>
                            <div className="ibox-body">
                                <ul className="nav nav-tabs tabs-line">
                                    <li className="nav-item">
                                        <a className="nav-link active" href="#tab-7-1" data-toggle="tab"><i className="fa fa-list-alt"></i> All</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#tab-7-2" data-toggle="tab"><i className="fa fa-thumbs-up"></i>Approved</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#tab-7-3" data-toggle="tab"><i className="fa fa-thumbs-down"></i>Declined</a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane fade show active" id="tab-7-1">
                                        <div className="table-responsive">
                                            <table className="table table-striped table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th className="tbl-date" width="91px">Start Date</th>
                                                        <th className="tbl-date" width="91px">End Date</th>
                                                        <th>Days</th>
                                                        <th>Status</th>
                                                        <th>Request</th>
                                                        <th>Reason</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Andy</td>
                                                        <td>25/11/2019</td>
                                                        <td>26/11/2019</td>
                                                        <td> 2</td>
                                                        <td>
                                                            <span className="badge badge-success">Approved</span>
                                                        </td>
                                                        <td>10/07/2017</td>
                                                        <td>
                                                            appointment with doctor
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Andy</td>
                                                        <td>25/11/2019</td>
                                                        <td>26/11/2019</td>
                                                        <td> 2</td>
                                                        <td>
                                                            <span className="badge badge-danger">Rejected</span>
                                                        </td>
                                                        <td>10/07/2017</td>
                                                        <td> appointment with doctor  </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Andy</td>
                                                        <td>25/11/2019</td>
                                                        <td>26/11/2019</td>
                                                        <td> 2</td>
                                                        <td>
                                                            <span className="badge badge-warning">Pending</span>
                                                        </td>
                                                        <td>10/07/2017</td>
                                                        <td> appointment with doctor</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="tab-pane" id="tab-7-2">
                                    <div className="table-responsive">
                                            <table className="table table-striped table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th className="tbl-date" width="91px">Start Date</th>
                                                        <th  className="tbl-date" width="91px">End Date</th>
                                                        <th>Days</th>
                                                        <th>Status</th>
                                                        <th>Request</th>
                                                        <th>Reason</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Andy</td>
                                                        <td>25/11/2019</td>
                                                        <td>26/11/2019</td>
                                                        <td> 2</td>
                                                        <td>
                                                            <span className="badge badge-success">Approved</span>
                                                        </td>
                                                        <td>10/07/2017</td>
                                                        <td>
                                                            appointment with doctor
                                                        </td>
                                                    </tr>
                                              
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade"
                                        id="tab-7-3">
                                              <div className="table-responsive">
                                            <table className="table table-striped table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th className="tbl-date" width="91px">Start Date</th>
                                                        <th className="tbl-date" width="91px">End Date</th>
                                                        <th>Days</th>
                                                        <th>Status</th>
                                                        <th>Request</th>
                                                        <th>Reason</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                           
                                                    <tr>
                                                        <td>Andy</td>
                                                        <td>25/11/2019</td>
                                                        <td>26/11/2019</td>
                                                        <td> 2</td>
                                                        <td>
                                                            <span className="badge badge-danger">Rejected</span>
                                                        </td>
                                                        <td>10/07/2017</td>
                                                        <td> appointment with doctor  </td>
                                                    </tr>
                                                 
                                                </tbody>
                                            </table>
                                        </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
