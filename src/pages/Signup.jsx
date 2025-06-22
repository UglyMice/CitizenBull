import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import './Signup.css'

function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !username || !password || !location) {
      alert('Please fill out all fields');
      return;
    } 

    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Firebase Auth created user:", user.uid);

      // Save extra info to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        username,
        location,
        profileIcon: '',
        watchlist: []
      });

      // Save lightweight version in localStorage
      const userData = {
        uid: user.uid,
        email,
        username,
        location,
        profileIcon: '',
        watchlist: []
      };
      localStorage.setItem('citizenbullUser', JSON.stringify(userData));

      // Go to choose icon page
      navigate('/choose-icon');
    } catch (err) {
      console.error('🔥 Firebase Signup Error:', err);
      alert('Signup failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='signup-page'>
      <div className='title-container'>
          <h1><em>CitizenBull</em></h1>
          <p className="caption">Market Dashboard</p>
      </div>

        <div className='container'>
          
          <Link to="/" className='back-link'>← Back</Link>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name='email'
              placeholder=""
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder=""
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name='password'
              placeholder=""
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <label htmlFor="location">Location</label>
            <input
              type="text"
              name='location'
              placeholder="Location (e.g. Seattle)"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />

            <button type="submit"className='signup-btn' disabled={loading}>
              {loading ? 'Signing up...' : 'Sign up'}
            </button>

          </form>
        </div>
    </div>
  );
};

export default Signup;