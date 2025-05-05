# Pratheep Srikone's Showcase App

A full-stack showcase web application built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **tRPC**, **MongoDB**, **Redis**, and **Socket.IO**. This app enables users to explore digital artworks, interact via a real-time chat system, and manage their profiles in a visually rich, responsive interface.

---

## ✨ Features

* 🔐 JWT Authentication with session persistence (HTTP-only cookies)
* 🎨 Explore and upload digital artworks
* 📬 Real-time chat using Socket.IO
* 🔔 Notification system
* 🧩 Modular, reusable component system via Radix UI & Tailwind
* 📦 Backend APIs using Express and tRPC
* 🧠 State management with Zustand
* 🧵 Server-side data validation using Zod
* ☁️ Cloudinary integration for media handling
* 📊 Interactive charts via Recharts

---

## 🧱 Tech Stack

* **Frontend**: Next.js (App Router), Tailwind CSS, Radix UI, React Hook Form
* **Backend**: Express, tRPC, Socket.IO
* **Database**: MongoDB + Mongoose
* **Server Communication**: Redis
* **Storage**: Cloudinary
* **State**: Zustand, React Query

---

## 📁 Project Structure (simplified)

```
pratheep-srikones-showcasea/
├── app/                # Next.js App Router pages and routes
├── components/         # UI and modal components (Radix-based)
├── db/                 # MongoDB models and mongoose setup
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and server-side helpers
├── public/             # Static assets
├── server/             # Express backend and Socket.IO integration
├── store/              # Zustand stores
├── styles/             # Global styles
├── types/              # Shared TypeScript types
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/pratheep-srikones-showcasea.git
cd pratheep-srikones-showcasea
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set environment variables

Create a `.env` file in the root with the following:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
REDIS_URL=redis://localhost:6379
```

### 4. Start development

```bash
npm run dev
```

This will concurrently start the Next.js frontend and the backend with Socket.IO.

---

## 🗃️ Redis Setup (Local)

To use Redis for pub/sub and caching:

1. **Install Redis** (if not already installed)

   * macOS (with Homebrew): `brew install redis`
   * Ubuntu: `sudo apt install redis`
   * Windows: Use [Memurai](https://www.memurai.com/) or WSL Redis

2. **Start Redis server**

```bash
redis-server
```

3. Confirm it's working:

```bash
redis-cli ping
# Should return: PONG
```

Your Redis URL will be `redis://localhost:6379` by default.

---

## 📦 Scripts

| Script           | Description                      |
| ---------------- | -------------------------------- |
| `npm run dev`    | Run both client & socket backend |
| `npm run client` | Run only Next.js frontend        |
| `npm run socket` | Run only Socket.IO backend       |
| `npm run build`  | Build production app             |
| `npm start`      | Start the production build       |

---

## 📜 License

MIT © 2025 Pratheep Srikone

---

## 🙌 Acknowledgements

* [Next.js](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Radix UI](https://www.radix-ui.com/)
* [tRPC](https://trpc.io/)
* [Socket.IO](https://socket.io/)
* [MongoDB](https://www.mongodb.com/)
* [Redis](https://redis.io/)
* [Cloudinary](https://cloudinary.com/)
