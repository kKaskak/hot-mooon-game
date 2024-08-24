import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './GameGrid.module.scss';
import toast from 'react-hot-toast';

const GameGrid = () => {
    const [grid, setGrid] = useState<Grid>({});
    const [gridSize, setGridSize] = useState(10);

    // Function to fetch game state from the server
    const fetchGameState = async () => {
        try {
            const response = await axios.get('/api/game-state');
            console.log(response.data);
            setGridSize(response.data.gridSize);
            setGrid(response.data.gridState);
        } catch (error) {
            console.error('Error fetching game state:', error);
        }
    };

    useEffect(() => {
        fetchGameState();

        const intervalId = setInterval(() => {
            fetchGameState();
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    const handleCellClick = (x: number, y: number) => {
        axios
            .post('/api/move', {
                username: localStorage.getItem('username'),
                x,
                y,
            })
            .then((response) => {
                console.log(response.data);
                if (response.data.success) {
                    setGrid(response.data.gridState);
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                console.error('Error making move:', error);
                toast.error('An error occurred while making the move.');
            });
    };

    const getCellColor = (x: number, y: number) => {
        const positionKey = `${x},${y}`;
        return grid[positionKey]?.color || 'transparent';
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
                                backgroundColor: getCellColor(rowIndex, colIndex),
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

