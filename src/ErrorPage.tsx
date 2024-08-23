import { Button } from '@/common';
import { Link, useRouteError } from 'react-router-dom';

export const ErrorPage = () => {
	const error: any = useRouteError();

	return (
		<div className={'error-container'}>
			<h1>{error.status}</h1>
			<h2>error.message</h2>
			<Link to={'/'}>
				<Button small>Home</Button>
			</Link>
		</div>
	);
};
