import React, { Component } from "react";

export default class AllPageFrom extends Component {
  render() {
    return (
      <div className="page-content fade-in-up">
        <div className="row justify-content-md-center">
          <div className="col-md-6 ">
            <div className="ibox">
              <div className="ibox-head">
                <div className="ibox-title">Basic form</div>
                <div className="ibox-tools">
                  <a className="ibox-collapse">
                    <i className="fa fa-minus"></i>
                  </a>
                  <a className="dropdown-toggle" data-toggle="dropdown">
                    <i className="fa fa-ellipsis-v"></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <a className="dropdown-item">option 1</a>
                    <a className="dropdown-item">option 2</a>
                  </div>
                </div>
              </div>
              <div className="ibox-body">
                <form>
                  <div className="row">
                    <div className="col-sm-6 form-group">
                      <label>First Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="First Name"
                      />
                    </div>
                    <div className="col-sm-6 form-group">
                      <label>Last Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="First Name"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Email address"
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Password"
                    />
                  </div>
                  <div className="form-group">
                    <label className="ui-checkbox">
                      <input type="checkbox" />
                      <span className="input-span"></span>Remember me
                    </label>
                  </div>
                  <div className="form-group">
                    <button
                      className="btn btn-success btn-rounded"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
