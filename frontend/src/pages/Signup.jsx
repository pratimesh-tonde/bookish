import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { BookOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Signup = () => {
  useDocumentTitle("Create Account");
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [website, setWebsite] = useState(""); // honeypot - real users never fill this in
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // silently drop the submission if the honeypot field got filled in (bots do this, people never see it)
    if (website) return;

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="page-container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <BookOpen size={28} className="text-maroon" />
          <h1 className="section-title">Create your account</h1>
          <p className="text-sm text-slate">Join Bookish to start shopping</p>
        </div>

        <div className="card p-6">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-in failed. Please try again.")}
              width="280"
            />
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <span className="text-xs text-slate">or sign up with email</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field - hidden from real users via CSS, but bots that
                auto-fill every field will trip it. Not a real "website" field. */}
            <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Full name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input-field"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="input-field"
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Confirm password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                className="input-field"
                placeholder="Re-enter your password"
              />
            </div>
            {error && <p className="text-sm text-maroon">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-slate">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-maroon hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;