import React, { useState, useEffect } from 'react';
import { CToast, CToastBody, CToastClose } from '@coreui/react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  fileInput: {
    marginBottom: theme.spacing(2),
  },
}));

const ApproveAllUsersManagement = () => {
  const columnsAllUser = [
    { field: 'userId', headerName: 'ID' },
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 250,
      renderCell: (params) => (
        <>
          <button
            onClick={() => handleClick(params.row)}
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
            All Courses
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

  // const [tableData, setTableData] = useState([]);
  const [AlltableData, setAllTableData] = useState([]);
  // console.log(AlltableData);
  // console.log(tableData);
  // const [rows, setRows] = useState(tableData);
  // const [deletedRows, setDeletedRows] = useState([]);
  const [approvedRows, setApprovedRows] = useState([]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [ userDetails , setUserDetails] = useState(null);
  const [ password , setPassword] = useState(null);
  const [ confirmPassword , setConfirmPassword] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://cpdbackend.onrender.com/approved')
      .then((res) => setAllTableData(res.data))
      .catch((err) => console.log(err));
  }, []);


  const handleOpen = (row) => {
    setUserDetails(row)
    console.log(row);
    setOpen(true);
  };

  const handleClick = (row) => {
    navigate(`/management/user-courses/${row.userId}`);
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
    if ( password === confirmPassword ) {
      try{
        const userId = userDetails.userId;
        const response = await axios.put(`https://cpdbackend.onrender.com/change/password/${userId}` , { password } )
        alert(response.data.message)
        setPassword(null)
        setConfirmPassword()
        handleClose()
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("Password and Confim Password Should be Same")
    }
  };

  // const handleUpload = (row) => {
  //   const userId = row.userId;
  //   console.log(userId);
  //   const confirmed = window.confirm('Are you sure you want to Block this User?');
  //   if (confirmed) {
  //     axios
  //       .put(`https://cpdbackend.onrender.com/users/blocked/${userId}`)
  //       .then((res) => {
  //         const updatedUsers = AlltableData.filter((u) => u.userId !== row.userId);
  //         setShow(true);
  //         setMessage('User has been Block');
  //         // setTableData(updatedUsers);
  //         // setDeletedRows(updatedUsers);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // };

  useEffect(() => {
    let timeout;
    if (show) {
      timeout = setTimeout(() => {
        setShow(false);
        navigate('/management/freeze');
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [show]);

  return (
    <>
      {show && (
        <CToast visible color="success" className="text-white align-items-center">
          <div className="d-flex">
            <CToastBody className="ml-4">{message}</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>
      )}

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
            // const rowsToDelete = tableData.filter((row) => rowIds.includes(row.userId));
            const rowsToApprove = AlltableData.filter((row) => rowIds.includes(row.userId));
            // setDeletedRows(rowsToDelete);
            setApprovedRows(rowsToApprove);
            // console.log(rowsToApprove);
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
    </>
  );
};

export default ApproveAllUsersManagement;
