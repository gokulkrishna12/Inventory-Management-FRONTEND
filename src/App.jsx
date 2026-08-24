import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom'
import { Boxes, PackagePlus, ListFilter } from 'lucide-react'
import Inventory from './pages/Inventory'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="glass-nav app-header">
          <Link to="/" className="brand-link">
            <div className="brand-icon-box">
              <Boxes size={22} />
            </div>
            <h1 className="rich-text-gradient brand-title">
              Inventory Management
            </h1>
          </Link>

          <nav className="app-nav">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link-item ${isActive ? 'active' : ''}`
              }
            >
              <ListFilter size={16} />
              Inventory
            </NavLink>
            <NavLink
              to="/add"
              className={({ isActive }) =>
                `nav-link-item ${isActive ? 'active' : ''}`
              }
            >
              <PackagePlus size={16} />
              Add Product
            </NavLink>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/edit/:id" element={<EditProduct />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
