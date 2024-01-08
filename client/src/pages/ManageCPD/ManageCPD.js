import React, { useState, useEffect } from 'react';
import { CToast, CToastBody, CToastClose } from '@coreui/react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManageCPD.css';
import AddCPD from '../AddCPD/AddCPD';

const ManageCPD = () => {
  const columns = [
    { field: 'registrationId', headerName: 'ID', width: 50 },
    { field: 'title', headerName: 'Title', width: 100 },
    { field: 'course', headerName: 'Course', width: 100 },
    { field: 'sponsor', headerName: 'Sponsor Organization', width: 120 },

    { field: 'startDate', headerName: 'Start Date:', width: 150 },

    { field: 'endDate', headerName: 'End Date:', width: 150 },

    { field: 'qualifyingActivity', headerName: 'Qualifying Activity', width: 250 },

    { field: 'methodOfDelivery', headerName: 'Sponsor Organization', width: 100 },

    {
      field: 'hours',
      headerName: 'Hours',
      width: 50,
    },
  ];
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });
  const [tableData, setTableData] = useState([]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const user = localStorage.getItem('user');
  const userParse = JSON.parse(user);
  const registrationId = userParse._id;

  // console.log(tableData);

  const handleShow = () => {
    navigate('/dashboard/addcpd');
  };

  useEffect(() => {
    axios
      .get(`https://cpdbackend.onrender.com/getcpd/${registrationId}`)
      .then((res) => {
        setTableData(res.data.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    let timeout;
    if (show) {
      timeout = setTimeout(() => {
        setShow(false);
        navigate('/admin/cpd');
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [show]);

  return (
    <>
      {show && (
        <CToast visible color="success" className="text-white align-items-center">
          <div className="d-flex">
            <CToastBody className="ml-4">CPD Successfully Updated</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>
      )}
      <section className="section_managecpd">
        <h1>Manage CPD</h1>
        <p>
          Remember to maintain your careerandskills.com certificaton, you must earn and report a minimum of 60 CPD hours
          every 3- year reporting cycle and at least 20 hours annually. CPD reporting is due by the end of each calender
          year and is required to renew through the following year. For example, to renew through the end of the current
          year, the CPD requirements of the previous year must be met.
        </p>
      </section>
      {show && (
        <CToast visible color="success" className="text-white align-items-center">
          <div className="d-flex">
            <CToastBody className="ml-4">{message}</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>
      )}
      <div style={{ width: '100%', marginTop: '8%' }}>
        <h2 style={{ margin: '20px', textAlign: 'center', textDecoration: 'underline' }}>CPD Data </h2>

        {tableData.length > 0 ? (
          <DataGrid
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rows={tableData}
            columns={columns}
            pageSize={10}
            getRowId={(row) => row._id}
          />
        ) : (
          'No Data Available'
        )}
      </div>

      <div>
        <button className="add_cpd_btn" onClick={handleShow}>
          Add CPD
        </button>
      </div>
    </>
  );
};

export default ManageCPD;
