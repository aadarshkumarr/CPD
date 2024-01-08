import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { CToast, CToastBody, CToastClose } from '@coreui/react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const ApproveUser = () => {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    const userParse = JSON.parse(user);
    const role = userParse?.role || '';
    setUserRole(role);
  }, []);
  const columns = [
    { field: 'userId', headerName: 'ID' },
    { field: 'name', headerName: 'Name', width: 100 },
    {
      field: 'email',
      headerName: 'Email',
      width: 150,
      renderCell: (params) => {
        // Replace this with your actual userRole state

        if (userRole === 'management') {
          return 'xxxxxxxxxx';
        }
        return params.value;
      },
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150,
      renderCell: (params) => {
        // const userRole = 'management'; // Replace this with your actual userRole state

        if (userRole === 'management') {
          return 'xxxxxxxxxx';
        }
        return params.value;
      },
    },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'createdAt', headerName: 'createdAt', width: 250 },
    {
      field: 'action',
      headerName: 'Action',
      width: 240,
      renderCell: (params) => (
        <>
          <button
            onClick={() => handleClickOpen(params.row)}
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
        </>
      ),
    },
  ];

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });
  const [tableData, setTableData] = useState([]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [deletedRows, setDeletedRows] = useState([]);
  const [approvedRows, setApprovedRows] = useState([]);
  const AdminDetails = JSON.parse(localStorage.getItem('user'));
  const [mail, setMail] = useState('');
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [alertMessage, setAlertMessage] = useState('');

  const navigate = useNavigate();
  console.log(tableData);

  useEffect(() => {
    axios
      .get('https://cpdbackend.onrender.com/pending')
      .then((res) => {
        setTableData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // console.log(tableData);

  const handleReject = (row) => {
    const userId = user.userId;
    const confirmed = window.confirm('Are you sure you want to Reject this User?');
    if (confirmed) {
      axios
        .delete(`https://cpdbackend.onrender.com/users/${userId}`)
        .then((res) => {
          const updatedUsers = tableData.filter((u) => u.userId !== user.userId);

          setTableData(updatedUsers); // Update tableData state
          setDeletedRows(updatedUsers);
          handleSend2(row.email);

          // Set the alert message in state
          setAlertMessage('User has been Rejected Successfully');
        })
        .catch((error) => {
          console.log(error);
          setAlertMessage(error.message);
        });
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

          setAlertMessage('User has been Approved Successfully');

          setTableData(updatedUsers); // update tableData state
          setApprovedRows(updatedUsers);
          handleSend(row.email);
          // console.log(row.email);
        })
        .catch((error) => {
          console.log(error);
          setAlertMessage(error.message);
        });
    }
  };

  const handleClickOpen = (row) => {
    setUser(row);
    setUserDetails(row);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    // set send message here
    setMail(event.target.value);
  };

  const handleSend = async (toEmail) => {
    try {
      const templateParams = {
        from_email: AdminDetails.email,
        to_email: toEmail,
        message: 'Dear Candidate you are Approved by admin',
        from_name: AdminDetails.name,
        to_name: userDetails.name,
      };

      emailjs
        .send('service_om7gti2', 'template_pix77zf', templateParams, 'FEmm8MJRVO24U1jqS')
        .then((response) => {
          console.log('Email sent!', response.status, response.text, response);
          setAlert(<Alert severity="success">Email sent!</Alert>);
          clearAlertAfterDelay();
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          setAlert(<Alert severity="error">{('Error sending email:', error)}</Alert>);
          clearAlertAfterDelay();
        });

      setAlert(<Alert severity="success">Email sent!</Alert>);
      clearAlertAfterDelay();

      setMail('');
      handleClose();
    } catch (err) {
      console.log(err);
      setAlert(<Alert severity="error">{err.message}</Alert>);
      clearAlertAfterDelay();
    }
  };

  const handleSend2 = async (toEmail) => {
    try {
      console.log(user);
      const templateParams = {
        from_email: AdminDetails.email,
        to_email: userDetails.email,
        message: mail,
        from_name: AdminDetails.name,
        to_name: userDetails.name || '',
      };

      emailjs
        .send('service_om7gti2', 'template_pix77zf', templateParams, 'FEmm8MJRVO24U1jqS')
        .then((response) => {
          console.log('Email sent!', response.status, response.text);
          setAlert(<Alert severity="success">{('Email sent!', response.status, response.text)}</Alert>);
          clearAlertAfterDelay();
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          setAlert(<Alert severity="error">{('Error sending email:', error)}</Alert>);
          clearAlertAfterDelay();
        });
      setAlert(<Alert severity="success">Email sent!</Alert>);
      clearAlertAfterDelay();

      setMail('');
      handleClose();
    } catch (err) {
      console.log(err);
      setAlert(<Alert severity="error">{('Error sending email:', err.message)}</Alert>);
      clearAlertAfterDelay();
    }
  };

  const clearAlertAfterDelay = () => {
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  useEffect(() => {
    if (alertMessage) {
      setAlert(<Alert severity="success">{alertMessage}</Alert>);

      // Automatically clear the alert after a delay
      setTimeout(() => {
        setAlert(null);
      }, 5000);
    }
  }, [alertMessage]);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '1000',
          width: '80%',
          maxWidth: '400px',
        }}
      >
        {alert}
      </div>

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
          <Button onClick={handleReject} color="primary" autoFocus>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ width: '100%', marginTop: '8%' }}>
        <h2 style={{ margin: '20px' }}>Pending Users </h2>

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

export default ApproveUser;
