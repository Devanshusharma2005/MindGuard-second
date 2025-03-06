"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const gridSize = 4;
const totalTiles = gridSize * gridSize;

const shuffleArray = (array: number[]) => {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Numpuzzle = () => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number } }>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    const initialTiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
    initialTiles.push(""); // Empty space
    const shuffledTiles = shuffleArray(initialTiles);
    setTiles(shuffledTiles);
    setPositions(getTilePositions(shuffledTiles));
    setStartTime(Date.now());
  }, []);

  // Add timer effect
  useEffect(() => {
    if (!startTime || isComplete) return;

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, isComplete]);

  // Add check for puzzle completion
  const checkCompletion = (newTiles: number[]) => {
    const isCompleted = newTiles.every((tile, index) => {
      if (index === newTiles.length - 1) return tile === "";
      return tile === index + 1;
    });

    if (isCompleted) {
      setIsComplete(true);
    }
  };

  const getTilePositions = (tiles: number[]) => {
    return tiles.reduce((acc, tile, index) => {
      acc[tile] = { x: index % gridSize, y: Math.floor(index / gridSize) };
      return acc;
    }, {});
  };

  const handleTileClick = (index: number) => {
    const emptyIndex = tiles.indexOf("");
    const newTiles = [...tiles];
    
    if (isValidMove(index, emptyIndex)) {
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setPositions(getTilePositions(newTiles));
      checkCompletion(newTiles);
    }
  };

  const isValidMove = (index: number, emptyIndex: number) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;
    return row === emptyRow || col === emptyCol;
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-4">Numpuzzle Game</h1>
      <div className=" flex text-xl mb-4">Time: {formatTime(elapsedTime)}</div>
      <div className={`grid grid-cols-${gridSize} gap-2 relative`} style={{ width: "800px", height: "800px" }}>
        {tiles.map((tile, index) => (
          tile !== "" && (
            <motion.div
              key={tile}
              className="absolute w-32 h-32 flex items-center justify-center bg-blue-500 text-white text-3xl font-bold rounded shadow-lg"
              animate={{
                x: positions[tile].x * 100,
                y: positions[tile].y * 100,
              }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={() => handleTileClick(index)}
            >
              {tile}
            </motion.div>
          )
        ))}
      </div>
      {isComplete && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-2 p-4 bg-green-100 rounded-lg text-center"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-2">Congratulations! 🎉</h2>
          <p className="text-lg">You solved the puzzle in {formatTime(elapsedTime)}!</p>
          <Button 
            className="mt-4"
            onClick={() => {
              setIsComplete(false);
              setStartTime(Date.now());
              setElapsedTime(0);
              const initialTiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
              initialTiles.push("");
              const shuffledTiles = shuffleArray(initialTiles);
              setTiles(shuffledTiles);
              setPositions(getTilePositions(shuffledTiles));
            }}
          >
            Play Again
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Numpuzzle;