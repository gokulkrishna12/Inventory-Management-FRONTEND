import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages (Adjust the paths if your folder structure is slightly different)
import Login from './pages/Login';
import Register from './pages/Register';
import AdminInventory from './pages/AdminInventory';
import UserInventory from './pages/UserInventory';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Dashboard from './pages/Dashboard';
import UserSales from './pages/UserSales';

// Helper to decode JWT safely and prevent silent frontend crashes
function getUserRole() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Dynamic padding fixes malformed token reads
        while (base64.length % 4) { base64 += '='; }
        const payload = JSON.parse(window.atob(base64));
        return payload.role; // Returns 'admin', 'staff', or 'user'
    } catch (error) {
        return null;
    }
}

// 1. Dynamic Route Protector (Solves UI State-Leakage)
function ProtectedInventory() {
    const role = getUserRole();
    if (!role) return <Navigate to="/" />; // Kick to login if no token
    
    // Admin and Staff get the full CRUD suite
    if (role === 'admin' || role === 'staff') {
        return <AdminInventory />;
    }
    // Basic Users only get the POS screen
    if (role === 'user') {
        return <UserInventory />;
    }
    
    return <Navigate to="/" />;
}

// 2. Strict Role-Based Wrapper for Admin/Staff Views
function AdminStaffRoute({ children }) {
    const role = getUserRole();
    if (!role) return <Navigate to="/" />;
    return (role === 'admin' || role === 'staff') ? children : <Navigate to="/inventory" />;
}

// 3. Strict Role-Based Wrapper for User Views
function UserRoute({ children }) {
    const role = getUserRole();
    if (!role) return <Navigate to="/" />;
    return (role === 'user') ? children : <Navigate to="/inventory" />;
}

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Auth Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dynamic Decoupled Inventory Route */}
                <Route path="/inventory" element={<ProtectedInventory />} />

                {/* Admin/Staff Secured Routes */}
                <Route 
                    path="/dashboard" 
                    element={<AdminStaffRoute><Dashboard /></AdminStaffRoute>} 
                />
                <Route 
                    path="/add-product" 
                    element={<AdminStaffRoute><AddProduct /></AdminStaffRoute>} 
                />
                <Route 
                    path="/edit-product/:id" 
                    element={<AdminStaffRoute><EditProduct /></AdminStaffRoute>} 
                />

                {/* User Secured Routes */}
                <Route 
                    path="/sales" 
                    element={<UserRoute><UserSales /></UserRoute>} 
                />
            </Routes>
        </Router>
    );
}

export default App;