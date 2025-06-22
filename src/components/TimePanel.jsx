import { useEffect, useState } from 'react';
import './TimePanel.css'


const weatherKey = import.meta.env.VITE_WEATHER_API_KEY;



// TIME //
function formatTo12Hour(timeString) {
  const [datePart, timePart] = timeString.split(' ');
  let [hour, minute] = timePart.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  const hourStr = hour.toString().padStart(2, '0');
  return `${hourStr}:${minute.toString().padStart(2, '0')}${ampm}`;
}

// DATE //
function parseApiDateTime(dateTimeString) {
  return new Date(dateTimeString.replace(' ', 'T') + ':00');
}

function formatDateVerbose(dateTimeString) {
  const date = parseApiDateTime(dateTimeString);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

// COMPONENT //
function TimePanel({ weather }) {
  if (!weather) {
    return (
      <div className="time-panel">
        <p>Loading time...</p>
      </div>
    );
  }

  const localtime = weather.location.localtime;
  const sunrise = weather.forecast.forecastday[0].astro.sunrise;
  const sunset = weather.forecast.forecastday[0].astro.sunset;

  return (

    <div className="time-panel">
      <div className="time-and-date">
        <p className="date">{formatDateVerbose(localtime)}</p>
        <p className="time">{formatTo12Hour(localtime)}</p>
        <div className="suntime">
            <p className='sunrise'>☼ {sunrise}</p>
            <p className='sunset'>☾ {sunset}</p>
        </div>
    </div>
      </div>

  );
}

export default TimePanel;