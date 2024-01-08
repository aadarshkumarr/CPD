import React, { useState, useEffect } from 'react';
import { CToast, CToastBody, CToastClose } from '@coreui/react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BlockCoursesManagement = () => {
  const [reload, setRelod] = useState(false);
  const columnsAllUser = [
    { field: 'courseName', headerName: 'CourseName' },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <>
          <button
            onClick={() => handleBlock(params.row)}
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
            Freeze
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
    { field: 'courseName', headerName: 'CourseName' },
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
            }}
          >
            Activate
          </button>
        </>
      ),
    },
  ];
  const [tableData, setTableData] = useState([]);
  const [AlltableData, setAllTableData] = useState([]);
  console.log(tableData);
  console.log(AlltableData);
  const [rows, setRows] = useState(tableData);
  const [deletedRows, setDeletedRows] = useState([]);
  const [approvedRows, setApprovedRows] = useState([]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://cpdbackend.onrender.com/admin/courses/freeze')
      .then((res) => {
        setTableData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get('https://cpdbackend.onrender.com/admin/courses/active')
      .then((res) => setAllTableData(res.data))
      .catch((err) => console.log(err));
  }, []);

  console.log(tableData);

  const handleBlock = (row) => {
    const userId = row._id;
    console.log(userId);
    const confirmed = window.confirm('Are you sure you want to Freeze this Course?');
    if (confirmed) {
      axios
        .put(`https://cpdbackend.onrender.com/course/freeze/${userId}`)
        .then((res) => {
          const updatedUsers = AlltableData.filter((u) => u.userId !== row.userId);
          setShow(!show);
          setMessage('Course has been Freeze');
          setTableData(updatedUsers);
          setDeletedRows(updatedUsers);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleUnblock = (row) => {
    const userId = row._id;
    const confirmed = window.confirm('Are you sure you want to Activate this Course?');
    if (confirmed) {
      axios
        .put(`https://cpdbackend.onrender.com/course/active/${userId}`)
        .then((res) => {
          const updatedUsers = tableData.filter((u) => u.userId !== row.userId);
          setShow(!show);
          setMessage('Course has been Actived');
          setTableData(updatedUsers);
          setApprovedRows(updatedUsers);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  // useEffect(() => {
  //     let timeout;
  //     if (show) {
  //         timeout = setTimeout(() => {
  //             setShow(false);
  //             reload('/admin/freeze/courses');
  //         }, 3000);
  //     }
  //     return () => clearTimeout(timeout);
  // }, []);

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
        <h2 style={{ margin: '20px' }}>All Courses</h2>
        <DataGrid
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rows={AlltableData}
          columns={columnsAllUser}
          pageSize={10}
          // checkboxSelection
          getRowId={(row) => row._id} // assuming "_id" is unique for each row
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

      <h2>Block Courses</h2>
      <div style={{ width: '100%' }}>
        <DataGrid
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rows={tableData}
          columns={columnsBlockedUser}
          pageSize={10}
          // checkboxSelection
          getRowId={(row) => row._id}
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

export default BlockCoursesManagement;
