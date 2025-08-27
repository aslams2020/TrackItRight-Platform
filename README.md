# Complaint Chain Tracker for Public Issues

## 📌 Overview
The **Complaint Chain Tracker** is a web application designed to streamline the process of reporting, tracking, and resolving public complaints such as potholes, faulty streetlights, water issues, etc.  
It connects citizens with the relevant authorities and provides a transparent tracking system to monitor complaint progress until resolution.

## ✨ Features
- **User Authentication** – Secure login & signup using JWT (JSON Web Token) authentication.
- **Submit Complaints** – Citizens can raise complaints by providing a title, description, and category (e.g., Water, Electricity, Roads).
- **Complaint Assignment** – Complaints are automatically or manually assigned to the relevant authority department.
- **Status Tracking** – Authorities can update the complaint status (Pending, In Progress, Resolved).
- **Resolution Feedback** – Citizens can confirm resolution or provide feedback after completion.
- **Complaint History** – Users can view all their submitted complaints and statuses.

## 🛠 Tech Stack
**Backend:**
- Java 17
- Spring Boot (REST API)
- Spring Security (JWT Authentication)
- MySQL (Database)
- Maven (Dependency Management)

**Frontend:**
- React.js 
- Axios (API Requests)
- CSS (Styling)

**Other Tools:**
- Postman (API Testing)
- Git & GitHub (Version Control)
- Spring Tool Suite (STS) – Backend Development

## Current Flow
1. **User Authentication**
   - User registers via `/api/auth/register`
   - User logs in via `/api/auth/login` and receives a JWT token.
2. **Complaint Submission**
   - User sends complaint details via `/api/complaints` with JWT token in headers.
3. **Complaint Management**
   - Admin/authority updates complaint status via respective endpoints.
4. **Tracking & Feedback**
   - Users track complaint status and give feedback when resolved.

## What I Made --> 
- Backend setup with Spring Boot
- MySQL database integration
- JWT-based authentication
- Register & Login APIs
- Basic complaint submission endpoint

- Role-based access (User, Authority, Admin)
- Complaint status update APIs
- Feedback & ratings system
- Complaint filtering/searching
- React.js frontend integration
- UI for complaint submission & tracking
