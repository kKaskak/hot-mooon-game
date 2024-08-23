import { createBrowserRouter } from 'react-router-dom';
import { Home, LeaderboardPage, RulesPage } from '@/pages';
import { ErrorPage } from '@/ErrorPage';

const router = createBrowserRouter([
	{
		path: '/',
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
]);

export default router;
