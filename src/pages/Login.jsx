import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

async function handleSubmit(e) {
  e.preventDefault();

  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }

  setLoading(true);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const profileData = docSnap.data();

      const userData = {
        uid: user.uid,
        email: user.email,
        ...profileData
      };

      localStorage.setItem('citizenbullUser', JSON.stringify(userData));

      navigate('/dashboard');
    } else {
      alert('No profile found for this user.');
    }
  } catch (err) {
    console.error('Login error:', err.message);
    alert('Login failed: ' + err.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className='login-page'>
        <div className='title-container'>
            <h1><em>CitizenBull</em></h1>
            <p className="caption">Market Dashboard</p>
        </div>

        <div className="container">

          <Link to="/" className='back-link'>← Back</Link>

          <form onSubmit={handleSubmit}>
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              name="email"
              placeholder=""
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder=""
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button type="submit" className='login-btn' disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
            </button>
            
          </form>
        </div>
    </div>
  );
}

export default Login;