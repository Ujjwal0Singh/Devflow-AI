const InputSection = ({ 
  apiKey, setApiKey, 
  url, setUrl, 
  handleFetchIssue, 
  loading, 
  isFreeMode, 
  setIsFreeMode 
}) => {
  return (
    <div className="input-group">
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button 
          type="button"
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: !isFreeMode ? '#3b82f6' : '#1e293b', 
            color: 'white'
          }}
          onClick={() => setIsFreeMode(false)}
        >
          Gemini Cloud
        </button>
        <button 
          type="button"
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: isFreeMode ? '#3b82f6' : '#1e293b', 
            color: 'white'
          }}
          onClick={() => setIsFreeMode(true)}
        >
          Free Mode (Puter.js)
        </button>
      </div>
      {!isFreeMode && (
        <>
          <label>Gemini API Key</label>
          <input 
            type="password" 
            placeholder="Enter your Gemini API Key..." 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </>
      )}

      <label>GitHub Issue URL</label>
      <input 
        type="text" 
        placeholder="https://github.com/owner/repo/issues/1" 
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={handleFetchIssue} disabled={loading}>
        {loading ? 'Processing...' : 'Analyze Issue'}
      </button>
    </div>
  );
};

export default InputSection;