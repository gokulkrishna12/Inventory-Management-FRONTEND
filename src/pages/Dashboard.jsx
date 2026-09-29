import { useState, useEffect } from 'react';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, AlertTriangle, DollarSign } from 'lucide-react';
import Footer from '../components/Footer';
import '../styles/Dashboard.css'; // Importing the new CSS

const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/products')
            .then((res) => {
                setProducts(res.data.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load dashboard data:', err);
                setLoading(false);
            });
    }, []);

    // 1. Calculate Analytics
    const totalItems = products.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalValue = products.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    const lowStockCount = products.filter(item => item.quantity <= 10).length;

    // 2. Prepare Data for Bar Chart (Top 5 lowest stock items)
    const barChartData = [...products]
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 5)
        .map(p => ({ name: p.name, Stock: p.quantity }));

    // 3. Prepare Data for Pie Chart (Items per category)
    const categoryData = products.reduce((acc, product) => {
        const catName = product.category?.name || 'Uncategorized';
        const existing = acc.find(c => c.name === catName);
        if (existing) {
            existing.value += product.quantity;
        } else {
            acc.push({ name: catName, value: product.quantity });
        }
        return acc;
    }, []);

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading Analytics...</div>;

    return (
        <div className="inventory-container">
            {/* Navbar removed from here to prevent duplication */}

            <div className="dashboard-wrapper">
                <h2 className="dashboard-title">Admin Analytics</h2>

                {/* KPI Cards */}
                <div className="kpi-grid">
                    <div className="kpi-card" style={{ borderLeft: '4px solid #38bdf8' }}>
                        <div className="kpi-icon-wrapper" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                            <Package size={28} />
                        </div>
                        <div>
                            <p className="kpi-label">Total Stock</p>
                            <h3 className="kpi-value">{totalItems} Units</h3>
                        </div>
                    </div>

                    <div className="kpi-card" style={{ borderLeft: '4px solid #34d399' }}>
                        <div className="kpi-icon-wrapper" style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34d399' }}>
                            <DollarSign size={28} />
                        </div>
                        <div>
                            <p className="kpi-label">Inventory Value</p>
                            <h3 className="kpi-value">${totalValue.toLocaleString()}</h3>
                        </div>
                    </div>

                    <div className="kpi-card" style={{ borderLeft: '4px solid #f87171' }}>
                        <div className="kpi-icon-wrapper" style={{ background: 'rgba(248, 113, 113, 0.2)', color: '#f87171' }}>
                            <AlertTriangle size={28} />
                        </div>
                        <div>
                            <p className="kpi-label">Low Stock Alerts</p>
                            <h3 className="kpi-value">{lowStockCount} Items</h3>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="charts-grid">

                    {/* Bar Chart: Lowest Stock */}
                    <div className="chart-card">
                        <h4 className="chart-title">Lowest Stock Items</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                                <Bar dataKey="Stock" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart: Category Distribution */}
                    <div className="chart-card">
                        <h4 className="chart-title">Stock by Category</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard;