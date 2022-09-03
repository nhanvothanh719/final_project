import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import moment from "moment";
import axios from "axios";

import "../../../assets/css/Renter/invoice.css";
import AppUrl from "../../../RestAPI/AppUrl";
import Loading from "../../../components/Loading/Loading";
import swal from "sweetalert";

export default function PaidInvoiceDetails({ match }) {
  const history = useHistory();
  const invoiceId = match.params.invoiceID;

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState({
    renter: {},
    payment: {
      method: {
        name: "",
      },
    },
    discount: "",
    extra_fee: "",
    extra_fee_description: "",
    total: "",
    month: "",
    year: "",
    effective_from: "",
    valid_until: "",
    is_paid: "",
  });
  const [usedServices, setUsedServices] = useState([
    {
      service_id: "",
      quantity: "",
      subtotal: "",
      service: {},
    },
  ]);

  useEffect(() => {
    axios.get(AppUrl.GetInvoiceDetails + invoiceId).then((response) => {
      if (response.data.status === 200) {
        setInvoice(response.data.invoice);
        setUsedServices(response.data.invoiceDetails);
        console.log(response.data.invoice);
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push("/renter/view-all-invoices");
      }
      setLoading(false);
    });
  }, [invoiceId, history]);

  return (
    <div className="page-content container">
      <div className="page-header text-blue-d2"></div>

      <div className="container px-0">
        <div className="row mt-4">
          <div className="col-12 col-lg-12">
            <hr className="row brc-default-l1 mx-n1 mb-4" />

            <div className="row">
              <div className="col-sm-6">
                <div>
                  <span className="text-sm text-grey-m2 align-middle">To: </span>
                  <span className="text-600 text-110 text-blue align-middle">
                    {invoice.renter.name}
                  </span>
                </div>
                <div className="text-grey-m2">
                  <div className="my-1">{invoice.renter.email}</div>
                  <div className="my-1">{invoice.renter.phone_number}</div>
                  <div className="my-1">
                    <i className="fa fa-phone fa-flip-horizontal text-secondary"></i>{" "}
                    <b className="text-600">111-111-111</b>
                  </div>
                </div>
              </div>

              <div className="text-95 col-sm-6 align-self-start d-sm-flex justify-content-end">
                <hr className="d-sm-none" />
                <div className="text-grey-m2">
                  <div className="mt-1 mb-2 text-secondary-m1 text-600 text-125">
                    Invoice
                  </div>

                  <div className="my-2">
                    <i className="fa fa-circle text-blue-m2 text-xs mr-1"></i>{" "}
                    <span className="text-600 text-90">ID:</span> #{invoice.id}
                  </div>

                  <div className="my-2">
                    <i className="fa fa-circle text-blue-m2 text-xs mr-1"></i>{" "}
                    <span className="text-600 text-90">Status:</span>{" "}
                    <span className="badge badge-success badge-pill px-25">
                      {invoice.is_paid ? "Paid" : "Unpaid"}
                    </span>
                  </div>

                  <div className="my-2">
                    <i className="fa fa-circle text-blue-m2 text-xs mr-1"></i>{" "}
                    <span className="text-600 text-90">Paid method:</span>{" "}
                    {invoice.payment.method.name}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="row text-600 text-white bgc-default-tp1 py-25">
                <div className="d-none d-sm-block col-1">#</div>
                <div className="col-9 col-sm-5">Service name</div>
                <div className="d-none d-sm-block col-4 col-sm-2">Quantity</div>
                <div className="d-none d-sm-block col-sm-2">Unit Price</div>
                <div className="col-2">Amount</div>
              </div>

              <div className="text-95 text-secondary-d3">
                {usedServices.map((item, index) => {
                  return (
                    <div class = {index % 2 === 1 ? "row mb-2 mb-sm-0 py-25" : "row mb-2 mb-sm-0 py-25 bgc-default-l4"}>
                      <div className="d-none d-sm-block col-1">{index + 1}</div>
                      <div className="col-9 col-sm-5">{item.service.name}</div>
                      <div className="d-none d-sm-block col-2">{item.quantity}</div>
                      <div className="d-none d-sm-block col-2 text-95">${item.service.unit_price}</div>
                      <div className="col-2 text-secondary-d2">${item.subtotal}</div>
                    </div>
                  );
                })}
              </div>

              <div className="row mt-3">
                <div className="col-12 col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0">
                  Extra note such as company or payment information...
                </div>

                <div className="col-12 col-sm-5 text-grey text-90 order-first order-sm-last">
                  <div className="row my-2">
                    <div className="col-7 text-right">Extra fee</div>
                    <div className="col-5">
                      <span className="text-120 text-secondary-d1">${invoice.extra_fee === null ? "0" : invoice.extra_fee}</span>
                    </div>
                  </div>

                  <div className="row my-2">
                    <div className="col-7 text-right">Discount</div>
                    <div className="col-5">
                      <span className="text-110 text-secondary-d1">{invoice.discount === null ? "0" : invoice.discount}%</span>
                    </div>
                  </div>

                  <div className="row my-2 align-items-center bgc-primary-l3 p-2">
                    <div className="col-7 text-right">Total Amount</div>
                    <div className="col-5">
                      <span className="text-150 text-d3 opacity-2" style={{ color: "red" }}>
                        ${invoice.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <div>
                <span className="text-secondary-d1 text-105">
                  Thank you for your choosing us
                </span>
                {/* <button className="btn btn-info btn-bold px-4 float-right mt-3 mt-lg-0">
                  Pay Now
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}