import { LegalPage } from "@/components/marketing/legal-page";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      updated="June 2026"
      sections={[
        { heading: "Bookings & deposits", body: ["A 25% non-refundable deposit is required to secure your date. The remaining balance is split across milestone payments, with the final payment due 14 days before your event.", "Dates are only confirmed once the deposit has been received and a signed agreement is in place."] },
        { heading: "Cancellations", body: ["Cancellations made more than 90 days before the event date will forfeit the deposit only. Cancellations within 90 days may incur additional charges as outlined in your agreement.", "We strongly recommend event insurance for all bookings."] },
        { heading: "Guest numbers", body: ["Final guest numbers must be confirmed 14 days before your event. Charges are based on the confirmed number or actual attendance, whichever is greater."] },
        { heading: "Liability", body: ["The Atrium Collection is not liable for personal belongings left on the premises. Clients are responsible for the conduct of their guests and any damage caused during the event."] },
        { heading: "Force majeure", body: ["Neither party shall be liable for failure to perform obligations due to events beyond reasonable control, including natural disasters, government restrictions, or public health emergencies."] },
        { heading: "Governing law", body: ["These terms are governed by the laws of the State of Oregon. Any disputes shall be resolved in the courts of Multnomah County."] },
      ]}
    />
  );
}
