import React, { useEffect, useState } from "react";
import "../../styles/stars.css";

import defaultAvatar from "../../assets/images/default.png";

import { useAuth } from "../../context/AuthContext";

import { FaRegUser } from "react-icons/fa";

import { HiMiniLanguage } from "react-icons/hi2";

import { MdOutlineLock } from "react-icons/md";

import { TfiWorld } from "react-icons/tfi";

import { CgNotes } from "react-icons/cg";

import { doc, setDoc } from "firebase/firestore";

import { db } from "../../../firebaseconfig";

import { uploadAvatar } from "../../utils/uploadAvatar";

import Button from "../ui/Button/Button";

const ProfileSetting = () => {
  const { currentUser, userData, loading } = useAuth();

  const [profileTap, setProfileTap] = useState("profileinfo");

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [avatar, setAvatar] = useState(defaultAvatar);

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

  /*
  ==========================
  LOAD USER DATA
  ==========================
  */

  useEffect(() => {
    if (!currentUser) return;

    setAvatar(userData?.photoURL || currentUser?.photoURL || defaultAvatar);

    setFormData({
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      email: currentUser?.email || "",

      phone: userData?.phone || "",
      country: userData?.country || "",
      address: userData?.address || "",
      city: userData?.city || "",
      postalCode: userData?.postalCode || "",
    });
  }, [currentUser, userData]);

  /*
  ==========================
  UPLOAD AVATAR
  ==========================
  */

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");

      return;
    }

    try {
      setUploading(true);

      const imageUrl = await uploadAvatar(file);

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

      setAvatar(imageUrl);
    } catch (error) {
      console.error("Avatar upload failed:", error);

      alert("Upload failed");
    } finally {
      setUploading(false);

      e.target.value = "";
    }
  };

  /*
  ==========================
  DELETE AVATAR
  ==========================
  */

  const deleteAvatar = async () => {
    try {
      await setDoc(
        doc(db, "users", currentUser.uid),

        {
          photoURL: "",

          updatedAt: new Date(),
        },

        {
          merge: true,
        },
      );

      setAvatar(defaultAvatar);
    } catch (error) {
      console.log(error);
    }
  };

  /*
  ==========================
  INPUT CHANGE
  ==========================
  */

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,

      [e.target.name]: e.target.value,
    }));
  };

  /*
  ==========================
  SAVE PROFILE
  ==========================
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await setDoc(
        doc(db, "users", currentUser.uid),

        {
          ...formData,

          updatedAt: new Date(),
        },

        {
          merge: true,
        },
      );

      alert("Profile updated");
    } catch (error) {
      console.log(error);

      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  if (!currentUser) return null;
  return (
    <div className="profile_seting_container">
      <div className="profile_wrapper">
        {/* ================= SIDEBAR ================= */}

        <div className="personal_information">
          <div className="personalside">
            {[
              {
                id: "profileinfo",
                icon: <FaRegUser />,
                title: "Personal Information",
                text: "Manage your personal information",
              },

              {
                id: "login-ser",
                icon: <FaRegUser />,
                title: "Login Services",
                text: "Manage your login methods",
              },

              {
                id: "program-res",
                icon: <CgNotes />,
                title: "Program & Resources",
                text: "Manage your learning resources",
              },

              {
                id: "language",
                icon: <HiMiniLanguage />,
                title: "Preferred Language",
                text: "Select your preferred language",
              },

              {
                id: "timezone",
                icon: <TfiWorld />,
                title: "Time Zone",
                text: "Choose your local time zone",
              },

              {
                id: "security",
                icon: <MdOutlineLock />,
                title: "Security",
                text: "Manage your account security",
              },
            ].map((item) => (
              <div className="profile-btn" key={item.id}>
                <button
                  className={profileTap === item.id ? "tab-active" : "tab"}
                  onClick={() => setProfileTap(item.id)}
                >
                  <div className="tab-icon">{item.icon}</div>

                  <div className="tab-content">
                    <strong>{item.title}</strong>

                    <p>{item.text}</p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CONTENT ================= */}

        <div className="personal_setting">
          {profileTap === "profileinfo" && (
            <div className="psetting_wraper">
              <h4>Personal Information</h4>

              {/* IMAGE */}

              <div className="image_container">
                <img
                  src={avatar}
                  alt="avatar"
                  onError={(e) => (e.currentTarget.src = defaultAvatar)}
                />

                <div className="image_deta">
                  <p>We only support JPG, JPEG or PNG files</p>

                  <div className="btn-btn">
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleAvatarChange}
                    />

                    <Button
                      type="button"
                      variant="primary"
                      loading={uploading}
                      onClick={() => document.getElementById("photo").click()}
                    >
                      Upload your photo
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={deleteAvatar}
                    >
                      Delete image
                    </Button>
                  </div>
                </div>
              </div>

              {/* FORM */}

              <form onSubmit={handleSubmit}>
                <div className="form-data">
                  <div className="form-column">
                    <label>First Name</label>

                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />

                    <label>Email</label>

                    <input value={formData.email} disabled />

                    <label>Country</label>

                    <input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    />

                    <label>Address</label>

                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-column">
                    <label>Last Name</label>

                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />

                    <label>Phone Number</label>

                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />

                    <label>City</label>

                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />

                    <label>Postal Code</label>

                    <input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="save-profile">
                  <Button type="submit" variant="primary" loading={saving}>
                    Edit profile
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;