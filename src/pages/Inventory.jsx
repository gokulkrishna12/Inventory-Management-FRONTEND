import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useNavigate, useLocation } from 'react-router-dom'
import { Edit, Trash2, LogOut, Download, Plus, Search, ShoppingCart } from 'lucide-react'
import Footer from '../components/Footer'
import '../styles/Inventory.css'

// Bulletproof token decoder
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

function Inventory() {
  const navigate = useNavigate()
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [userRole, setUserRole] = useState('user')
  const [toast, setToast] = useState('')

  // Sell Modal States (For Staff)
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)
  const [sellData, setSellData] = useState({ id: null, name: '', maxQty: 0 })
  const [sellQuantity, setSellQuantity] = useState(1)

  // Admin History Modal States (For Admin)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [auditLogs, setAuditLogs] = useState([])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // Force re-check role on mount and route change
  useEffect(() => {
    setUserRole(getRoleFromToken());
  }, [location.pathname]);

  useEffect(() => {
    api.get(`/products`)
      .then((response) => {
        setProducts(response.data?.data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching products:', err)
        setError('Failed to load products. Make sure your secure backend is running!')
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
      showToast('Failed to export CSV. Unauthorized.')
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

      {/* ADMIN HISTORY MODAL */}
      {isHistoryModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '800px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.2)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Store Audit Logs (All Users)</h3>
              <button onClick={() => setIsHistoryModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>Close X</button>
            </div>

            <table className="inventory-table" style={{ marginTop: '10px' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee</th>
                  <th>Action</th>
                  <th>Product</th>
                  <th>Qty</th>
                </tr>
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
                      <td style={{ color: log.product ? '#fff' : '#f87171' }}>{log.product?.name || '[Item Deleted from DB]'}</td>
                      <td style={{ fontWeight: 'bold' }}>{log.quantityChanged}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SELL MODAL (STAFF ONLY) */}
      {isSellModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h3 style={{ margin: 0, color: '#fff' }}>Sell Product</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{sellData.name}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Quantity (Max: {sellData.maxQty})</label>
              <input
                type="number"
                min="1"
                max={sellData.maxQty}
                value={sellQuantity}
                onChange={(e) => setSellQuantity(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
              />
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
          <div className="header-title">
            <h2>Product Inventory</h2>
            <p>Real-time stock tracking and management</p>
          </div>

          <div className="header-actions">
            <span className="inventory-count">
              {filteredProducts.length} Items
            </span>

            {/* ADMIN BUTTONS */}
            {userRole === 'admin' && (
              <>
                <button onClick={handleViewHistory} className="header-btn" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  View History
                </button>
                <button onClick={() => navigate('/add-product')} className="header-btn btn-add">
                  <Plus size={16} /> Add Product
                </button>
              </>
            )}

            <button onClick={handleExportCSV} className="header-btn btn-csv"><Download size={16} /> Export CSV</button>
            <button onClick={handleLogout} className="header-btn btn-logout"><LogOut size={16} /> Logout</button>
          </div>
        </div>

        <div className="search-bar-container">
          <Search size={18} className="search-icon-full" />
          <input
            type="text"
            className="search-input-full"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state glass-panel">Loading products...</div>
      ) : error ? (
        <div className="error-state glass-panel">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state glass-panel"><p>No products match your search.</p></div>
      ) : (
        <div className="inventory-table-card glass-panel">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const productId = product._id || product.id
                return (
                  <tr key={productId}>
                    <td className="product-name">{product.name}</td>
                    <td><span className="category-badge">{product.category?.name || 'Uncategorized'}</span></td>
                    <td className="price-text">${Number(product.price || 0).toFixed(2)}</td>
                    <td>
                      <span className={product.quantity <= 0 ? 'quantity-badge out-of-stock' : product.quantity <= 10 ? 'quantity-badge low-stock' : 'quantity-badge in-stock'}>
                        {product.quantity}
                      </span>
                    </td>
                    <td style={{ color: '#cbd5e1' }}>{product.supplier?.name || 'Unknown'}</td>
                    <td>
                      <div className="actions-cell">
                        {userRole === 'admin' ? (
                          <>
                            <button className="btn-edit" onClick={() => navigate(`/edit-product/${productId}`)}><Edit size={16} /></button>
                            <button className="btn-delete" onClick={() => handleDelete(productId)}><Trash2 size={16} /></button>
                          </>
                        ) : (
                          <button className="btn-sell" onClick={() => handleSellClick(product)}><ShoppingCart size={14} /> Sell</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default Inventory