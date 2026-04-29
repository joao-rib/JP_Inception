import LegalPageTemplate from "../../legal/components/LegalPageTemplate";

const sections = [
  {
    title: "Use of the Service",
    content: `This application is an online multiplayer game developed as part of the 42 School ft_transcendence project.

By using the service, you agree to follow these terms.`,
  },
  {
    title: "User Accounts",
    content: `Users are responsible for keeping their login credentials secure and for all activity performed under their account.

You must provide accurate information when creating an account.`,
  },
  {
    title: "Acceptable Use",
    content: `Users agree not to:

• Attempt to gain unauthorized access to the system
• Disrupt or interfere with the service
• Use cheats, bots, or automated tools
• Exploit bugs or vulnerabilities
• Harass or abuse other users

Violation of these rules may result in account suspension or termination.`,
  },
  {
    title: "Service Availability",
    content:
      'The service is provided on an "as is" basis. We do not guarantee uninterrupted or error-free operation.',
  },
  {
    title: "Account Termination",
    content:
      "We reserve the right to suspend or terminate accounts that violate these terms or misuse the service.",
  },
];

export default function TermsPage() {
  return (
    <LegalPageTemplate
      title="Terms of Service"
      description="Rules and conditions for using ft_transcendence"
      updatedAt="April 22, 2026"
      sections={sections}
    />
  );
}
