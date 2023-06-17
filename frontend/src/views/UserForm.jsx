import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from '../contexts/ContextProvider';

export default function UserForm() {

  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    confirm_password: ''
  })
  let {id} = useParams();
  const navigate = useNavigate()
  const [errors, setErrors] = useState(null)  
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/users/${id}`)
        .then(({data}) => {
          setLoading(false)
          setUser(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }
  

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (user.id) {
      axiosClient.put(`/users/${user.id}`, user)
        .then(() => {
          setNotification('User was successfully updated')
          navigate('/users')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/users', user)
        .then(() => {
          setNotification('User was successfully created')
          navigate('/users')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

  

  return (
    <>
        {user.id && <h1>Update User: {user.name}</h1>}
        {!user.id && <h1>New User</h1>}
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        {!loading && (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {errors &&
            <Box>
              {Object.keys(errors).map(key => (
                <Typography key={key}>
                  {errors[key][0]}
                </Typography>
              ))}
            </Box>
          }
        <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            value={user.name}
            label="User Name"
            name="name"
            autoComplete="name"
            autoFocus
            onChange={ (e) => setUser({ ...user, name:e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            value={user.email}
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={ (e) => setUser({ ...user, email:e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={ (e) => setUser({ ...user, password:e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="comfirm_password"
            label="Comfirmed Password"
            type="password"
            id="comfirm_password"
            autoComplete="current-password"
            onChange={ (e) => setUser({ ...user, confirm_password:e.target.value })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Save
          </Button>
        </Box>
        )}
     </> 
  );
}