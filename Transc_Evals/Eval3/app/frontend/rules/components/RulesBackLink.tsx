"use client";

import { useRouter } from "next/navigation";

const RULES_RETURN_TO_STORAGE_KEY = "ft-transcendence-rules-return-to";

const sanitizeReturnTo = (value: string | null) => {
	return value && value.startsWith("/") ? value : "/";
};

export default function RulesBackLink() {
	const router = useRouter();

	const handleBack = () => {
		const searchParams = new URLSearchParams(window.location.search);
		const requestedReturnTo = sanitizeReturnTo(searchParams.get("returnTo"));
		const storedReturnTo = sanitizeReturnTo(
			window.sessionStorage.getItem(RULES_RETURN_TO_STORAGE_KEY),
		);
		const returnTo = requestedReturnTo !== "/" ? requestedReturnTo : storedReturnTo;

		window.sessionStorage.removeItem(RULES_RETURN_TO_STORAGE_KEY);
		router.push(returnTo);
	};

	return (
		<button
			type="button"
			onClick={handleBack}
			className="fixed top-8 left-8 z-20 transition-colors hover:opacity-80 flex items-center gap-2 text-lg"
			style={{ color: "var(--text-accent)" }}
		>
			<span className="inline-flex h-5 w-5 items-center justify-center" aria-hidden="true">
				<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
					<path d="M15 18l-6-6 6-6" />
				</svg>
			</span>
			<span className="leading-normal">Back</span>
		</button>
	);
}