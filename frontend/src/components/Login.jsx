import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
          await register(formData.username, formData.email, formData.password);
      } else {
          await login(formData.email, formData.password);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Authentication failed');
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', 
      background: 'radial-gradient(circle at 50% 10%, #1a1f35 0%, #0d1117 100%)' 
    }}>
      <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isRegister && (
             <input 
              type="text" 
              placeholder="Username" 
              className="glass-panel"
              style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              required
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            className="glass-panel"
            style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="glass-panel"
            style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.8rem', cursor: 'pointer' }}>
            {isRegister ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <button 
             className="glass-panel"
             style={{ 
                 background: 'white', color: '#333', border: 'none', padding: '0.8rem', cursor: 'pointer',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold'
             }}
             onClick={() => {
                 const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                 window.location.href = `${API_URL}/auth/google`;
             }}
          >
            <span style={{ fontSize: '1.2rem' }}>G</span> Sign in with Google
          </button>

          <button 
            style={{ background: 'none', border: 'none', color: '#58a6ff', cursor: 'pointer', marginTop: '0.5rem' }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Already have an account? Login' : 'Need an account? Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
