import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface py-16 border-t border-outline-variant/20 hidden md:block select-none">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between gap-12">

          {/* Logo & Description */}
          <div className="max-w-xs">
            <div className="flex items-center mb-4">
              <img
                src="/logo.jpeg"
                alt="Shena Logo"
                className="w-20 rounded-2xl object-cover border border-outline-variant/10 shadow-sm"
              />
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              The luxury standard for beauty services in Itanagar, Papum Pare, and Guwahati. Book artists, find studios, and shop curated beauty.
            </p>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">

            {/* Column 1 */}
            <div>
              <h4 className="font-bold mb-5 text-on-surface text-sm tracking-wide uppercase">Experience</h4>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <Link href="/salons" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
                    Find a Salon
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
                    Beauty Products
                  </Link>
                </li>
                <li>
                  <Link href="/membership" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
                    Member Benefits
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="font-bold mb-5 text-on-surface text-sm tracking-wide uppercase">Company</h4>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <Link href="/about" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/partner" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
                    Partner with Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-bold mb-5 text-on-surface text-sm tracking-wide uppercase">Support</h4>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <Link href="/help" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Footer Bottom info */}
        <div className="mt-16 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface-variant/70">
            © 2026 Sh3na Premium Services Pvt Ltd. Developed and Designed by <a href="https://www.samnictech.in" target="_blank"> Samnic Tech</a>.
          </p>
          <div className="flex gap-6">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors text-xl">
              language
            </span>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors text-xl">
              share
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
