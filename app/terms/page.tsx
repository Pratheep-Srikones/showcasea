import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Terms of Service Section */}
      <main className="flex-1 w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">
              Terms of Service
            </h1>
            <p className="mb-6 text-muted-foreground">
              By accessing and using Showcasa, you agree to the following terms
              and conditions. These terms apply to all visitors, users, and
              others who access or use the service.
            </p>

            <h2 className="text-2xl font-semibold mb-2">1. User Accounts</h2>
            <p className="mb-4 text-muted-foreground">
              Users are responsible for safeguarding their passwords and for any
              activities or actions under their accounts.
            </p>

            <h2 className="text-2xl font-semibold mb-2">2. Content</h2>
            <p className="mb-4 text-muted-foreground">
              You retain ownership of the content you upload but grant Showcasa
              a non-exclusive license to use, display, and share your content
              within the platform.
            </p>

            <h2 className="text-2xl font-semibold mb-2">
              3. Prohibited Activities
            </h2>
            <p className="mb-4 text-muted-foreground">
              Users must not use Showcasa for illegal activities, harassment, or
              sharing offensive or copyrighted material without rights.
            </p>

            <h2 className="text-2xl font-semibold mb-2">4. Termination</h2>
            <p className="mb-4 text-muted-foreground">
              We may terminate or suspend your account immediately without prior
              notice or liability for any reason.
            </p>

            <h2 className="text-2xl font-semibold mb-2">5. Changes to Terms</h2>
            <p className="mb-4 text-muted-foreground">
              We reserve the right to modify or replace these Terms at any time.
              It is your responsibility to review the Terms periodically.
            </p>

            <p className="mt-8 text-sm text-muted-foreground">
              Last updated: April 16, 2025
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Showcasa. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
