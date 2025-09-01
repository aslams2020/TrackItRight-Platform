// src/pages/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import DepartmentTable from "../components/DepartmentTable";
import DepartmentForm from "../components/DepartmentForm";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import Reports from "../components/Reports";
import "../styles/AdminDashboard.css";

const TABS = ["Departments", "Users", "Reports"];

export default function AdminDashboard() {
  const [active, setActive] = useState("Departments");
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState({
    byDept: [],
    byStatus: [],
    averageRating: null
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const api = async (url, opts = {}) => {
    const res = await fetch(url, {
      ...opts,
      headers: {
        "Accept": "application/json",
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
        "Authorization": `Bearer ${token}`,
        ...(opts.headers || {})
      }
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (_) { }
    if (!res.ok) {
      throw new Error(data?.message || `${res.status} ${res.statusText}: ${text?.slice(0, 500)}`);
    }
    return data;
  };

  const loadDepartments = async () => {
    setErr(""); setLoading(true);
    try {
      const data = await api("http://localhost:8080/api/admin/departments");
      setDepartments(Array.isArray(data) ? data : []);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const loadUsers = async () => {
    setErr(""); setLoading(true);
    try {
      const data = await api("http://localhost:8080/api/admin/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const objToArray = (obj, keyName, valueName) =>
    obj && typeof obj === "object"
      ? Object.entries(obj).map(([k, v]) => ({ [keyName]: k, [valueName]: v }))
      : [];

  const loadReports = async () => {
    setErr("");
    setLoading(true);
    try {
      const [byDeptRaw, byStatusRaw, avgRaw] = await Promise.all([
        api("http://localhost:8080/api/admin/reports/complaints-per-department"),
        api("http://localhost:8080/api/admin/reports/complaints-by-status"),
        api("http://localhost:8080/api/admin/reports/average-rating"),
      ]);

      const byDeptArr = objToArray(byDeptRaw, "departmentName", "count");
      const byStatusArr = objToArray(byStatusRaw, "status", "count");

      // Average rating:
      let avgValue = null;
      if (typeof avgRaw === "number") {
        avgValue = avgRaw;
      } else if (avgRaw && typeof avgRaw === "object") {
        const values = Object.values(avgRaw).filter(v => typeof v === "number");
        avgValue = values.length ? (values.reduce((a, b) => a + b, 0) / values.length) : null;
      }

      setReports({
        byDept: byDeptArr,
        byStatus: byStatusArr,
        averageRating: avgValue,
      });
    } catch (e) {
      setErr(e.message);
      setReports({ byDept: [], byStatus: [], averageRating: null });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { setErr("Missing admin token. Please login again."); return; }
    if (active === "Departments") loadDepartments();
    if (active === "Users") loadUsers();
    if (active === "Reports") loadReports();
  }, [active, token]);

  return (
    <div className="admin-dashboard">
      <h2>Admin <span className="admin-span">Dashboard⚡</span></h2>
      <div className="admin-main">
      <aside className="admin-sidebar">
        <nav>
          {TABS.map(tab => (
            <button
              key={tab}
              className={`tab-btn ${active === tab ? "active" : ""}`}
              onClick={() => setActive(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h3>{active}</h3>
          {loading && <span className="spinner" aria-label="Loading" />}
        </header>
        {err && <div className="error-banner">{err}</div>}

        {active === "Departments" && (
          <section className="section">
            <div className="section-grid">
              <div className="card">
                <DepartmentForm
                  onSaved={loadDepartments}
                />
              </div>
              <div className="card">
                <DepartmentTable
                  departments={departments}
                  onChange={loadDepartments}
                />
              </div>
            </div>
          </section>
        )}

        {active === "Users" && (
          <section className="section">
            <div className="section-grid">
              <div className="card">
                <UserForm
                  departments={departments}
                  onSaved={() => { loadUsers(); loadDepartments(); }}
                />
              </div>
              <div className="card">
                <UserTable
                  users={users}
                  departments={departments}
                  onChange={() => { loadUsers(); loadDepartments(); }}
                />
              </div>
            </div>
          </section>
        )}

        {active === "Reports" && (
          <section className="section">
            <div className="card">
              <Reports data={reports} />
            </div>
          </section>
        )}
      </main>
    </div>
    </div>
  );
}
