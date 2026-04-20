import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
  const { currentUser: user } = useAuth();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    setError("");
    setSuccess("");

    const firstName = e.target["First-Name"].value;
    const lastName = e.target["Last-Name"].value;
    const nickname = e.target["Nickname"].value;
    const currentPassword = e.target["current-password"].value;
    const newPassword = e.target["new-password"].value;
    const confirmPassword = e.target["confirm-password"].value;

    try {
      const updatedData = {
        firstName,
        lastName,
        nickname,
        email: user.email,
      };
      await setDoc(doc(db, "users", user.uid), updatedData, { merge: true });

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

        e.target["current-password"].value = "";
        e.target["new-password"].value = "";
        e.target["confirm-password"].value = "";
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
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="alert alert-error">{error}</p>}
        {success && <p className="alert alert-success">{success}</p>}

        <h3>Profile Details</h3>
        <div className="form-group">
          <label htmlFor="First-Name">First Name (required)</label>
          <input
            type="text"
            defaultValue={userData.firstName}
            id="First-Name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Last-Name">Last Name (required)</label>
          <input
            type="text"
            defaultValue={userData.lastName}
            id="Last-Name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Nickname">Nickname (required)</label>
          <input
            type="text"
            defaultValue={userData.nickname}
            id="Nickname"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Account-Email">Email</label>
          <input
            type="email"
            id="Account-Email"
            defaultValue={user.email}
            readOnly
          />
        </div>

        <h3>Change Password</h3>
        <p className="helper-text">Leave blank to keep current password</p>

        <div className="form-group">
          <label htmlFor="current-password">Current Password</label>
          <div className="password-wrapper">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="current-password"
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
        </div>

        <div className="form-group">
          <label htmlFor="new-password">New Password</label>
          <div className="password-wrapper">
            <input
              type={showNewPassword ? "text" : "password"}
              id="new-password"
              minLength={6}
            />
            <button
              type="button"
              className="eye-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <IoMdEyeOff /> : <IoMdEye className="eye" />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm New Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              minLength={6}
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

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default SettingsPage;
