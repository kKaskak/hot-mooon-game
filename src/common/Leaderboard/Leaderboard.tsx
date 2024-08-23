import { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
	const [leaderboard, setLeaderboard] = useState<
		{ username: string; points: number }[]
	>([]);

	useEffect(() => {
		const fetchLeaderboard = async () => {
			const response = await axios.get('/leaderboard');
			setLeaderboard(response.data.leaderboard);
		};

		fetchLeaderboard();
	}, []);

	return (
		<div>
			<h2>Top Players</h2>
			<ol>
				{leaderboard.map((player, index) => (
					<li key={index}>
						{index + 1}. {player.username} - {player.points} points
					</li>
				))}
			</ol>
		</div>
	);
};

export default Leaderboard;
