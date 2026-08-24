import React from 'react'

function Footer() {
  return (
    <footer
      className="glass-panel"
      style={{
        margin: '2rem auto 1.5rem auto',
        maxWidth: '1100px',
        width: 'calc(100% - 3rem)',
        padding: '1.25rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        fontSize: '0.9rem',
        color: '#e2e8f0'
      }}
    >
      <div style={{ fontWeight: 600, letterSpacing: '0.02em', color: '#f8fafc' }}>
        Developed by <span className="rich-text-gradient" style={{ fontWeight: 700 }}>Gokul Krishna</span>
      </div>
      <div style={{ color: '#94a3b8', fontSize: '0.825rem' }}>
        Built with React.js, Express.js, Node.js, and MongoDB Cloud
      </div>
    </footer>
  )
}

export default Footer
