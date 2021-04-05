import React from 'react';

const NotFound = () =>
  <div className="not-content">

    <h1 class="m-t-20">404</h1>
    <p class="not-error-title">PAGE NOT FOUND</p>
    <p class="m-b-20">Sorry, the page you were looking for could not found. Please check the URL and try your luck again.
        {/* <a class="color-green"> Go homepage </a> or click on side bar menu. */}
        </p>
    {/* <form action='javascript:;'>
      <div class="input-group">
        <input class="form-control" type="text" placeholder="Search for page">
          <div class="input-group-btn">
            <button class="btn btn-success" type="button">Search</button>
          </div>
        </div>
    </form> */}

      {/* <h3>404 page not found</h3>
    <p>We are sorry but the page you are looking for does not exist.</p> */}
    </div>

    export default NotFound;