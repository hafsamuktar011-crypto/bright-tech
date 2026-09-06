import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAdmin } from "../service/authService.js";

function AdminRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    checkAdmin()
      .then(() => {
        if (!cancelled) setStatus("ok");
      })
      .catch(() => {
        if (!cancelled) setStatus("deny");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Checking admin access…
      </div>
    );
  }

  if (status === "deny") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;
