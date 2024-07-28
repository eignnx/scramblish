import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import PlayPage from './pages/PlayPage';
import { orthographies, Orthography, RomanOrthography } from './lib/orthography';

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
    new Set<Orthography>([orthographies[0]]),
  ));


  return (
    <Router>
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
    </Router >
  );
}

export default App;
