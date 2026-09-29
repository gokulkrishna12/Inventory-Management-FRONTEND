import React from 'react';
import AdminInventory from './AdminInventory';
import UserInventory from './UserInventory';

export default function Inventory() {
  let role = 'user';
  try {
    const token = localStorage.getItem('token');
    if (token) {
      let base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      // Pad the string so atob() never throws a decoding error
      while (base64.length % 4) {
        base64 += '=';
      }

      const payload = JSON.parse(window.atob(base64));
      role = payload.role === 'admin' ? 'admin' : 'user';
    }
  } catch (err) {
    console.error("JWT Decode Error (Inventory Wrapper):", err);
    role = 'user';
  }

  // Maps securely to the isolated components
  return role === 'admin' ? <AdminInventory /> : <UserInventory />;
}