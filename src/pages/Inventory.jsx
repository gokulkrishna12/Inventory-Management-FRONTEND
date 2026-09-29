import React from 'react';
import AdminInventory from './AdminInventory';
import UserInventory from './UserInventory';

export default function Inventory() {
  let role = 'user';
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // Safely decode the JWT payload
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      role = payload.role === 'admin' ? 'admin' : 'user';
    }
  } catch (err) {
    role = 'user';
  }

  // Absolutely zero chance of cross-contamination now. 
  // If you are admin, you get AdminInventory. Otherwise, UserInventory.
  return role === 'admin' ? <AdminInventory /> : <UserInventory />;
}