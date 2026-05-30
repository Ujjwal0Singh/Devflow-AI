import React, {useState} from 'react'
import { callPuterAI }  from '../utils/puterAi';

const RepoChat = ({fileTree, issueTitle}) => {
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAskRepo = async (e) => {
    e.preventDefault();
    if(!query.trim() || !fileTree) return ;

    const userMessage = query;
    setQuery('');
    setChatLog(prev => [...prev, {role: 'user', text: userMessage}]);
    setLoading(true);

    try {
      const contextPrompt = `You are an expert software architecture agent. You are looking at the codebase architecture for a project handling the issue: "${issueTitle}".
        
        Here is the full flat file tree structure of the repository:
        [
          ${fileTree.slice(0, 400).join(',\n  ')}
        ]
        
        Answer the user's question based strictly on this file tree directory map. Suggest which specific files or directories they should look at for their task.
        
        User Question: "${userMessage}"`;
      
      const aiResponse = await callPuterAI(contextPrompt);
      setChatLog(prev => [...prev, {role: 'ai', text: aiResponse}]);
    }
    catch{
      setChatLog(prev => [...prev, {role: 'ai', text: "Error communicating with repo context engine."}])
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="repo-chat-container" style={{
      background: '#1e293b',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '20px',
      border: '1px solid #334155'
    }}>
      <h3 style={{ color: '#3b82f6', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🔍 RAG-lite Context Chat: Ask About the Repo
      </h3>
      
      <div className="chat-window" style={{
        maxHeight: '250px',
        overflowY: 'auto',
        background: '#0f172a',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {chatLog.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? '#3b82f6' : '#334155',
            color: 'white',
            padding: '10px 14px',
            borderRadius: '8px',
            maxWidth: '80%',
            fontSize: '14px',
            whiteSpace: 'pre-wrap'
          }}>
            <strong>{msg.role === 'user' ? 'You: ' : 'AI Architect: '}</strong>
            {msg.text}
          </div>
        ))}
        {chatLog.length === 0 && (
          <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', margin: 0 }}>
            Ask where features, routing files, modules, or state managers reside in this repository tree!
          </p>
        )}
      </div>

      <form onSubmit={handleAskRepo} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="e.g., Where is the authentication routing logic located?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          style={{ margin: 0 }}
        />
        <button type="submit" disabled={loading || !fileTree}>
          {loading ? 'Searching...' : 'Ask'}
        </button>
      </form>
    </div>
  );
}

export default RepoChat;