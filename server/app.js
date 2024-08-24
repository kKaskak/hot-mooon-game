const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const { appConfig } = require('./config');
const proxy = require('express-http-proxy');
const cron = require('node-cron');

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// Initialize SQLite Database
const db = new sqlite3.Database('./game.db', (err) => {
	if (err) {
		console.error('Could not connect to database', err);
	} else {
		console.log('Connected to SQLite database');
	}
});

// Create Tables
db.serialize(() => {
	db.run(`
        CREATE TABLE IF NOT EXISTS Players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            color TEXT,
            points INTEGER DEFAULT 0
        )
    `);

	db.run(`
        CREATE TABLE IF NOT EXISTS Rounds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gridSize INTEGER,
            gridState TEXT,
            startTime DATETIME,
            endTime DATETIME
        )
    `);

	db.run(`
        CREATE TABLE IF NOT EXISTS Leaderboard (
            id INTEGER PRIMARY KEY,
            username TEXT,
            points INTEGER
        )
    `);
});

// API Routes

// Route to join the game
app.post('/join', (req, res) => {
	const { username } = req.body;

	// Assign a random color for the player
	const color = '#' + Math.floor(Math.random() * 16777215).toString(16);

	const query = `INSERT INTO Players (username, color) VALUES (?, ?)`;
	db.run(query, [username, color], function (err) {
		if (err) {
			res.status(400).json({ error: 'Username already exists' });
		} else {
			res.json({ id: this.lastID, username, color });
		}
	});
});

// Route to get the current game state
app.get('/game-state', (req, res) => {
	const roundId = 1; // For simplicity, we'll use a single round (expand as needed)

	const query = `SELECT * FROM Rounds WHERE id = ?`;
	db.get(query, [roundId], (err, round) => {
		if (err) {
			res.status(500).json({ error: err.message });
		} else if (round) {
			const gridState = JSON.parse(round.gridState);
			res.json({ gridSize: round.gridSize, gridState });
		} else {
			res.status(404).json({ error: 'No active round found' });
		}
	});
});

// Route to handle player moves
app.post('/move', (req, res) => {
    const { username, x, y } = req.body;
    const roundId = 1; // For simplicity, we'll use a single round (expand as needed)
    const gridPosition = `${x},${y}`;

    // Check if the round exists
    const query = `SELECT * FROM Rounds WHERE id = ?`;
    db.get(query, [roundId], (err, round) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else if (round) {
            let gridState = JSON.parse(round.gridState);

            // Check if the cell is already occupied
            const existingPlayer = gridState[gridPosition];
            if (existingPlayer) {
                if (existingPlayer.username === username) {
                    return res.status(400).json({ message: "You can't occupy your own cell again!" });
                } else {
                    // If another player occupies this cell, return the move to the original player
                    db.run(
                        `UPDATE Players SET points = points - 1 WHERE username = ?`,
                        [existingPlayer.username],
                    );
                    db.run(
                        `UPDATE Players SET points = points + 1 WHERE username = ?`,
                        [username],
                    );
                }
            }

            // Fetch the player from the database
            db.get(`SELECT id, username, color, points FROM Players WHERE username = ?`, [username], (err, player) => {
                if (err || !player) {
                    return res.status(500).json({ error: 'Player not found' });
                }

                // Update the grid state with the new player's move
                gridState[gridPosition] = {
                    id: player.id,
                    username: player.username,
                    color: player.color,
                    points: player.points
                };

                // Update the round in the database
                const updateQuery = `UPDATE Rounds SET gridState = ? WHERE id = ?`;
                db.run(updateQuery, [JSON.stringify(gridState), roundId], (err) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                    } else {
                        res.json({ success: true, gridState, message: 'Cell occupied!', player: gridState[gridPosition] });
                    }
                });
            });
        } else {
            res.status(404).json({ error: 'No active round found' });
        }
    });
});

// Route to get the leaderboard
app.get('/leaderboard', (req, res) => {
	const query = `SELECT username, points FROM Players ORDER BY points DESC LIMIT 300`;

	db.all(query, [], (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
		} else {
			res.json({ leaderboard: rows });
		}
	});
});

// Starting a new round (for testing purpose)
app.post('/start-round', (req, res) => {
	const { gridSize } = req.body;

	// Initialize a new grid with the given size
	const gridState = {};

	const query = `INSERT INTO Rounds (gridSize, gridState, startTime, endTime) VALUES (?, ?, ?, ?)`;
	const startTime = new Date();
	const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

	db.run(
		query,
		[
			gridSize,
			JSON.stringify(gridState),
			startTime.toISOString(),
			endTime.toISOString(),
		],
		function (err) {
			if (err) {
				res.status(500).json({ error: err.message });
			} else {
				res.json({ roundId: this.lastID, gridSize, gridState });
			}
		},
	);
});

// Function to start a new round
function startNewRound(gridSize = 10) {
	return new Promise((resolve, reject) => {
		const gridState = {};

		const startTime = new Date();
		const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

		const query = `INSERT INTO Rounds (gridSize, gridState, startTime, endTime) VALUES (?, ?, ?, ?)`;
		db.run(
			query,
			[
				gridSize,
				JSON.stringify(gridState),
				startTime.toISOString(),
				endTime.toISOString(),
			],
			function (err) {
				if (err) {
					reject(err);
				} else {
					resolve({ roundId: this.lastID, gridSize, gridState });
				}
			},
		);
	});
}

// Schedule a new round every hour at the start of the hour
cron.schedule('0 * * * *', async () => {
	try {
		console.log('Starting a new round...');
		await startNewRound();
		console.log('New round started.');
	} catch (error) {
		console.error('Error starting a new round:', error);
	}
});

if (process.env.NODE_ENV === 'production') {
	const path = require('path');
	const static_path = path.resolve(path.join(__dirname, '..', 'dist'));
	app.use(express.static(static_path));
	app.get('*', (req, res) => {
		res.sendFile(path.join(static_path, 'index.html'));
	});
} else {
	app.get('*', proxy(`http://localhost:${appConfig.vite_app_port || 3000}`));
}

app.listen(appConfig.server_port, () => {
	console.log(`Server running on http://localhost:${appConfig.server_port}`);
});
