import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'
import { Edit, Trash2, LogOut, Download, Plus, Search } from 'lucide-react'
import AdminNavbar from '../components/AdminNavbar'
import Footer from '../components/Footer'
import '../styles/Inventory.css'

export default function AdminInventory() {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [toast, setToast] = useState('')
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
    const [auditLogs, setAuditLogs] = useState([])

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

    useEffect(() => {
        api.get(`/products`).then((res) => { setProducts(res.data?.data || []); setLoading(false) })
            .catch(() => { setError('Failed to load products.'); setLoading(false) })
    }, [])

    const handleDelete = (id) => {
        if (window.confirm('Delete this product?')) {
            api.delete(`/products/${id}`).then(() => {
                setProducts(prev => prev.filter(item => (item._id || item.id) !== id))
                showToast('Deleted successfully!')
            }).catch(err => showToast('Delete failed.'))
        }
    }

    const handleLogout = () => { localStorage.removeItem('token'); navigate('/') }

    const handleViewHistory = async () => {
        try {
            const response = await api.get('/products/transactions/history');
            setAuditLogs(response.data.data);
            setIsHistoryModalOpen(true);
        } catch (err) { showToast('Failed to load history.'); }
    }

    const filteredProducts = products.filter((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <>
            <AdminNavbar />
            <div className="inventory-container">
                {toast && <div className="toast-message">{toast}</div>}

                {isHistoryModalOpen && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
                        <div className="glass-panel" style={{ padding: '2rem', width: '800px', maxHeight: '80vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3 style={{ color: '#fff' }}>Store Audit Logs (All Users)</h3>
                                <button onClick={() => setIsHistoryModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Close X</button>
                            </div>
                            <table className="inventory-table" style={{ marginTop: '10px' }}>
                                <thead><tr><th>Date</th><th>Employee</th><th>Action</th><th>Product</th><th>Qty</th></tr></thead>
                                <tbody>
                                    {auditLogs.map((log) => (
                                        <tr key={log._id}>
                                            <td style={{ color: '#94a3b8' }}>{new Date(log.createdAt).toLocaleDateString()}</td>
                                            <td style={{ color: '#38bdf8' }}>{log.user?.name || log.user?.email || 'System'}</td>
                                            <td><span style={{ color: log.type === 'IN' ? '#34d399' : '#f87171' }}>{log.description || (log.type === 'IN' ? 'Stock Added' : 'Item Sold')}</span></td>
                                            <td style={{ color: log.product ? '#fff' : '#f87171' }}>{log.product?.name || '[Item Deleted]'}</td>
                                            <td>{log.quantityChanged}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="inventory-header glass-panel">
                    <div className="header-top-row">
                        <div className="header-title"><h2>Admin Inventory Hub</h2></div>
                        <div className="header-actions">
                            <button onClick={handleViewHistory} className="header-btn" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>View History</button>
                            <button onClick={() => navigate('/add-product')} className="header-btn btn-add"><Plus size={16} /> Add Product</button>
                            <button onClick={handleLogout} className="header-btn btn-logout"><LogOut size={16} /> Logout</button>
                        </div>
                    </div>
                    <div className="search-bar-container">
                        <Search size={18} className="search-icon-full" />
                        <input type="text" className="search-input-full" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                {loading ? <div className="loading-state glass-panel">Loading...</div> : (
                    <div className="inventory-table-card glass-panel">
                        <table className="inventory-table">
                            <thead><tr><th>Name</th><th>Price</th><th>Quantity</th><th>Actions</th></tr></thead>
                            <tbody>
                                {filteredProducts.map((p) => (
                                    <tr key={p._id || p.id}>
                                        <td>{p.name}</td><td>${p.price}</td><td>{p.quantity}</td>
                                        <td>
                                            <div className="actions-cell">
                                                <button className="btn-edit" onClick={() => navigate(`/edit-product/${p._id || p.id}`)}><Edit size={16} /></button>
                                                <button className="btn-delete" onClick={() => handleDelete(p._id || p.id)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Footer />
            </div>
        </>
    )
}