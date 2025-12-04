// client/src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import toast from "react-hot-toast";

export default function Navbar({ user }) {
  const nav = useNavigate();

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
          <Link to="/">Home</Link>
          <Link to="/all-books">All Books</Link>
          {user && <Link to="/my-books">My Books</Link>}
          {user && <Link to="/add-book">Add Book</Link>}
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
                {user.photoURL && <img src={user.photoURL} alt="avatar" className="w-9 h-9 rounded-lg" />}
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
