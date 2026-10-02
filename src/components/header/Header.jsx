import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

import Logo from "../../assets/logo.png";

const headerData = {
  logo: {
    image: Logo,
    alt: "TravelTrail",
    path: "/",
  },

  menu: [
    {
      title: "Home Search Hub",
      path: "/home",
    },
    {
      title: "Trip Builder",
      path: "/trip-builder",
    },
    {
      title: "Booking Summary",
      path: "/booking-summary",
    },
    {
      title: "Help & Support",
      path: "/help-support",
    },
  ],
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(() =>
    new URLSearchParams(window.location.search).has("authError"),
  );
  const [authMode, setAuthMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState(() =>
    new URLSearchParams(window.location.search).has("authError")
      ? { type: "error", text: "Google sign-in could not be completed. Please try again." }
      : null,
  );
  const [currentUser, setCurrentUser] = useState(null);
  const [googleAuthEnabled, setGoogleAuthEnabled] = useState(false);
  const loginRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json();
        return data.user;
      })
      .then((user) => {
        if (!cancelled && user) setCurrentUser(user);
      })
      .catch(() => {});

    fetch("/api/auth/google/status")
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setGoogleAuthEnabled(Boolean(data.enabled));
      })
      .catch(() => {});

    const url = new URL(window.location.href);
    if (url.searchParams.has("authError")) {
      url.searchParams.delete("authError");
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!loginOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!loginRef.current?.contains(event.target)) {
        setLoginOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setLoginOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [loginOpen]);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthBusy(true);
    setAuthMessage(null);

    const formData = new FormData(event.currentTarget);
    const requestBody = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    if (authMode === "register") requestBody.name = formData.get("name");

    try {
      const response = await fetch(`/api/auth/${authMode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Unable to sign in.");
      setCurrentUser(data.user);
      setLoginOpen(false);
      setAuthMessage(null);
    } catch (error) {
      setAuthMessage({
        type: "error",
        text: error.message || "Could not connect to the server. Try again.",
      });
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    setAuthBusy(true);
    setAuthMessage(null);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Could not sign out. Try again.");
      setCurrentUser(null);
      setLoginOpen(false);
    } catch (error) {
      setAuthMessage({ type: "error", text: error.message });
    } finally {
      setAuthBusy(false);
    }
  };

  return (
    <header className="header_area">
      <div className="container">
        <div className="header_inner">

          {/* Logo */}
          <Link
            to={headerData.logo.path}
            className="logo_area"
            onClick={closeMenu}
          >
            <img
              src={headerData.logo.image}
              alt={headerData.logo.alt}
              className="logo_icon"
            />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className={`menu_toggle d-lg-none ${
              menuOpen ? "open" : ""
            }`}
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Menu */}
          <ul className={`menu_list ${menuOpen ? "menu_open" : ""}`}>
            {headerData.menu.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? "active" : ""
                  }
                  onClick={closeMenu}
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Login dropdown */}
          <div className="account_menu" ref={loginRef}>
            <button
              className={`user_btn ${loginOpen ? "is_open" : ""}`}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={loginOpen}
              aria-controls="login-dropdown"
              aria-label={currentUser ? "Open account menu" : "Open sign in"}
              onClick={() => {
                setLoginOpen((isOpen) => !isOpen);
                setAuthMessage(null);
                closeMenu();
              }}
            >
              {currentUser?.picture ? (
                <img
                  className="user_avatar"
                  src={currentUser.picture}
                  alt=""
                  referrerPolicy="no-referrer"
                />
              ) : (
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M10.8571 4.5C10.8571 3.75408 10.5561 3.03871 10.0203 2.51126C9.48449 1.98382 8.75776 1.6875 8 1.6875C7.24224 1.6875 6.51551 1.98382 5.9797 2.51126C5.44388 3.03871 5.14286 3.75408 5.14286 4.5C5.14286 5.24592 5.44388 5.96129 5.9797 6.48874C6.51551 7.01618 7.24224 7.3125 8 7.3125C8.75776 7.3125 9.48449 7.01618 10.0203 6.48874C10.5561 5.96129 10.8571 5.24592 10.8571 4.5ZM3.42857 4.5C3.42857 3.30653 3.9102 2.16193 4.76751 1.31802C5.62482 0.474106 6.78758 0 8 0C9.21242 0 10.3752 0.474106 11.2325 1.31802C12.0898 2.16193 12.5714 3.30653 12.5714 4.5C12.5714 5.69347 12.0898 6.83807 11.2325 7.68198C10.3752 8.52589 9.21242 9 8 9C6.78758 9 6.51551 8.52589 5.9797 7.68198C3.9102 6.83807 3.42857 5.69347 3.42857 4.5ZM1.76071 16.3125H14.2393C13.9214 14.0871 11.9786 12.375 9.63214 12.375H6.36786C4.02143 12.375 2.07857 14.0871 1.76071 16.3125ZM0 16.9559C0 13.493 2.85 10.6875 6.36786 10.6875H9.63214C13.15 10.6875 16 13.493 16 16.9559C16 17.5324 15.525 18 14.9393 18H1.06071C0.475 18 0 17.5324 0 16.9559Z"
                    fill="currentColor"
                  />
                </svg>
              )}
              <span className="user_btn_label">
                {currentUser ? currentUser.name : "Sign in"}
              </span>
              <span className="login_chevron" aria-hidden="true" />
            </button>

            {loginOpen && (
              <section
                className="login_dropdown"
                id="login-dropdown"
                role="dialog"
                aria-label="Sign in to TravelTrail"
              >
                {currentUser ? (
                  <div className="account_signed_in">
                    <div className="login_dropdown_heading">
                      <div className="account_identity">
                        {currentUser.picture ? (
                          <img
                            className="account_profile_picture"
                            src={currentUser.picture}
                            alt=""
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="account_avatar_fallback" aria-hidden="true">
                            {currentUser.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div>
                          <span className="login_kicker">TRAVELTRAIL ACCOUNT</span>
                          <h2>You're signed in</h2>
                          <p>{currentUser.email}</p>
                        </div>
                      </div>
                      <button
                        className="login_close"
                        type="button"
                        aria-label="Close account menu"
                        onClick={() => setLoginOpen(false)}
                      >
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                      </button>
                    </div>
                    {authMessage && (
                      <p className={`login_message ${authMessage.type}`} role="alert">
                        {authMessage.text}
                      </p>
                    )}
                    <button
                      className="login_submit"
                      type="button"
                      disabled={authBusy}
                      onClick={handleLogout}
                    >
                      {authBusy ? "Please wait..." : "Sign out"}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="login_dropdown_heading">
                      <div>
                        <span className="login_kicker">TRAVELTRAIL ACCOUNT</span>
                        <h2>{authMode === "login" ? "Sign in" : "Create account"}</h2>
                        <p>
                          {authMode === "login"
                            ? "Access your saved trips and bookings."
                            : "Create an account to keep your trips together."}
                        </p>
                      </div>
                      <button
                        className="login_close"
                        type="button"
                        aria-label="Close sign-in"
                        onClick={() => setLoginOpen(false)}
                      >
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                      </button>
                    </div>

                    <form className="login_form" onSubmit={handleAuthSubmit}>
                      {authMode === "register" && (
                        <>
                          <label htmlFor="login-name">Full name</label>
                          <input
                            id="login-name"
                            name="name"
                            type="text"
                            placeholder="Your name"
                            autoComplete="name"
                            minLength={2}
                            maxLength={80}
                            required
                          />
                        </>
                      )}
                      <label htmlFor="login-email">Email address</label>
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        maxLength={254}
                        required
                      />

                      <div className="login_password_label">
                        <label htmlFor="login-password">Password</label>
                        {authMode === "register" && <span>At least 8 characters</span>}
                      </div>
                      <div className="login_password_field">
                        <input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          autoComplete={authMode === "login" ? "current-password" : "new-password"}
                          minLength={authMode === "register" ? 8 : undefined}
                          required
                        />
                        <button
                          className="password_visibility"
                          type="button"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowPassword((visible) => !visible)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>

                      <button className="login_submit" type="submit" disabled={authBusy}>
                        {authBusy
                          ? "Please wait..."
                          : authMode === "login"
                            ? "Sign in"
                            : "Create account"}
                      </button>
                      {authMessage && (
                        <p className={`login_message ${authMessage.type}`} role="alert">
                          {authMessage.text}
                        </p>
                      )}
                    </form>

                    <div className="google_signin_divider"><span>OR</span></div>
                    {googleAuthEnabled ? (
                      <a className="google_signin_button" href="/api/auth/google">
                        <span className="google_mark" aria-hidden="true">G</span>
                        Continue with Google
                      </a>
                    ) : (
                      <button className="google_signin_button" type="button" disabled>
                        <span className="google_mark" aria-hidden="true">G</span>
                        Google sign-in not configured
                      </button>
                    )}

                    <p className="login_mode_switch">
                      {authMode === "login" ? "New to TravelTrail?" : "Already have an account?"}
                      <button
                        type="button"
                        disabled={authBusy}
                        onClick={() => {
                          setAuthMode((mode) => mode === "login" ? "register" : "login");
                          setAuthMessage(null);
                        }}
                      >
                        {authMode === "login" ? "Create account" : "Sign in"}
                      </button>
                    </p>
                  </>
                )}
              </section>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;