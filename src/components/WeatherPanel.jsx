import { useEffect, useState } from 'react';
import './WeatherPanel.css'

const weatherKey = import.meta.env.VITE_WEATHER_API_KEY;

function getWeatherIcon(conditionText) {
  const condition = conditionText.toLowerCase();

  if (condition.includes('sun') || condition.includes('clear')) return '☀︎';
  if (condition.includes('rain') || condition.includes('drizzle')) return '☂︎';
  if (condition.includes('snow')) return '❄︎';
  if (condition.includes('storm') || condition.includes('thunder')) return '⚡';
  if (condition.includes('overcast') || condition.includes('cloudy')) return '☁︎';

  // Default icon
  return '☀︎';
}

function WeatherPanel() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Get location from localStorage or fallback
        const storedUser = JSON.parse(localStorage.getItem('citizenbullUser'));
        const location = storedUser?.location || 'Seattle';

        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${location}&days=3&aqi=no&alerts=no`
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
      }
    }

    fetchWeather();
  }, []);

  if (!weather) return <div className="weather-panel">Loading weather...</div>;

  const { location, current, forecast } = weather;

  return (
    <div className="weather-panel">
      
      <div className="current-weather">
            <div className="location">{location.name}, {location.region}</div>
            <div className="timezone">{location.tz_id}</div>
            <div className="temp">{current.temp_f}°F — </div>
            <div className="condition">{getWeatherIcon(current.condition.text)} {current.condition.text}</div>
        </div>

        <div className="forecast-box">
        <div className="forecast-label">3-Day<br />Forecast</div>
        <div className='forcast-day-containers'>
            {forecast.forecastday.map((day) => (
              <div key={day.date} className="forecast-day">
                <div className='forecast-date'>{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', })}</div>
                <div className='forecast-detail'><strong className='forecast-temp'>{Math.round(day.day.maxtemp_f)}°F</strong><br />{day.day.condition.text}</div>
              </div>
              ))}
          </div>
    </div>

    </div>
  );
}

export default WeatherPanel;