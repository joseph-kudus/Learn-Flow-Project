import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseconfig";
import { } from "../../firebaseconfig";

function SettingsPage() {
  const userId = auth.currentUser?.uid;
  const [userData, setUserData] = useState({});


 useEffect(() => {
   const fetchData = async () => {
     try {
       const docRef = doc(db, "users", userId);
       const docSnap = await getDoc(docRef);
       if (docSnap.exists()) {
         setUserData(docSnap.data());
       } else {
         console.log("No user data");
       }
     } catch (e) {
       console.error(e);
     }
   };
   fetchData();
 }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      firstName: e.target["First-Name"].value,
      lastName: e.target["Last-Name"].value,
    };
    await updateDoc(doc(db, "users", userId), updatedData);
  };

  return (
    <section className="SETTING">
      <form
        onSubmit={handleSubmit}
        className="container-main col-span-2 min-h-dvh md:45px"
      >
        <div className="form-container">
          <div className="SETTIN">
            <button type="submit">Edit Profile</button>
            <p>Login Information</p>
          </div>
          <h4>Edit Details</h4>
          <label htmlFor="First-Name" className="editpro">
            First Name (required)
            <input type="text" placeholder="ATO" id="First-Name" required />
          </label>
          <label htmlFor="Last-Name">
            Last Name (required)
            <input type="text" placeholder="ATO" id="Last-Name" required />
          </label>
          <label htmlFor="Nickname">
            Nickname (required)
            <input
              type="text"
              placeholder="Endlesslove"
              id="Nickname"
              required
            />
          </label>
          <fieldset>
            <legend>
              <h5>Login Information</h5>
            </legend>
            <label htmlFor="Current-Password">
              Current Password (required)
              <input
                type="password"
                id="Current-Password"
                placeholder="Current Password"
                autoComplete="off"
              />
            </label>
            <label htmlFor="Account-Email">
              Account Email
              <input
                type="email"
                id="Account-Email"
                placeholder="Ag834054@gmail.com"
              />
            </label>
            <label htmlFor="new-password">
              Add your new password
              <input
                type="password"
                placeholder="Add your new password"
                id="new-password"
                required
              />
            </label>
            <label htmlFor="Confirm-new-password">
              Confirm new password
              <input
                type="password"
                required
                id="Confirm-new-password"
                placeholder="Confirm new password"
              />
            </label>
          </fieldset>
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </section>
  );
}

export default SettingsPage;
