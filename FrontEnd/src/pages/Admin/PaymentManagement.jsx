import { useEffect, useMemo, useState } from "react";
import { legacyCreateColumnHelper } from "@tanstack/react-table/legacy";
import { api } from "../../service/axiosInstance";
import DataTable from "../../components/admin/DataTable";
import "../../styles/adminShared.css";
import "../../styles/payment.css";

const columnHelper = legacyCreateColumnHelper();

function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const res = await api.get("/payment");
        const rows = res.data?.data ?? res.data ?? [];
        setPayments(Array.isArray(rows) ? rows : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load payments");
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  const handleReview = async (id, status) => {
    setMessage("");
    setError("");
    try {
      await api.patch(`/payment/${id}`, { status });
      setPayments((prev) =>
        prev.map((payment) =>
          payment._id === id ? { ...payment, status } : payment
        )
      );
      setMessage(`Payment ${status} successfully.`);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to update payment status"
      );
    }
  };

  const visiblePayments = useMemo(() => {
    if (statusFilter === "all") return payments;
    return payments.filter((p) => p.status === statusFilter);
  }, [payments, statusFilter]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "student",
        header: "Student",
        cell: ({ row }) => (
          <div className="admin-cellStack">
            <strong>{row.original.studentId?.fullName || "Unknown"}</strong>
            <small>{row.original.studentId?.emailAddress || "—"}</small>
          </div>
        ),
      }),
      columnHelper.display({
        id: "course",
        header: "Course",
        cell: ({ row }) => (
          <div className="admin-cellStack">
            <strong>{row.original.courseId?.courseName || "Unknown"}</strong>
            <small>{row.original.courseId?.courseCode || "—"}</small>
          </div>
        ),
      }),
      columnHelper.accessor("coursePrice", { header: "Course Price" }),
      columnHelper.accessor("amount", { header: "Amount Paid" }),
      columnHelper.accessor("paymentType", { header: "Type" }),
      columnHelper.accessor("paymentMethod", { header: "Method" }),
      columnHelper.accessor("transactionId", {
        header: "Transaction ID",
        cell: (info) => info.getValue() || "—",
      }),
      columnHelper.display({
        id: "receipt",
        header: "Receipt",
        cell: ({ row }) =>
          row.original.receiptUrl ? (
            <a
              className="admin-link"
              href={row.original.receiptUrl}
              target="_blank"
              rel="noreferrer"
            >
              View
            </a>
          ) : (
            "—"
          ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <span
            className={`admin-statusBadge admin-statusBadge--${info.getValue() || "pending"}`}
          >
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) =>
          row.original.status === "pending" ? (
            <div className="admin-rowActions">
              <button
                type="button"
                className="admin-approveBtn"
                onClick={() => handleReview(row.original._id, "approved")}
              >
                Approve
              </button>
              <button
                type="button"
                className="admin-dangerBtn"
                onClick={() => handleReview(row.original._id, "denied")}
              >
                Deny
              </button>
            </div>
          ) : (
            <small>Reviewed</small>
          ),
      }),
    ],
    []
  );

  return (
    <div className="admin-page payments-page">
      <div className="payments-header">
        <div>
          <h2 className="admin-pageTitle">Payment Receipts</h2>
          <p className="admin-pageLead">
            Filter and review student payment submissions.
          </p>
        </div>
        <select
          className="admin-filterSelect"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
      </div>

      {message && <p className="admin-msg admin-msg--success">{message}</p>}
      {error && <p className="admin-msg admin-msg--error">{error}</p>}

      <div className="admin-card">
        {loading ? (
          <p className="admin-pageLead">Loading payments…</p>
        ) : (
          <DataTable
            data={visiblePayments}
            columns={columns}
            searchPlaceholder="Search payments…"
            emptyMessage="No payment records match this filter."
          />
        )}
      </div>
    </div>
  );
}

export default PaymentManagement;
