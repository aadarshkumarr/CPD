import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert } from '@mui/material';

const CourseApprove = () => {
  const columns = [
    { field: 'userId', headerName: 'User ID' },
    { field: 'username', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'certificateId', headerName: 'Certificate Id', width: 150 },
    { field: 'certificatePDF', headerName: 'Certificate PDF', width: 200 },
    { field: 'courseName', headerName: 'CourseName', width: 200 },
    { field: 'status', headerName: 'Status', width: 100 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
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
  const [deletedRows, setDeletedRows] = useState([]);
  const [approvedRows, setApprovedRows] = useState([]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [mail, setMail] = useState('');
  const AdminDetails = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(null);
  const [cpd, setcpd] = useState(null);
  const [alert, setAlert] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [alertMessage, setAlertMessage] = useState('');

  const navigate = useNavigate();

  console.log(tableData, 'table data ====>');

  useEffect(() => {
    axios
      .get('https://cpdbackend.onrender.com/courses/pending')
      .then((res) => {
        setTableData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleReject = (row) => {
    const userId = cpd.userId;
    const confirmed = window.confirm('Are you sure you want to Reject this Course?');
    if (confirmed) {
      axios
        .put(`https://cpdbackend.onrender.com/courses/rejected/${userId}`)
        .then((res) => {
          const updatedUsers = tableData.map((u) => (u._id === cpd._id ? { ...u, status: 'rejected' } : u));

          setAlertMessage('Course has been Rejected Successfully');

          // Create a new array of deleted rows without the rejected course
          const deletedRowsUpdated = tableData.filter((u) => u._id === cpd._id);

          setDeletedRows(deletedRows.concat(deletedRowsUpdated)); // Update deletedRows state
          setTableData(updatedUsers);

          handleSend2(row.email);
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
    const confirmed = window.confirm('Are you sure you want to Approve this Course?');
    if (confirmed) {
      axios
        .put(`https://cpdbackend.onrender.com/courses/approve/${userId}`)
        .then((res) => {
          const updatedUsers = tableData.filter((u) => u.userId !== row.userId);
          setAlertMessage('Course has been Approved Successfully');

          setTableData(updatedUsers);
          setApprovedRows(updatedUsers);
          handleSend(row);
        })
        .catch((error) => {
          console.log(error);
          setAlertMessage(error.message);
        });
    }
  };

  const handleClickOpen = (row) => {
    setcpd(row);
    fetchUsers2(row.userId);
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

  const fetchUsers2 = async (userId) => {
    // console.log(userId);
    try {
      const user = await axios.get(`https://cpdbackend.onrender.com/users/${userId}`);
      setUser(user.data);
      // console.log(user);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSend2 = async (row) => {
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
          console.log('Email sent!', response.status, response.text, response);
          setAlert(<Alert severity="success">{('Email sent!', response.status, response.text)}</Alert>);
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          setAlert(<Alert severity="error">{('Error sending email:', error)}</Alert>);
        });
      setAlert(<Alert severity="success">Email sent!</Alert>);

      setMail('');
      handleClose();
    } catch (err) {
      console.log(err);
      setAlert(<Alert severity="error">{('Error sending email:', err.message)}</Alert>);
    }
  };

  const handleSend = async (row) => {
    try {
      // e.preventDefault();
      // console.log(row.userId);
      // Handle sending the message here
      const templateParams = {
        from_email: AdminDetails.email,
        to_email: row.email,
        message: 'Dear Candidate your course has been Approved by admin',
        from_name: AdminDetails.name,
        to_name: row.name,
      };

      emailjs
        .send('service_om7gti2', 'template_pix77zf', templateParams, 'FEmm8MJRVO24U1jqS')
        .then((response) => {
          console.log('Email sent!', response.status, response.text);
          setAlert(<Alert severity="success">Email sent</Alert>);
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          setAlert(<Alert severity="error">{('Error sending email:', error)}</Alert>);
        });
      setAlert(<Alert severity="success">Email sent</Alert>);

      setMail('');
      handleClose();
    } catch (err) {
      console.log(err);
      setAlert(<Alert severity="error">{err.message}</Alert>);
    }
  };

  useEffect(() => {
    let timeout;
    if (show) {
      timeout = setTimeout(() => {
        setShow(false);
        navigate('/admin/course');
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [show]);

  useEffect(() => {
    if (alertMessage) {
      setAlert(<Alert severity="success">{alertMessage}</Alert>);

      // Automatically clear the alert after a delay
      setTimeout(() => {
        setAlert(null);
        setAlertMessage('');
        window.location.reload();
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
        <h2 style={{ margin: '20px' }}>Course Approval </h2>
        {tableData.length > 0 ? (
          <DataGrid
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rows={tableData}
            columns={columns}
            pageSize={5}
            getRowId={(row) => `${row._id}-${row.certificateId}`} // Updated getRowId function
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

export default CourseApprove;
