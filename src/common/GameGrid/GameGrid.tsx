import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './GameGrid.module.scss';
import toast from 'react-hot-toast';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const GameGrid = () => {
    const [grid, setGrid] = useState<Grid>({});
    const [gridSize, setGridSize] = useState(10);
    const [socketUrl, setSocketUrl] = useState('ws://localhost:5050');

    // Initialize WebSocket connection
    const { sendMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl);

    useEffect(() => {
        if (lastJsonMessage !== null) {
            if (lastJsonMessage.success) {
                setGrid(lastJsonMessage.gridState);
            }
        }
    }, [lastJsonMessage]);

    const handleCellClick = (x: number, y: number) => {
        axios
            .post('/api/move', {
                username: localStorage.getItem('username'),
                x,
                y,
            })
            .then((response) => {
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

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <div>
            <div>Status: {connectionStatus}</div>
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
        </div>
    );
};

export default GameGrid;
