import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './GameGrid.module.scss';

const GameGrid: React.FC = () => {
	const [grid, setGrid] = useState<string[][]>([]);
	const [gridSize, setGridSize] = useState(10); // Default to 10x10 grid

	useEffect(() => {
		// Fetch initial game state
		const fetchGameState = async () => {
			try {
				const response = await axios.get('/api/game-state');
				console.log(response.data); // Log the data to inspect it
				setGridSize(response.data.gridSize);
				setGrid(response.data.gridState);
			} catch (error) {
				console.error('Error fetching game state:', error);
			}
		};

		fetchGameState();
	}, []);

	const handleCellClick = (x: number, y: number) => {
		// Logic to handle cell click
		axios
			.post('/api/move', {
				username: localStorage.getItem('username'),
				x,
				y,
			})
			.then((response) => {
				console.log(response.data); // Log the response to inspect it
				setGrid(response.data.gridState);
			})
			.catch((error) => {
				console.error('Error making move:', error);
			});
	};

	return (
		<div className={styles.grid}>
			{[...Array(gridSize)].map((_, rowIndex) => (
				<div key={rowIndex} className={styles.gridRow}>
					{[...Array(gridSize)].map((_, colIndex) => (
						<div
							key={colIndex}
							className={styles.gridCell}
							style={{
								backgroundColor:
									grid[rowIndex]?.[colIndex] || 'transparent',
							}}
							onClick={() => handleCellClick(rowIndex, colIndex)}
						/>
					))}
				</div>
			))}
		</div>
	);
};

export default GameGrid;
