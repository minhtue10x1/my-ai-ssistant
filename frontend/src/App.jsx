import { useState, useContext, useEffect } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Workflows from './components/Workflows';

function MainLayout() {
  const { user, logout, loading } = useContext(AuthContext);
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => setServerStatus('Online'))
      .catch(() => setServerStatus('Offline'));
  }, []);

  if (loading) return <div style={{ color: 'white', display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  
  if (!user) {
    return <Login />;
  }

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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
            {['Dashboard', 'Workflows', 'Integrations'].map((item) => (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user.username}</span>
                <button onClick={logout} style={{ background: 'none', border: 'none', color: '#f85149', cursor: 'pointer', fontSize: '0.9rem' }}>Logout</button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ flex: 1, paddingBottom: '2rem' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back, {user.username}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Here is what's happening in your ecosystem today.</p>
        </div>

        {activeTab === 'dashboard' && <Dashboard user={user} />}
        {activeTab === 'workflows' && <Workflows />}
        {activeTab === 'integrations' && <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>Integrations Coming Soon</div>}

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

