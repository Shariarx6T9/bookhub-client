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
            <div style={{fontSize:13,color:'#111'}}>BookHub</div>
            <div style={{fontSize:11,color:'var(--muted)'}}>Books • Reviews • Manage</div>
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
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                {user.photoURL && <img src={user.photoURL} alt="avatar" style={{width:36,height:36,borderRadius:10}} />}
                <div style={{fontSize:13}}>{user.displayName || user.email}</div>
                <button onClick={handleLogout} className="btn" style={{background:'#ef4444'}}>Logout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
