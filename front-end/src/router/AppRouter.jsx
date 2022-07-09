import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgetPassword from "../pages/ForgetPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import UserProfile from "../components/UserProfile";
import HomePage from "../pages/HomePage";
import FeaturesPage from "../pages/FeaturesPage";
import WhyChooseUsPage from "../pages/WhyChooseUsPage";
import ContactUsPage from "../pages/ContactUsPage";
import TermsAndConditionPage from "../pages/TermsAndConditionPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import AvailableRoomsPage from "../pages/AvailableRoomsPage";
import AvailableRoomDetailsPage from "../pages/AvailableRoomDetailsPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import RentersList from "../pages/Dashboard/RentersList";
import RenterDetails from "../pages/Dashboard/Form";

class AppRouter extends Component {
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
        <Switch>
          {/* Home page */}
          <Route exact path="/" component={HomePage} />
          <Redirect from="/home" to="/" />
          {/* Features page */}
          <Route exact path="/features" component={FeaturesPage} />
          {/* Why choose us page */}
          <Route exact path="/why-choose-us" component={WhyChooseUsPage} />
          {/* Contact us page */}
          <Route exact path="/contact-us" component={ContactUsPage} />
          {/* Available rooms */}
          <Route exact path="/available-rooms" component={AvailableRoomsPage} />
          {/* Available room details */}
          <Route
            exact
            path="/available-room-details/:roomID/:roomNumber"
            component={AvailableRoomDetailsPage}
          />
          {/* Other pages */}
          <Route exact path="/all-terms-and-condition" component={TermsAndConditionPage} />
          <Route exact path="/privacy-policy" component={PrivacyPolicyPage} />
          {/* Login */}
          <Route
            exact
            path="/login"
            component={() => (
              <LoginPage user={this.state.user} setUser={this.setUser} />
            )}
          />
          {/* Register */}
          <Route exact path="/register" component={RegisterPage} />
          {/* Forget and Reset password */}
          <Route exact path="/forget-password" component={ForgetPassword} />
          <Route
            exact
            path="/reset-password/:token"
            component={ResetPasswordPage}
          />
          {/* Current user profile */}
          <Route
            exact
            path="/user-profile"
            component={() => <UserProfile user={this.state.user} />}
          />
          {/* Dashboard */}
          <Route exact path="/admin/dashboard" component={Dashboard} />
          <Redirect from="/admin" to="/admin/dashboard" />
          
          <Route exact path="/admin/renters" component={RentersList} />
          <Route exact path="/admin/renters/:renterID" component={RenterDetails} />
        </Switch>
      </div>
    );
  }
}

export default AppRouter;
