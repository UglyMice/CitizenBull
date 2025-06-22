import { useState, useEffect, } from 'react';
import './CompanyPanel.css'
import AutoCompleteInput from './AutoCompleteInput';

const finnhubKey = import.meta.env.VITE_FINNHUB_API_KEY;

function CompanyPanel() {
  const [symbol, setSymbol] = useState('SOFI'); // default
  const [inputSymbol, setInputSymbol] = useState('');
  const [profile, setProfile] = useState(null);
  const [quote, setQuote] = useState(null);
  const [news, setNews] = useState([]);

  // Format today's date range
  const toDate = new Date().toISOString().split('T')[0];
  const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const [profileRes, quoteRes, newsRes] = await Promise.all([
          fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${finnhubKey}`),
          fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`),
          fetch(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${finnhubKey}`)
        ]);

        const profileData = await profileRes.json();
        const quoteData = await quoteRes.json();
        const newsData = await newsRes.json();

        setProfile(profileData);
        setQuote(quoteData);
        setNews(newsData.slice(0, 5)); // Limit to 5
      } catch (err) {
        console.error('Error fetching company info:', err);
      }
    };

    fetchCompanyData();
  }, [symbol]);

  const handleAdd = () => {
    if (inputSymbol.trim()) {
      setSymbol(inputSymbol.trim().toUpperCase());
      setInputSymbol('');
    }
  };

  const percentChange = quote ? ((quote.c - quote.pc) / quote.pc) * 100 : 0;

  return (
    <div className="company-panel">
      <div className="ticker-search">
        <AutoCompleteInput
            value={inputSymbol}
            onChange={setInputSymbol}
            placeholder="Enter stock symbol"
        />
        <button onClick={handleAdd} className='cp-search-btn'>Search</button>
      </div>

      {profile && quote && (
        <div className="company-overview">

          <div className="company-header">
              {profile.logo && (
                <img
                  src={profile.logo}
                  alt={`${profile.name} logo`}
                  className="company-logo"
                />
              )}
              <h3 className='company-name'>{profile.name} ({profile.ticker})</h3>
          </div>

          <h1>${quote.c?.toFixed(2)}{' '}<span className={`change ${percentChange >= 0 ? 'positive' : 'negative'}`}>
          {percentChange.toFixed(2)}%</span></h1>
          <p><strong>Open:</strong> ${quote.o}</p>
          <p><strong>High:</strong> ${quote.h}</p>
          <p><strong>Low:</strong> ${quote.l}</p>
          <p><strong>Previous Close:</strong> ${quote.pc}</p>
          <div id="break"></div>
          <p><strong>Industry:</strong> {profile.finnhubIndustry}</p>
          <p><strong>Exchange:</strong> {profile.exchange}</p>
          <p><strong>IPO Date:</strong> {profile.ipo}</p>
          <a href={profile.weburl} target="_blank" rel="noreferrer">Website</a>
        </div>
      )}

        <div className="company-news">
            <h3>Company News</h3>
            {news.map((article, idx) => (
              <div key={idx} className="news-headline">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.headline}
                    </a>
                    <small>{new Date(article.datetime * 1000).toLocaleDateString()}</small>
              </div>
            ))}
        </div>

    </div>
  );
}

export default CompanyPanel;