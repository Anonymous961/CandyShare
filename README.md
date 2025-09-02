

# 🍬 CandyShare

A simple **file-sharing platform** that lets you upload files and generate temporary links for sharing. Built with **Express (Bun runtime)**, **Prisma (PostgreSQL)**, and **AWS S3** for object storage.

---

## ✨ Features

* 📂 Upload files via presigned S3 URLs
* 🔗 Generate temporary shareable links
* 🗑️ Automatic file expiry
* 🛡️ Secure storage using AWS S3
* 🐳 Dockerized for easy deployment

---

## 🛠 Tech Stack

* **Backend:** Express + Bun
* **Database:** PostgreSQL + Prisma ORM
* **Storage:** AWS S3
* **Containerization:** Docker
* **CI/CD:** GitHub Actions → Docker Hub → EC2

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/candyshare.git
cd candyshare
```

### 2. Backend Setup

```bash
cd backend
bun install
```

Set up your environment variables in `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
S3_BUCKET_NAME=your_bucket
```

Run migrations and generate the Prisma client:

```bash
bun run db:generate
```

Start the dev server:

```bash
bun index.ts
```

The backend runs at `http://localhost:4000`.

---

## 🐳 Docker

### Build the Docker image

```bash
docker build -t candyshare -f docker/Dockerfile.server .
```

### Run the container

```bash
docker run -d -p 4000:4000 \
  --name candy-share \
  -e DATABASE_URL="postgresql://postgres:password@db:5432/postgres" \
  -e AWS_ACCESS_KEY_ID=your_key \
  -e AWS_SECRET_ACCESS_KEY=your_secret \
  -e S3_BUCKET_NAME=your_bucket \
  candyshare:latest
```

---

## 🚀 Deployment (CI/CD)

* On **push to `main`**, GitHub Actions:

  1. Builds the Docker image
  2. Pushes it to Docker Hub
  3. SSHs into your EC2 instance
  4. Pulls the new image & restarts the container

---

## 📂 Repository Structure

```
.
├── backend/           # Express + Bun + Prisma backend
├── frontend/          # (coming soon) React frontend
├── docker/            
│   └── Dockerfile.server
└── .github/workflows/ # CI/CD pipeline
```

---

## 📝 TODO

* [ ] Add file expiry/cleanup cron
* [ ] Frontend file upload UI
* [ ] User authentication (optional)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you’d like to change.

---

## 📜 License

MIT
