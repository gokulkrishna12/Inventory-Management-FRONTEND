import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'
import { Edit, Trash2, LogOut, Download, Plus, Search } from 'lucide-react'
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

    const showToast = (msg) => {
        setToast(msg)
        setTimeout(() => setToast(''), 3000)
    }

    useEffect(() => {
        api.get(`/products`)
            .then((response) => {
                setProducts(response.data?.data || [])
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error fetching products:', err)
                setError('Failed to load products.')
                setLoading(false)
            })
    }, [])

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            api.delete(`/products/${id}`)
                .then(() => {
                    setProducts((prev) => prev.filter((item) => (item._id || item.id) !== id))
                    showToast('Product deleted successfully!')
                })
                .catch((err) => showToast(err.response?.data?.message || 'Delete failed.'))
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    const handleExportCSV = async () => {
        try {
            const response = await api.get('/csv/export', { responseType: 'blob' })
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (err) {
            showToast('Failed to export CSV.')
        }
    }

    const handleViewHistory = async () => {
        try {
            const response = await api.get('/products/transactions/history');
            setAuditLogs(response.data.data);
            setIsHistoryModalOpen(true);
        } catch (err) {
            showToast('Failed to load history.');
        }
    }

    const filteredProducts = products.filter((product) => {
        const searchLower = searchTerm.toLowerCase()
        return product.name?.toLowerCase().includes(searchLower) || product.category?.name?.toLowerCase().includes(searchLower)
    })

    return (
        <div className="inventory-container">
            {toast && <div className="toast-message">{toast}</div>}

            {isHistoryModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
                    <div className="glass-panel" style={{ padding: '2rem', width: '800px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.2)', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#fff' }}>Store Audit Logs (All Users)</h3>
                            <button onClick={() => setIsHistoryModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>Close X</button>
                        </div>
                        <table className="inventory-table" style={{ marginTop: '10px' }}>
                            <thead>
                                <tr><th>Date</th><th>Employee</th><th>Action</th><th>Product</th><th>Qty</th></tr>
                            </thead>
                            <tbody>
                                {auditLogs.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>No transactions found.</td></tr>
                                ) : (
                                    auditLogs.map((log) => (
                                        <tr key={log._id}>
                                            <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(log.createdAt).toLocaleString()}</td>
                                            <td style={{ color: '#38bdf8' }}>{log.user?.name || log.user?.email || 'System'}</td>
                                            <td>
                                                <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', background: log.type === 'IN' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: log.type === 'IN' ? '#34d399' : '#f87171' }}>
                                                    {log.description || (log.type === 'IN' ? 'Stock Added' : 'Item Sold')}
                                                </span>
                                            </td>
                                            <td style={{ color: log.product ? '#fff' : '#f87171' }}>{log.product?.name || '[Item Deleted]'}</td>
                                            <td style={{ fontWeight: 'bold' }}>{log.quantityChanged}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="inventory-header glass-panel">
                <div className="header-top-row">
                    <div className="header-title"><h2>Admin Inventory Hub</h2><p>Full control and audit management</p></div>
                    <div className="header-actions">
                        <span className="inventory-count">{filteredProducts.length} Items</span>
                        <button onClick={handleViewHistory} className="header-btn" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>View History</button>
                        <button onClick={() => navigate('/add-product')} className="header-btn btn-add"><Plus size={16} /> Add Product</button>
                        <button onClick={handleExportCSV} className="header-btn btn-csv"><Download size={16} /> Export CSV</button>
                        <button onClick={handleLogout} className="header-btn btn-logout"><LogOut size={16} /> Logout</button>
                    </div>
                </div>
                <div className="search-bar-container">
                    <Search size={18} className="search-icon-full" />
                    <input type="text" className="search-input-full" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            {loading ? <div className="loading-state glass-panel">Loading...</div> : error ? <div className="error-state glass-panel">{error}</div> : (
                <div className="inventory-table-card glass-panel">
                    <table className="inventory-table">
                        <thead>
                            <tr><th>Name</th><th>Category</th><th>Price</th><th>Quantity</th><th>Supplier</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product._id || product.id}>
                                    <td className="product-name">{product.name}</td>
                                    <td><span className="category-badge">{product.category?.name || 'Uncategorized'}</span></td>
                                    <td className="price-text">${Number(product.price || 0).toFixed(2)}</td>
                                    <td><span className={product.quantity <= 0 ? 'quantity-badge out-of-stock' : product.quantity <= 10 ? 'quantity-badge low-stock' : 'quantity-badge in-stock'}>{product.quantity}</span></td>
                                    <td style={{ color: '#cbd5e1' }}>{product.supplier?.name || 'Unknown'}</td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="btn-edit" onClick={() => navigate(`/edit-product/${product._id || product.id}`)}><Edit size={16} /></button>
                                            <button className="btn-delete" onClick={() => handleDelete(product._id || product.id)}><Trash2 size={16} /></button>
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
    )
}