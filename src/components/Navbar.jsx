import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layers, ShieldCheck, LayoutDashboard, List, History } from 'lucide-react';

function Navbar() {
    const navigate = useNavigate();

    // INSTANT Synchronous role check. No useEffect delays.
    const [userRole] = useState(() => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return 'user';
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Navbar Token Role:", payload.role); // Check your F12 console!
            return payload.role === 'admin' ? 'admin' : 'user';
        } catch (err) {
            return 'user';
        }
    });

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

                    {/* ONLY ADMIN SEES DASHBOARD */}
                    {userRole === 'admin' && (
                        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }}>
                            <LayoutDashboard size={16} color="#38bdf8" /> Dashboard
                        </Link>
                    )}

                    {/* INVENTORY LINK FOR ALL */}
                    <Link to="/inventory" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                        <List size={16} color="#34d399" /> Inventory
                    </Link>

                    {/* SALES HISTORY - STRICTLY HIDDEN FROM ADMINS */}
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