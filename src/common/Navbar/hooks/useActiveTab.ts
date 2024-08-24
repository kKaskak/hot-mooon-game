import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

const useActiveTab = (iconMappings: Option[]) => {
	const location = useLocation();
	const [activeTab, setActiveTab] = useState<any>(null);
	const excludedPaths = ['/', '/tools', '/auth'];

	useEffect(() => {
		const activeItem = iconMappings.find(
			(item) =>
				typeof item.action === 'string' &&
				item.action === window.location.pathname,
		);

		!excludedPaths.includes(location.pathname) && setActiveTab('tools');
		activeItem && setActiveTab(activeItem.id);
	}, [location.pathname, iconMappings]);

	return [activeTab, setActiveTab];
};

export default useActiveTab;
