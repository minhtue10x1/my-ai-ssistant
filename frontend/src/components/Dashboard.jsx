import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
      activeAgents: 3,
      pendingPRs: 12,
      workflows: 0,
      alerts: 0
  });

  useEffect(() => {
    // Fetch real stats
    // For now we just check user repos or workflows count
    const fetchStats = async () => {
        try {
            // Example: Get number of workflows
            // const res = await axios.get('http://localhost:5000/api/workflow'); 
            // In a real app we'd have a /stats endpoint
        } catch (e) {
            console.error(e);
        }
    };
    fetchStats();
  }, []);

  return (
        <div className="grid-cols-2">
          {/* Stats / Overview Card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>System Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              {[
                { label: 'Active Agents', value: stats.activeAgents, color: '#58a6ff' },
                { label: 'Pending PRs', value: stats.pendingPRs, color: '#bc8cff' },
                { label: 'Workflows Run', value: '1,204', color: '#3fb950' },
                { label: 'Security Alerts', value: stats.alerts, color: '#d2a8ff' }
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
  );
};

export default Dashboard;
