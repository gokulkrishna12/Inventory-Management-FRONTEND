// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages to drastically shrink the initial JS bundle size
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Inventory = lazy(() => import('./pages/Inventory'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const EditProduct = lazy(() => import('./pages/EditProduct'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserSales = lazy(() => import('./pages/UserSales')); // Added User Sales page

// Layout wrapper for all protected pages
function AuthenticatedLayout() {
  return (
    <ProtectedRoute>
      {/* GLOBAL NAVBAR REMOVED FROM HERE! Navbars are now safely inside individual pages */}

      {/* Added <main> landmark to fix the Lighthouse Accessibility error */}
      <main>
        <Outlet />
      </main>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Router>
      {/* Suspense provides a fallback UI while the lazy chunks are downloading */}
      <Suspense fallback={<div style={{ color: 'white', display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<AuthenticatedLayout />}>
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sales" element={<UserSales />} /> {/* Sales Route Added */}
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;