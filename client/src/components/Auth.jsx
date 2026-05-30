import {useState} from 'react';
import axios from 'axios';
const Auth = ({onLoginSuccess}) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isSignup ? 'sign-up' : 'login';
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/${endpoint}`, {email, password});
      const { token, user: userData } = res.data;
      if(!isSignup){
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userId', userData.id);
        onLoginSuccess({
          email: userData.email,
          token,
          id: userData.id
        });
      }
      else {
        alert("Account created! Please Log in.");
        setIsSignup(false);
      }
    }
    catch (err) {
      setError(err.response?.data?.error || "Authentication failed. Please try again.");
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', background: '#1e293b', borderRadius: '12px' }}>
      <h2 style={{ textAlign: 'center' }}>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" placeholder="Email" required 
          value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        <input 
          type="password" placeholder="Password" required 
          value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
        />
        {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <p onClick={() => setIsSignup(!isSignup)} style={{ textAlign: 'center', cursor: 'pointer', color: '#60a5fa', marginTop: '15px' }}>
        {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
}

export default Auth;