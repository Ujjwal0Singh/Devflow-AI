import {useEffect, useState} from 'react';
import axios from 'axios';

const HistorySidebar = ({userId, onSelectHistory}) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/history/${userId}`);
        setHistory(res.data);
      }
      catch (err){
        console.error("Failed to fetch history:", err);
      }
      finally{
        setLoading(false);
      }
    }
    if(userId){
      fetchHistory();
    }
  }, [userId]);

  return (
    <div className="history-sidebar" style={{
      width: '300px',
      background: '#0f172a',
      borderRight: '1px solid #334155',
      height: '100vh',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <h3 style={{ color: '#60a5fa', marginBottom: '20px' }}>📜 Past Fixes</h3>
      {loading ? <p>Loading history...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {history.map((item) => (
            <li 
              key={item._id} 
              onClick={() => onSelectHistory(item)}
              style={{
                padding: '12px',
                background: '#1e293b',
                borderRadius: '8px',
                marginBottom: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                border: '1px solid transparent',
                transition: '0.2s'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = '#3b82f6'}
              onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
            >
              <div style={{ fontWeight: 'bold', color: '#e2e8f0', marginBottom: '4px' }}>
                {item.issueTitle.substring(0, 30)}...
              </div>
              <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                {item.repoName} • {item.filePath.split('/').pop()}
              </div>
            </li>
          ))}
          {history.length === 0 && <p style={{ color: '#64748b' }}>No history yet.</p>}
        </ul>
      )}
    </div>
  );
};

export default HistorySidebar;