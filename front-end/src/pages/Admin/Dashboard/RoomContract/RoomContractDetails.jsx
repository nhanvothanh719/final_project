import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function RoomContractDetails({ match }) {
  const history = useHistory();
  const roomContractId = match.params.roomContractID;

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});

  axios.get(AppUrl.GetRoomContractDetails + roomContractId).then((response) => {
    if (response.data.status === 200) {
      setDetails(response.data.roomContractDetails);
    } else if (response.data.status === 404) {
      swal("Error", response.data.message, "error");
      history.push("/admin/view-all-motorbikes");
    }
    setLoading(false);
  });

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <p>{details.renter_id}</p>
      <p>{details.effective_from}</p>
      <p>{details.effective_until}</p>
      <p>{details.deposit_amount}</p>
      <img
        src={`http://127.0.0.1:8000/${details.owner_signature}`}
        alt=""
        style={{ width: "60px", height: "60px", borderRadius: "50%" }}
      />
      <img
        src={`http://127.0.0.1:8000/${details.renter_signature}`}
        alt=""
        style={{ width: "60px", height: "60px", borderRadius: "50%" }}
      />
    </Fragment>
  );
}
