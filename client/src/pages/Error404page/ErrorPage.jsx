import React from "react";
import "./errorpage.css";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="error_container">
      <section className="page_404">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-10 col-sm-offset-1  text-center">
              <h1 className="errorheading ">404</h1>

                <div className="four_zero_four_bg">
                </div>

                <div className="contant_box_404">
                  <h3 className="h2">Look like you're lost</h3>

                  <p>the page you are looking for not avaible!</p>

                  <Link className="link_404" to={"/"}>
                    Go to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ErrorPage;
