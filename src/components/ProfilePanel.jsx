import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iconGray from '../assets/icon-gray.svg';
import './ProfilePanel.css';

function ProfilePanel() {
  const [username, setUsername] = useState('Guest');
  const [profileIcon, setProfileIcon] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('citizenbullUser'));
    if (storedUser?.username) {
      setUsername(storedUser.username);
    }
    if (storedUser?.profileIcon) {
      setProfileIcon(storedUser.profileIcon);
    }
  }, []);

  const iconToRender = profileIcon === 'gray' ? iconGray : profileIcon;
  if (profileIcon === 'gray') {
    iconToRender = iconGray;
  }

  function handleLogout() {
    localStorage.removeItem('citizenbullUser');
    navigate('/');
  }

  return (
    <div className="profile-panel">

      <div className="profile-icon-wrapper" onClick={() => setShowMenu(!showMenu)}>
          {iconToRender ? (
            <img className="user-icon" src={iconToRender} alt="User Icon" />
          ) : (
            <div className="user-icon fallback-icon">?</div>
          )}
      </div>

      <span className="username">{username}</span>

      {showMenu && (
        <div className="profile-menu">
          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      )}

    </div>
  );
}

export default ProfilePanel;