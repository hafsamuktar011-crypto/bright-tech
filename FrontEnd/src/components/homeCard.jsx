import "../../styles/homeCard.css";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";

function HomeCard({ course }) {
  const id = course._id;
  const title = course.courseName;
  const description = course.description || "No description yet.";
  const image = course.image || DEFAULT_IMAGE;

  return (
    <Link to={`/courses/${id}`} className="homeCard-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
}

export default HomeCard;