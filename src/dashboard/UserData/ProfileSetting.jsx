import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./stars.css";
import defautAvatar from "../../assets/images/default.png";
import { useAuth } from "../../context/AuthContext";
import { FaRegUser } from "react-icons/fa";
import { HiMiniLanguage } from "react-icons/hi2";
import { MdOutlineLock } from "react-icons/md";
import { TfiWorld } from "react-icons/tfi";
import { CgNotes } from "react-icons/cg";

const ProfileSetting = () => {
  const [profileTap, setProfileTap] = useState("personinfo");
  const { currentUser, userData, loading } = useAuth();
  const avatar = userData?.photoURl || currentUser.photoURl || defautAvatar;
  return (
    <div className="profile_seting_container">
      <div className="profile_wrapper">
        <div className="personal_information">
        <div className="personalside">

<div className="profile-btn">
  <button
    className={profileTap === "profileinfo" ? "tab-active" : "tab"}
    onClick={() => setProfileTap("profileinfo")}
  >
    <div className="tab-icon">
      <FaRegUser />
    </div>

    <div className="tab-content">
      <strong>Personal Information</strong>
      <p>Manage your personal information</p>
    </div>
  </button>
</div>

<div className="profile-btn">
  <button
    className={profileTap === "login-ser" ? "tab-active" : "tab"}
    onClick={() => setProfileTap("login-ser")}
  >
    <div className="tab-icon">
      <FaRegUser />
    </div>

    <div className="tab-content">
      <strong>Login Services</strong>
      <p>Manage your login methods</p>
    </div>
  </button>
</div>

<div className="profile-btn">
  <button
    className={profileTap === "program-res" ? "tab-active" : "tab"}
    onClick={() => setProfileTap("program-res")}
  >
    <div className="tab-icon">
      <CgNotes />
    </div>

    <div className="tab-content">
      <strong>Program & Resources</strong>
      <p>Manage your learning resources</p>
    </div>
  </button>
</div>

<div className="profile-btn">
  <button
    className={profileTap === "language" ? "tab-active" : "tab"}
    onClick={() => setProfileTap("language")}
  >
    <div className="tab-icon">
      <HiMiniLanguage />
    </div>

    <div className="tab-content">
      <strong>Preferred Language</strong>
      <p>Select your preferred language</p>
    </div>
  </button>
</div>

<div className="profile-btn">
  <button
    className={profileTap === "timezone" ? "tab-active" : "tab"}
    onClick={() => setProfileTap("timezone")}
  >
    <div className="tab-icon">
      <TfiWorld />
    </div>

    <div className="tab-content">
      <strong>Time Zone</strong>
      <p>Choose your local time zone</p>
    </div>
  </button>
</div>

<div className="profile-btn">
  <button
    className={profileTap === "security" ? "tab-active" : "tab"}
    onClick={() => setProfileTap("security")}
  >
    <div className="tab-icon">
      <MdOutlineLock />
    </div>

    <div className="tab-content">
      <strong>Security</strong>
      <p>Manage your account security</p>
    </div>
  </button>
</div>

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
                <div className="form-data">
                <div className="labeforname">
                  <label htmlFor="firstname">First Name</label>
                    <input type="text"  required />
                    <label>Email</label>
                    <input type="email" name="email" id="email" />
                    <div className="labeforname">
                      <h4>Personal Address</h4>
                  <label htmlFor="firstname">Country or Region</label>
                    <input type="text"  required />
                    <label htmlFor="#">Address</label>
                    <input type="address" name="addres" id="address" />
                  </div>
                </div>
                <div className="labeforname">
                  <label htmlFor="firstname">Last Name</label>
                    <input type="text"  required />
                    <label htmlFor="#">Phone Number</label>
                    <input type="number" name="phonenumber" id="phonenumber" />
                    <div className="labeforname">
                  <label htmlFor="firstname">City</label>
                    <input type="text"  required />
                    <label htmlFor="#">Postal Code</label>
                    <input type="number" name="phonenumber" id="phonenumber" />
                  </div>
                  </div>                  
                  </div>
                <button type="edit" className="edit-profile">Edit profile</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfileSetting;
