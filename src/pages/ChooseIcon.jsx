import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase-config';
import { doc, updateDoc } from 'firebase/firestore';
import './ChooseIcon.css';
import iconGray from '../assets/icon-gray.svg';
import iconGreen from '../assets/icon-green.svg';
import iconLightBlue from '../assets/icon-lightblue.svg';
import iconRed from '../assets/icon-red.svg';
import iconOrange from '../assets/icon-orange.svg';
import iconPink from '../assets/icon-pink.svg';
import iconBlue from '../assets/icon-blue.svg';
import iconTeal from '../assets/icon-teal.svg';

const iconOptions = [iconGray, iconGreen, iconLightBlue, iconRed, iconOrange, iconPink, iconBlue, iconTeal];

const iconMap = {
  gray: iconGray,
};

function ChooseIcon() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  function handleSelect(color) {
    setSelected(color);
  }

  async function handleSubmit() {
    if (!selected) {
      alert('Please select a profile icon');
      return;
    }

    const user = JSON.parse(localStorage.getItem('citizenbullUser'));
    if (!user?.uid) {
      alert('User not found');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);

      // 🔥 Update profileIcon in Firestore
      await updateDoc(userRef, { profileIcon: selected });

      // ✅ Also update localStorage
      const updated = { ...user, profileIcon: selected };
      localStorage.setItem('citizenbullUser', JSON.stringify(updated));

      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving profile icon:', err.message);
      alert('Could not save profile icon. Try again.');
    }
  }

  return (
    <div className='icon-page'>
        <div className='title-container'>
            <h1><em>CitizenBull</em></h1>
            <p className="caption">Market Dashboard</p>
        </div>

        <div className='container'>

          <Link to="/" className='back-link'>← Back</Link>

          <h2>Pick Your Profile Icon</h2>
          <div className="icon-container">
            {iconOptions.map((icon, i) => (
              <img
                key={i}
                src={icon}
                alt={`icon-${i}`}
                className={`icon ${selected === icon ? 'selected' : ''}`}
                onClick={() => handleSelect(icon)}
              />
            ))}
          </div>
          <button onClick={handleSubmit} className='start-dash-btn'>Start Dashboard</button>
        </div>
    </div>
  );
};

export default ChooseIcon;