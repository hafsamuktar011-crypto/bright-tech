import { useParams, useNavigate } from "react-router-dom";
import "../styles/coursed.css";
import { courses } from "../assets/courseData.js";

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = courses.find((c) => c.id === courseId);

  // If someone opens the URL directly with an id that does not exist
  if (!course) {
    return (
      <div className="course-not-found">
        <h2>Course not found</h2>

        <button onClick={() => navigate("/courses")}>
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="course-details-page">

      <button
        className="back-button"
        onClick={() => navigate("/courses")}
      >
        ← Back to Courses
      </button>

      <div className="course-details">

        <div className="details-image">
          <img src={course.image} alt={course.title} />
        </div>

        <div className="details-content">

          <h1>{course.title}</h1>

          <p className="details-description">
            {course.description}
          </p>

          <div className="details-info">
            <div>
              <strong>Level</strong>
              <span>{course.level}</span>
            </div>

            <div>
              <strong>Duration</strong>
              <span>{course.duration}</span>
            </div>
          </div>

          <h2>What You Will Learn</h2>

          <ul>
            <li>Programming fundamentals</li>
            <li>Practical coding exercises</li>
            <li>Real-world projects</li>
            <li>Problem solving</li>
            <li>Build your own applications</li>
          </ul>

          <button className="start-learning-btn">
            Start Learning
          </button>

        </div>
      </div>
    </div>
  );
}

export default CourseDetails;