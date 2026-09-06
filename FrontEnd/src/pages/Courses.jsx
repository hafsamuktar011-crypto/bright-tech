import SiteNav from "../components/SiteNav.jsx";
import { courses } from "../assets/courseData.js";
import HomeCard from "../components/ui/homecrad.jsx";
import "../styles/courses.css";

function Courses() {
  return (
    <div className="courses-page">
      <SiteNav />

      <div className="courses-hero">
        <h1>Our Courses</h1>
        <p>Pick a course to see what it covers.</p>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <HomeCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default Courses;
