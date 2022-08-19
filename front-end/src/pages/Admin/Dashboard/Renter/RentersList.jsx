import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import DefaultAvatar from "../../../../assets/images/avatar.jpeg";

export default function RentersList() {
  const history = useHistory();

  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentersList, setRentersList] = useState([]);
  const [rentersListChange, setRentersListChange] = useState(false);

  useEffect(() => {
    axios.get(AppUrl.ShowRenters).then((response) => {
      if (response.data.status === 200) {
        setRentersList(response.data.allRenters);
      }
    });
    setLoading(false);
    if (rentersListChange) {
      setRentersListChange(false);
    }
  }, [rentersListChange]);

  const lockRenterAccount = (id) => {
    axios.put(AppUrl.LockRenterAccount + id).then((response) => {
      if (response.data.status === 200) {
        swal("Success", response.data.message, "success");
        setRentersListChange(true);
      }
    });
  }

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { title: '#', render: (rowData) => rowData.tableData.id + 1 },
      { field: "profile_picture", title: "Avatar", export: false, width: "10%", render: rowData => <img src={DefaultAvatar} alt="avatar" style={{width: 40, borderRadius: '50%'}}/> },
      // { field: "profile_picture", title: "Avatar", export: false, width: "10%", render: rowData => <img src={rowData.profile_picture} alt="avatar" style={{width: 40, borderRadius: '50%'}}/> },
      { field: "name", title: "Name", width: "20%" },
      { field: "email", title: "Email", width: "20%" },
      { field: "gender", title: "Gender", lookup: { 0: "Female", 1: "Male" }, width: "10%" },
      { field: "phone_number", title: "Phone number" },
      {
        field: "is_locked",
        title: "Status",
        lookup: { 0: "Active", 1: "Locked" },
      },
    ];
    return (
      <Fragment>
        <div className="customDatatable">
          <div className="datatableHeader">
            <Link to="/admin/create-renter" className="createBtn">
              Add new renter
            </Link>
          </div>
          <MaterialTable
            columns={columns}
            data={rentersList}
            title="All renters"
            options={{
              searchAutoFocus: false,
              searchFieldVariant: "outlined",
              filtering: false,
              pageSizeOptions: [5, 10],
              paginationType: "stepped",
              exportButton: true,
              exportAllData: true,
              actionsColumnIndex: -1,
            }}
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit',
                onClick: (event, renter) =>
                  history.push(`/admin/edit-renter/${renter.id}`),
              },
              renter => ({
                icon: renter.is_locked ? LockOpenIcon : LockOutlinedIcon,
                tooltip: renter.is_locked ? 'Unlock account' : 'Lock account',
                onClick: (event, renter) => lockRenterAccount(renter.id),
              }),
              ({
                icon: FolderSharedIcon,
                tooltip: 'Renter details',
                onClick: (event, renter) => history.push(
                  `/admin/view-all-invoices-of-renter/${renter.id}`
                ),
              }),
            ]}
            editable={{
              onRowDelete: (thisRenter) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const selectedRenter = [...details];
                    const index = thisRenter.tableData.id;
                    selectedRenter.splice(index, 1); //1: only one record
                    axios
                      .delete(AppUrl.DeleteRenter + thisRenter.id)
                      .then((response) => {
                        if (response.data.status === 200) {
                          swal("Success", response.data.message, "success");
                          setRentersListChange(true);
                        } else if (response.data.status === 404) {
                          swal("Error", response.data.message, "error");
                        }
                      });
                    resolve();
                  }, 1000);
                }),
            }}
          />
        </div>
      </Fragment>
    );
  }
}
