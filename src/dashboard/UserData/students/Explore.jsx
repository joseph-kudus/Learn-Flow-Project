import { Courseicon } from "../../../assets/images/Myimg";
import { termina, book2 } from "../../../assets/images/logos";
import { MdAccessTime } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { GrMore } from "react-icons/gr";

const Explore = () => {
  const enrolledCourses = [
    {
      id: 1,
      title: "Intro to C++",
      category: "CODING",
      img: Courseicon,
      classesCompleted: 42,
      totalClasses: 50,
      duration: "1hr 45m",
      nextLesson: "Pointers & Memory",
    },
    {
      id: 2,
      title: "Intro to Programming",
      category: "LANGUAGE",
      img: termina,
      classesCompleted: 12,
      totalClasses: 32,
      duration: "2hr 10m",
      nextLesson: "Variables and Functions",
    },
  ];
  const getProgress = (course) => {
    if (course.progress !== undefined && course.progress !== null)
      return course.progress;
    return Math.round((course.classesCompleted / course.totalClasses) * 100);
  };
  return (
    <div className="explore">
      <div className="Active-course">
        <h1>Active Courses</h1>
        <div className="programs-nav">
          <button>
            <GrMore />
          </button>
          <button className="active">All</button>
        </div>
      </div>

      <div className="card-container">
        {enrolledCourses.map((course) => {
          const progress = getProgress(course);
          return (
            <div key={course.id} className="course-card-container">
              <div className="card-header">
                <img
                  src={course.img}
                  alt={course.title}
                  className="card-image"
                />
                <div className="bek">
                  <h3>{course.title}</h3>
                  <span className="card-category">{course.category}</span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-bard">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{progress}</span>
              </div>

              <div className="lessons">
                <div className="lessons-logo">
                  <img src={book2} alt="ff" />
                  <p>
                    {course.classesCompleted}/{course.totalClasses} Classes
                  </p>
                </div>
                <div className="durationy">
                  <MdAccessTime size={20} />
                  <p>{course.duration}</p>
                </div>
              </div>
              <hr />
              <div className="card-footer">
                <button>Resume classes</button>
                <button className="arrow-btn">
                  <FaArrowRightLong />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <h2>Recently Enrolled</h2>
    </div>
  );
};
export default Explore;
