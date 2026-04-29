"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";
import { registerUser } from "@/app/actions/authActions";

export function useHomePageController() {
	const router = useRouter();
	const [loginOpen, setLoginOpen] = useState(false);
	const [signupOpen, setSignupOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Handle login: uses NextAuth signIn with Credentials provider
	 * - Extracts email/password from form
	 * - Calls NextAuth signIn() which validates against database
	 * - If valid, creates JWT session stored in HTTP-only cookie
	 * - Errors are caught and displayed to user
	 */
	const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const email = String(formData.get("email"));
		const password = String(formData.get("password"));

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false, // We'll handle redirect manually
			});

			console.log("[handleLogin] signIn result:", result);

			if (!result?.ok) {
				const providerError = result?.error ?? "CredentialsSignin";
				const errorMessage = providerError === "CredentialsSignin"
					? "Invalid email or password"
					: providerError;
				setError(errorMessage);
				console.error("[handleLogin] Login failed:", result?.error);
				return;
			}

			console.log("[handleLogin] Login successful, about to redirect");
			// Redirect to lobby after successful login (do this BEFORE closing modal to avoid form element issues)
			console.log("[handleLogin] Calling router.push('/game/lobby')");
			router.push("/game/lobby");
			
			// Close modal after redirect is initiated
			setLoginOpen(false);
			console.log("[handleLogin] router.push() called");
		} catch (err) {
			const fallbackError = err instanceof Error && err.message.includes("NetworkError")
				? "Invalid email or password."
				: "An error occurred during login";
			setError(fallbackError);
			console.error("[handleLogin] Error:", err);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Handle signup: calls Server Action registerUser, then auto-signs in
	 * - Calls Server Action to hash password + create user + initialize scores
	 * - If successful, automatically signs in the new user
	 * - Validates input before sending
	 */
	const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const username = String(formData.get("username"));
		const email = String(formData.get("email"));
		const password = String(formData.get("password"));

		// Basic client-side validation
		if (!username || !email || !password) {
			setError("All fields are required");
			setIsLoading(false);
			return;
		}

		try {
			// Call Server Action to register user
			const result = await registerUser(username, email, password);

			console.log("[handleSignup] registerUser result:", result);

			if (!result.success) {
				setError(result.message);
				console.error("[handleSignup] Registration failed:", result.message);
				return;
			}

			console.log("[handleSignup] Registration successful, attempting auto-login");
			// Auto sign-in after successful registration
			const signInResult = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			console.log("[handleSignup] signIn result:", signInResult);

			if (!signInResult?.ok) {
				setError("Registration successful, but auto-login failed");
				console.error("[handleSignup] Auto-login failed:", signInResult?.error);
				return;
			}

			console.log("[handleSignup] Auto-login successful, about to redirect");
			// Redirect to lobby after successful signup (do this BEFORE closing modal to avoid form element issues)
			console.log("[handleSignup] Calling router.push('/game/lobby')");
			router.push("/game/lobby");
			
			// Close modal after redirect is initiated
			setSignupOpen(false);
			console.log("[handleSignup] router.push() called");
		} catch (err) {
			setError("An error occurred during signup");
			console.error("[handleSignup] Error:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const openLogin = () => {
		setLoginOpen(true);
		setError(null); // Clear errors when opening modal
	};

	const closeLogin = () => {
		setLoginOpen(false);
		setError(null);
	};

	const openSignup = () => {
		setSignupOpen(true);
		setError(null);
	};

	const closeSignup = () => {
		setSignupOpen(false);
		setError(null);
	};

	const switchToLogin = () => {
		setSignupOpen(false);
		setLoginOpen(true);
		setError(null);
	};

	const switchToSignup = () => {
		setLoginOpen(false);
		setSignupOpen(true);
		setError(null);
	};

	return {
		loginOpen,
		signupOpen,
		isLoading,
		error,
		handleLogin,
		handleSignup,
		openLogin,
		closeLogin,
		openSignup,
		closeSignup,
		switchToLogin,
		switchToSignup,
	};
}
