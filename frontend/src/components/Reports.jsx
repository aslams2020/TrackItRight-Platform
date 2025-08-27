import React from "react";
import "../styles/Reports.css";

export default function Reports({ data }) {
  const { byDept, byStatus, averageRating } = data || {};

  return (
    <div className="reports">
      <div className="report-cards">
        <div className="report-card">
          <div className="metric-title">Average Rating</div>
          <div className="metric-value">
            {averageRating != null ? averageRating.toFixed(2) : "-"}
          </div>
          <div className="metric-sub">Out of 5</div>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-table-card">
          <h4>Complaints per Department</h4>
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Total Complaints</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(byDept) && byDept.length > 0 ? byDept.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.departmentName ?? r.department ?? "-"}</td>
                  <td>{r.count ?? r.total ?? 0}</td>
                </tr>
              )) : (
                <tr><td colSpan={2} className="muted">No data.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="report-table-card">
          <h4>Complaints by Status</h4>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(byStatus) && byStatus.length > 0 ? byStatus.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.status ?? "-"}</td>
                  <td>{r.count ?? r.total ?? 0}</td>
                </tr>
              )) : (
                <tr><td colSpan={2} className="muted">No data.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
