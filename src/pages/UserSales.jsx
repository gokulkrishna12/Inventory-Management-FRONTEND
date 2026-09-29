import { useState, useEffect } from 'react'
import api from '../utils/api'
import '../styles/AddProduct.css'

function UserSales() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Fetch user's history
        api.get('/products/transactions/history')
            .then((res) => {
                setTransactions(res.data.data || res.data || [])
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error fetching sales history:', err)
                setError('Failed to load sales history.')
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <div className="add-product-container"><div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>Loading your sales history...</div></div>
    }

    return (
        <div className="add-product-container" style={{ maxWidth: '900px' }}>
            <div className="glass-panel" style={{ padding: '30px' }}>
                <h2>Your Sales History</h2>
                <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>View all your completed stock sales.</p>

                {error && <div className="form-error">{error}</div>}

                {transactions.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>No sales transactions recorded yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '12px' }}>Product</th>
                                    <th style={{ padding: '12px' }}>Quantity Sold</th>
                                    <th style={{ padding: '12px' }}>Handled By</th>
                                    <th style={{ padding: '12px' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '12px', color: tx.product ? '#fff' : '#f87171' }}>
                                            {tx.product?.name || '[Item Deleted from DB]'}
                                        </td>
                                        <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>{tx.quantityChanged}</td>
                                        <td style={{ padding: '12px' }}>{tx.user?.name || tx.user?.email || 'You'}</td>
                                        <td style={{ padding: '12px', color: '#94a3b8' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserSales