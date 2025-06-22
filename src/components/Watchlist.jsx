import { useState, useEffect } from 'react';
import './Watchlist.css';
import AutoCompleteInput from './AutoCompleteInput';
import { db } from '../firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const finnhubKey = import.meta.env.VITE_FINNHUB_API_KEY;

     // Save watchlist to Firestore + localStorage
  async function updateWatchlistInFirebase(updatedStocks) {
    const user = JSON.parse(localStorage.getItem('citizenbullUser'));
    if (!user?.uid || user.uid === 'guest') return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { watchlist: updatedStocks });

      const updatedUser = { ...user, watchlist: updatedStocks };
      localStorage.setItem('citizenbullUser', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Error updating watchlist:', err);
    }
  }

function Watchlist() {
  const [input, setInput] = useState('');
  const [stocks, setStocks] = useState([]);
  const [quotes, setQuotes] = useState({});

  // Load watchlist from Firestore on mount
  useEffect(() => {
    async function fetchWatchlist() {
      const user = JSON.parse(localStorage.getItem('citizenbullUser'));
      if (!user?.uid) return;

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStocks(data.watchlist || []);
        }
      } catch (err) {
        console.error('Error fetching watchlist from Firestore:', err);
      }
    }

    fetchWatchlist();
    }, []);

  // Fetch quotes every 60s
  useEffect(() => {
    async function fetchQuotes() {
      const updatedQuotes = {};
      for (const symbol of stocks) {
        try {
          const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`);
          const data = await res.json();
          updatedQuotes[symbol] = {
            price: data.c,
            change: ((data.c - data.pc) / data.pc) * 100,
          };
        } catch (err) {
          console.error(`Error fetching data for ${symbol}:`, err);
        }
      }
      setQuotes(updatedQuotes);
    }

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 60000);
    return () => clearInterval(interval);
  }, [stocks]);


  // Add new symbol and update Firebase
  const handleAdd = () => {
  const upperInput = input.trim().toUpperCase();
  if (!upperInput || stocks.includes(upperInput)) return;

  const updated = [...stocks, upperInput];
  setStocks(updated);
  updateWatchlistInFirebase(updated);
  setInput('');
};

  // Remove symbol and update Firebase
  const handleRemove = (symbol) => {
  const updated = stocks.filter((s) => s !== symbol);
  setStocks(updated);
  updateWatchlistInFirebase(updated);
};

  return (
    <div className="watchlist-panel">
      <div className="watchlist-title">Watchlist</div>
      <div className="watchlist-input-row">
        <AutoCompleteInput
          value={input}
          onChange={setInput}
          placeholder="Add symbol (e.g., TSLA)"
        />
        <button onClick={handleAdd} className='wl-add-btn'>Add</button>
      </div>

      <div className="watchlist-container">
        <div className="watchlist-items">
          {stocks.map((symbol) => {
            const quote = quotes[symbol];
            return (
              <div key={symbol} className="watchlist-item">
                <span className="symbol">{symbol}</span>
                <span className="price">
                  {quote ? `$${quote.price.toFixed(2)}` : '...'}
                </span>
                <span
                  className={`change ${quote?.change >= 0 ? 'positive' : 'negative'}`}
                >
                  {quote ? `${quote.change.toFixed(2)}%` : ''}
                </span>
                <button className="remove-btn" onClick={() => handleRemove(symbol)}>
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Watchlist;