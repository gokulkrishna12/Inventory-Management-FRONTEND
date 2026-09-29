import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'
import { LogOut, Search, ShoppingCart } from 'lucide-react'
import UserNavbar from '../components/UserNavbar'
import Footer from '../components/Footer'
import '../styles/Inventory.css'

export default function UserInventory() {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState('')
    const [isSellModalOpen, setIsSellModalOpen] = useState(false)
    const [sellData, setSellData] = useState({ id: null, name: '', maxQty: 0 })
    const [sellQuantity, setSellQuantity] = useState(1)

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

    useEffect(() => {
        api.get(`/products`).then((res) => { setProducts(res.data?.data || []); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const handleLogout = () => { localStorage.removeItem('token'); navigate('/') }

    const handleSellClick = (product) => {
        setSellData({ id: product._id || product.id, name: product.name, maxQty: product.quantity });
        setSellQuantity(1); setIsSellModalOpen(true);
    }

    const confirmSale = async () => {
        try {
            await api.post(`/products/${sellData.id}/sell`, { quantitySold: Number(sellQuantity) });
            setProducts(products.map(p => (p._id || p.id) === sellData.id ? { ...p, quantity: p.quantity - sellQuantity } : p));
            showToast(`Successfully sold!`); setIsSellModalOpen(false);
        } catch (err) { showToast('Sale failed.'); }
    }

    const filteredProducts = products.filter((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <>
            <UserNavbar />
            <div className="inventory-container">
                {toast && <div className="toast-message">{toast}</div>}

                {isSellModalOpen && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
                        <div className="glass-panel" style={{ padding: '2rem', width: '350px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ color: '#fff' }}>Sell Product</h3>
                            <p style={{ color: '#94a3b8' }}>{sellData.name}</p>
                            <input type="number" min="1" max={sellData.maxQty} value={sellQuantity} onChange={(e) => setSellQuantity(e.target.value)} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setIsSellModalOpen(false)} style={{ flex: 1, padding: '10px', background: 'transparent', color: 'white', border: '1px solid white' }}>Cancel</button>
                                <button onClick={confirmSale} style={{ flex: 1, padding: '10px', background: '#10b981', color: 'white', border: 'none' }}>Confirm Sale</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="inventory-header glass-panel">
                    <div className="header-top-row">
                        <div className="header-title"><h2>Staff Point of Sale</h2></div>
                        <div className="header-actions">
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
                                            <button className="btn-sell" onClick={() => handleSellClick(p)}><ShoppingCart size={14} /> Sell</button>
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