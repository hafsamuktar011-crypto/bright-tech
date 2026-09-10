import "./AdminDashboard.css";
import { Outlet, NavLink, Link } from "react-router-dom";

const navItems = [
  { to: "/admin/students", label: "Students" },
  { to: "/admin/instructors", label: "Instructors" },
  { to: "/admin/register-staff", label: "Register Staff" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/courses", label: "Courses" },
];

function AdminDashboard() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Link to="/" className="admin-brandMark">
            Bright <span>tech</span>
          </Link>
          <p className="admin-brandSub">Admin console</p>
        </div>

        <nav className="admin-nav" aria-label="Admin">
          <p className="admin-navLabel">Workspace</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `admin-navLink${isActive ? " active" : ""}`
              }
            >
              <span className="admin-navDot" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebarFoot">
          <strong>Bright tech</strong>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <div className="admin-headerCopy">
            <h1>Admin Dashboard</h1>
            <p>Overview and tools for your Bright tech academy.</p>
          </div>
        </header>

        <section className="admin-stats" aria-label="Quick overview">
          <article className="admin-statCard">
            <span>Students</span>
            <strong>Manage</strong>
          </article>
          <article className="admin-statCard">
            <span>Courses</span>
            <strong>Catalog</strong>
          </article>
          <article className="admin-statCard">
            <span>Payments</span>
            <strong>Review</strong>
          </article>
        </section>

        <div className="admin-contentArea">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
