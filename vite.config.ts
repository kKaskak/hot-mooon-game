import * as path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	const VITE_APP_PORT = env.VITE_APP_PORT;

	return {
		server: {
			port: Number(VITE_APP_PORT),
			open: true,
			hmr: {
				overlay: false,
			},
			proxy: {
				'/api': {
					target: 'http://localhost:5050',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
		plugins: [react(), svgr()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
			},
		},
	};
});
