import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import PlayPage from './pages/PlayPage';

export type Lang = 'english' | 'scrambled';

function App() {
  return (
    <Router>
      <div id="App">
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/play" element={<PlayPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
