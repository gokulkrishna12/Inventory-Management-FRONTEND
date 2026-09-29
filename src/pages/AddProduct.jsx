import { useState } from 'react'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'
import '../styles/AddProduct.css'

function AddProduct() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    supplier: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity)
    }

    // Swapped axios for secure api interceptor
    api.post('/products', payload)
      .then(() => {
        setLoading(false)
        navigate('/inventory') // Redirects back to dashboard instead of login screen
      })
      .catch((err) => {
        console.error('Error adding product:', err)
        setError(
          err.response?.data?.message ||
          'Failed to add product. Ensure Category and Supplier are valid ObjectIds.'
        )
        setLoading(false)
      })
  }

  return (
    <div className="add-product-container">
      <div className="add-product-card glass-panel">
        <div className="add-product-header">
          <h2>Add New Product</h2>
          <p>Enter the details below to add an item to your inventory.</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Mouse"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category ID *</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Paste MongoDB Category ID"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="supplier">Supplier ID *</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Paste MongoDB Supplier ID"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/inventory')}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct