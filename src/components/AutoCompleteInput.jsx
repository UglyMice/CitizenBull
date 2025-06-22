import { useState, useEffect, useRef } from 'react';
import './Watchlist.css';

const finnhubKey = import.meta.env.VITE_FINNHUB_API_KEY;

function AutoCompleteInput({ value, onChange, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null); // ref

  // Hide suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (!value) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://finnhub.io/api/v1/search?q=${value}&token=${finnhubKey}`);
        const data = await res.json();
        setSuggestions(data.result.slice(0, 5));
      } catch (err) {
        console.error('Autocomplete error:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="auto-input-wrapper" ref={wrapperRef}> {/* 👈 attach ref here */}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="auto-input"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item) => (
            <li
              key={item.symbol}
              className="suggestion-item"
              onClick={() => onChange(item.symbol)}
            >
              {item.symbol} — {item.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutoCompleteInput;