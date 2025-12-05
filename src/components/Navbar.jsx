import React, { useState, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import toast from "react-hot-toast";

const Navbar = React.memo(({ user }) => {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await signOut(auth);
    toast.success("Logged out");
    nav("/login");
  }, [nav]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(prev => !prev), []);

  const navLinks = useMemo(() => [
    { to: "/", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { to: "/all-books", label: "All Books", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    ...(user ? [
      { to: "/my-books", label: "My Books", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
      { to: "/add-book", label: "Add Book", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6" }
    ] : [])
  ], [user]);

  const userInitial = useMemo(() => 
    (user?.displayName || user?.email || 'U').charAt(0).toUpperCase(),
    [user?.displayName, user?.email]
  );

  return (
    <header className="navbar">
      <div className="wrap">
        <Link to="/" className="brand">
          <div className="logo">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
          </div>
          <div>
            <div className="text-sm sm:text-base text-white font-bold">BookHub</div>
            <div className="text-xs text-white/60 hidden sm:block">Books • Reviews • Manage</div>
          </div>
        </Link>

        <nav className={`navlinks ${mobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Main navigation">
          {navLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to} className={pathname === to ? 'nav-active' : ''} onClick={closeMobileMenu}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
              </svg>
              {label}
            </Link>
          ))}

          {user && (
            <button
              onClick={() => { handleLogout(); closeMobileMenu(); }}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg text-sm transition border border-red-500/30 md:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          )}

          {!user && (
            <div className="md:hidden border-t border-white/10 pt-4 mt-4 space-y-2">
              <Link className="nav-mobile-btn" to="/login" onClick={closeMobileMenu}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </Link>
              <Link className="nav-mobile-btn-primary" to="/register" onClick={closeMobileMenu}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="auth-buttons hidden md:flex">
            {!user ? (
              <>
                <Link className="nav-mobile-btn" to="/login">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
                <Link className="nav-mobile-btn" to="/register">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="user-profile-box">
                  <div className="user-avatar-container">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="avatar" className="user-avatar" loading="lazy" />
                    ) : (
                      <div className="user-avatar-fallback">{userInitial}</div>
                    )}
                    <div className="user-status-indicator"></div>
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.displayName || 'User'}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg text-sm transition border border-red-500/30 hidden lg:flex"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
          
          <button className="mobile-menu-btn md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <svg className="w-8 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
});

export default Navbar;