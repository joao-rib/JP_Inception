"use client";

import { Suspense } from "react";
import Background from "../components/Background";
import RulesAboutCard from "./components/RulesAboutCard";
import RulesBackLink from "./components/RulesBackLink";
import RulesHero from "./components/RulesHero";
import RulesQuickRulesCard from "./components/RulesQuickRulesCard";
import RulesTutorialsCard from "./components/RulesTutorialsCard";

export default function Rules() {
	return (
		<div className="relative min-h-screen overflow-hidden font-sans">
			<Background />

			<Suspense fallback={null}>
				<RulesBackLink />
			</Suspense>

			<main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 py-20">
				<div className="w-full max-w-4xl mx-auto space-y-12">
					<RulesHero />
					<RulesAboutCard />
					<RulesTutorialsCard />
					<RulesQuickRulesCard />

				</div>
			</main>
		</div>
	);
}