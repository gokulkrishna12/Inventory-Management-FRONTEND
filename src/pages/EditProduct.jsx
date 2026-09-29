import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import '../styles/AddProduct.css'

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    supplier: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Swapped axios for secure api interceptor
    api.get(`/products/${id}`)
      .then((response) => {
        const product = response.data?.data || response.data
        if (product) {
          setFormData({
            name: product.name || '',
            // Extract the raw ID string if the backend populated it as an object
            category: product.category?._id || product.category || '',
            price: product.price !== undefined ? product.price : '',
            quantity: product.quantity !== undefined ? product.quantity : '',
            supplier: product.supplier?._id || product.supplier || ''
          })
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching product:', err)
        setError('Failed to fetch product details. Make sure backend is running.')
        setLoading(false)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity)
    }

    api.put(`/products/${id}`, payload)
      .then(() => {
        setSaving(false)
        navigate('/inventory') // Redirects back to dashboard
      })
      .catch((err) => {
        console.error('Error updating product:', err)
        setError(
          err.response?.data?.message ||
          'Failed to update product. Please try again.'
        )
        setSaving(false)
      })
  }

  if (loading) {
    return (
      <div className="add-product-container">
        <div className="add-product-card glass-panel form-loading">
          Loading product details...
        </div>
      </div>
    )
  }

  return (
    <div className="add-product-container">
      <div className="add-product-card glass-panel">
        <div className="add-product-header">
          <h2>Edit Product</h2>
          <p>Update the product information below.</p>
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
            <button type="submit" className="btn-submit" disabled={saving}>
              {saving ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct