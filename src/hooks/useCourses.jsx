import { useEffect, useState } from "react";
import { getCourses } from "../services/course/courseService";

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return { courses, loading };
};

export default useCourses;
