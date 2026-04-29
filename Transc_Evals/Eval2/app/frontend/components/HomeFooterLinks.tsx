
"use client";

import Link from "next/link";

const RULES_RETURN_TO_STORAGE_KEY = "ft-transcendence-rules-return-to";

export default function HomeFooterLinks() {
	const handleRulesClick = () => {
		if (typeof window === "undefined") {
			return;
		}

		window.sessionStorage.setItem(RULES_RETURN_TO_STORAGE_KEY, "/");
	};

  return (
    <div className="flex items-center justify-center gap-6 pt-4 text-sm">
      <Link href="/frontend/rules?returnTo=%2F"onClick={handleRulesClick}className="transition-colors"style={{ color: "var(--text-accent)" }}>
        Rules
      </Link>
      <span style={{ color: "var(--text-muted)" }}>•</span>
      <a href="/privacy" className="transition-colors" style={{ color: "var(--text-accent)" }}>
        Privacy Policy
      </a>
      <span style={{ color: "var(--text-muted)" }}>•</span>
      <a href="/support" className="transition-colors" style={{ color: "var(--text-accent)" }}>
        Terms of Service
      </a>
    </div>
  );
}
