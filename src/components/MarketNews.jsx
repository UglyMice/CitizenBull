import { useEffect, useState } from 'react';
import './MarketNews.css'

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

function MarketNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`
        );
        const data = await response.json();
        setNews(data.slice(0, 5)); // Get top 5 headlines
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="market-news">
      <h2>Market Headlines</h2>
      {news.map((item, index) => (
        <div key={index} className="news-card">
          <h3>{item.headline}</h3>
          <p>{item.summary}</p>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            Read more →
          </a>
        </div>
      ))}
    </div>
  );
}

export default MarketNews;