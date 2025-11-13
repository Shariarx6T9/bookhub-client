import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login(){
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try{
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in");
      nav("/");
    }catch(err){ toast.error(err.message); }
  };

  const google = async () => {
    try{
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google");
      nav("/");
    }catch(err){ toast.error(err.message); }
  };

  return (
    <div className="container" style={{maxWidth:480}}>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} required placeholder="Email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} required type="password" placeholder="Password" />
        <button className="btn" type="submit">Login</button>
      </form>
      <hr />
      <button className="btn" onClick={google}>Continue with Google</button>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}
