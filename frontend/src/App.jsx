import { useState, useContext, useEffect } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Workflows from './components/Workflows';
import Dashboard from './components/Dashboard';

function MainLayout() {
  const { user, logout, loading } = useContext(AuthContext);
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Check backend status
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    // Simple fetch to see if server responds (root / might not extract json, so we use auth/me or just ping)
    // Actually our previous code used root http://localhost:5000/ .. lets try to be robust
    fetch(API_URL.replace('/api', '')) 
      .then(res => setServerStatus('Online'))
      .catch(() => setServerStatus('Offline'));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Loading...</div>;
  if (!user) return <Login />;

  const renderContent = () => {
      switch(activeTab) {
          case 'workflows': return <Workflows />;
          case 'dashboard': return <Dashboard user={user} />;
          default: return <div style={{ textAlign: 'center', padding: '2rem' }}>Coming Soon</div>;
      }
  };

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
        <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', alignItems: 'center' }}>
          {['Dashboard', 'Workflows', 'Integrations'].map((item) => (
            <a 
              key={item} 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab(item.toLowerCase()); }}
              style={{ color: activeTab === item.toLowerCase() ? 'var(--primary)' : 'var(--text-muted)', textDecoration: 'none' }}
            >
              {item}
            </a>
          ))}
          <div style={{ borderLeft: '1px solid #333', paddingLeft: '1rem', marginLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#888' }}>{user.username}</span>
              <button 
                onClick={logout}
                style={{ background: 'none', border: 'none', color: '#f85149', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                  Logout
              </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container" style={{ flex: 1, paddingBottom: '2rem' }}>
        {renderContent()}
      </main>
    </div>
  )
}

function App() {
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>
    );
}

export default App;
