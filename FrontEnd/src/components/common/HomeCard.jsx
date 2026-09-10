import { Link } from "react-router-dom";

function HomeCard({ course }) {
  return (
    <Link to={`/courses/${course.id}`} className="card">
      <img src={course.image} alt={course.title} />
      <h3>{course.title}</h3>
      <p>within {course.duration}</p>
    </Link>
  );
}

export default HomeCard;
