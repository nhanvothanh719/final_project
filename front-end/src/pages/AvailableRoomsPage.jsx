import React, { Component, Fragment } from "react";
import PageTitle from "../components/PageTitle";
import AvailableRooms from "../components/AvailableRooms";
import WebPageTitle from "../components/WebPageTitle";

class AvailableRoomsPage extends Component {
  componentDidMount(){
    window.scroll(0, 0)
  }
  render() {
    return (
      <Fragment>
        <WebPageTitle pageTitle="Available rooms" />
        <PageTitle title="Rooms for rent" />
        <AvailableRooms />
      </Fragment>
    );
  }
}

export default AvailableRoomsPage;