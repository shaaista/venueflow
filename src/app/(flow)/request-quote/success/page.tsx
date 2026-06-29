import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RequestQuoteSuccess() {
  return (
    <div className="container-lux flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-sage-50 text-sage-600">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-3xl text-cocoa">Your request is in!</h1>
      <p className="mt-3 text-cocoa-muted">
        Thank you for thinking of The Atrium Collection. Our events team is preparing your tailored quote and will email you within 24 hours.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/"><Button variant="outline">Back to home</Button></Link>
        <Link href="/event-spaces"><Button>Explore our spaces</Button></Link>
      </div>
    </div>
  );
}
