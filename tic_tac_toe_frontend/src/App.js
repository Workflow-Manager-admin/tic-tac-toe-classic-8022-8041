import React, { useState, useEffect } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  /** One square on the board, click triggers placement */
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      tabIndex={0}
      aria-label={`Board square: ${value ? value : 'empty'}`}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  /** The 3x3 grid board, highlights winning line if present */
  function renderSquare(i) {
    const highlight = winningLine && winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={highlight}
      />
    );
  }
  // render as 3 rows of 3
  let rows = [];
  for (let row = 0; row < 3; row++) {
    let cols = [];
    for (let col = 0; col < 3; col++) {
      cols.push(renderSquare(row * 3 + col));
    }
    rows.push(
      <div key={row} className="ttt-board-row">
        {cols}
      </div>
    );
  }
  return <div className="ttt-board">{rows}</div>;
}

// PUBLIC_INTERFACE
function ScoreBoard({ xScore, oScore }) {
  /** Shows simple tally for each player */
  return (
    <div className="ttt-scoreboard">
      <span className="score x-score" aria-label="X Score">
        X: {xScore}
      </span>
      <span className="score o-score" aria-label="O Score">
        O: {oScore}
      </span>
    </div>
  );
}

// PUBLIC_INTERFACE
function StatusText({ message }) {
  /** Displays the dynamic status text for the game (eg. Who's turn, winner, draw) */
  return (
    <div className="ttt-status" role="status">
      {message}
    </div>
  );
}

// Winner calculation helper
function calculateWinner(squares) {
  /** Checks if someone has won, returns [winner ('X' or 'O'), winningLineIndices] or null */
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return [squares[a], line];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  /** Main tic tac toe app: manages state, theming, and UI layout */
  const [theme, setTheme] = useState('light');
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXisNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [status, setStatus] = useState('Next: X');
  const [winnerLine, setWinnerLine] = useState(null);
  const [roundOver, setRoundOver] = useState(false);

  // Theme handling (already present)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Game status update effect
  useEffect(() => {
    const winResult = calculateWinner(squares);
    if (winResult) {
      const [winner, line] = winResult;
      setStatus(`Winner: ${winner}`);
      setWinnerLine(line);
      setRoundOver(true);
    } else if (squares.every(Boolean)) {
      setStatus('Draw!');
      setWinnerLine(null);
      setRoundOver(true);
    } else {
      setStatus(`Next: ${xIsNext ? 'X' : 'O'}`);
      setWinnerLine(null);
      setRoundOver(false);
    }
  }, [squares, xIsNext]);

  // Handle square click
  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    if (squares[index] || roundOver) return;
    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXisNext((prev) => !prev);

    // Check winner next tick
    setTimeout(() => {
      const winResult = calculateWinner(nextSquares);
      if (winResult) {
        const [winner] = winResult;
        setScores((prev) => ({
          ...prev,
          [winner]: prev[winner] + 1,
        }));
      }
    }, 0);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setSquares(Array(9).fill(null));
    setXisNext((prev) => !prev); // Loser goes first next
    setWinnerLine(null);
    setRoundOver(false);
    // Status will auto-update
  }

  // THEME toggle inherited from template
  // PUBLIC_INTERFACE
  function toggleTheme() {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }

  return (
    <div className="App" data-testid="ttt-app-container">
      <header className="ttt-main-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      <main className="ttt-main-content">
        <ScoreBoard xScore={scores.X} oScore={scores.O} />
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winnerLine}
        />
        <StatusText message={status} />
        <button
          onClick={handleReset}
          className="ttt-reset-btn"
          aria-label="Reset this round"
          data-testid="ttt-reset-btn"
        >
          Reset Round
        </button>
      </main>
      <footer className="ttt-footer">
        <span className="ttt-footer-credit">
          <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">
            Built with React
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
