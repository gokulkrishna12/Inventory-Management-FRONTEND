import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Edit, Trash2 } from 'lucide-react'
import '../styles/Inventory.css'

function Inventory() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get('https://inventory-management-backend-sstw.onrender.com/api/products')
      .then((response) => {
        console.log('Backend response data:', response.data)

        if (Array.isArray(response.data)) {
          setProducts(response.data)
        } else if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data)
        } else {
          setProducts([])
        }

        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching products:', err)
        setError('Failed to load products. Make sure your backend server is running!')
        setLoading(false)
      })
  }, [])

  const handleDelete = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this product?')
    if (isConfirmed) {
      axios
        .delete(`https://inventory-management-backend-sstw.onrender.com/api/products/${id}`)
        .then(() => {
          setProducts((prevProducts) =>
            prevProducts.filter((item) => (item._id || item.id) !== id)
          )
        })
        .catch((err) => {
          console.error('Error deleting product:', err)
          alert('Failed to delete product. Please try again.')
        })
    }
  }

  const getQuantityClass = (qty) => {
    if (qty <= 0) return 'quantity-badge out-of-stock'
    if (qty <= 10) return 'quantity-badge low-stock'
    return 'quantity-badge in-stock'
  }

  return (
    <div className="inventory-container">
      <div className="inventory-header glass-panel">
        <div>
          <h2>Product Inventory</h2>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
            Real-time stock tracking and management
          </p>
        </div>
        <span className="inventory-count">
          {products.length} {products.length === 1 ? 'Item' : 'Items'} Listed
        </span>
      </div>

      {loading ? (
        <div className="loading-state glass-panel">Loading products...</div>
      ) : error ? (
        <div className="error-state glass-panel">{error}</div>
      ) : products.length === 0 ? (
        <div className="empty-state glass-panel">
          <p>No products found in inventory.</p>
        </div>
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
              {Array.isArray(products) &&
                products.map((product) => {
                  const productId = product._id || product.id
                  return (
                    <tr key={productId}>
                      <td className="product-name">{product.name}</td>
                      <td>
                        <span className="category-badge">
                          {product.category || 'General'}
                        </span>
                      </td>
                      <td className="price-text">
                        ${Number(product.price || 0).toFixed(2)}
                      </td>
                      <td>
                        <span className={getQuantityClass(product.quantity)}>
                          {product.quantity}
                        </span>
                      </td>
                      <td style={{ color: '#cbd5e1' }}>{product.supplier || 'N/A'}</td>
                      <td>
                        <div className="actions-cell">
                          <button
                            type="button"
                            className="btn-edit"
                            title="Edit Product"
                            aria-label="Edit Product"
                            onClick={() => navigate(`/edit/${productId}`)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-delete"
                            title="Delete Product"
                            aria-label="Delete Product"
                            onClick={() => handleDelete(productId)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Inventory