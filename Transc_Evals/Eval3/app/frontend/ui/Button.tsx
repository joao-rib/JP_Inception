interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	variant?: 'primary' | 'secondary';
	className?: string;
}

export default function Button({ children, onClick, variant = 'primary', className = '' }: ButtonProps) {
	const baseStyles = "w-full font-bold py-5 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95";
	
	const variantStyles = {
		primary: "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black shadow-lg shadow-yellow-500/30",
		secondary: "bg-white/10 hover:bg-white/15 text-white border-2 border-yellow-600/30 hover:border-yellow-600/50"
	};

	return (
		<button 
			onClick={onClick}
			className={`${baseStyles} ${variantStyles[variant]} ${className}`}
		>
			{children}
		</button>
	);
}
