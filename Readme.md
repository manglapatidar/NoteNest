# 📚 NoteNest — Study Notes Sharing Platform

## 🚀 Project Overview

**NoteNest** is a full-stack web application designed for sharing and managing study notes. Users can upload notes by subject, while an admin reviews and approves them before they become publicly accessible. The platform also allows users to save, rate, and comment on notes, creating an interactive learning environment.

---

## ✨ Key Features

### 👤 User Features

* Upload notes (text or PDF)
* Browse approved notes by subject
* Save notes to personal collection
* Rate notes (1–5 stars)
* Comment on notes

### 🛠 Admin Features

* View all pending notes
* Approve or reject notes
* Manage subjects/categories
* Delete any note or comment
* View analytics (notes per subject, average ratings)

---

## 🧠 AI Feature (Claude API)

* Each note has a **"Summarize with AI"** button
* When clicked:

  * Sends note content to AI
  * Returns **exactly 5 bullet points summary**
* Summary is displayed in a highlighted section for quick revision

---

## 🧰 Tech Stack

### Frontend

* React.js (Vite)
* Redux Toolkit
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT (JSON Web Token)
* bcrypt (password hashing)

### File Upload

* Multer (for PDF uploads)

### AI Integration

* Claude API (Anthropic)

---

## 🧩 Redux Toolkit Slices

* **authSlice**

  * Handles authentication
  * Stores JWT token and user info

* **notesSlice**

  * Stores approved notes
  * Handles filters and saved notes

* **adminSlice**

  * Manages pending notes
  * Stores subject-wise statistics

---

## 🗄 Database Schema Design

### User

* name
* email
* password
* role (user/admin)

### Subject

* name

### Note

* userId
* title
* subject
* content / fileUrl
* status (pending / approved / rejected)
* avgRating
* saves

### Rating

* userId
* noteId
* score

### Comment

* userId
* noteId
* text

---

## 🔗 API Endpoints

### 🔐 Auth APIs

* `POST /api/auth/register`
* `POST /api/auth/login`

### 📝 Notes APIs

* `POST /api/notes` (Upload note)
* `GET /api/notes/approved`
* `GET /api/notes/:id`
* `DELETE /api/notes/:id`

### ❤️ Interaction APIs

* `POST /api/notes/:id/save`
* `POST /api/notes/:id/rate`
* `POST /api/notes/:id/comment`
* `GET /api/notes/:id/comments`

### 👤 User APIs

* `GET /api/users/profile`
* `GET /api/users/my-notes`
* `GET /api/users/saved-notes`

### 🛠 Admin APIs

* `GET /api/admin/notes/pending`
* `PATCH /api/admin/notes/:id/approve`
* `PATCH /api/admin/notes/:id/reject`
* `DELETE /api/admin/notes/:id`
* `GET /api/admin/stats`

### 🤖 AI API

* `POST /api/ai/summarize`

---

## ⚙️ Project Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <repo-url>
cd notenest
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
ANTHROPIC_API_KEY=your_api_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔄 Application Flow

1. User registers and logs in
2. JWT token is generated and stored
3. User uploads a note → status = **pending**
4. Admin reviews and approves/rejects
5. Approved notes become visible to all users
6. Users can:

   * Save notes
   * Rate notes
   * Comment
7. Admin views analytics using MongoDB aggregation
8. AI feature generates summaries on demand

---

## 🔐 Security Features

* JWT-based authentication
* Protected routes (user/admin)
* Role-based access control
* Password hashing with bcrypt

---

## 📊 Analytics Feature

* Notes grouped by subject
* Total uploads per subject
* Average rating calculation using MongoDB aggregation

---

## 🧪 Testing

* Test all APIs using Postman
* Validate:

  * Auth flow
  * Upload system
  * Admin controls
  * Rating/comment system
  * AI summarization

---

## 🚀 Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 📌 Future Improvements

* Search functionality
* Bookmark folders
* Real-time notifications
* AI-powered recommendations

---

## 🎯 Conclusion

NoteNest is a complete full-stack application demonstrating:

* Authentication & Authorization
* File Upload System
* Role-Based Access Control
* State Management with Redux
* REST API Design
* AI Integration

---

💡 *This project is ideal for showcasing full-stack development skills along with modern tools and AI integration.*
