import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { db } from "../../../../firebaseconfig";
import { useAuth } from "../../../context/AuthContext";
import "./SettingsPage.css";

function SettingsPage() {
  const { currentUser: user, userData, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use userData from context instead of fetching again
  useEffect(() => {
    if (userData !== null) {
      setLoading(false);
    }
  }, [userData]); // Only run when userData changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    setError("");
    setSuccess("");

    const form = e.target;
    const firstName = form["First-Name"].value.trim();
    const lastName = form["Last-Name"].value.trim();
    const nickname = form["Nickname"].value.trim();
    const currentPassword = form["current-password"].value;
    const newPassword = form["new-password"].value;
    const confirmPassword = form["confirm-password"].value;

    try {
      const updatedData = {
        firstName,
        lastName,
        nickname,
        email: user.email,
      };
      await setDoc(doc(db, "users", user.uid), updatedData, { merge: true });

      // Update context so DashboardHeader updates instantly
      await refreshUserData();

      const tryingToChangePassword =
        currentPassword || newPassword || confirmPassword;

      if (tryingToChangePassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
          throw new Error("Fill all password fields to change password");
        }
        if (newPassword !== confirmPassword) {
          throw new Error("New passwords do not match");
        }
        if (newPassword.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword,
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);

        form["current-password"].value = "";
        form["new-password"].value = "";
        form["confirm-password"].value = "";
      }

      setSuccess(
        tryingToChangePassword
          ? "Profile and password updated"
          : "Profile updated",
      );
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setError("Current password is incorrect");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak");
      } else {
        setError(err.message);
      }
      console.error("Update error:", err);
    }
  };

  if (loading) return <div className="settings-page">Loading...</div>;
  if (!user) return <div className="settings-page">Please log in</div>;

  return (
    <div className="settings-page">
      <h1>Update Profile</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="alert alert-error">{error}</p>}
        {success && <p className="alert alert-success">{success}</p>}
        <h3>Edit Details</h3>
        <div className="form-group">
          <label htmlFor="First-Name">First Name (required)</label>
          <input
            type="text"
            defaultValue={userData?.firstName || ""}
            id="First-Name"
            required
          />
          <label htmlFor="Last-Name">Last Name (required)</label>
          <input
            type="text"
            defaultValue={userData?.lastName || ""}
            id="Last-Name"
            required
          />
          <label htmlFor="Nickname">Nickname (required)</label>
          <input
            type="text"
            defaultValue={userData?.nickname || ""}
            id="Nickname"
            required
          />
          <label htmlFor="Account-Email">Email</label>
          <input
            type="email"
            id="Account-Email"
            defaultValue={user.email}
            readOnly
          />
        </div>
        <h3>Login information</h3>
        <div className="form-group">
          <label htmlFor="current-password">Current Password</label>
          <div className="password-wrapper">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="current-password" placeholder="Your current password"
            />
            <button
              type="button"
              className="eye-toggle"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <IoMdEyeOff />
              ) : (
                <IoMdEye className="eye" />
              )}
            </button>
          </div>

          <label htmlFor="new-password">New Password</label>
          <div className="password-wrapper">
            <input
              type={showNewPassword ? "text" : "password"}
              id="new-password"
              minLength={6} placeholder="New password"
            />
            <button
              type="button"
              className="eye-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <IoMdEyeOff /> : <IoMdEye className="eye" />}
            </button>
          </div>

          <label htmlFor="confirm-password">Confirm New Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              minLength={6} placeholder="confirm new password"
            />
            <button
              type="button"
              className="eye-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <IoMdEyeOff />
              ) : (
                <IoMdEye className="eye" />
              )}
            </button>
          </div>
        </div>
        <button className="sub" type="submit">Save Changes</button>
      </form>
    </div>
  );
}
export default SettingsPage;
