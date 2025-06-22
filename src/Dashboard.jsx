import './Dashboard.css'
import TimePanel from './components/TimePanel';
import ProfilePanel from './components/ProfilePanel';
import MarketNews from './components/MarketNews';
import CompanyPanel from './components/CompanyPanel';
import WeatherPanel from './components/WeatherPanel';
import Watchlist from './components/Watchlist';
import { useEffect, useState } from 'react';

const weatherKey = import.meta.env.VITE_WEATHER_API_KEY;

function Dashboard () {
  const [weather, setWeather] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [autoDarkMode, setAutoDarkMode] = useState(true);

  const [user, setUser] = useState(null);
  useEffect(() => {
    const stored = localStorage.getItem('citizenbullUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);


  useEffect(() => {
    async function fetchWeather() {
      try {
        const location = user?.location || 'Seattle';
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${location}&days=3&aqi=no&alerts=no`
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error('Weather fetch failed:', err);
      }
    }

    if (user) fetchWeather();
  }, [user]);

  useEffect(() => {
    if (!weather || !autoDarkMode) return;

    const sunsetStr = weather.forecast.forecastday[0].astro.sunset;
    const [time, modifier] = sunsetStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const now = new Date();
    const sunsetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    );

    setDarkMode(now >= sunsetTime);
  }, [weather, autoDarkMode]);

  function toggleDarkMode() {
    setDarkMode((prev) => {
      if (autoDarkMode) setAutoDarkMode(false);
      return !prev;
    });
  }

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <button onClick={toggleDarkMode} className="dark-mode-toggle" aria-label="Toggle dark mode">
        {darkMode ? 'Day Theme' : 'Night Theme'}
      </button>

      <div className="column left">

        <div className="user-time-container">
          <ProfilePanel weather={weather} user={user} />
          <TimePanel weather={weather} />
        </div>

        <div className='weather-watchlist-section'>
            <WeatherPanel />
            <Watchlist />
        </div>

      </div>

      <div className="column center">
        <MarketNews />
      </div>

      <div className="column right">
        <CompanyPanel />
      </div>
    </div>
  );
}

export default Dashboard;