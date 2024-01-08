import React, { useState, useEffect } from 'react';
import { CToast, CToastBody, CToastClose } from '@coreui/react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const AllUserManagement = () => {
  const columns = [
    { field: 'userId', headerName: 'ID' },
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'isActive', headerName: 'IsActive', width: 150 },
    { field: 'createdAt', headerName: 'createdAt', width: 250 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <>
          <button
            onClick={() => handleReject(params.row)}
            style={{
              border: 'none',
              padding: '5px 10px',
              marginRight: '5px',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: 'red',
              color: 'white',
            }}
          >
            X
          </button>
          <button
            onClick={() => handleApproved(params.row)}
            style={{
              border: 'none',
              padding: '5px 10px',
              marginRight: '5px',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: 'green',
              color: 'white',
            }}
          >
            ✔
          </button>
          {/* <button
            onClick={() => handleClickOpen(params.row)}
            style={{
              border: 'none',
              // padding: '5px 10px',
              marginRight: '5px',
              fontSize: '19px',
              cursor: 'pointer',
              backgroundColor: '#4169E1',
              color: 'white',
            }}
          >
            ✉️
          </button> */}
        </>
      ),
    },
  ];

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });
  const [tableData, setTableData] = useState([]);
  console.log(tableData);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [deletedRows, setDeletedRows] = useState([]);
  const [approvedRows, setApprovedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [mail, setMail] = useState('');
  const AdminDetails = JSON.parse(localStorage.getItem('user'));
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    axios
      .get('https://cpdbackend.onrender.com/users')
      .then((res) => {
        setTableData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // console.log(tableData);

  const handleReject = (row) => {
    const userId = row.userId;
    console.log(userId);
    const confirmed = window.confirm('Are you sure you want to Reject this User?');
    if (confirmed) {
      axios
        .delete(`https://cpdbackend.onrender.com/users/${userId}`)
        .then((res) => {
          const updatedUsers = tableData.filter((u) => u.userId !== row.userId);
          setShow(true);
          setMessage('User has been Reject');
          setTableData(updatedUsers); // update tableData state
          setDeletedRows(updatedUsers);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleApproved = (row) => {
    const userId = row.userId;
    console.log(userId);
    const confirmed = window.confirm('Are you sure you want to Approve this User?');
    if (confirmed) {
      axios
        .put(`https://cpdbackend.onrender.com/users/approve/${userId}`)
        .then((res) => {
          const updatedUsers = tableData.filter((u) => u.userId !== row.userId);
          setShow(true);
          setMessage('User has been Approved');
          setTableData(updatedUsers); // update tableData state
          setApprovedRows(updatedUsers);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleClickOpen = (row) => {
    setUserDetails(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    // Handle sending the message here
    const templateParams = {
      from_email: AdminDetails.email,
      to_email: userDetails.email,
      message: mail,
      from_name: AdminDetails.name,
      to_name: userDetails.name,
    };

    emailjs
      .send('service_knunjfm', 'template_ovttgkn', templateParams, 't6TOry913aayxbxe1')
      .then((response) => {
        console.log('Email sent!', response.status, response.text);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });

    alert('Email send');
    setMail('');
    handleClose();
  };

  const handleChange = (event) => {
    // set send message here
    setMail(event.target.value);
  };

  useEffect(() => {
    let timeout;
    if (show) {
      timeout = setTimeout(() => {
        setShow(false);
        navigate('/management/approve');
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [show]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Send Message</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={7}
            variant="outlined"
            value={mail}
            onChange={handleChange}
            fullWidth
            sx={{ width: '500px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleSend} color="primary" autoFocus>
            Send
          </Button>
        </DialogActions>
      </Dialog>
      {show && (
        <CToast visible color="success" className="text-white align-items-center">
          <div className="d-flex">
            <CToastBody className="ml-4">{message}</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>
      )}

      <div style={{ width: '100%', marginTop: '8%' }}>
        <h2 style={{ margin: '20px' }}>All Users </h2>

        {tableData.length > 0 ? (
          <DataGrid
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rows={tableData}
            columns={columns}
            pageSize={10}
            // checkboxSelection
            getRowId={(row) => row.userId}
            onSelectionModelChange={({ selectionModel }) => {
              const rowIds = selectionModel.map((rowId) => parseInt(String(rowId), 10));
              const rowsToDelete = tableData.filter((row) => rowIds.includes(row.userId));
              const rowsToApprove = tableData.filter((row) => rowIds.includes(row.userId));
              setDeletedRows(rowsToDelete);
              setApprovedRows(rowsToApprove);
            }}
          />
        ) : (
          'No Data Available'
        )}
      </div>
    </>
  );
};

export default AllUserManagement