import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders game title and scoreboard', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByText(/X:/)).toBeInTheDocument();
  expect(screen.getByText(/O:/)).toBeInTheDocument();
});

test('makes a move and updates the board', () => {
  render(<App />);
  const squares = screen.getAllByRole('button', { name: /Board square/i });
  fireEvent.click(squares[0]);
  expect(squares[0].textContent).toBe('X');
  fireEvent.click(squares[1]);
  expect(squares[1].textContent).toBe('O');
});

test('declares winner and updates score', () => {
  render(<App />);
  const squares = screen.getAllByRole('button', { name: /Board square/i });
  // X moves: 0, 1, 2 (top row), O: 3, 4
  fireEvent.click(squares[0]); // X
  fireEvent.click(squares[3]); // O
  fireEvent.click(squares[1]); // X
  fireEvent.click(squares[4]); // O
  fireEvent.click(squares[2]); // X wins
  expect(screen.getByText(/Winner: X/i)).toBeInTheDocument();
  expect(screen.getByText(/X:\s*1/)).toBeInTheDocument();
});

test('reset button clears the board but keeps score', () => {
  render(<App />);
  const squares = screen.getAllByRole('button', { name: /Board square/i });
  fireEvent.click(squares[0]);
  fireEvent.click(squares[3]);
  fireEvent.click(squares[1]);
  fireEvent.click(squares[4]);
  fireEvent.click(squares[2]);
  expect(screen.getByText(/Winner: X/i)).toBeInTheDocument();

  const resetButton = screen.getByTestId('ttt-reset-btn');
  fireEvent.click(resetButton);
  // After reset, no winner/draw & squares cleared, but score persists.
  expect(squares[0].textContent).toBe('');
  expect(squares[1].textContent).toBe('');
  expect(squares[2].textContent).toBe('');
  expect(screen.getByText(/X:\s*1/)).toBeInTheDocument();
});
