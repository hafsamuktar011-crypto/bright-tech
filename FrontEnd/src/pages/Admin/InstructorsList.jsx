import { useEffect, useMemo, useState } from "react";
import { legacyCreateColumnHelper } from "@tanstack/react-table/legacy";
import { getInstructors } from "../../service/userService.js";
import DataTable from "../../components/admin/DataTable";
import "./AdminShared.css";

const columnHelper = legacyCreateColumnHelper();

function InstructorsList() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInstructors() {
      try {
        setLoading(true);
        const res = await getInstructors();
        const rows = res.data?.data ?? res.data ?? [];
        setInstructors(Array.isArray(rows) ? rows : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load instructors");
      } finally {
        setLoading(false);
      }
    }
    fetchInstructors();
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
            {info.getValue() || "instructor"}
          </span>
        ),
      }),
    ],
    []
  );

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-pageLead">Loading instructors…</p>
      </div>
    );
  }

  return (
    <div className="admin-page instructors-page">
      <div>
        <h2 className="admin-pageTitle">Registered Instructors</h2>
        <p className="admin-pageLead">
          Search, sort, and browse every instructor registered in the portal.
        </p>
      </div>

      {error && <p className="admin-msg admin-msg--error">{error}</p>}

      <div className="admin-card">
        <DataTable
          data={instructors}
          columns={columns}
          searchPlaceholder="Search instructors…"
          emptyMessage="No instructors found."
        />
      </div>
    </div>
  );
}

export default InstructorsList;
