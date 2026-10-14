import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UpdatePassword.css';

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    try {
      const passwordData = { oldPassword, newPassword, confirmPassword };
      await axios.put('http://localhost:8080/updatePassword', passwordData);
      
      // Clear form fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully.');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password.');
    }
  };

  return (
    <div className="update-password-container">
      <div className="card">
        <h3 className="text-center">Update Password</h3>
        
        <div className="form-group mb-3">
  <label htmlFor="oldPassword">Old Password:</label>
  <input
    type="password"
    className="form-control"
    id="oldPassword"
    value={oldPassword}
    onChange={(e) => {
      if (e.target.value.length <= 8) {
        setOldPassword(e.target.value);
      }
    }}
  />
</div>

<div className="form-group mb-3">
  <label htmlFor="newPassword">New Password:</label>
  <input
    type="password"
    className="form-control"
    id="newPassword"
    value={newPassword}
    onChange={(e) => {
      if (e.target.value.length <= 8) {
        setNewPassword(e.target.value);
      }
    }}
  />
</div>

<div className="form-group mb-3">
  <label htmlFor="confirmPassword">Confirm New Password:</label>
  <input
    type="password"
    className="form-control"
    id="confirmPassword"
    value={confirmPassword}
    onChange={(e) => {
      if (e.target.value.length <= 8) {
        setConfirmPassword(e.target.value);
      }
    }}
  />
</div>

        <button className="btnn btnn-primary" onClick={handleUpdatePassword}>
          Update Password
        </button>
      </div>
    </div>
  );
};

export default UpdatePassword;
