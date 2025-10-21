# 🧠 Agent Task Distributor (MERN Stack Application)

A basic **CRM-like tool** built with the **MERN stack (MongoDB, Express.js, React, Node.js)** to manage agents and distribute tasks uploaded via CSV or Excel files.

---

## ✨ Features

* **Admin Login:** Secure authentication for the administrator using JWT (JSON Web Tokens) stored in httpOnly cookies.  
* **Agent Management:** Admins can create new agents with name, email, mobile number, and password. Agent details (including mobile number) are displayed in a table.  
* **List Upload & Distribution:**
  * Upload `.csv`, `.xlsx`, or `.xls` files containing tasks (`FirstName`, `Phone`, `Notes`).
  * Validation for file types and required row data (`FirstName`, `Phone`).
  * Automatic and equal distribution of tasks among the first 5 agents found in the system.
  * Handles remainders by distributing sequentially.
* **Task Viewing:** Admins can select an agent from a dropdown to view all tasks assigned to them, displayed in a table.
* **Responsive UI:** Frontend built with React and Tailwind CSS for a clean, modern look on different screen sizes.
* **Notifications:** User-friendly toast notifications (using Sonner) for success and error messages.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js  
* **Database:** MongoDB (with Mongoose ODM)  
* **Frontend:** React (Vite), Tailwind CSS  
* **Authentication:** JWT (jsonwebtoken), bcryptjs (for password hashing)  
* **File Handling:** Multer (for uploads), csv-parser, xlsx (SheetJS)  
* **Validation:** Zod (backend), Client-side checks (frontend)  
* **Icons:** Lucide React  
* **Notifications:** Sonner  

---

## 📋 Prerequisites

* **Node.js:** v18 or later (Download: [https://nodejs.org/](https://nodejs.org/))  
* **npm:** v8 or later (usually comes with Node.js)  
* **MongoDB:** A running MongoDB instance (local or cloud like MongoDB Atlas).  
  You'll need the connection string. (Setup Atlas: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd <your-repository-folder>
```

---

### 2. Backend Setup

Navigate to the backend folder:
```bash
cd server
```

#### Install Dependencies
```bash
npm install
```

#### (Recommended) Install Nodemon for Development
Nodemon automatically restarts the server when you save file changes.  
If it's not already listed in `devDependencies` in `package.json`, install it:
```bash
npm install --save-dev nodemon
```

#### Ensure `dev` Script in `package.json`
Open the `server/package.json` file and make sure the `"scripts"` section has a `"dev"` script pointing to your server file:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```
*(Adjust the path `server.js` if your main backend file is located elsewhere relative to the `package.json` file).*

#### Create `.env` File
Create a file named `.env` in the `server` directory and add the following variables, replacing the placeholder values:
```env
DATABASE_URL=<your_mongodb_connection_string>
JWT_SECRET_AUTH=<your_strong_jwt_secret_key>
PORT=3000
```

* `DATABASE_URL`: Your MongoDB connection string.  
* `JWT_SECRET_AUTH`: A long, random, secret string for signing tokens (e.g., generate one online).  
* `PORT`: The port the backend server will run on (e.g., 3000).

#### Seed Admin User
If you haven't created an admin user yet, run the seed script (make sure MongoDB is running and `DATABASE_URL` is set in `.env`):
```bash
node seedAdmin.js
```
*(Remember to set the desired admin email/password inside `seedAdmin.js` first).*

---

### 3. Frontend Setup

Navigate to the frontend folder:
```bash
cd ../client
```

#### Install Dependencies
```bash
npm install
```

#### Verify API Port
Ensure the `API_BASE_URL` in `src/api/axios.js` matches the `PORT` you set in the backend `.env` file:
```js
export const API_BASE_URL = "http://localhost:3000/api";
```

---

## ▶️ Running the Application

You need **two terminals** open.

### 1. Run the Backend Server
In the `server` folder terminal:
```bash
npm run dev
```
*(This uses Nodemon to watch for file changes and restart automatically.  
If you don't have this script or Nodemon, use `npm start` or `node server.js` instead).*

The server should start, usually on:  
👉 **http://localhost:3000**

---

### 2. Run the Frontend Development Server
In the `client` folder terminal:
```bash
npm run dev
```

The frontend app should open in your browser, usually at:  
👉 **http://localhost:5173**

Navigate to the frontend URL in your browser — you should see the **login page**.

---

## 📁 Folder Structure

```
project-root/
│
├── client/                # React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                # Node.js + Express backend
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seedAdmin.js
│   ├── server.js
│   └── package.json
│
└── README.md
```
## 📜 License

This project is licensed under the **MIT License** — feel free to modify and use it for your own projects.

