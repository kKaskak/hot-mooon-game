import React, { useEffect } from 'react';
import { GameGrid, UsernameInput } from '@/common';
import { usePlayer } from '@/context';

import axios from 'axios';

const Home: React.FC = () => {
    const { username } = usePlayer();

    useEffect(() => {
        if (username) {
            joinGame(username);
        }
    }, [username]);

    const joinGame = async (username: string) => {
        try {
            const response = await axios.post('/join', { username });
            console.log('Joined game:', response.data);
        } catch (error) {
            console.error('Error joining the game:', error);
        }
    };

    return (
        <div>
            <h1>Welcome to the Grid Game!</h1>
            {!username && <UsernameInput />}
            {username && <GameGrid />}
        </div>
    );
};

export default Home;
