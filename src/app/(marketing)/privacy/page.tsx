import { LegalPage } from "@/components/marketing/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="June 2026"
      sections={[
        { heading: "Information we collect", body: ["We collect information you provide directly to us, such as when you submit an enquiry, request a quote, or make a booking. This may include your name, email, phone number, event details, and payment information.", "We also collect certain information automatically, including your IP address, browser type, and the pages you visit on our site."] },
        { heading: "How we use your information", body: ["We use the information we collect to respond to your enquiries, process bookings and payments, send you relevant updates, and improve our services.", "We will never sell your personal information to third parties."] },
        { heading: "Data security", body: ["We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, or disclosure.", "Payment information is processed securely through our PCI-compliant payment partner, Stripe."] },
        { heading: "Your rights", body: ["You have the right to access, correct, or delete your personal information at any time. You may also object to or restrict certain processing of your data.", "To exercise these rights, please contact us at privacy@theatrium.co."] },
        { heading: "Cookies", body: ["We use cookies to improve your browsing experience and analyse site traffic. You can control cookies through your browser settings."] },
        { heading: "Contact us", body: ["If you have any questions about this Privacy Policy, please contact us at privacy@theatrium.co or by post at 1200 Riverside Ave, Portland, OR 97201."] },
      ]}
    />
  );
}
