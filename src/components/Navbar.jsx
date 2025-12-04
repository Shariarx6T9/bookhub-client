// client/src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import toast from "react-hot-toast";

export default function Navbar({ user }) {
  const nav = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out");
    nav("/login");
  };

  return (
    <header className="navbar">
      <div className="wrap">
        <Link to="/" className="brand">
          <div className="logo">B</div>
          <div>
            <div className="text-sm text-white">BookHub</div>
            <div className="text-xs text-white/60">Books • Reviews • Manage</div>
          </div>
        </Link>

        <nav className="navlinks" aria-label="Main navigation">
          <Link to="/" className={location.pathname === '/' ? 'nav-active' : ''}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <Link to="/all-books" className={location.pathname === '/all-books' ? 'nav-active' : ''}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            All Books
          </Link>
          {user && (
            <Link to="/my-books" className={location.pathname === '/my-books' ? 'nav-active' : ''}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Books
            </Link>
          )}
          {user && (
            <Link to="/add-book" className={location.pathname === '/add-book' ? 'nav-active' : ''}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Book
            </Link>
          )}
        </nav>

        <div className="auth-buttons">
          {!user ? (
            <>
              <Link className="btn-outline" to="/login">Login</Link>
              <Link className="btn" to="/register">Register</Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                {user.photoURL && <img src={user.photoURL} alt="avatar" className="w-9 h-9 rounded-xl " />}
                <div className="text-sm text-white hidden sm:block">{user.displayName || user.email}</div>
                <button onClick={handleLogout} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition">Logout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
