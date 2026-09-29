import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'
import { LogOut, Download, Search, ShoppingCart } from 'lucide-react'
import Footer from '../components/Footer'
import '../styles/Inventory.css'

export default function UserInventory() {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [toast, setToast] = useState('')

    const [isSellModalOpen, setIsSellModalOpen] = useState(false)
    const [sellData, setSellData] = useState({ id: null, name: '', maxQty: 0 })
    const [sellQuantity, setSellQuantity] = useState(1)

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

    const handleSellClick = (product) => {
        const productId = product._id || product.id;
        setSellData({ id: productId, name: product.name, maxQty: product.quantity });
        setSellQuantity(1);
        setIsSellModalOpen(true);
    }

    const confirmSale = async () => {
        if (sellQuantity < 1 || sellQuantity > sellData.maxQty) {
            showToast('Invalid quantity!');
            return;
        }
        try {
            await api.post(`/products/${sellData.id}/sell`, { quantitySold: Number(sellQuantity) });
            setProducts(products.map(p => {
                const pId = p._id || p.id;
                if (pId === sellData.id) return { ...p, quantity: p.quantity - sellQuantity };
                return p;
            }));
            showToast(`Successfully sold ${sellQuantity}x ${sellData.name}!`);
            setIsSellModalOpen(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Sale failed.');
        }
    }

    const filteredProducts = products.filter((product) => {
        const searchLower = searchTerm.toLowerCase()
        return product.name?.toLowerCase().includes(searchLower) || product.category?.name?.toLowerCase().includes(searchLower)
    })

    return (
        <div className="inventory-container">
            {toast && <div className="toast-message">{toast}</div>}

            {isSellModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
                    <div className="glass-panel" style={{ padding: '2rem', width: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <h3 style={{ margin: 0, color: '#fff' }}>Sell Product</h3>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{sellData.name}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Quantity (Max: {sellData.maxQty})</label>
                            <input type="number" min="1" max={sellData.maxQty} value={sellQuantity} onChange={(e) => setSellQuantity(e.target.value)} style={{ padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button onClick={() => setIsSellModalOpen(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={confirmSale} style={{ flex: 1, padding: '10px', background: '#10b981', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Confirm Sale</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="inventory-header glass-panel">
                <div className="header-top-row">
                    <div className="header-title"><h2>Staff Point of Sale</h2><p>Process outbound stock accurately</p></div>
                    <div className="header-actions">
                        <span className="inventory-count">{filteredProducts.length} Items</span>
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
                                            <button className="btn-sell" onClick={() => handleSellClick(product)}><ShoppingCart size={14} /> Sell</button>
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