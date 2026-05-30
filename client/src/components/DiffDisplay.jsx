import ReactDiffViewer from '@alexbruf/react-diff-viewer';

const DiffDisplay = ({ fixData }) => {
  if (!fixData || !fixData.original || !fixData.fixed) return null;

  return (
    <div className="diff-display-panel" style={{ 
      marginTop: '30px', 
      background: '#1e293b', /* Dark panel container border card wrapper */
      color: '#e2e8f0', 
      borderRadius: '12px', 
      padding: '20px',
      border: '1px solid #334155',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <h4 style={{ color: '#60a5fa', marginTop: 0, marginBottom: '15px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🛠️ Code Delta Patch Modification View: <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '13px' }}>{fixData.fileName}</span>
      </h4>
      
      <div style={{ borderRadius: '8px', border: '1px solid #334155', overflowX: 'auto', background: '#0f172a' }}>
          <ReactDiffViewer 
              oldValue={fixData.original} 
              newValue={fixData.fixed} 
              splitView={true}
              useDarkTheme={true}          
          />
      </div>

      {/* Small operational micro-copy assistance banner for code presentation clarity */}
      <div style={{ display: 'flex', gap: '15px', marginTop: '12px', fontSize: '11px', color: '#64748b', justifyContent: 'flex-end' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', background: 'rgba(239,68,68,0.4)', borderRadius: '2px' }}></span> Old Code Baseline (Subtractions)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', background: 'rgba(16,185,129,0.4)', borderRadius: '2px' }}></span> AI Generated Optimization (Additions)
        </span>
      </div>
    </div>
  );
};

export default DiffDisplay;