import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { BookOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Login = () => {
  useDocumentTitle("Log In");
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";
  const sessionExpired = location.state?.sessionExpired;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not log in");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="page-container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <BookOpen size={28} className="text-maroon" />
          <h1 className="section-title">Welcome back</h1>
          <p className="text-sm text-slate">Log in to continue to Bookish</p>
        </div>

        {sessionExpired && (
          <div className="mb-4 rounded-sm border border-gold/40 bg-gold/10 p-3 text-sm text-ink">
            You were logged out due to inactivity. Please log in again.
          </div>
        )}

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
            <span className="text-xs text-slate">or continue with email</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-maroon">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-slate">
          New here?{" "}
          <Link to="/signup" className="font-medium text-maroon hover:underline">
            Create an account
          </Link>
        </p>

        <div className="mt-6 rounded-sm border border-line bg-white p-3 text-xs text-slate">
          <p className="font-semibold text-ink">Accounts for tesing </p>
          <p>User: reader@bookportal.com / reader123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;