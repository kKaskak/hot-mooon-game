import { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
	const [leaderboard, setLeaderboard] = useState<Leaderboard>([]);

	useEffect(() => {
		const fetchLeaderboard = async () => {
			const response = await axios.get('/api/leaderboard');
			setLeaderboard(response.data.leaderboard);
		};

		fetchLeaderboard();
	}, []);

	return (
		<div>
			<h2>Top Players</h2>
			<ol>
				{leaderboard.map((user, index) => (
					<li key={index}>
						{user.username} - {user.score} points
					</li>
				))}
			</ol>
		</div>
	);
};

export default Leaderboard;
