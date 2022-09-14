import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

import axios from "axios";

import WebPageTitle from "../../components/WebPageTitle/WebPageTitle";
import NavBar from "../../layouts/User/NavBar";
import Footer from "../../layouts/User/Footer";
import swal from "sweetalert";

function ForgetPasswordPage(props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const formSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: email,
    };
    
    axios
      .post("/forget-password", data)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          document.getElementById("forgetPasswordForm").reset();
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
        } else if (response.data.status === 403) {
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
  };
  //Display error message
  let error = "";
  if (message) {
    error = (
      <div>
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      </div>
    );
  }
  return (
    <Fragment>
      <NavBar/>
      <WebPageTitle pageTitle="Forget password" />
      <Container
        fluid={true}
        className="loginBackground"
        style={{ minHeight: "622px" }}
      >
        <Row>
          <Col lg={4} md={2} sm={2}></Col>
          <Col lg={4} md={8} sm={8}>
            <div id="logreg-forms">
              <form id="forgetPasswordForm" onSubmit={formSubmit}>
                <h3
                  className="mb-3 font-weight-normal loginText"
                  style={{ "textAlign": "center" }}
                >
                  Forget Password
                </h3>
                {error}
                <div className="form-group">
                  <label for="inputEmail" className="formLabel">
                    Email address:
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    id="inputEmail"
                    aria-describedby="emailHelp"
                    placeholder="Email to reset password"
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block loginFormButton"
                >
                  Submit
                </button>
                <Link to="/login" className="customLink">
                  {" "}
                  Have an account?{" "}
                </Link>
                <br />
              </form>
            </div>
          </Col>
          <Col lg={4} md={2} sm={2}></Col>
        </Row>
      </Container>
      <Footer/>
    </Fragment>
  );
}

export default ForgetPasswordPage;
