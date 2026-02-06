import { useMemo, useState } from "react";
import "./App.css";

const emptyBoard = () => Array(9).fill(null);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function App() {
  const [squares, setSquares] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);

  // NEW: theme toggle
  const [funMode, setFunMode] = useState(false);

  const result = useMemo(() => calculateWinner(squares), [squares]);
  const winner = result?.winner ?? null;
  const isDraw = !winner && squares.every(Boolean);

  function displayValue(value) {
    if (!value) return "";
    if (!funMode) return value; // default: X / O
    // fun mode: X -> * , O -> @
    return value === "X" ? "*" : "@";
  }

  const status = winner
    ? `Winner: ${funMode ? (winner === "X" ? "★" : "☆") : winner}`
    : isDraw
      ? "Draw!"
      : `Next player: ${
          funMode ? (xIsNext ? "★" : "☆") : xIsNext ? "X" : "O"
        }`;

  function handleClick(i) {
    if (squares[i] || winner) return;

    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";

    setSquares(next);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setSquares(emptyBoard());
    setXIsNext(true);
  }

  return (
    <div className={`page ${funMode ? "fun" : ""}`}>
      <div className="card">
        <div className="headerRow">
          <h1>Tic Tac Toe</h1>

          {/* NEW: theme toggle */}
          <button
            type="button"
            className={`toggle ${funMode ? "on" : ""}`}
            onClick={() => setFunMode((v) => !v)}
            aria-pressed={funMode}
          >
            {funMode ? "Fun Mode: ON" : "Fun Mode: OFF"}
          </button>
        </div>

        <p className="status">{status}</p>

        <div className="board" role="grid" aria-label="Tic Tac Toe board">
          {squares.map((value, i) => {
            const isWinningCell = result?.line?.includes(i);
            const isX = value === "X";
            const isO = value === "O";

            return (
              <button
                key={i}
                className={`cell ${isWinningCell ? "win" : ""} ${
                  funMode && isX ? "xCell" : ""
                } ${funMode && isO ? "oCell" : ""}`}
                onClick={() => handleClick(i)}
                aria-label={`Cell ${i + 1} ${
                  value ? `occupied by ${value}` : "empty"
                }`}
              >
                {displayValue(value)}
              </button>
            );
          })}
        </div>

        <div className="actions">
          <button className="reset" onClick={resetGame}>
            Reset
          </button>
        </div>

        <p className="hint">
          2-player local game: take turns clicking squares.
        </p>
      </div>
    </div>
  );
}