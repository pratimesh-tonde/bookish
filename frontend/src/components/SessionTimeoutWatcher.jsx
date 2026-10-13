import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const IDLE_TIMEOUT_MINUTES = 10; // total inactivity allowed before logout
const WARNING_SECONDS = 60; // show a "still there?" warning this many seconds before logout


const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

// Watches for user activity anywhere on the page. If the user is logged in
// and goes quiet for IDLE_TIMEOUT_MINUTES, they're shown a warning modal with
// a countdown; if they don't respond, they're logged out automatically.
const SessionTimeoutWatcher = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WARNING_SECONDS);

  const resetRef = useRef(() => {});
  const logoutNowRef = useRef(() => {});

  useEffect(() => {
    if (!user) return;

    let warningTimer;
    let countdownInterval;
    let warningActive = false;

    const doLogout = () => {
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      setShowWarning(false);
      logout();
      navigate("/login", { state: { sessionExpired: true } });
    };

    const startWarning = () => {
      warningActive = true;
      setShowWarning(true);
      setSecondsLeft(WARNING_SECONDS);
      countdownInterval = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(countdownInterval);
            doLogout();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    };

    const resetTimers = () => {
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      warningActive = false;
      setShowWarning(false);
      const delay = IDLE_TIMEOUT_MINUTES * 60 * 1000 - WARNING_SECONDS * 1000;
      warningTimer = setTimeout(startWarning, delay);
    };

    // while the warning is showing, only the "Stay logged in" button should
    // reset the clock — otherwise stray mouse jitter would silently dismiss it
    const handleActivity = () => {
      if (!warningActive) resetTimers();
    };

    resetRef.current = resetTimers;
    logoutNowRef.current = doLogout;

    resetTimers();
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, handleActivity));

    return () => {
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, handleActivity));
    };
  }, [user, logout, navigate]);

  if (!user || !showWarning) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 p-4">
      <div className="w-full max-w-sm rounded-sm bg-white p-6 text-center shadow-lg">
        <h2 className="font-serif text-lg font-semibold text-ink">Are you still there?</h2>
        <p className="mt-2 text-sm text-slate">
          You've been inactive for a while. For your security, you'll be logged out in{" "}
          <span className="font-semibold text-maroon">{secondsLeft}s</span>.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button onClick={() => logoutNowRef.current()} className="btn-secondary">
            Log out now
          </button>
          <button onClick={() => resetRef.current()} className="btn-primary">
            Stay logged in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutWatcher;