import React, { useState, useEffect } from 'react';
import { CToast, CToastBody, CToastClose } from '@coreui/react';
import emailjs from 'emailjs-com';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const CPDApproveManagement = () => {
  const columns = [
    { field: 'registrationId', headerName: 'ID', width: 50 },
    { field: 'title', headerName: 'Title', width: 100 },
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
  const [change,setChange] = useState("")

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
    const userId = cpd.registrationId;
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
          setMessage('CPD has been Rejected');
          setDeletedRows(updatedUsers);
          setTableData(updatedUsers);
          handleSend2(); // update tableData state with the latest data
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleApproved = (row) => {
    const userId = row.registrationId;
    // console.log(userId);
    const confirmed = window.confirm('Are you sure you want to approve this CPD?');
    if (confirmed) {
      axios
        .put(`https://cpdbackend.onrender.com/addcpds/approve/${userId}`)
        .then((res) => {
          const updatedUsers = tableData.map((u) => (u._id === row._id ? { ...u, status: 'approved' } : u));
          setShow(true);
          setMessage('CPD has been approved');
          setTableData(updatedUsers); // update tableData state
          setApprovedRows(updatedUsers);
          fetchUsers(row.registrationId);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  const updateOpenPop = (id) => {
    setIde(id)
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
    fetchUsers2(row.registrationId);
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

  const handleSend2 = async () => {
    try {
      // e.preventDefault();
      // console.log(row.registrationId);
      // Handle sending the message here
      console.log(user);
      const templateParams = {
        from_email: AdminDetails.email,
        to_email: 'dipakchaudhari9876@gmail.com',
        message: mail,
        from_name: AdminDetails.name,
        to_name: user.name || '',
      };

      emailjs
        .send('service_om7gti2', 'template_pix77zf', templateParams, 'FEmm8MJRVO24U1jqS')
        .then((response) => {
          console.log('Email sent!', response.status, response.text);
        })
        .catch((error) => {
          console.error('Error sending email:', error);
        });

      alert('Email send');
      setMail('');
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSend = async (data) => {
    try {
      // e.preventDefault();
      // console.log(row.registrationId);
      // Handle sending the message here
      console.log(data);
      const templateParams = {
        from_email: AdminDetails.email,
        to_email: 'dipakchaudhari9876@gmail.com',
        message: 'Dear Candidate user CPD has Approved by admin',
        from_name: AdminDetails.name,
        to_name: data.name || '',
      };

      emailjs
        .send('service_om7gti2', 'template_pix77zf', templateParams, 'FEmm8MJRVO24U1jqS')
        .then((response) => {
          console.log('Email sent!', response.status, response.text);
        })
        .catch((error) => {
          console.error('Error sending email:', error);
        });

      alert('Email send');
      setMail('');
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let timeout;
    if (show) {
      timeout = setTimeout(() => {
        setShow(false);
        navigate('/management/cpd');
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
        setChange(res.data)
        setUpdateOpen(false)

      })
      .catch((err) => console.log(err));
  };

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
          <Button onClick={handleReject} color="primary" autoFocus>
            Send
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={updateOpen} onClose={updateOpenPop}>
        <DialogTitle>Update Hour</DialogTitle>
        <DialogContent>
          <TextField onChange={(e)=>{
            setHour({hours:e.target.value})
          }} value={hour.hours} rows={1} variant="outlined" fullWidth sx={{ width: '500px' }} />
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
      {show && (
        <CToast visible color="success" className="text-white align-items-center">
          <div className="d-flex">
            <CToastBody className="ml-4">{message}</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>
      )}
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
            getRowId={(row) => row.registrationId}
            onSelectionModelChange={({ selectionModel }) => {
              const rowIds = selectionModel.map((rowId) => parseInt(String(rowId), 10));
              const rowsToDelete = tableData.filter((row) => rowIds.includes(row.registrationId));
              const rowsToApprove = tableData.filter((row) => rowIds.includes(row.registrationId));
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

export default CPDApproveManagement;