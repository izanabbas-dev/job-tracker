# 💼 JobTrackr - Full Stack MERN Application

**JobTrackr** is a feature-rich, full-stack web application designed to help job seekers organize, track, and manage their job applications across global and remote markets. Built using the **MERN** stack (MongoDB, Express.js, React 18, Node.js), it features a dynamic Kanban board with drag-and-drop capabilities, secure user authentication, profile management, password reset via Nodemailer, and CV/Resume tracking.

---

## ✨ Features & Highlights

* **📌 Interactive Kanban Board:** Drag-and-drop job application cards across columns (*Applied*, *Interviewing*, *Offer Received*, *Rejected*) to dynamically update statuses.
* **🔐 Secure Authentication:** User signup, login, persistent session management via JSON Web Tokens (JWT), and secure password hashing with `bcryptjs`.
* **📧 Password Recovery:** Email-based password reset workflows integrated with Nodemailer.
* **📄 Integrated CV Tracking:** Attach specific CV version names or direct clickable links to track exactly which resume was submitted for each job.
* **📱 Responsive & Modern UI:** Designed with Tailwind CSS, supporting dark mode styling and seamless usability on desktop, tablet, and mobile devices.
* **👤 User Profile Management:** View and update account details directly from the dashboard.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React 18 (Vite)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State Management:** React Context API
* **HTTP Client:** Axios

### Backend
* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas & Mongoose ODM
* **Authentication:** JWT & bcryptjs
* **Emailing:** Nodemailer (Gmail / SMTP)

---

## 📁 Repository Structure

```text
job-tracker/
│
├── backend/            # Express.js REST API server & database logic
│   ├── config/         # Database & Mailer configuration
│   ├── controllers/    # Request handlers for auth, jobs, and user profile
│   ├── middleware/     # Authentication & security middleware
│   ├── models/         # Mongoose schemas (User, Job)
│   ├── routes/         # Express API endpoints
│   ├── server.js       # Entry point for backend
│   └── package.json
│
├── frontend/           # React + Vite client-side application
│   ├── src/
│   │   ├── api/        # Axios API client setup
│   │   ├── components/ # Reusable UI components (Modals, Kanban Cards)
│   │   ├── context/    # React Context providers
│   │   ├── pages/      # Dashboard, Auth, and Profile pages
│   │   └── App.jsx     # Main App component & routes
│   └── package.json
│
└── README.md           # Project documentation