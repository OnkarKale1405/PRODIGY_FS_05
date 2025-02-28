import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

const Changepass = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    if (name === 'oldPassword') {
      setOldPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const changePassword = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const response = await axios.post(
        'http://localhost:8000/api/v1/users/change-pass',
        {
          oldPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert('Password changed successfully.');
      } else {
        throw new Error('Failed to change password.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('An error occurred while changing the password. Please try again.');
    }
  };

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password should match.');
      return;
    }
    changePassword();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '3rem',
      }}
    >
      <Box
        sx={{
          width: '40rem',
          border: '1px solid black',
          borderRadius:'2rem', // Apply border to the whole box
          padding: '2rem', // Add padding inside the box
          '& > *': {
            marginBottom: '1rem', // Add spacing between input fields
          },
        }}
      >
        <TextField
          name="oldPassword"
          label="Old Password"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
          value={oldPassword}
          onChange={handlePasswordChange}
        />
        <TextField
          name="newPassword"
          label="New Password"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
          value={newPassword}
          onChange={handlePasswordChange}
        />
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
          value={confirmPassword}
          onChange={handlePasswordChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: '1rem' }}
        >
          Change Password
        </Button>
      </Box>
    </Box>
  );
};

export default Changepass;
