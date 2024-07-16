import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import PlayPage from './pages/PlayPage';

export type Lang = 'english' | 'scrambled';

function App() {
  const [wordNotes, setWordNotes] = React.useState(new Map<string, string>());

  function getWordNote(lang: Lang, word: string): string | null {
    return wordNotes.get(`${lang}:${word}`) || null;
  }

  function setWordNote(lang: Lang, word: string, note: string): void {
    setWordNotes(new Map(wordNotes).set(`${lang}:${word}`, note));
  }

  return (
    <Router>
      <div id="App">
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/play" element={
            <PlayPage wordNote={getWordNote} setWordNote={setWordNote} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
