import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Navbar } from '@/common';
import { Toaster } from 'react-hot-toast';

const Root = () => {
	return (
		<>
			<Toaster position="top-center" reverseOrder={false} />
			<ScrollRestoration />
			<Outlet />
			<Navbar />
		</>
	);
};

export default Root;
