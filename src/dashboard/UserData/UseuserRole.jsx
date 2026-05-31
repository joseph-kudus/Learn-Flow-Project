import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebaseconfig";
import { doc, getDoc } from "firebase/firestore";


const UseuserRole = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                setUserData(docSnap.exists() ? { uid: user.uid, ...docSnap.data() } : null);
            } else {
                setUserData(null);
            }
            setLoading(false);
        });
        return unsub;
    },[]);

    return { user: userData, loading };
}
export default UseuserRole;