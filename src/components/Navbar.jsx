import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Layers, ShieldCheck, LayoutDashboard, List, History } from 'lucide-react';

// Bulletproof Token Decoder
const getRoleFromToken = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return 'user';
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload).role === 'admin' ? 'admin' : 'user';
    } catch (err) {
        return 'user';
    }
};

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    // INSTANT LOAD: No flicker possible
    const [userRole, setUserRole] = useState(getRoleFromToken);

    useEffect(() => {
        setUserRole(getRoleFromToken());
    }, [location.pathname]);

    return (
        <header className="glass-panel" style={{ margin: '1.5rem auto', maxWidth: '1100px', width: 'calc(100% - 3rem)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.2)', padding: '10px', borderRadius: '10px', color: '#38bdf8' }}>
                    <Layers size={24} />
                </div>
                <div style={{ cursor: 'pointer' }} onClick={() => navigate('/inventory')}>
                    <h1 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>GK's Enterprise Hub</h1>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                        Secure MERN Stack Inventory • Real-time RBAC & Audit Logging Enabled
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', marginRight: '10px', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '20px' }}>

                    {userRole === 'admin' && (
                        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                            <LayoutDashboard size={16} color="#38bdf8" /> Dashboard
                        </Link>
                    )}

                    <Link to="/inventory" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                        <List size={16} color="#34d399" /> Inventory
                    </Link>

                    {userRole === 'user' && (
                        <Link to="/sales" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                            <History size={16} color="#38bdf8" /> Sales History
                        </Link>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                    <ShieldCheck size={14} /> JWT Secured
                </div>
            </div>
        </header>
    );
}

export default Navbar;