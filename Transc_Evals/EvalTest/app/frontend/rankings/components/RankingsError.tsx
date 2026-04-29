export default function RankingsError({ message }: { message: string }) {
	return (
		<div
			className="p-4 rounded-lg text-center"
			style={{
				backgroundColor: "rgba(239, 68, 68, 0.1)",
				borderColor: "rgba(239, 68, 68, 0.5)",
				color: "var(--text-primary)",
			}}
		>
			{message}
		</div>
	);
}
