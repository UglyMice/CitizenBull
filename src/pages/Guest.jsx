import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import iconGray from '../assets/icon-gray.svg';
import './Guest.css'

function Guest() {
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (!location) {
      alert('Please enter a location');
      return;
    }

    const guestUser = {
      uid: 'guest',
      email: 'guest@citizenbull.cc',
      username: 'Guest',
      location,
      profileIcon: iconGray,
      watchlist: [],
      isGuest: true
    };

    localStorage.setItem('citizenbullUser', JSON.stringify(guestUser));
    navigate('/dashboard');
  }

  return (
    <div className='guest-page'>
        <div className='title-container'>
            <h1><em>CitizenBull</em></h1>
            <p className="caption">Market Dashboard</p>
        </div>

        <div className='container'>

          <Link to="/" className='back-link'>← Back</Link>

          <p className='guest-subtitle'>Continue as Guest</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
            <button type="submit" className='guest-continue-btn'>Continue</button>
          </form>
        </div>
    </div>
  );
};

export default Guest;