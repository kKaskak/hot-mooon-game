import classNames from 'classnames';
import { motion } from 'framer-motion';
import { hoverAnimation, hoverAnimationEasy } from '@/animations';
import { useMobileDevice } from '@/common';
import styles from './Button.module.scss';

type Props = {
	children: React.ReactNode;
	className?: string;
	type?: 'button' | 'submit' | 'reset';
	small?: boolean;
	confirm?: boolean;
	filler?: boolean;
	danger?: boolean;
	onClick?: () => void;
};

const Button = ({
	children,
	className,
	small,
	danger,
	onClick,
	filler,
	confirm,
	type,
	...props
}: Props) => {
	const isMobile = useMobileDevice();

	return (
		<motion.button
			type={type || 'button'}
			whileHover={!isMobile ? hoverAnimationEasy : hoverAnimation}
			className={classNames(styles.button, className, {
				[styles.small]: small,
				[styles.danger]: danger,
				[styles.confirm]: confirm,
				[styles.filler]: filler,
			})}
			{...props}
			onClick={onClick}
		>
			{children}
		</motion.button>
	);
};

export default Button;
