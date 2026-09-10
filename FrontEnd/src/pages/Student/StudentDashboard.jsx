import { useEffect, useState } from "react";
import { NavLink, Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext.jsx";
import { getStudent } from "../../service/userService.js";
import { getStudentDashboardPath, toStudentSlug } from "./studentPath.js";
import "./StudentDashboard.css";

const navItems = [
  { to: ".", label: "Dashboard", end: true },
  { to: "assignments", label: "Assignments", end: false },
  { to: "courses", label: "Courses", end: false },
  { to: "settings", label: "Settings", end: false },
];

function StudentSection({ title, lead }) {
  return (
    <section className="student-panel">
      <header className="student-header">
        <div className="student-headerCopy">
          <h1>{title}</h1>
          <p>{lead}</p>
        </div>
      </header>
    </section>
  );
}

export function StudentOverview() {
  const { state, setUser } = useUserContext();
  const [student, setStudent] = useState(state?.user || null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getStudent()
      .then((response) => {
        if (cancelled) return;
        const liveStudent = response.data.user;
        setStudent(liveStudent);
        setUser(liveStudent);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load student data."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="student-panel">
      <header className="student-header">
        <div className="student-headerCopy">
          <h1>Dashboard</h1>
          <p>Your profile from Bright tech records.</p>
        </div>
      </header>

      {loading && <p className="student-status">Loading your profile…</p>}
      {error && <p className="student-error">{error}</p>}

      {!loading && !error && student && (
        <div className="student-profileCard">
          <dl className="student-profileGrid">
            <div>
              <dt>Full name</dt>
              <dd>{student.fullName}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{student.emailAddress}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{student.phone}</dd>
            </div>
            <div>
              <dt>Birth date</dt>
              <dd>{student.birthDate}</dd>
            </div>
            <div>
              <dt>Gender</dt>
              <dd>{student.gender}</dd>
            </div>
            <div>
              <dt>Academic background</dt>
              <dd>{student.academicBackground}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{student.role}</dd>
            </div>
            {student.status && (
              <div>
                <dt>Status</dt>
                <dd>{student.status}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </section>
  );
}

export function StudentAssignments() {
  return (
    <StudentSection
      title="Assignments"
      lead="Assignments will appear in this section later."
    />
  );
}

export function StudentCoursesPanel() {
  return (
    <StudentSection
      title="Courses"
      lead="Your courses will appear in this section later."
    />
  );
}

export function StudentSettings() {
  return (
    <StudentSection
      title="Settings"
      lead="Account settings will appear in this section later."
    />
  );
}

function StudentDashboard() {
  const { studentName } = useParams();
  const location = useLocation();
  const { state } = useUserContext();
  const user = state?.user;
  const expectedSlug = toStudentSlug(user?.fullName);

  if (studentName !== expectedSlug) {
    const prefix = `/student-dashboard/${studentName}`;
    const nested = location.pathname.startsWith(prefix)
      ? location.pathname.slice(prefix.length)
      : "";
    return (
      <Navigate
        to={`${getStudentDashboardPath(user)}${nested}${location.search}`}
        replace
      />
    );
  }

  return (
    <div className="student-layout">
      <aside className="student-sidebar">
        <div className="student-brand">
          <NavLink to="/" className="student-brandMark">
            Bright <span>tech</span>
          </NavLink>
          <p className="student-brandSub">Student workspace</p>
        </div>

        <nav className="student-nav" aria-label="Student">
          <p className="student-navLabel">Workspace</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `student-navLink${isActive ? " active" : ""}`
              }
            >
              <span className="student-navDot" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="student-sidebarFoot">
          <strong>{user?.fullName || "Student"}</strong>
          <p>Bright tech</p>
        </div>
      </aside>

      <main className="student-content">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentDashboard;
