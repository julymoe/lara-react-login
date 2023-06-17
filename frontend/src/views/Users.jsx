import { useEffect, useState } from 'react'
import axiosClient from "../axios-client";
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useStateContext } from '../contexts/ContextProvider';


function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

  const navigate = useNavigate()

  const [clickedRow, setClickedRow] = useState();
  const onButtonClick = (e, row) => {
    e.stopPropagation();
    setClickedRow(row);
  };

  useEffect(()=>{
    getUsers();
  },[])

  const getUsers = () => {
    setLoading(true)
    axiosClient.get('/users')
      .then(({ data }) => {
        setLoading(false) 
        setUsers(data.data)
        console.log(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  } 

  
  const onDelete = (users) => {
    console.log(`/users/${users.id}`)
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }
    
    axiosClient.delete(`/users/${users.id}`)
      .then(() => {
        setNotification('User was successfully deleted')
        getUsers()
      })
        .catch(error => {
            console.error('There was an error!', error);
        });
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 250,
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      editable: true,
    },
    {
      field: 'created_at',
      headerName: 'Created Date',
      type: 'number',
      width: 200,
      editable: true,
    },
    {
      field: "editButton",
        headerName: "Actions",
        description: "Actions column.",
        sortable: false,
        width: 200,
        renderCell: (users) => {
          return (
            <>
              <Button
                onClick={()=>navigate('/users/' + users.id)}
                variant="outlined"
              >
                Edit
              </Button>
              &nbsp;&nbsp;
              <Button
              onClick={()=>onDelete(users)}
              variant="outlined"
              >
                Delete
              </Button>
            </>
          );
        }
    },
  ];

  return (
    <>
      <Button variant="outlined" onClick={()=>navigate('/users/new')}>Add New User</Button>
      <Box sx={{ height: 'auto', width: '100%', pt: '15px', }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 15,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </>
  )
}

export default Users



