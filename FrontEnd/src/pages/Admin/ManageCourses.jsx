import { useEffect, useMemo, useState } from "react";
import { legacyCreateColumnHelper } from "@tanstack/react-table/legacy";
import { api } from "../../service/axiosInstance";
import DataTable from "../../components/admin/DataTable";
import "./AdminShared.css";
import "./ManageCourses.css";

const columnHelper = legacyCreateColumnHelper();

const emptyForm = {
  courseName: "",
  courseCode: "",
  description: "",
  credits: "",
  instructorId: "",
  batchNumber: "",
  programType: "Online",
};

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/course");
        const rows = res.data?.data ?? res.data ?? [];
        setCourses(Array.isArray(rows) ? rows : []);
      } catch (err) {
        setError("Failed to load courses");
        console.log(err);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await api.post("/course/create", formData);
      setMessage(res.data?.message || "Course created successfully!");
      setFormData(emptyForm);
      const created = res.data?.data ?? res.data;
      if (created) {
        setCourses((prev) => [created, ...prev]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/course/${id}`);
      setCourses((prev) => prev.filter((course) => course._id !== id));
      setMessage("Course deleted.");
    } catch {
      setError("Failed to delete course");
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("courseName", {
        header: "Name",
        cell: (info) => <strong>{info.getValue()}</strong>,
      }),
      columnHelper.accessor("courseCode", {
        header: "Code",
      }),
      columnHelper.accessor("credits", {
        header: "Credits",
      }),
      columnHelper.accessor("programType", {
        header: "Type",
        cell: (info) => info.getValue() || "—",
      }),
      columnHelper.accessor("batchNumber", {
        header: "Batch",
        cell: (info) => info.getValue() || "—",
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            type="button"
            className="admin-dangerBtn"
            onClick={() => handleDelete(row.original._id)}
          >
            Delete
          </button>
        ),
      }),
    ],
    []
  );

  return (
    <div className="admin-page manage-courses-page">
      <div>
        <h2 className="admin-pageTitle">Manage Courses</h2>
        <p className="admin-pageLead">
          Create programs and keep your catalog up to date.
        </p>
      </div>

      {message && <p className="admin-msg admin-msg--success">{message}</p>}
      {error && <p className="admin-msg admin-msg--error">{error}</p>}

      <div className="admin-card">
        <h3>Add a course</h3>
        <form onSubmit={handleSubmit} className="admin-formGrid">
          <input
            type="text"
            name="courseName"
            placeholder="Course Name"
            value={formData.courseName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="courseCode"
            placeholder="Course Code"
            value={formData.courseCode}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="credits"
            placeholder="Credits"
            value={formData.credits}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="instructorId"
            placeholder="Instructor Id"
            value={formData.instructorId}
            onChange={handleChange}
          />
          <input
            type="text"
            name="batchNumber"
            placeholder="Batch Number"
            value={formData.batchNumber}
            onChange={handleChange}
            required
          />
          <select
            name="programType"
            value={formData.programType}
            onChange={handleChange}
          >
            <option value="Online">Online</option>
            <option value="In-person">In-person</option>
            <option value="Both">Both</option>
          </select>
          <button type="submit" className="admin-primaryBtn">
            Add Course
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h3>Existing courses</h3>
        <DataTable
          data={courses}
          columns={columns}
          searchPlaceholder="Search courses…"
          emptyMessage="No courses yet."
        />
      </div>
    </div>
  );
}

export default ManageCourses;
