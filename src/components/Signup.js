// components/Signup.js
import  { useContext, useState } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';
import { BASE_URL } from '@/apis/baseurl';

const Signup = () => {
    const router = useRouter();
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext); // To automatically log in after signup

  const handleSubmit = async (event) => {
    event.preventDefault();

    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    if(!email && !password && !firstName && !lastName) {
      setError('Please enter all required fields');
      return;
   }
    try {
      const response = await fetch(`${BASE_URL}/api/user/create`, {
        method: 'POST',
        headers: {
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning':'true'
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });

      if (response.ok) {
        // Handle successful signup (e.g., show success message, redirect)
        console.log('Signup successful!'); 
        try {
            // Assuming the signup API doesn't automatically log the user in
            await login(email, password); 
            router.push('/');
          } catch (error) {
            console.error('Error during auto-login after signup:', error);
            // Handle error (e.g., redirect to login page)
          }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An error occurred during signup.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField 
        margin="normal"
        required
        fullWidth
        id="firstName"
        label="First Name"
        name="firstName"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="lastName"
        label="Last Name"
        name="lastName"
      />
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
        Sign Up
      </Button>
    </Box>
  );
};

export default Signup;