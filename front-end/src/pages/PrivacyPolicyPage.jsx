import React, { Component, Fragment } from "react";
import PageTitle from "../components/PageTitle";
import PrivacyPolicy from "../components/PrivacyPolicy";
import WebPageTitle from "../components/WebPageTitle";

class PrivacyPolicyPage extends Component {
  componentDidMount() {
    window.scroll(0, 0);
  }
  render() {
    return (
      <Fragment>
        <WebPageTitle pageTitle="Privacy policy" />
        <PageTitle title="Privacy Policy" />
        <PrivacyPolicy />
      </Fragment>
    );
  }
}

export default PrivacyPolicyPage;
