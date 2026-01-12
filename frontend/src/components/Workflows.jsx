import { useState, useEffect } from 'react';
import axios from 'axios';

const Workflows = () => {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [triggering, setTriggering] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchWorkflows();
  }, []);

  useEffect(() => {
    if (selectedWorkflow) {
        fetchLogs(selectedWorkflow._id);
    }
  }, [selectedWorkflow]);

  const fetchWorkflows = async () => {
      try {
          const res = await axios.get(`${API_URL}/workflows`);
          setWorkflows(res.data);
      } catch (err) {
          console.error("Failed to fetch workflows", err);
      }
  };

  const fetchLogs = async (id) => {
      setLoading(true);
      try {
          const res = await axios.get(`${API_URL}/workflow/${id}/logs`);
          setLogs(res.data);
      } catch (err) {
          console.error(err);
      }
      setLoading(false);
  };

  const handleRun = async (workflow) => {
      // Logic from before, but passing ID dynamically
      // For MVP, simplistic confirmation
      if (!confirm(`Run ${workflow.name} manually? (Uses hardcoded params)`)) return;

      setTriggering(true);
      try {
           await axios.post(`${API_URL}/workflow/${workflow._id}/run`, {
               owner: 'minhtue10x1',
               repo: 'my-ai-ssistant'
           });
           alert('Workflow triggered check logs shortly.');
           if (selectedWorkflow?._id === workflow._id) fetchLogs(workflow._id);
      } catch (err) {
          alert('Failed to run workflow');
      }
      setTriggering(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selectedWorkflow ? '1fr 1fr' : '1fr', gap: '2rem', height: '100%' }}>
        
        {/* List Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1rem' }}>Your Workflows</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {workflows.map(wf => (
                    <div 
                        key={wf._id} 
                        onClick={() => setSelectedWorkflow(wf)}
                        style={{ 
                            padding: '1rem', 
                            background: selectedWorkflow?._id === wf._id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            border: selectedWorkflow?._id === wf._id ? '1px solid #58a6ff' : '1px solid transparent'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0 }}>{wf.name}</h4>
                            <span style={{ 
                                fontSize: '0.75rem', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                background: wf.status === 'active' ? 'rgba(63, 185, 80, 0.2)' : 'rgba(150,150,150,0.2)',
                                color: wf.status === 'active' ? '#3fb950' : '#ccc'
                            }}>
                                {wf.status}
                            </span>
                        </div>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {wf.description || 'No description'}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        {/* Detail/Logs Panel */}
        {selectedWorkflow && (
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                     <div>
                        <h3 style={{ margin: 0 }}>{selectedWorkflow.name} History</h3>
                        <span style={{ fontSize: '0.8rem', color: '#888' }}>ID: {selectedWorkflow._id}</span>
                     </div>
                     <button className="btn-primary" onClick={() => handleRun(selectedWorkflow)} disabled={triggering}>
                        {triggering ? 'Running...' : '▶ Run Now'}
                     </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {loading ? (
                        <p>Loading history...</p>
                    ) : logs.length === 0 ? (
                        <p style={{ color: '#888', fontStyle: 'italic' }}>No execution history found.</p>
                    ) : (
                        logs.map(log => (
                            <LogItem key={log._id} log={log} />
                        ))
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

const LogItem = ({ log }) => {
    const [expanded, setExpanded] = useState(false);
    
    // Helper to format Trigger Data nicely
    const TriggerInfo = () => {
        if (log.triggerType === 'WEBHOOK_PR') {
            return (
                <div style={{ fontSize: '0.9rem', color: '#58a6ff' }}>
                    <span style={{ color: '#aaa' }}>PR:</span> {log.triggerData?.title} 
                    <span style={{ marginLeft: '10px', color: '#aaa' }}>(#{log.triggerData?.prNumber})</span>
                </div>
            );
        }
        return <div style={{ fontSize: '0.9rem' }}>Manual Run</div>;
    };

    return (
        <div style={{ 
            marginBottom: '1rem', 
            padding: '1rem', 
            background: 'rgba(0,0,0,0.2)', 
            borderRadius: '6px',
            borderLeft: log.status === 'SUCCESS' ? '3px solid #3fb950' : '3px solid #f85149' 
        }}>
            <div 
                style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => setExpanded(!expanded)}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <TriggerInfo />
                    <span style={{ fontSize: '0.75rem', color: '#666' }}>
                        {new Date(log.createdAt).toLocaleString()}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ 
                        fontSize: '0.8rem', 
                        color: log.status === 'SUCCESS' ? '#3fb950' : '#f85149'
                    }}>
                        {log.status}
                    </span>
                    <span style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                </div>
            </div>

            {expanded && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <h5 style={{ margin: '0 0 0.5rem', color: '#ccc' }}>Logs / Result:</h5>
                    <pre style={{ 
                        background: '#0d1117', 
                        padding: '0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem', 
                        color: '#aaa',
                        overflowX: 'auto' 
                    }}>
                        {JSON.stringify(log.logs, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default Workflows;
