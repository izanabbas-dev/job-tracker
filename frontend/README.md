# JobTrackr - Frontend

The modern, responsive user interface for **JobTrackr**, built using React 18, Vite, and Tailwind CSS. It features a fully interactive Kanban board with smooth drag-and-drop capabilities, user authentication views, dynamic add/edit modals, and CV tracking.

---

## 🚀 Tech Stack

* **Library / Framework:** React 18 (with Vite)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State Management:** React Context API
* **HTTP Client:** Axios

---

## 📁 Folder Structure

```text
frontend/
│
├── public/             # Static assets and public icons
│
├── src/
│   ├── api/            # Axios instance and API service calls
│   ├── assets/         # Images, logos, or local graphics
│   ├── components/     # Reusable UI components (Modals, Cards, Navbar, etc.)
│   ├── constants/      # App-wide constants and configurations
│   ├── context/        # React Context providers for global state
│   ├── pages/          # Full page views (Dashboard, Login, Register, Profile)
│   ├── App.jsx         # Main application component & routing setup
│   ├── index.css       # Global styles and Tailwind configuration
│   └── main.jsx        # React application entry point
│
├── .env                # Environment variables (ignored in Git)
├── .gitignore          # Git ignored files & directories
├── index.html          # HTML root template
├── package.json        # Dependencies and scripts
└── vite.config.js      # Vite bundler configuration