# JobTrackr - Backend API

The robust backend server for **JobTrackr**, built using Node.js, Express.js, and MongoDB. It handles secure user authentication (JWT), job application management (CRUD operations, Kanban updates), profile management, and password recovery / email notifications via Nodemailer.

---

## 🚀 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas & Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs
* **Email Service:** Nodemailer (Gmail / SMTP)

---

## 📁 Folder Structure

```text
backend/
│
├── config/             # Database connection & Mailer configuration
│   ├── db.js
│   └── mailer.js
│
├── controllers/        # Business logic for auth, jobs, and user profiles
│   ├── authController.js
│   ├── jobController.js
│   └── userController.js
│
├── middleware/         # Custom authentication & security middleware
│   └── authMiddleware.js
│
├── models/             # Mongoose schemas for User and Job applications
│   ├── Job.js
│   └── User.js
│
├── routes/             # API endpoints mapping
│   ├── authRoutes.js
│   ├── jobRoutes.js
│   └── userRoutes.js
│
├── .env                # Environment variables (ignored in Git)
├── .env.example        # Environment variables template
├── server.js           # Entry point of the backend application
└── package.json        # Dependencies and scripts