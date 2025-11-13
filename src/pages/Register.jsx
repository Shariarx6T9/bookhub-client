import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register(){
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', photo:'', password:'' });

  const validatePass = (pw) => {
    if (pw.length < 6) return false;
    if (!/[A-Z]/.test(pw)) return false;
    if (!/[a-z]/.test(pw)) return false;
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validatePass(form.password)) {
      toast.error("Password must be ≥6 chars, include 1 uppercase and 1 lowercase");
      return;
    }
    try{
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      if (form.name || form.photo) {
        await updateProfile(cred.user, { displayName: form.name || undefined, photoURL: form.photo || undefined });
      }
      toast.success("Registered");
      nav("/");
    }catch(err){ toast.error(err.message); }
  };

  const google = async () => {
    try{ await signInWithPopup(auth, googleProvider); toast.success("Logged in with Google"); nav("/"); } catch(err){ toast.error(err.message); }
  };

  return (
    <div className="container" style={{maxWidth:480}}>
      <h1>Register</h1>
      <form onSubmit={submit}>
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Full Name (optional)" />
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required placeholder="Email" />
        <input value={form.photo} onChange={e=>setForm({...form, photo:e.target.value})} placeholder="Photo URL (optional)" />
        <input value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required type="password" placeholder="Password" />
        <button className="btn" type="submit">Register</button>
      </form>
      <hr />
      <button className="btn" onClick={google}>Continue with Google</button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
