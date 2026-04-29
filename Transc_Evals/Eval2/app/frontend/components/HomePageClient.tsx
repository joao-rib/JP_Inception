"use client";

import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import Background from "./Background";
import AuthCard from "./AuthCard";
import HomeFooterLinks from "./HomeFooterLinks";
import HomeHero from "./HomeHero";
import { useHomePageController } from "../hooks/useHomePageController";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Home() {
  const {
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
  } = useHomePageController();

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      <Background />

      <div className="fixed top-6 left-6 z-50">
        <ThemeSwitcher />
      </div>

      <LoginModal
        isOpen={loginOpen}
        onClose={closeLogin}
        onSubmit={handleLogin}
        onSwitchToSignup={switchToSignup}
        isLoading={isLoading}
        error={error}
      />

      <SignupModal
        isOpen={signupOpen}
        onClose={closeSignup}
        onSubmit={handleSignup}
        onSwitchToLogin={switchToLogin}
        isLoading={isLoading}
        error={error}
      />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 py-20">
        <div className="mx-auto w-full max-w-2xl space-y-12">
          <HomeHero />
          <AuthCard onLoginClick={openLogin} onSignupClick={openSignup} />
          <HomeFooterLinks />
        </div>
      </main>
    </div>
  );
}