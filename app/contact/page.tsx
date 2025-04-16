import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Contact Section */}
      <main className="flex-1 w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
            <p className="mb-6 text-center text-muted-foreground">
              We'd love to hear from you. Whether you have a question about
              features, pricing, or anything else, our team is ready to answer
              all your questions.
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Email</h2>
                <p className="text-muted-foreground">support@showcasa.com</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">Phone</h2>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">Address</h2>
                <p className="text-muted-foreground">
                  123 Main Street, Colombo, Sri Lanka
                </p>
              </div>
            </div>

            {/* Send Message Section */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Send Us a Message
              </h2>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-muted-foreground"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full p-3 mt-2 rounded-md bg-muted/10 border border-muted text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="John Doe"
                    required
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-muted-foreground"
                  >
                    Your Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full p-3 mt-2 rounded-md bg-muted/10 border border-muted text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="john.doe@example.com"
                    required
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-muted-foreground"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full p-3 mt-2 rounded-md bg-muted/10 border border-muted text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Type your message here..."
                    required
                    autoComplete="off"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-8 py-3 text-sm font-semibold text-background bg-primary rounded-lg hover:bg-primary/80 focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
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
