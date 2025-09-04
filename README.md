# CandyShare

A simple file-sharing platform that lets you upload files and generate secure temporary links for sharing. Perfect for quickly sharing files without the need for accounts or complex setup.

## What it does

CandyShare allows you to:

- **Upload files** of any type and size
- **Generate secure links** that expire automatically
- **Share files instantly** with anyone via a simple URL
- **Protect sensitive files** with optional password protection
- **Track downloads** and access patterns
- **No registration required** - start sharing immediately

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
- Up to 100MB file size
- Password protection available

### Pro

- Full features
- Files expire in 30 days
- Up to 1GB file size
- Advanced analytics and customization

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- AWS S3 bucket

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/candyshare.git
cd candyshare
```

2. Install dependencies

```bash
cd backend
bun install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your database and AWS credentials
```

4. Run database migrations

```bash
bun run db:generate
```

5. Start the development server

```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

## Docker Deployment

Build and run with Docker:

```bash
docker build -t candyshare .
docker run -p 3000:3000 candyshare
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.
