# Pratheep Srikone's Showcase

A full-stack portfolio and social artwork-sharing platform built with Next.js (App Router), TRPC, MongoDB, TailwindCSS, and Cloudinary.

---

## 🌟 Features

* 🎨 Upload, edit, and explore user-generated artwork
* 👤 Authentication & session handling with JWT (stored in HTTP-only cookies)
* 🖼️ Profile pages and follow functionality
* 🔔 Real-time notifications for likes, follows, and comments
* 💬 Comment and like artworks
* 🧠 Responsive UI with reusable components and skeleton loading states
* 📊 Dashboard with analytics and management tools

---

## 🧾 Tech Stack

### Frontend

* **Next.js App Router**
* **Tailwind CSS**
* **Shadcn UI**
* **TRPC** for frontend-backend type-safe API
* **Zustand** for local state management

### Backend

* **Node.js** (via Next.js Server Actions and Express APIs)
* **TRPC** server handlers
* **MongoDB** via Mongoose
* **Cloudinary** for image uploads

---

## 📁 Project Structure

```
pratheep-srikones-showcasea/
├── app/               # Next.js app directory structure (App Router)
│   ├── [routes]/      # Each route is a folder with page.tsx
│   └── api/trpc/      # TRPC handler (route.ts)
├── components/        # Reusable UI components & modals
├── db/                # Mongoose models & connection
├── hooks/             # Custom React hooks
├── lib/               # Utilities (JWT, cloudinary, helper functions)
├── public/            # Static assets
├── server/            # Express server with controllers & routers
├── store/             # Zustand stores
├── styles/            # Global styles
├── types/             # Shared TypeScript types
```

---

## 🛠️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/pratheep-srikones-showcasea.git
cd pratheep-srikones-showcasea
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root:

```env
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Build

```bash
pnpm build
```

---

## 📌 Scripts

```bash
pnpm dev        # Start dev server
pnpm build      # Build for production
pnpm lint       # Run linter
```

---

## 📣 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

---

## 📝 License

[MIT](LICENSE)

---

## 🙏 Acknowledgements

* [shadcn/ui](https://ui.shadcn.com/)
* [Next.js](https://nextjs.org/)
* [Cloudinary](https://cloudinary.com/)
* [MongoDB](https://mongodb.com/)
* [TRPC](https://trpc.io/)

---

## 📧 Contact

Built by [Pratheep Srikone](mailto:your-email@example.com)
