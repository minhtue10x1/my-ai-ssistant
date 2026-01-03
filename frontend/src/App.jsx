import { useState, useEffect } from 'react';

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Check backend status
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => setServerStatus('Online'))
      .catch(() => setServerStatus('Offline'));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Header */}
      <header className="glass-panel" style={{ 
        position: 'sticky', top: 0, zIndex: 100, 
        padding: '1rem 2rem', margin: '1rem', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 className="title-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>AI-DevFlow</h1>
          <span style={{ 
            fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '20px',
            backgroundColor: serverStatus === 'Online' ? 'rgba(35, 134, 54, 0.2)' : 'rgba(218, 54, 51, 0.2)',
            color: serverStatus === 'Online' ? '#3fb950' : '#f85149',
            border: `1px solid ${serverStatus === 'Online' ? '#238636' : '#da3633'}`
          }}>
            API: {serverStatus}
          </span>
        </div>
        <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
          {['Dashboard', 'Workflows', 'Integrations', 'Settings'].map((item) => (
            <a 
              key={item} 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab(item.toLowerCase()); }}
              style={{ color: activeTab === item.toLowerCase() ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="container" style={{ flex: 1, paddingBottom: '2rem' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back, Developer</h2>
          <p style={{ color: 'var(--text-muted)' }}>Here is what's happening in your ecosystem today.</p>
        </div>

        <div className="grid-cols-2">
          
          {/* Stats / Overview Card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>System Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              {[
                { label: 'Active Agents', value: '3', color: '#58a6ff' },
                { label: 'Pending PRs', value: '12', color: '#bc8cff' },
                { label: 'Workflows Run', value: '1,204', color: '#3fb950' },
                { label: 'Security Alerts', value: '0', color: '#d2a8ff' }
              ].map((stat) => (
                <div key={stat.label} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{stat.label}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / recent activity */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { time: '10m ago', text: 'AI Agent "Reviewer" analyzed PR #405', icon: '🤖' },
                { time: '1h ago', text: 'Deployment to Staging successful', icon: '🚀' },
                { time: '3h ago', text: 'New issue detected in module "Auth"', icon: '🐛' },
              ].map((item, i) => (
                <li key={i} style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', 
                  padding: '0.8rem 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' 
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem' }}>{item.text}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.time}</div>
                  </div>
                </li>
              ))}
            </ul>
            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>View Full Logs</button>
          </div>
        </div>

      </main>
    </div>
  )
}

export default App

