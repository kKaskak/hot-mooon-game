import { createBrowserRouter } from 'react-router-dom';
import { Home, LeaderboardPage, RulesPage } from '@/pages';
import { ErrorPage } from '@/ErrorPage';
import Root from './Root';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Home />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/rules',
				element: <RulesPage />,
				errorElement: <ErrorPage />,
			},
			{
				path: '/leaderboard',
				element: <LeaderboardPage />,
				errorElement: <ErrorPage />,
			},
		],
	},
]);

export default router;
