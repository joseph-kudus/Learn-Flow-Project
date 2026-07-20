//import "../usedata.css";
import { bguser } from "../../assets/images/logos.jsx";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { SlCloudDownload } from "react-icons/sl";
import { PiPencilSimpleLineLight } from "react-icons/pi";
import defaultAvatar from "../../assets/images/default.png";

const Settings = () => {
  const [profileTap, setProfileTap] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const { currentUser, userData, loading } = useAuth();

  if (loading) return <div className="header-skeleton">Loading...</div>;
  if (!currentUser) return null;

  // Default to student and force lowercase
  const role = (userData?.role || "student").toLowerCase();

  const displayName =
    userData?.nickname ||
    userData?.firstName ||
    userData?.username ||
    currentUser.email?.split("@")[0] ||
    "User";
  const avatar = userData?.photoURL || currentUser.photoURL || defaultAvatar;

  return (
    <div className="setting-container">
      <div className="profile-avatar-section">
        <div className="avatar-wrapper">
          <img
            src={avatar}
            className="avatar-img"
            alt="user avatar"
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
            alt="avatar"
          />
          <div className="avatar-overlay">
            <button className="change-avatar-btn">Change</button>
          </div>
        </div>
        <p className="change-avatar-text">
          Change profile avatar <PiPencilSimpleLineLight />{" "}
        </p>
        <h3>{displayName}</h3>
        <p className="text-muted">{role}</p>
      </div>

      <div className="detail-container">
        <div className="detail-header">
          <div className="detail-tabs">
            <button
              className={profileTap === "profile" ? "tab-active" : "tab"}
              onClick={() => setProfileTap("profile")}
            >
              Profile
            </button>

            <button
              className={profileTap === "notification" ? "tab-active" : "tab"}
              onClick={() => setProfileTap("notification")}
            >
              Notification
            </button>

            <button
              className={profileTap === "subscription" ? "tab-active" : "tab"}
              onClick={() => setProfileTap("subscription")}
            >
              Subscription
            </button>
          </div>
          <button className="save-btn">
            Save changes <SlCloudDownload />
          </button>
        </div>

        <div className="profile-edit">
          {profileTap === "profile" && (
            <>
              <div className="form-section">
                <div className="section-header">
                  <h4>Profile Name</h4>
                  <button
                    className="edit-btn"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                    <PiPencilSimpleLineLight />
                  </button>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      disabled={!isEditing}
                      placeholder="Joseph"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      disabled={!isEditing}
                      placeholder="kudus"
                    />
                  </div>
                </div>

                <div className="section-header">
                  <h4>Personal Address</h4>
                </div>

                <div className="form-group">
                  <label htmlFor="residentAddress">Resident Address</label>
                  <input
                    id="residentAddress"
                    type="text"
                    disabled={!isEditing}
                    placeholder="Bulange, Kampala"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="streetAddress">Street Address</label>
                  <input
                    id="streetAddress"
                    type="text"
                    disabled={!isEditing}
                    placeholder="Plot 123, Main Street"
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="section-header">
                  <h4>Employment Status</h4>
                </div>
                <div className="form-group">
                  <label htmlFor="employment">Choose from dropdown</label>
                  <select id="employment" disabled={!isEditing}>
                    <option value="student">Student</option>
                    <option value="entrepreneur">Entrepreneur</option>
                    <option value="civil-servant">Civil Servant</option>
                  </select>
                </div>

                <div className="section-header">
                  <h4>Contact Address</h4>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="phone-input">
                    <select className="country-code" disabled={!isEditing}>
                      <option value="+256">+256</option>
                      <option value="+254">+254</option>
                    </select>
                    <input
                      id="phone"
                      type="tel"
                      disabled={!isEditing}
                      placeholder="782760685"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {profileTap === "notification" && (
            <div className="form-section">
              <h4>Notification Settings</h4>
              <p className="text-muted">Coming soon...</p>
            </div>
          )}

          {profileTap === "subscription" && (
            <div className="form-section">
              <h4>Subscription Plan</h4>
              <p className="text-muted">Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
