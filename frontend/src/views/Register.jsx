import { Box, Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Register() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const {setUser, setToken} = useStateContext()
  const [errors, setErrors] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      confirm_password: confirmPasswordRef.current.value,
    }
    axiosClient.post('/register', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token);
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors)
        }
      })
  };

 
 
  

  return (
    <>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
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
            label="User Name"
            name="name"
            autoComplete="name"
            autoFocus
            inputRef={nameRef}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            inputRef={emailRef}
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
            inputRef={passwordRef}
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
            inputRef={confirmPasswordRef}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/login" variant="body2">
                {"Already have an account? Login"}
              </Link>
            </Grid>
          </Grid>
        </Box>
     </> 
  );
}