import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebaseconfig";
import { doc, getDoc } from "firebase/firestore";

const UseuserRole = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          console.log("Doc exists:", docSnap.exists());
          console.log("Doc data:", docSnap.data());

          // Merge Firebase Auth + Firestore data
          setUserData({
            uid: user.uid,
            email: user.email, // from Auth
            displayName: user.displayName, // from Auth
            ...docSnap.data(), // Firstname, Lastname, role from Firestore
          });
        } catch (err) {
          console.error("Error fetching user doc:", err);
          // Still return auth data even if Firestore fails
          setUserData({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return { user: userData, loading };
};

export default UseuserRole;
