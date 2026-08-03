import { useEffect, useState } from "react";
import { getCourses } from "../services/course/courseService";

const useCourses = () => {
  const [courses, SetCourses] = useState([]);
  const [loading, SetLoading] = useState(true);

  useEffect(() => {
    const loadingCourses = async () => {
      const data = await getCourses;
      SetCourses(data);
      SetLoading(false);
    };
  }, []);
  return (courses, loading);
};
export default useCourses;
