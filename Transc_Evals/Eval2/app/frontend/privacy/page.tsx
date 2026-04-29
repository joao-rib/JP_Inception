import LegalPageTemplate from "../../legal/components/LegalPageTemplate";

const sections = [
  {
    title: "Information We Collect",
    content: `We collect basic account information required to operate the service, including:

• Username
• Email address
• Authentication data
• Game activity such as match history and results

We may also collect technical information such as IP address and login timestamps for security purposes.`,
  },
  {
    title: "How We Use Information",
    content: `We use collected information to:

• Create and manage user accounts
• Provide gameplay functionality
• Maintain security and prevent misuse
• Improve the reliability of the service

We do not sell personal data.`,
  },
  {
    title: "Cookies and Sessions",
    content: `We use cookies or authentication tokens to maintain secure login sessions and enable core features of the application.

These technologies are required for the service to function properly.`,
  },
  {
    title: "Data Security and Retention",
    content: `We apply reasonable safeguards to protect user data.

Account data is stored while the account exists and may be deleted upon request.`,
  },
  {
    title: "User Rights",
    content: `Users may:

• Update their account information
• Request account deletion`,
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageTemplate
      title="Privacy Policy"
      description="How we collect, use, and protect your data in ft_transcendence"
      updatedAt="April 22, 2026"
      sections={sections}
    />
  );
}
