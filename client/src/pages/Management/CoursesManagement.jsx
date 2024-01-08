import React, { useState, useEffect } from 'react';
import { CToast, CToastBody, CToastClose } from '@coreui/react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate  , useParams } from 'react-router-dom';
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

const CoursesManagement = () => {
  const columnsAllUser = [
    { field: 'courseId', headerName: 'ID' },
    { field: 'courseName', headerName: 'Name', width: 600 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <>
          <button
            onClick={() => handleOpen(params.row)}
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
            Upload
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
  console.log(AlltableData);
  // console.log(tableData);
  // const [rows, setRows] = useState(tableData);
  // const [deletedRows, setDeletedRows] = useState([]);
  const [approvedRows, setApprovedRows] = useState([]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [batchURL, setBatchURL] = useState("");
  const [ CourseDetails , setCourseDetails] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    axios
      .get(`https://cpdbackend.onrender.com/courses/${id}`)
      .then((res) => setAllTableData(res.data))
      .catch((err) => console.log(err));
  }, []);


  const handleOpen = (row) => {
    setCourseDetails(row)
    console.log(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleBatchImageChange = (event) => {
  //   setBatchImage(event.target.files[0]);
  // };

  const handleBatchURLChange = (event) => {
    setBatchURL(event.target.value);
  };

  // const handleCertificatePdfChange = (event) => {
  //   setCertificatePdf(event.target.files[0]);
  // };


  const handleUpload = async () => {
    const courseId = CourseDetails._id
    try {
  
        await axios.put(`https://cpdbackend.onrender.com/upload/url/${courseId}`, {batchURL} );
  
        alert('URL uploaded successfully');;
        setBatchURL(null);
        setOpen(false);
      } catch (error) {
        console.error('Error uploading URL:', error);
        alert('An error occurred while uploading the URL');
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
        <h2 style={{ margin: '20px' }}>User Courses</h2>
        <DataGrid
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rows={AlltableData}
          columns={columnsAllUser}
          pageSize={10}
          // checkboxSelection
          getRowId={(row) => row.courseId} // assuming "_id" is unique for each row
          onSelectionModelChange={({ selectionModel }) => {
            const rowIds = selectionModel.map((rowId) => parseInt(String(rowId), 10));
            // const rowsToDelete = tableData.filter((row) => rowIds.includes(row.userId));
            const rowsToApprove = AlltableData.filter((row) => rowIds.includes(row.registrationId));
            // setDeletedRows(rowsToDelete);
            setApprovedRows(rowsToApprove);
            // console.log(rowsToApprove);
          }}
        />
      </div>
      <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="upload-dialog-title">
          <DialogTitle id="upload-dialog-title">Upload Files</DialogTitle>
          <DialogContent>
            <TextField
              type="text"
              className={classes.fileInput}
              onChange={handleBatchURLChange}
              label="Batch URL"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            {/* <TextField
              type="file"
              className={classes.fileInput}
              onChange={handleCertificatePdfChange}
              label="Certificate PDF"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              required
            /> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpload} color="primary" variant="contained">
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default CoursesManagement;
