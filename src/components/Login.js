// components/Login.js
import  { useState, useContext } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import  {AuthContext}  from '../context/AuthContext'; // Adjust path
import { useAuthModal } from '@/context/AuthModalContext';
import { CartContext } from '@/context/CartContext';

const Login = () => {
    const router = useRouter();
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext); // Get the login function
    const {closeModal}= useAuthModal()
    const {fetchCartItems}= useContext(CartContext)
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      const email = event.target.email.value;
      const password = event.target.password.value;
     if(!email && !password) {
        setError('Please enter both email and password');
        return;
     }
    
      try {
        const successfulLogin = await login(email, password);
        console.log(successfulLogin) 
        if (!successfulLogin.is_error) {
          // Login successful, redirect to home page or another protected route
          // router.push('/products');
          //cart api trigger
          fetchCartItems()
          closeModal() 
        } else {
          // Handle login errors (e.g., display error message)
          setError(successfulLogin?.message); 
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('An error occurred during login.'); 
      }
    };
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
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
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Login
      </Button>
    </Box>
  );
};

export default Login;



// In your main component:
