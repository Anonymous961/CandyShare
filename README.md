# CandyShare

A modern file-sharing platform that lets you upload files and generate secure temporary links for sharing. Perfect for quickly sharing files with advanced features and multiple tier options.

## What it does

CandyShare allows you to:

- **Upload files** with drag-and-drop interface
- **Generate secure links** that expire automatically
- **Share files instantly** with anyone via a simple URL or QR code
- **Protect sensitive files** with optional password protection
- **Track downloads** and access patterns with detailed analytics
- **Choose your tier** - Anonymous, Free, or Pro sharing options
- **Manage files** with a comprehensive dashboard

## Use Cases

### Personal Use

- Share photos and videos with family and friends
- Send large documents that won't fit in email
- Temporary file storage for personal projects
- Quick file transfers between devices

### Business Use

- Share project files with clients
- Distribute documents to team members
- Send large presentations or reports
- Temporary file hosting for meetings

### Developer Use

- Share code files and assets
- Distribute software builds
- Host temporary documentation
- Share log files for debugging

## Features

- **Instant Upload**: Drag and drop or click to upload files
- **Secure Links**: Files are accessible only via generated links
- **Auto Expiry**: Files automatically expire for security
- **Password Protection**: Add passwords to sensitive files
- **QR Code Sharing**: Generate QR codes for easy mobile sharing
- **Download Tracking**: See how many times files are downloaded
- **Analytics Dashboard**: Detailed insights into file usage and activity
- **User Authentication**: Secure account management with NextAuth
- **Payment Integration**: Pro tier subscription with Razorpay
- **File Management**: Organize and manage your shared files
- **Multiple Tiers**: Anonymous, Free, and Pro sharing options

## Quick Start

1. **Upload a file** by dragging it to the upload area
2. **Get your share link** instantly
3. **Share the link** with anyone who needs the file
4. **Files expire automatically** based on your tier

## Tiers

### Anonymous

- No registration required
- Files expire in 24 hours
- Up to 10MB file size
- Basic sharing features

### Free

- Account required
- Files expire in 7 days
- Up to 200MB file size
- Password protection available
- Basic analytics

### Pro ($8.99/month)

- Full features
- Files expire in 30 days
- Up to 2GB file size
- Advanced analytics and insights
- Priority support
- Custom branding options

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- AWS S3 bucket
- Razorpay account (for payments)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/candyshare.git
cd candyshare
```

2. Install backend dependencies

```bash
cd backend
bun install
```

3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

4. Set up environment variables

**Backend (.env):**
```bash
cp .env.example .env
# Edit .env with your database, AWS, and Razorpay credentials
```

**Frontend (.env.local):**
```bash
cp .env.example .env.local
# Edit .env.local with your API endpoints
```

5. Run database migrations

```bash
cd backend
bun run db:generate
bun run db:migrate
```

6. Start the development servers

**Backend:**
```bash
cd backend
bun run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`.

## Docker Deployment

Build and run with Docker:

```bash
docker build -f docker/Dockerfile.server -t candyshare .
docker run -p 4000:4000 candyshare
```

## Project Structure

```
CandyShare/
├── backend/           # Bun + Prisma API server
├── frontend/          # Next.js React application
├── docker/            # Docker configuration
└── README.md
```

## Legal Pages

- [Privacy Policy](/privacy-policy)
- [Terms & Conditions](/terms-conditions)
- [Pricing Policy](/pricing-policy)
- [Refund Policy](/refund-policy)
- [Shipping Policy](/shipping-policy)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.
