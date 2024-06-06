import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Test from './components/test';
const socket = io('http://localhost:4000');

const App = () => {
  const [words, setWords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    socket.on('randomWords', (data) => {
      setWords(data);
      setError(null);
    });

    socket.on('error', (errorMessage) => {
      setError(errorMessage);
    });

    return () => {
      socket.off('randomWords');
      socket.off('error');
    };
  }, []);

  const fetchWords = () => {
    socket.emit('fetchRandomWords');
  };

  return (
    <div>
      <Test />
      <button onClick={fetchWords}>Obtenir des mots</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
          {words.map((word, index) => (
            <ul key={index}>
              <li>{word}</li>
            </ul>
          ))}
    </div>
  );
};

export default App;
