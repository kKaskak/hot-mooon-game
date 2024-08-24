import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import axios from 'axios';

type PlayerContext = {
	username: string | null;
	color: string | null;
	setUsername: (username: string) => void;
	setColor: (color: string) => void;
};

type Props = {
	children: ReactNode;
};

const PlayerContext = createContext<PlayerContext | undefined>(undefined);

export const PlayerProvider = ({ children }: Props) => {
	const [username, setUsername] = useState<string | null>(
		localStorage.getItem('username'),
	);
	const [color, setColor] = useState<string | null>(
		localStorage.getItem('color'),
	);

	useEffect(() => {
		if (username && !color) {
			// If username exists but no color is set, join the game and get the color
			joinGame(username);
		}
	}, [username]);

	const joinGame = async (username: string) => {
		try {
			const response = await axios.post('/api/join', { username });
			setColor(response.data.color);
			localStorage.setItem('color', response.data.color);
		} catch (error) {
			console.error('Error joining the game:', error);
		}
	};

	const handleSetUsername = (newUsername: string) => {
		setUsername(newUsername);
		localStorage.setItem('username', newUsername);
		joinGame(newUsername);
	};

	return (
		<PlayerContext.Provider
			value={{
				username,
				color,
				setUsername: handleSetUsername,
				setColor,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

export const usePlayer = (): PlayerContext => {
	const context = useContext(PlayerContext);
	if (context === undefined) {
		throw new Error('usePlayer must be used within a PlayerProvider');
	}
	return context;
};
