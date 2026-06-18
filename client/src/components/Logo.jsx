const Logo = ({ size = 48 }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.4))' }}
      >
        <circle cx="50" cy="50" r="44" stroke="#334155" strokeWidth="2" strokeDasharray="6 6" />
      
        <circle cx="25" cy="50" r="4" fill="#64748b" />
        <circle cx="50" cy="22" r="4" fill="#3b82f6" />
        <circle cx="50" cy="78" r="4" fill="#10b981" />
        
        <path d="M25 50 Q 50 22 50 22" stroke="#334155" strokeWidth="2" />
        <path d="M25 50 Q 50 78 50 78" stroke="#334155" strokeWidth="2" />
        <path d="M50 22 L 72 50 L 50 78" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        
        <path 
          d="M42 38 L 54 50 L 42 62" 
          stroke="#ffffff" 
          strokeWidth="4.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M58 62 H 68" 
          stroke="#3b82f6" 
          strokeWidth="4.5" 
          strokeLinecap="round" 
        />
      </svg>
    </div>
  );
};

export default Logo;