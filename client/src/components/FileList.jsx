const FileList = ({ files, onGenerateFix }) => (
  <div style={{ marginTop: '20px', padding: '15px', background: '#334155', borderRadius: '8px' }}>
    <h4 style={{ color: '#60a5fa', marginTop: 0 }}>🎯 Files Identified for Fix:</h4>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {files.map((file, index) => (
        <li key={index} style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: 'monospace', background: '#1e293b', padding: '10px 15px', 
          marginBottom: '8px', borderRadius: '6px', borderLeft: '4px solid #3b82f6', fontSize: '14px'
        }}>
          <span style={{ color: '#e2e8f0' }}>{file}</span>
          <button 
              style={{ padding: '6px 12px', fontSize: '12px', background: '#3b82f6', borderRadius: '4px' }}
              onClick={() => onGenerateFix(file)}
          >
              Generate Fix
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default FileList;