// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Login is the landing page, so it is loaded eagerly to avoid an extra request
import Login from './pages/Login';

// Everything else stays lazy-loaded to keep the initial JS bundle small
const Register = lazy(() => import('./pages/Register'));
const Inventory = lazy(() => import('./pages/Inventory'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const EditProduct = lazy(() => import('./pages/EditProduct'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserSales = lazy(() => import('./pages/UserSales'));

// Layout wrapper for all protected pages
function AuthenticatedLayout() {
  return (
    <ProtectedRoute>
      {/* <main> landmark for accessibility */}
      <main>
        <Outlet />
      </main>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Router>
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
            <Route path="/sales" element={<UserSales />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;