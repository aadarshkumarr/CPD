import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert } from '@mui/material';

const BlockUser = () => {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    const userParse = JSON.parse(user);
    const role = userParse?.role || '';
    setUserRole(role);
  }, []);
  const columnsAllUser = [
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
              borderRadius: '5px',
            }}
          >
            Deactive
          </button>
        </>
      ),
    },
  ];

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });
  const columnsBlockedUser = [
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
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <>
          <button
            onClick={() => handleUnblock(params.row)}
            style={{
              border: 'none',
              padding: '5px 10px',
              marginRight: '5px',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: 'green',
              color: 'white',
              borderRadius: '5px',
            }}
          >
            Active
          </button>
        </>
      ),
    },
  ];
  const [tableData, setTableData] = useState([]);
  const [AlltableData, setAllTableData] = useState([]);

  const [rows, setRows] = useState(tableData);
  const [deletedRows, setDeletedRows] = useState([]);
  const [approvedRows, setApprovedRows] = useState([]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState(null);
  const [mail, setMail] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [block, setBlock] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const AdminDetails = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://cpdbackend.onrender.com/blocked')
      .then((res) => {
        const filterData = res.data.filter((user) => user.role !== 'admin' && user.role !== 'management');
        setTableData(filterData);
        console.log(filterData);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get('https://cpdbackend.onrender.com/approved')
      .then((res) => {
        const filterData = res.data.filter((user) => user.role !== 'admin' && user.role !== 'management');
        setAllTableData(filterData);
        console.log(filterData);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleBlock = (row) => {
    const userId = block.userId;
    console.log(userId);
    const confirmed = window.confirm('Are you sure you want to Block this User?');
    if (confirmed) {
      axios
        .put(`https://cpdbackend.onrender.com/users/blocked/${userId}`)
        .then((res) => {
          const updatedUsers = AlltableData.filter((u) => u.userId !== row.userId);
          setAlertMessage('User has been Blocked Successfully');
          // setShow(true);
          setTableData(updatedUsers);
          setDeletedRows(updatedUsers);
          handleSend2();
        })
        .catch((err) => {
          console.log(err);
          setAlertMessage(err.message);
        });
    }
  };

  const handleUnblock = (row) => {
    const userId = row.userId;
    console.log(userId);
    const confirmed = window.confirm('Are you sure you want to Unblock this User?');
    if (confirmed) {
      axios
        .put(`https://cpdbackend.onrender.com/users/approve/${userId}`)
        .then((res) => {
          const updatedUsers = tableData.filter((u) => u.userId !== row.userId);
          setAlertMessage('User has been Unblocked Successfully');
          // setShow(true);
          setTableData(updatedUsers);
          setApprovedRows(updatedUsers);
          handleSend(row);
        })
        .catch((err) => {
          console.log(err);
          setAlertMessage(err.message);
        });
    }
  };

  const handleClickOpen = (row) => {
    setBlock(row);
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

  const handleSend = async (row) => {
    try {
      const templateParams = {
        from_email: AdminDetails.email,
        to_email: row.email,
        message: 'Dear Candidate you have been Unblocked by admin',
        from_name: AdminDetails.name,
        to_name: row.name,
      };

      emailjs
        .send('service_om7gti2', 'template_pix77zf', templateParams, 'FEmm8MJRVO24U1jqS')
        .then((response) => {
          console.log('Email sent!', response.status, response.text);
          setAlert(<Alert severity="success">Email sent!</Alert>);
        })
        .catch((error) => {
          setAlert(<Alert severity="error">Email not sent! Internal error</Alert>);

          // setAlertMessage(error.message);
        });
      setAlert(<Alert severity="success">Email sent!</Alert>);

      setMail('');
      handleClose();
    } catch (err) {
      console.log(err);
      setAlert(<Alert severity="error">Email not sent! Internal error</Alert>);
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
          setAlert(<Alert severity="success">Email sent!</Alert>);
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          setAlert(<Alert severity="error">Email not sent! Internal error</Alert>);
        });
      setAlert(<Alert severity="success">Email sent!</Alert>);

      setMail('');
      handleClose();
    } catch (err) {
      console.log(err);
      setAlert(<Alert severity="error">Email not sent! Internal error</Alert>);
    }
  };

  useEffect(() => {
    let timeout;
    if (show) {
      timeout = setTimeout(() => {
        setShow(false);
        navigate('/admin/freeze');
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
        setAlertMessage(''); // Clear the alert message
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
          <Button onClick={handleBlock} color="primary" autoFocus>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ width: '100%', marginTop: '8%' }}>
        <h2 style={{ margin: '20px' }}>All Users</h2>
        <DataGrid
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rows={AlltableData}
          columns={columnsAllUser}
          pageSize={10}
          // checkboxSelection
          getRowId={(row) => row.userId} // assuming "_id" is unique for each row
          onSelectionModelChange={({ selectionModel }) => {
            const rowIds = selectionModel.map((rowId) => parseInt(String(rowId), 10));
            const rowsToDelete = tableData.filter((row) => rowIds.includes(row.userId));
            const rowsToApprove = tableData.filter((row) => rowIds.includes(row.userId));
            setDeletedRows(rowsToDelete);
            setApprovedRows(rowsToApprove);
            // console.log(deletedRows);
          }}
        />
      </div>

      <h2>Block Users</h2>
      <div style={{ width: '100%' }}>
        <DataGrid
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rows={tableData}
          columns={columnsBlockedUser}
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
      </div>
    </>
  );
};

export default BlockUser;
