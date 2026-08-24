import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom'
import { Boxes, PackagePlus, ListFilter } from 'lucide-react'
import Inventory from './pages/Inventory'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header
          className="glass-nav"
          style={{
            margin: '1.25rem auto 0 auto',
            maxWidth: '1100px',
            width: 'calc(100% - 3rem)',
            padding: '0.85rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: '1rem',
            zIndex: 50
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none'
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(129, 140, 248, 0.3))',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '0.45rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}
            >
              <Boxes size={22} />
            </div>
            <h1 className="rich-text-gradient" style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700 }}>
              Inventory Management
            </h1>
          </Link>

          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#38bdf8' : '#e2e8f0',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)'
              })}
            >
              <ListFilter size={16} />
              Inventory
            </NavLink>
            <NavLink
              to="/add"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#38bdf8' : '#e2e8f0',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)'
              })}
            >
              <PackagePlus size={16} />
              Add Product
            </NavLink>
          </nav>
        </header>

        <main style={{ flex: 1 }}>
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
