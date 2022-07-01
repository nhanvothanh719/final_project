import React, { Component, Fragment } from "react";
import Features from "../components/Features";
import TopBanner from "../components/TopBanner";
import WhyChooseUs from "../components/WhyChooseUs";
import ContactUs from "../components/ContactUs";

class HomePage extends Component {
  componentDidMount(){
    window.scroll(0, 0)
  }
  render() {
    return (
      <Fragment>
        <TopBanner />
        <Features />
        <WhyChooseUs />
        <ContactUs />
      </Fragment>
    );
  }
}

export default HomePage;
