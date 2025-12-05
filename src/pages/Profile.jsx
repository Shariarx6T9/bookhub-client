import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { uploadToImgBB } from '../services/imgbb';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile({ user }) {
  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.photoURL || null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : user?.photoURL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let photoURL = form.photoURL;
      
      if (file) {
        photoURL = await uploadToImgBB(file);
      }
      
      await updateProfile(auth.currentUser, {
        displayName: form.displayName,
        photoURL: photoURL
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="empty">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-white mb-2">Please log in</h3>
          <p className="text-white/60">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Profile Settings</h1>
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className="profile-avatar-container">
              {preview ? (
                <img src={preview} alt="Profile" className="profile-avatar" />
              ) : (
                <div className="profile-avatar-fallback">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{user.displayName || 'User'}</h2>
              <p className="profile-email">{user.email}</p>
              <div className="profile-stats">
                <span className="stat-item">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Member since {new Date(user.metadata?.creationTime).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-form-section">
          <h3 className="section-title">
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </h3>
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
                className="input"
                placeholder="Enter your display name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <p className="form-help">Upload a new profile photo or leave empty to keep current one</p>
            </div>

            <div className="form-group">
              <label className="form-label">Photo URL (Alternative)</label>
              <input
                type="url"
                name="photoURL"
                value={form.photoURL}
                onChange={handleChange}
                className="input"
                placeholder="Or enter a photo URL"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                className="btn w-full sm:w-auto"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size={20} />
                    Updating...
                  </span>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}