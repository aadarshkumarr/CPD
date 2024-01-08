import React, { useState, useEffect } from 'react';
import { CToast, CToastBody, CToastClose } from '@coreui/react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { Alert, alertClasses } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  fileInput: {
    marginBottom: theme.spacing(2),
  },
}));

const Courses = () => {
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
  const [alert, setAlert] = useState(null);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [batchURL, setBatchURL] = useState('');
  const [CourseDetails, setCourseDetails] = useState(null);
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
    setCourseDetails(row);
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
    const courseId = CourseDetails._id;
    try {
      await axios.put(`https://cpdbackend.onrender.com/upload/url/${courseId}`, { batchURL });

      alert('URL uploaded successfully');
      setAlert(<Alert severity="success">URL uploaded successfully</Alert>);

      setBatchURL(null);
      setOpen(false);
    } catch (error) {
      console.error('Error uploading URL:', error);
      alert('An error occurred while uploading the URL');
      setAlert(<Alert severity="error">{error.message}</Alert>);
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

      <div style={{ width: '100%', marginTop: '8%' }}>
        <h2 style={{ margin: '20px' }}>User Courses</h2>
        <DataGrid
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rows={AlltableData}
          columns={columnsAllUser}
          pageSize={10}
          getRowId={(row) => row.courseId}
          onSelectionModelChange={({ selectionModel }) => {
            const rowIds = selectionModel.map((rowId) => parseInt(String(rowId), 10));
            const rowsToApprove = AlltableData.filter((row) => rowIds.includes(row.registrationId));
            setApprovedRows(rowsToApprove);
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

export default Courses;
