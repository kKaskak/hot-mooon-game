import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin'; // Corrected import path
import pluginReact from 'eslint-plugin-react';

export default [
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		languageOptions: {
			globals: globals.browser,
		},
	},
	pluginJs.configs.recommended,
	tseslint.configs.recommended, // Removed the spread operator for proper usage
	{
		...pluginReact.configs.recommended,
		settings: {
			react: {
				version: 'detect', // Automatically detect the react version
			},
		},
	},
];
