import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Privacy Policy Section */}
      <main className="flex-1 w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">
              Privacy Policy
            </h1>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              At Showcasa, we are committed to protecting your privacy. This
              Privacy Policy outlines how we collect, use, and safeguard your
              information.
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              1. Information Collection
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              We collect personal information you provide directly to us, such
              as when you create an account, post listings, or contact support.
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              2. Use of Information
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              We use your information to provide, maintain, and improve our
              services, communicate with you, and ensure platform security.
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              3. Sharing of Information
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              We do not share your personal information with third parties
              except as necessary to provide our services or comply with legal
              obligations.
            </p>

            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              We implement industry-standard security measures to protect your
              data from unauthorized access, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-semibold mb-4">
              5. Changes to This Policy
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              We may update this Privacy Policy from time to time. Please review
              it periodically for any changes.
            </p>

            <p className="mt-8 text-sm text-muted-foreground text-center">
              Last updated: April 16, 2025
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6">
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
