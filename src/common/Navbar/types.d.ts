type Option = {
	icon: string;
	action: string | (() => void);
	id: string;
	name: string;
	disabled?: boolean;
	hideOnMobile?: boolean;
};
