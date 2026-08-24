import { useState, useEffect } from 'react'
import axios from 'axios'
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
    axios
      .get(`https://inventory-management-backend-sstw.onrender.com/api/products/${id}`)
      .then((response) => {
        const product = response.data?.data || response.data
        if (product) {
          setFormData({
            name: product.name || '',
            category: product.category || '',
            price: product.price !== undefined ? product.price : '',
            quantity: product.quantity !== undefined ? product.quantity : '',
            supplier: product.supplier || ''
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

    axios
      .put(`https://inventory-management-backend-sstw.onrender.com/api/products/${id}`, payload)
      .then(() => {
        setSaving(false)
        navigate('/')
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
        <div className="add-product-card glass-panel" style={{ textAlign: 'center', padding: '3rem', color: '#cbd5e1' }}>
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
            <label htmlFor="category">Category *</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Electronics, Office Supplies"
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
            <label htmlFor="supplier">Supplier</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="e.g. Acme Logistics"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/')}
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
