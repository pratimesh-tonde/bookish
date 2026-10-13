import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Page Not Found");
  return (
    <div className="page-container flex flex-col items-center justify-center gap-3 py-24 text-center">
      <h1 className="font-serif text-5xl font-semibold text-ink">404</h1>
      <p className="text-slate">This page doesn't exist.</p>
      <Link to="/" className="btn-primary mt-2">
        Back to home
      </Link>
    </div>
  );
};

export default NotFound;