import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./stars.css";
import defautAvatar from "../../assets/images/default.png";
import { useAuth } from "../../context/AuthContext";

const ProfileSetting = () => {
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
              <h4>Personal Informations</h4>
              <div className="image_container">
                <img src={avatar} alt="avatar" />
                <div className="image_deta">
                  <p>We only support .JPG, .JPEG, or , PNG file</p>
                  <div className="btn-btn">
                    <button className="btn-upload" type="picture">
                      Upload your photo
                    </button>
                    <button className="btn-delete">Delete image</button>
                  </div>
                </div>
              </div>
              <form action="#">
                <div className="labeforname">
                  <label htmlFor="firstname">First Name</label>
                  <input type="text" value={name} required />
                </div>
                <div className="ln">
                  <label htmlFor="firstname">Last Name</label>
                  <input type="text" value={name} required />
                </div>
                <button type="edit">Edit profile</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfileSetting;
