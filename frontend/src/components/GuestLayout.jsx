import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import { Box, Container } from '@mui/material'

function GuestLayout() {
  const {token} = useStateContext()
  if(token){
    return <Navigate to='/' />
  }
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{  
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        
        <Outlet />
      </Box>
    </Container>
  )
}

export default GuestLayout