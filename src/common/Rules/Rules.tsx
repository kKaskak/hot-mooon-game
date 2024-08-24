const Rules = () => {
	return (
		<div>
			<h2>Game Rules</h2>
			<ul>
				<li>
					The game takes place on a grid of various sizes (10x10,
					20x20, 30x30).
				</li>
				<li>Each player can occupy cells with their own color.</li>
				<li>The goal is to occupy as many cells as possible.</li>
				<li>Each cell occupied gives the player 1 point.</li>
				<li>
					Rounds last 1 hour, and the player with the most cells
					occupied wins.
				</li>
			</ul>
		</div>
	);
};

export default Rules;
