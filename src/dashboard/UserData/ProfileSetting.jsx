import React, { useState, useEffect } from "react";
import "./stars.css";
import defautAvatar from "../../assets/images/default.png";
import { useAuth } from "../../context/AuthContext";
import { FaRegUser } from "react-icons/fa";
import { HiMiniLanguage } from "react-icons/hi2";
import { MdOutlineLock } from "react-icons/md";
import { TfiWorld } from "react-icons/tfi";
import { CgNotes } from "react-icons/cg";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseconfig";
import { uploadAvatar } from "../../utils/uploadAvatar";

const ProfileSetting = () => {
  const [profileTap, setProfileTap] = useState("profileinfo");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const { currentUser, userData, loading } = useAuth();

  const [avatar, setAvatar] = useState(
    userData?.photoURL || currentUser?.photoURL || defautAvatar,
  );

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      // Upload to Cloudinary
      const imageUrl = await uploadAvatar(file);

      // Save URL to Firebase
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          photoURL: imageUrl,
          updatedAt: new Date(),
        },
        {
          merge: true,
        },
      );
      
      
      

      // Update UI immediately
      setAvatar(imageUrl);

      alert("Profile photo updated");
    } catch (error) {
      console.log("Avatar upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    setAvatar(userData?.photoURL || currentUser?.photoURL || defautAvatar);
  }, [userData, currentUser]);
  
  
  
  
  
  


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) return;

    try {
      setSaving(true);

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          country: formData.country,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          updatedAt: new Date(),
        },
        {
          merge: true,
        },
      );

      alert("Profile updated successfully");
    } catch (error) {
      console.log(error);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!currentUser) {
    return null;
  }

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
                  <h4>Personal Information</h4>
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
                <img
                  src={avatar}
                  alt="avatar"
                  onError={(e) => {
                    e.target.src = defautAvatar;
                  }}
                />
                <div className="image_deta">
                  <p>We only support .JPG, .JPEG, or , PNG file</p>
                  <div className="btn-btn">
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      id="photo"
                      onChange={handleAvatarChange}
                    />

                    <label htmlFor="photo" className="btn-upload">
                      {uploading ? "Uploading..." : "Upload your photo"}
                    </label>

                    <button className="btn-delete" type="button">
                      Delete image
                    </button>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-data">
                  <div className="labeforname">
                    <label htmlFor="firstname">First Name</label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                    />

                    <div className="form-column">
                      <h4>Personal Address</h4>
                      <label htmlFor="country">Country or Region</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="address">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-column">
                    <label htmlFor="firstname">Last Name</label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="phonenumber">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <div className="form-column">
                      <label htmlFor="firstname">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                      <label htmlFor="postalCode">Postal Code</label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="edit-profile"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Edit profile"}
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
