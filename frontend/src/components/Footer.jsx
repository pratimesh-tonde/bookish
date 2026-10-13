import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Footer = () => (
  <footer className="mt-16 border-t border-line bg-white">
    <div className="page-container grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <BookOpen size={20} className="text-maroon" />
          <span className="font-serif text-lg font-semibold text-ink">Bookish</span>
        </div>
        <p className="text-sm text-slate">Books for every shelf, delivered to your door.</p>
      </div>

      <div>
        <p className="mb-2.5 text-sm font-semibold text-ink">Shop</p>
        <ul className="space-y-2 text-sm text-slate">
          <li>
            <Link to="/books" className="hover:text-maroon">
              All books
            </Link>
          </li>
          <li>
            <Link to="/books?sort=newest" className="hover:text-maroon">
              New arrivals
            </Link>
          </li>
          <li>
            <Link to="/books?sort=rating" className="hover:text-maroon">
              Bestsellers
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <p className="mb-2.5 text-sm font-semibold text-ink">Help</p>
        <ul className="space-y-2 text-sm text-slate">
          <li>
            <Link to="/orders" className="hover:text-maroon">
              Track your order
            </Link>
          </li>
          <li>
            <a href="mailto:support@bookish.com" className="hover:text-maroon">
              Contact us
            </a>
          </li>
        </ul>
      </div>

      <div>
        <p className="mb-2.5 text-sm font-semibold text-ink">Legal</p>
        <ul className="space-y-2 text-sm text-slate">
          <li>
            <Link to="/privacy" className="hover:text-maroon">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms" className="hover:text-maroon">
              Terms &amp; Conditions
            </Link>
          </li>
        </ul>
      </div>
    </div>
    
    {/* Ye raha aapka updated bottom footer part */}
    <div className="border-t border-line py-4 text-center text-xs text-slate">
      <p>© 2026 Bookish. All rights reserved.</p>
      <p className="mt-1">
        Designed and Developed by Pratimesh Tonde ❤️ | Powered by <strong className="font-semibold">AIX Tech Ltd.</strong>
      </p>
    </div>
  </footer>
);

export default Footer;