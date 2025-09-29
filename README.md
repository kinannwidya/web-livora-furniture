# 🛋️ Livora Furniture (MERN E-Commerce)

Livora Furniture is a **full-stack e-commerce web app** featuring a **customer store** and an **admin dashboard**.  
Frontend built with **React + TypeScript + TailwindCSS**, backend with **Express + MongoDB + Cloudinary**.  

This project demonstrates **real-world skills** in state management, authentication, CRUD flows, drag-and-drop UI, and secure API integration.

---

## ✨ Features

### 👥 Customer Store
- Automatic **Banner Slider** for promotions
- Responsive carousel for category & room selector with Swiper.js  
- Product listing with dynamic routes, responsive grid, and stock/discount overlays
- **Cart system**: undo toast, bulk select, quantity controls, sticky checkout summary
- **Blog**: Markdown rendering, reading time, next/previous navigation
- **About Page**: hero, story, services grid, and CTA section

### 🛠️ Admin Dashboard
- **JWT login** with protected routes & Axios interceptor
- CRUD for **Products, Categories, Rooms**  
  - Cloudinary image upload & cleanup  
  - Cropping with react-easy-crop  
- **Drag & Drop** reorder for featured layout (DnD Kit)
- Safety: unsaved changes modal + browser/tab close warning

---

## ⚙️ Tech Stack

### Frontend
- **React + TypeScript**
- **React Router v7** (nested & protected routes, navigation guard)
- **TanStack React Query** (server state, caching, stale-time)
- **DnD Kit** (drag-and-drop admin layout)
- **Axios** (JWT interceptor, dynamic base URL)
- **TailwindCSS** (responsive, utility-first styling)
- **Swiper.js** (slider)
- **ReactMarkdown + remark-gfm** (Markdown rendering)

### Backend
- **Express.js**
- **MongoDB Atlas + Mongoose**
- **JWT Authentication** (login/register, role-based access)
- **bcrypt** (password hashing)
- **Cloudinary** (image upload & deletion, auto WebP conversion)
- **Multer** (temp upload handler)
- **dotenv + nodemon** (config & dev experience)

---

## 📸 Preview

### Customer Store
![Customer Page](./preview/Livora%20Customer%20Store.png)  

### Admin Dashboard
![Admin Panel](./preview/Livora%20Admin%20Dashboard.png)

## 🎥 Demo Video

- [Customer Store](https://youtu.be/onNxe0EZfQE?si=nPkKkVTztBVRtxbY)  
- [Admin Dashboard](https://youtu.be/YJX8XOxHij8?si=AcTGMuYz6KXBqj46)

---

## 🔑 Highlights
- Full MERN stack with **JWT auth**, **React Query caching**, **Cloudinary integration**
- Admin panel with **drag-and-drop reorder**, modal CRUD, and safety guards
- Customer store with **search, filter, sort, cart persistence**, and Markdown blog
- Data migration scripts for admin tools & consistency
- Responsive, UX-focused, and **deployment-ready structure**

---

## 👩‍💻 Created by [@kinannwidya](https://github.com/kinannwidya)