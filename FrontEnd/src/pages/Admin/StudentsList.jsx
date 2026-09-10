import { useEffect, useMemo, useState } from "react";
import { legacyCreateColumnHelper } from "@tanstack/react-table/legacy";
import { getStudents } from "../../service/userService.js";
import DataTable from "../../components/admin/DataTable";
import "./AdminShared.css";

const columnHelper = legacyCreateColumnHelper();

function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const res = await getStudents();
        const rows = res.data?.data ?? res.data ?? [];
        setStudents(Array.isArray(rows) ? rows : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("fullName", {
        header: "Name",
        cell: (info) => <strong>{info.getValue() || "—"}</strong>,
      }),
      columnHelper.accessor("emailAddress", {
        header: "Email",
        cell: (info) => info.getValue() || "—",
      }),
      columnHelper.accessor("phone", {
        header: "Phone",
        cell: (info) => info.getValue() || "—",
      }),
      columnHelper.accessor("role", {
        header: "Role",
        cell: (info) => (
          <span className="admin-statusBadge admin-statusBadge--pending">
            {info.getValue() || "student"}
          </span>
        ),
      }),
    ],
    []
  );

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-pageLead">Loading students…</p>
      </div>
    );
  }

  return (
    <div className="admin-page students-page">
      <div>
        <h2 className="admin-pageTitle">Registered Students</h2>
        <p className="admin-pageLead">
          Search, sort, and browse every learner in the portal.
        </p>
      </div>

      {error && <p className="admin-msg admin-msg--error">{error}</p>}

      <div className="admin-card">
        <DataTable
          data={students}
          columns={columns}
          searchPlaceholder="Search students…"
          emptyMessage="No students found."
        />
      </div>
    </div>
  );
}

export default StudentsList;
