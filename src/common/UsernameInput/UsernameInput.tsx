import React, { useState } from 'react';
import { usePlayer } from '@/context';

const UsernameInput = () => {
	const { username, setUsername } = usePlayer();
	const [inputValue, setInputValue] = useState<string>(username || '');

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (inputValue) {
			setUsername(inputValue);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="username">Enter your username:</label>
			<input
				id="username"
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				required
			/>
			<button type="submit">Join Game</button>
		</form>
	);
};

export default UsernameInput;
