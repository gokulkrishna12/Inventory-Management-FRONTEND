// src/components/Footer.jsx
import React from 'react'

function Footer() {
  return (
    <footer
      className="glass-panel"
      style={{
        marginTop: 'auto', // This pushes the footer to the very bottom!
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '8px'
      }}
    >
      <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '1rem' }}>
        Developed by <span style={{ color: '#38bdf8' }}>Gokul Krishna</span>
      </div>
      <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
        Built with MongoDB Atlas, Express.js, React.js (Vite), Node.js, Mongoose, JWT, Axios, Render & Vercel
      </div>
    </footer>
  )
}

export default Footer