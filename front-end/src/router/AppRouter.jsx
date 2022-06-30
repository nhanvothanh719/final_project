import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import NavBar from "../common/NavBar";
import Login from "../components/Login";
import Register from "../components/Register";
import ForgetPassword from "../components/ForgetPassword";
import ResetPassword from "../components/ResetPassword";
import UserProfile from "../components/UserProfile";
import HomePage from "../pages/HomePage";
import FeaturesPage from "../pages/FeaturesPage";
import WhyChooseUsPage from "../pages/WhyChooseUsPage";
import ContactUsPage from "../pages/ContactUsPage";
import TermsAndConditionPage from "../pages/TermsAndConditionPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";

class header extends Component {
    state = {
        user: {},
      };
    
      componentDidMount() {
        //Get user credentials
        axios
          .get("/get-user-profile")
          .then((response) => {
            console.log(response.data);
            this.setUser(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    
      setUser = (user) => {
        this.setState({ user: user });
      };
  render() {
    return (
        <div>
            <NavBar user={this.state.user} setUser={this.setUser}/>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/features" component={FeaturesPage} />
            <Route exact path="/why-choose-us" component={WhyChooseUsPage} />
            <Route exact path="/contact-us" component={ContactUsPage} />
            <Route exact path="/login" component={() => <Login user={this.state.user} setUser={this.setUser} />} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/forget-password" component={ForgetPassword} />
            <Route exact path="/reset-password/:token" component={ResetPassword} />
            <Route exact path="/user-profile" component={() => <UserProfile user={this.state.user} />} />
            <Route exact path="/all-terms-and-condition" component={TermsAndConditionPage} />
            <Route exact path="/privacy-policy" component={PrivacyPolicyPage} />
          </Switch>
        </div>
    );
  }
}

export default header;