import React, { useState, useEffect } from 'react';
import { CToast, CToastBody, CToastClose } from '@coreui/react';
import emailjs from 'emailjs-com';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert } from '@mui/material';

const CPDApprove = () => {
  const columns = [
    { field: 'userId', headerName: 'ID', width: 50 },
    { field: 'username', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 150 },
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
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
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
          <button
            onClick={() => updateOpenPop(params.row._id)}
            style={{
              border: 'none',
              padding: '5px 10px',
              marginRight: '5px',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: 'skyblue',
              // color: '',
            }}
          >
            Update Hours
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
  // console.log(tableData);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [deletedRows, setDeletedRows] = useState([]);
  const [approvedRows, setApprovedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [mail, setMail] = useState('');
  const AdminDetails = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(null);
  const [cpd, setcpd] = useState(null);
  const [hour, setHour] = useState({ hours: 6 });
  const [ide, setIde] = useState('');
  const [change, setChange] = useState('');
  const [alert, setAlert] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://cpdbackend.onrender.com/addcpds/pending')
      .then((res) => {
        setTableData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get('https://cpdbackend.onrender.com/addcpds/pending')
      .then((res) => {
        setTableData(res.data);
      })
      .catch((err) => console.log(err));
  }, [change]);

  const handleReject = () => {
    const userId = cpd.userId;
    console.log(userId);
    const confirmed = window.confirm('Are you sure you want to Reject this CPD?');
    if (confirmed) {
      axios
        .put(`https://cpdbackend.onrender.com/addcpds/rejected/${userId}`)
        .then((res) => {
          const updatedUsers = tableData.map((u) => (u._id === cpd._id ? { ...u, status: 'rejected' } : u));
          console.log(updatedUsers);
          // const updatedUsers = tableData.filter((u) => u._Id !== cpd._Id);
          setShow(true);
          setAlert(<Alert severity="success">CPD has been Rejected successfully</Alert>);

          setMessage('CPD has been Rejected');
          setDeletedRows(updatedUsers);
          setTableData(updatedUsers);
          handleSend2(); // update tableData state with the latest data
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          setAlert(<Alert severity="error">{('Error sending email:', error)}</Alert>);
        });
    }
  };

  const handleApproved = (row) => {
    const userId = row.userId;
    // console.log(userId);
    const confirmed = window.confirm('Are you sure you want to approve this CPD?');
    if (confirmed) {
      axios
        .put(`https://cpdbackend.onrender.com/addcpds/approve/${userId}`)
        .then((res) => {
          const updatedUsers = tableData.map((u) => (u._id === row._id ? { ...u, status: 'approved' } : u));
          setShow(true);
          setMessage('CPD has been approved');
          setAlert(<Alert severity="success">CPD has been approved successfully</Alert>);

          setTableData(updatedUsers); // update tableData state
          setApprovedRows(updatedUsers);
          fetchUsers(row.userId);
          handleSend(row);
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          setAlert(<Alert severity="error">{('Error sending email:', error)}</Alert>);
        });
    }
  };

  const updateOpenPop = (id) => {
    setIde(id);
    const temp = tableData.filter((item) => {
      return item._id === id;
    });
    if (updateOpen === true) {
      setUpdateOpen(false);
    } else {
      setHour({ hours: temp[0].hours });
      setUpdateOpen(true);
    }
    // console.log(tableData);
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

  const fetchUsers = async (userId) => {
    // console.log(userId);
    try {
      const user = await axios.get(`https://cpdbackend.onrender.com/users/${userId}`);
      setUser(user.data);
      handleSend(user.data);
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
        message: 'Dear Candidate your CPD has been Approved by admin',
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

      alert('Email send');
      setMail('');
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

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

  const updateHour = async (temp) => {
    // console.log(temp);
    axios
      .put(`https://cpdbackend.onrender.com/addcpds/pending/${ide}`, hour)
      .then((res) => {
        console.log(res.data);
        setAlert(<Alert severity="success">Hour updated successfully</Alert>);

        setChange(res.data);
        setUpdateOpen(false);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        setAlert(<Alert severity="error">{('Error sending email:', error)}</Alert>);
      });
  };

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
      <Dialog open={updateOpen} onClose={updateOpenPop}>
        <DialogTitle>Update Hour</DialogTitle>
        <DialogContent>
          <TextField
            onChange={(e) => {
              setHour({ hours: e.target.value });
            }}
            value={hour.hours}
            rows={1}
            variant="outlined"
            fullWidth
            sx={{ width: '500px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={updateOpenPop} color="primary">
            Close
          </Button>
          <Button onClick={() => updateHour()} color="primary" autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>
      {alert}
      <div style={{ width: '100%', marginTop: '8%' }}>
        <h2 style={{ margin: '20px' }}>CPD Approval </h2>
        {tableData.length > 0 ? (
          <DataGrid
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rows={tableData}
            columns={columns}
            pageSize={10}
            // checkboxSelection
            getRowId={(row) => row._id}
            onSelectionModelChange={({ selectionModel }) => {
              const rowIds = selectionModel.map((userId) => parseInt(String(userId), 10));
              const rowsToDelete = tableData.filter((row) => rowIds.includes(row.userId));
              const rowsToApprove = tableData.filter((row) => rowIds.includes(row.userId));
              setDeletedRows(rowsToDelete);
              setApprovedRows(rowsToApprove);
            }}
          />
        ) : (
          'No Data Available'
        )}
        {/* )} */}
      </div>
    </>
  );
};

export default CPDApprove;
