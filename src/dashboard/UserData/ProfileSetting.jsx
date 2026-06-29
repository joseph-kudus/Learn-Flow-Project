import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./stars.css";
import defautAvatar from "../../assets/images/default.png";
import { useAuth } from "../../context/AuthContext";

const ProfileSetting = () => {
  const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
  const [profileTap, setProfileTap] = useState("personinfo");
  const { currentUser, userData, loading } = useAuth();
  const avatar = userData?.photoURl || currentUser.photoURl || defautAvatar;
  return (
    <div className="profile_seting_container">
      <div className="profile_wrapper">
        <div className="personal_information">
          <div className="personalside">
            
              <button
                className={profileTap === "profileinfo" ? "tab-active" : "tab"}
                onClick={() => setProfileTap("profileinfo")}
              >
                <span>Personal Informations</span>
              </button>
            
            
              <button
                className={profileTap === "login-ser" ? "tab-active" : "tab"}
                onClick={() => setProfileTap("login-ser")}
              >
                <span> Login Services</span>
              </button>
            
            
              <button
                className={profileTap === "program-res" ? "tab-active" : "tab"}
                onClick={() => setProfileTap("program-res")}
              >
                <span>Program & Resources</span>
              </button>
            
            
              <button
                className={profileTap === "language" ? "tab-active" : "tab"}
                onClick={() => setProfileTap("language")}
              >
                <span>Preferred Language</span>
              </button>
            
            
              <button
                className={profileTap === "timezone" ? "tab-active" : "tab"}
                onClick={() => setProfileTap("timezone")}
              >
                <span>Time Zone</span>
              </button>
            
            
              <button
                className={profileTap === "security" ? "tab-active" : "tab"}
                onClick={() => setProfileTap("security")}
              >
                <span>Security</span>
              </button>
           
          </div>
        </div>
        <div className="personal_setting">
  {profileTap === "profileinfo" && (
    <div className="psetting_wraper">
      <h4>Personal Information</h4>

      <div className="image_container">
        <img src={avatar} alt="avatar" />

        <div className="image_deta">
          <p>We only support .JPG, .JPEG or .PNG files.</p>

          <div className="btn-btn">
            <button className="btn-upload" type="button">
              Upload your photo
            </button>

            <button className="btn-delete" type="button">
              Delete image
            </button>
          </div>
        </div>
      </div>

      <form>
        {/* First Name & Last Name */}
        <div className="name_row">
          <div className="form_group">
            <label htmlFor="firstname">First Name</label>
            <input
              id="firstname"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="form_group">
            <label htmlFor="lastname">Last Name</label>
            <input
              id="lastname"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div className="form_group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="form_group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button className="edit-btn" type="submit">
          Edit Profile
        </button>
      </form>
    </div>
  )}
</div>
      </div>
    </div>
  );
};
export default ProfileSetting;
