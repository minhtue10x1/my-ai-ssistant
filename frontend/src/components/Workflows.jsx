import { useState } from 'react';
import axios from 'axios';

const Workflows = () => {
  const [triggering, setTriggering] = useState(false);
  const [result, setResult] = useState(null);
  
  // Hardcoded for MVP, fetch from API in real implementation
  const workflowId = '69627edf92f16f934b87ae8a'; // Replace if ID changes

  const handleRun = async () => {
      setTriggering(true);
      setResult(null);
      try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          // You might want to let the user pick the repo/owner from UI
           const res = await axios.post(`${API_URL}/workflow/${workflowId}/run`, {
               owner: 'minhtue10x1',
               repo: 'my-ai-ssistant'
           });
           setResult(res.data.result);
      } catch (err) {
          console.error(err);
          alert('Failed to run workflow');
      }
      setTriggering(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Active Workflows</h3>
            <button className="btn-primary" onClick={handleRun} disabled={triggering}>
                {triggering ? 'Running...' : '▶ Run Demo Workflow'}
            </button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-muted)' }}>
            <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>Name</th>
                    <th style={{ padding: '0.5rem' }}>Description</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                    <th style={{ padding: '0.5rem' }}>Last Run</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ padding: '1rem 0.5rem' }}>Auto-Review Code</td>
                    <td style={{ padding: '1rem 0.5rem' }}>Fetches server.js and runs AI analysis</td>
                    <td style={{ padding: '1rem 0.5rem' }}><span style={{ color: '#3fb950' }}>Active</span></td>
                    <td style={{ padding: '1rem 0.5rem' }}>Just now</td>
                </tr>
            </tbody>
        </table>

        {result && (
            <div style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
                <h4>Execution Result:</h4>
                <pre style={{ fontSize: '0.8rem', color: '#ccc' }}>
                    {JSON.stringify(result, null, 2)}
                </pre>
            </div>
        )}
    </div>
  );
};

export default Workflows;
