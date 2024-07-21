import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import PlayPage from './pages/PlayPage';
import { orthographies, Orthography } from './lib/orthography';

export type Lang = 'english' | 'scramblish';

export class PuzzleParams {
  constructor(
    public initialExampleCount: number,
    public scriptPool: Set<Orthography>,
  ) { }
}

function App() {
  const [puzzleParams, setPuzzleParams] = React.useState(new PuzzleParams(
    1,
    new Set<Orthography>(orthographies),
  ));

  return (
    <Router>
      <div id="App">
        <Routes>
          <Route path="/" element={
            <MenuPage
              puzzleParams={puzzleParams}
              setPuzzleParams={setPuzzleParams}
            />
          } />
          <Route path="/play" element={
            <PlayPage puzzleParams={puzzleParams} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
