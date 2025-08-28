import React, { useEffect, useState } from "react";
import { fetchUnreadCount, fetchNotifications, markAllRead } from "./NotificationService";
import "./notification.css";

export default function NotificationsIcon() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;
        fetchUnreadCount(token).then(setUnreadCount);
    }, [token]);

    const toggleDropdown = () => {
        if (!showDropdown) {
            // Open dropdown - mark all as read and fetch notifications
            markAllRead(token);
            fetchNotifications(token).then(notifs => {
                setNotifications(notifs);
                setUnreadCount(0);
            });
        }
        setShowDropdown(!showDropdown);
    };

    const getNotificationStyle = (type) => {
        switch (type) {
            case "STATUS":
                return { backgroundColor: "#dbeafe", color: "#1e40af" };
            case "REMARK":
                return { backgroundColor: "#dcfce7", color: "#065f46" };  
            default:
                return { backgroundColor: "white", color: "#374151" };
        }
    };

    return (
        <div className="notifications-container" style={{ position: "relative" }}>
            <button onClick={toggleDropdown} style={{ fontSize: "20px" }}>
                🔔{unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            {showDropdown && (
                <div className="notifications-dropdown" style={{
                    position: "absolute", right: 0, top: "100%", width: 300, maxHeight: 400, overflowY: "auto", background: "white", border: "1px solid #ddd", borderRadius: 6, zIndex: 1000, boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}>
                    {notifications.length === 0 ? (
                        <div style={{ padding: 10 }}>No new notifications</div>
                    ) : (
                        notifications.map(n => (
                            <div
                                key={n.id}
                                style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #eee",
                                    backgroundColor: !n.seen ? "#eef6ff" : "white",
                                    ...getNotificationStyle(n.type),
                                }}
                            >
                                <strong>{n.complaintTitle}</strong> {/* Bold complaint title */}
                                <div>{n.message}</div>
                                <small style={{ color: "#888" }}>{new Date(n.createdAt).toLocaleString()}</small>
                            </div>
                        ))

                    )}
                </div>
            )}
        </div>
    );
}
