import React, { useState, useEffect } from 'react';
import { CToast, CToastBody, CToastClose } from '@coreui/react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { Alert } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  fileInput: {
    marginBottom: theme.spacing(2),
  },
}));

const ApproveAllUsers = () => {
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
      width: 350,
      renderCell: (params) => (
        <>
          <button
            onClick={() => handleOpenUploadModal(params.row)}
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
            Upload badge certificate
          </button>
          <button
            onClick={() => handleOpen(params.row)}
            style={{
              border: 'none',
              padding: '5px 10px',
              marginRight: '5px',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: 'skyblue',
              color: 'black',
            }}
          >
            Change Password
          </button>
        </>
      ),
    },
  ];

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });

  const [AlltableData, setAllTableData] = useState([]);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [badgeLink, setBadgeLink] = useState('');
  const [approvedRows, setApprovedRows] = useState([]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

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

  const handleOpen = (row) => {
    setUserDetails(row);
    console.log(row);
    setOpen(true);
  };

  const handleOpenUploadModal = (user) => {
    setUserDetails(user);
    setOpenUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setOpenUploadModal(false);
    setBadgeLink(''); // Reset the badge link input value
  };

  const handleClick = (row) => {
    navigate(`/admin/user-courses/${row.userId}`);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePassChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCpassChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleChangePass = async () => {
    if (password === confirmPassword) {
      try {
        const userId = userDetails.userId;
        const response = await axios.put(`https://cpdbackend.onrender.com/change/password/${userId}`, { password });
        setAlert(<Alert severity="success">{response.data.message}</Alert>);
        clearAlertAfterDelay();
        setPassword(null);
        setConfirmPassword();
        handleClose();
      } catch (err) {
        setAlert(<Alert severity="error">{err.message}</Alert>);
        clearAlertAfterDelay();
      }
    } else {
      setAlert(<Alert severity="error">Password and Confim Password Should be Same</Alert>);
      clearAlertAfterDelay();
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

  const handleUploadBadgeCertificate = async () => {
    if (userDetails) {
      const userId = userDetails.userId;
      const name = userDetails.name;
      const email = userDetails.email;

      const data = {
        userId,
        name,
        email,
        badgeLink,
      };

      try {
        const baseUrl = `https://cpdbackend.onrender.com/create-badge/${userId}`;
        const result = await axios.post(baseUrl, data);
        console.log(result.data);
        setAlert(<Alert severity="success">Badge upload successfully</Alert>);
        clearAlertAfterDelay();
        handleCloseUploadModal();
      } catch (error) {
        console.error('Error uploading badge certificate:', error);
        setAlert(<Alert severity="error">{('Error uploading badge certificate:', error)}</Alert>);
        clearAlertAfterDelay();
      }
    }
  };

  const clearAlertAfterDelay = () => {
    setTimeout(() => {
      setAlert(null);
      // window.location.reload();
    }, 5000);
  };

  const renderAlert = () => {
    if (alert) {
      return (
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
      );
    }
    return null;
  };

  return (
    <>
      {renderAlert()}

      <div style={{ width: '100%', marginTop: '8%' }}>
        <h2 style={{ margin: '20px' }}>Approved Users</h2>
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
            const rowsToApprove = AlltableData.filter((row) => rowIds.includes(row.userId));
            setApprovedRows(rowsToApprove);
          }}
        />
      </div>
      <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="upload-dialog-title">
          <DialogTitle id="upload-dialog-title">Change Password</DialogTitle>
          <DialogContent>
            <TextField
              type="password"
              className={classes.fileInput}
              onChange={handlePassChange}
              label="Password"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <TextField
              type="password"
              className={classes.fileInput}
              onChange={handleCpassChange}
              label="Confirm Password"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleChangePass} color="primary" variant="contained">
              Change
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Dialog open={openUploadModal} onClose={handleCloseUploadModal} aria-labelledby="upload-dialog-title">
        <DialogTitle id="upload-dialog-title">Upload Badge Certificate</DialogTitle>
        <DialogContent>
          <TextField
            className={classes.fileInput}
            value={badgeLink}
            onChange={(e) => setBadgeLink(e.target.value)}
            label="Badge Link"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUploadBadgeCertificate} color="primary" variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApproveAllUsers;
