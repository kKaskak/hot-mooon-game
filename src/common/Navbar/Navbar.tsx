import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon, LeaderboardIcon, RulesIcon } from '@/assets/icons';
import { useActiveTab } from './hooks';
import { useMobileDevice } from '@/common';
import styles from './Navbar.module.scss';

const Navbar = () => {
	const navigate = useNavigate();
	const isMobile = useMobileDevice();

	const iconMappings: Option[] = [
		{ icon: HomeIcon, action: '/', id: 'home', name: 'Dashboard' },
		{
			icon: LeaderboardIcon,
			action: '/leaderboard',
			id: 'leaderboard',
			name: 'Leaderboard',
		},
		{ icon: RulesIcon, action: '/rules', id: 'rules', name: 'Rules' },
	];

	const [activeTab, setActiveTab] = useActiveTab(iconMappings);
	const [delayedActiveTab, setDelayedActiveTab] = useState<any>(null);

	const onTabClick = (id: string, action: string | (() => void)) => {
		setActiveTab(id);
		typeof action === 'string'
			? navigate(action)
			: typeof action === 'function' && action();
	};

	useEffect(() => {
		if (activeTab !== null) {
			const timeout = setTimeout(() => {
				setDelayedActiveTab(activeTab);
			}, 250);
			return () => clearTimeout(timeout);
		}
	}, [activeTab]);

	return (
		<div className={styles.navbarContainer}>
			{iconMappings.map(
				({ icon: Icon, id, action, disabled, name, hideOnMobile }) => (
					<div
						className={classNames(
							styles.tabWrapper,
							{ [styles.logoutTab]: id === 'logout' },
							{ [styles.newTaskTab]: id === 'newtask' },
							{ [styles.hideOnMobile]: hideOnMobile },
						)}
						key={id}
						onClick={() => onTabClick(id, action)}
					>
						<button
							className={classNames(styles.tabButton, {
								[styles.active]: delayedActiveTab === id,
							})}
							disabled={disabled}
						>
							{activeTab === id ? (
								<motion.span
									layoutId="bubble"
									className={styles.animatedSpan}
									style={
										isMobile
											? { originY: '0px' }
											: { originX: '0px' }
									}
									transition={{
										type: 'spring',
										bounce: 0.2,
										duration: 0.6,
									}}
								/>
							) : null}
							<Icon />
						</button>
						<span
							className={classNames(styles.tabName, {
								[styles.active]: activeTab === id,
							})}
						>
							{name}
						</span>
					</div>
				),
			)}
		</div>
	);
};

export default Navbar;
