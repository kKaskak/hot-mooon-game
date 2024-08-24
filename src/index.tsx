import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './Router';
import { PlayerProvider } from './context';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<PlayerProvider>
			<RouterProvider router={router} />
		</PlayerProvider>
	</React.StrictMode>,
);
