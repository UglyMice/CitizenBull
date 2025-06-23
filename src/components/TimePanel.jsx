import { useEffect, useState } from 'react';
import './TimePanel.css'


const weatherKey = import.meta.env.VITE_WEATHER_API_KEY;

// TIME //
function formatTo12Hour(date) {
  let hour = date.getHours();
  let minute = date.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  const hourStr = hour.toString().padStart(2, '0');
  const minuteStr = minute.toString().padStart(2, '0');
  return `${hourStr}:${minuteStr}${ampm}`;
}

// DATE //
function formatDateVerbose(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

// GET TIMEZONE-CORRECT DATE //
function getTimeInTimezone(tz) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date());

  const map = {};
  for (const part of parts) {
    if (part.type !== 'literal') map[part.type] = part.value;
  }

  return new Date(`${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`);
}

// COMPONENT //
function TimePanel({ weather }) {
  const [localTime, setLocalTime] = useState(null);

  useEffect(() => {
    if (!weather) return;

    const tz = weather.location.tz_id;

    const updateTime = () => {
      setLocalTime(getTimeInTimezone(tz));
    };

    updateTime(); // Run immediately
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup
  }, [weather]);

  if (!weather || !localTime) {
    return (
      <div className="time-panel">
        <p>Loading time...</p>
      </div>
    );
  }

  const sunrise = weather.forecast.forecastday[0].astro.sunrise;
  const sunset = weather.forecast.forecastday[0].astro.sunset;

  return (
    <div className="time-panel">
      <div className="time-and-date">
        <p className="date">{formatDateVerbose(localTime)}</p>
        <p className="time">{formatTo12Hour(localTime)}</p>
        <div className="suntime">
          <p className="sunrise">☼ {sunrise}</p>
          <p className="sunset">☾ {sunset}</p>
        </div>
      </div>
    </div>
  );
}

export default TimePanel;