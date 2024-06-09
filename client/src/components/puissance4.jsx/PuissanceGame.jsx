import React, { useEffect, useState } from "react";

const Puissance4 = ({ socket }) => {
  const [board, setBoard] = useState(Array.from({ length: 6 }, () => Array(7).fill(null)));
  const [colors, setColors] = useState(Array.from({ length: 6 }, () => Array(7).fill("bg-white")));
  const [currentPlayer, setCurrentPlayer] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on('gameStart', (playerColor) => {
        setBoard(Array.from({ length: 6 }, () => Array(7).fill(null)));
        setColors(Array.from({ length: 6 }, () => Array(7).fill("bg-white")));
        setCurrentPlayer(playerColor);
      });

      socket.on('moveMade', ({ board: newBoard, player }) => {
        updateBoardAndColors(newBoard);
        setCurrentPlayer(player === "red" ? "yellow" : "red");
      });
    }

    return () => {
      socket.off('gameStart');
      socket.off('moveMade');
    };
  }, [socket]);

  const updateBoardAndColors = (newBoard) => {
    const newColors = newBoard.map(row =>
      row.map(cell => {
        if (cell === "red") return "bg-red-400";
        if (cell === "yellow") return "bg-yellow-400";
        return "bg-white";
      })
    );
    setBoard(newBoard);
    setColors(newColors);
  };

  const handleCircleClick = (rowIndex, colIndex) => {
    if (board[rowIndex][colIndex] === null && currentPlayer) {
      socket.emit('playerMove', { rowIndex, colIndex });
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-col-reverse">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`w-20 h-20 rounded-full m-3 cursor-pointer ${colors[rowIndex][colIndex]}`}
                onClick={() => handleCircleClick(rowIndex, colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Puissance4;