import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";

import Mycourses from "./Mycourses";
import { useAuth } from "../../context/AuthContext";

import { db } from "../../../firebaseconfig";
import { allEnrollments } from "../../services/allEnrollments";

const MyCoursesPage = () => {
  const { currentUser } = useAuth();

  const [enrollmentData, setEnrollmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) {
      setEnrollmentData([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", currentUser.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("MY COURSES DATA:", data);

      setEnrollmentData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return <p>Loading courses...</p>;
  }

  return (
    <Mycourses
      allEnrollments={allEnrollments}
      enrollmentData={enrollmentData}
      currentUser={currentUser}
    />
  );
};

export default MyCoursesPage;
