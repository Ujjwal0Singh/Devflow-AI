const GuardrailDisplay = ({ report }) => {
  if (!report) return null;

  const { score, status, issues } = report;
  
  const getThemeColor = () => {
    if (score >= 90) return '#10b981'; 
    if (score >= 60) return '#f59e0b'; 
    return '#ef4444';
  };

  return (
    <div className="guardrail-panel" style={{
      marginTop: '20px',
      padding: '15px 20px',
      background: '#1e293b',
      borderRadius: '12px',
      borderLeft: `5px solid ${getThemeColor()}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🛡️ AI Code Quality Guardrail Report
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', background: '#334155', padding: '4px 8px', borderRadius: '4px', color: getThemeColor() }}>
            {status}
          </span>
          <span style={{ fontWeight: 'bold', fontSize: '18px', color: getThemeColor() }}>
            {score}/100
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: '6px', background: '#334155', borderRadius: '3px', marginTop: '12px', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: getThemeColor(), transition: 'width 0.5s ease-in-out' }} />
      </div>

      {issues.length > 0 && (
        <div style={{ marginTop: '12px', fontSize: '13px', color: '#94a3b8' }}>
          <div style={{ fontWeight: '600', marginBottom: '5px', color: '#cbd5e1' }}>Lexical & Syntactic Insights:</div>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {issues.map((issue, idx) => (
              <li key={idx} style={{ color: score < 60 ? '#fca5a5' : '#fcd34d' }}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GuardrailDisplay;