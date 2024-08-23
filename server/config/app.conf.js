const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const appConfig = {
	env: process.env.NODE_ENV || 'development',
	server_port: process.env.VITE_SERVER_PORT,
	vite_app_port: process.env.VITE_APP_PORT,
};

module.exports = appConfig;
