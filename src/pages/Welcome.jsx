import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className='title-container'>
          <h1><em>CitizenBull</em></h1>
          <p className="caption">Market Dashboard</p>
      </div>

      <p className='subtitle'>Choose how you'd like to get started:</p>

      <div className="welcome-buttons">
        <button className="login-btn" onClick={() => navigate('/login')}>Log In</button>
        <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
        <div className='break'></div>
        <button className="guest-btn" onClick={() => navigate('/guest')}>Continue as Guest</button>
      </div>
    </div>
  );
}

export default Welcome;