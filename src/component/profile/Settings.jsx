import "../../styles/usedata.css";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { SlCloudDownload } from "react-icons/sl";
import { PiPencilSimpleLineLight } from "react-icons/pi";
import defaultAvatar from "../../assets/images/default.png";
import Button from "../ui/Button/Button.jsx";
import Input from "../../component/ui/Input/Input.jsx";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebaseconfig.js";
import { uploadAvatar } from "../../utils/uploadAvatar";
import { toast } from "react-toastify";
import countryCodes from "country-codes-list";

const Settings = () => {
  const [profileTap, setProfileTap] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const { currentUser, userData, loading } = useAuth();
  const fileInputRef = useRef(null);

  // Default to student and force lowercase
  const role = (userData?.role || "student").toLowerCase();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    residentAddress: "",
    streetAddress: "",
    phone: "",
    employment: "student",
  });

 
 
 
 
 
  const countrie = Object.entries(
    countryCodes.customList("countryCode", "{countryCallingCode}"),
  ).map(([iso, callingCode]) => {
    const flag = iso
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt(0)),
      );

    return {
      iso,
      flag,
      phoneCode: `+${callingCode}`,
    };
  });
 

 
 
 
 
 







  const displayName =
    userData?.nickname ||
    userData?.firstName ||
    userData?.username ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const handleSubmit = async () => {
    if (!currentUser) return;

    try {
      setSaving(true);

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          ...formData,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    if (!currentUser) return;
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    try {
      setUploading(true);

      const imageUrl = await uploadAvatar(file);

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          photoURL: imageUrl,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setAvatar(imageUrl);
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!userData || !currentUser) return;

    setAvatar(userData.photoURL || currentUser.photoURL || defaultAvatar);

    setFormData({
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      residentAddress: userData.residentAddress || "",
      streetAddress: userData.streetAddress || "",
      phone: userData.phone || "",
      employment: userData.employment || "student",
    });
  }, [userData, currentUser]);

  if (loading) return <div className="header-skeleton">Loading...</div>;
  if (!currentUser) return null;

  const [countries, setCountries] = useState([]);
  const [countryCode, setCountryCode] = useState("+256");

  return (
    <div className="setting-container">
      <div className="profile-avatar-section">
        <div className="avatar-wrapper">
          <img
            src={avatar}
            className="avatar-img"
            alt="User avatar"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
          />

          <div className="avatar-overlay">
            <Button
              variant="outline"
              size="sm"
              loading={uploading}
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? "Uploading..." : "Change"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
        <p
          className="change-avatar-text"
          onClick={() => fileInputRef.current?.click()}
        >
          Change profile avatar <PiPencilSimpleLineLight />
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
          <Button
            variant="primary"
            rightIcon={<SlCloudDownload />}
            loading={saving}
            disabled={!isEditing || uploading}
            onClick={handleSubmit}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="profile-edit">
          {profileTap === "profile" && (
            <>
              <div className="form-section">
                <div className="section-header">
                  <h4>Profile Name</h4>

                  <Button
                    variant={isEditing ? "secondary" : "outline"}
                    size="sm"
                    rightIcon={<PiPencilSimpleLineLight />}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <Input
                      label="First Name"
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-group">
                    <Input
                      label="Last Name"
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="section-header">
                  <h4>Personal Address</h4>
                </div>

                <div className="form-group">
                  <Input
                    label="Resident Address"
                    id="residentAddress"
                    name="residentAddress"
                    type="text"
                    value={formData.residentAddress}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Bulange, Kampala"
                  />
                </div>
                <div className="form-group">
                  <Input
                    label="Street Address"
                    id="streetAddress"
                    name="streetAddress"
                    type="text"
                    value={formData.streetAddress}
                    onChange={handleChange}
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
                  <select
                    id="employment"
                    name="employment"
                    value={formData.employment}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
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
                    <select
                      className="country-code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      disabled={!isEditing}
                    >
                      {countrie.map((country) => (
                        <option key={country.iso} value={country.phoneCode}>
                          {country.phoneCode} {country.flag}
                        </option>
                      ))}
                    </select>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Phone Number"
                      className="phone-field"
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
