import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = 'JO4avBuWewywFGqyf9icJOeHZTODfwVxKlbGSFxT'; 

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredPhotos, setFilteredPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=10`);
        setPhotos(response.data);
        setFilteredPhotos(response.data); 
      } catch (err) {
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const filterPhotos = () => {
    if (!startDate && !endDate) {
      setFilteredPhotos(photos);
      return;
    }

    const filtered = photos.filter(photo => {
      const photoDate = new Date(photo.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (
        (!start || photoDate >= start) && (!end || photoDate <= end)
      );
    });

    setFilteredPhotos(filtered);
  };

  return (
    <div className="App">
      <h1>Галерея NASA</h1>
      <div className="filter">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="btn_search" onClick={filterPhotos}>Искать</button>
      </div>

      {loading && <div>Загрузка...</div>}
      {error && <div>{error}</div>}

      <div className="photo-list">
        {filteredPhotos.map((photo, index) => (
          <div key={index} className="photo-card">
            <h3>{photo.title}</h3>
            <img src={photo.url} alt={photo.title} />
            <p>{photo.explanation}</p>
            <p><strong>Дата:</strong> {photo.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;