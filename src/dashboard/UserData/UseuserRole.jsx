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
          const docSnap = await getDoc(doc(db, "users", user.uid));
          console.log("Doc exist:", docSnap.exists());
          console.log("Doc data:", docSnap.data());
          setUserData(
            docSnap.exists() ? { uid: user.uid, ...docSnap.data() } : null,
          );
        } catch (err) {
          console.error("Error fetching user doc:", err);
          setUserData(null);
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
