# 🔗 RoLinks

**RoLinks** is an open-source platform for sharing and discovering Roblox private server links. Built with Next.js 15, PayloadCMS, and modern web technologies.

🌐 **Live Demo:** [https://rolinks-temp.vercel.app](https://rolinks-temp.vercel.app)

## ✨ Features

- 🎮 **Game Discovery** - Browse and search Roblox games with beautiful card layouts
- 🔗 **Server Sharing** - Submit and discover private server links
- 🔐 **Discord Authentication** - Secure OAuth login via Discord
- 📱 **Responsive Design** - Beautiful glassmorphism UI with mobile support
- ⚡ **Fast Performance** - Built with Next.js 15 and Turbopack
- 🛠️ **Admin Dashboard** - Complete CMS for managing games and servers
- 🎯 **Rate Limiting** - Built-in protection against spam
- 💾 **Caching** - Optimized data fetching and caching

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB database (local or cloud)
- Discord application (for OAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/rolinks.git
cd rolinks
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:

```env
# Payload CMS Configuration
PAYLOAD_SECRET=your-super-secret-key-here
BETTER_AUTH_SECRET=another-super-secret-key

# Database
DATABASE_URI=mongodb://localhost:27017/rolinks

# Next.js Configuration
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000

# Discord OAuth (Required)
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

### 4. Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 settings
4. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`
5. Copy Client ID and Client Secret to your `.env.local`

### 5. Database Setup

**Option A: Local MongoDB**

```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: MongoDB Atlas**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and get connection string
3. Update `DATABASE_URI` in `.env.local`

### 6. Start Development Server

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

```
rolinks/
├── app/
│   ├── (frontend)/          # User-facing pages
│   │   ├── games/           # Game listings and details
│   │   ├── settings/        # User profile management
│   │   └── api/            # API routes
│   └── (payload)/          # Admin CMS interface
├── collections/            # PayloadCMS collections
│   ├── Games.ts           # Game data models
│   ├── Servers.tsx        # Server link models
│   └── Admins.ts          # Admin users
├── components/            # React components
├── utils/                # Utility functions
└── brain/               # Design documentation
```

## 🛠️ Available Scripts

```bash
# Development
bun run dev              # Start development server with Turbopack
bun run build           # Build for production
bun start              # Start production server

# Code Quality
bun run lint           # Run ESLint

# PayloadCMS
bun run payload        # Access admin dashboard
bun run generate:types # Generate TypeScript types
bun run generate:schema # Generate auth schema
```

## 🔧 Configuration

### PayloadCMS Admin

Access the admin dashboard at `http://localhost:3000/admin` to:

- Manage games and server links
- View user data
- Configure site settings

### Authentication

The app uses Discord-only OAuth via better-auth. Users authenticate through Discord and their data is stored in PayloadCMS collections.

### Database Collections

- **Games** - Roblox game data with auto-fetched thumbnails
- **Servers** - Private server links with relationships to games/users
- **Admins** - Admin user accounts for CMS access
- **Auth Collections** - Generated collections for user sessions

## 🎨 Design System

RoLinks features a modern glassmorphism design with:

- Dark theme (`bg-gray-950`) backgrounds
- Consistent card patterns with backdrop blur
- Framer Motion animations
- TailwindCSS 4 with custom components

See `brain/design.md` for detailed design guidelines.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Update these for production deployment:

```env
DATABASE_URI=your-production-mongodb-uri
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- 🐛 **Bug Reports** - [Open an issue](https://github.com/natatoolie/rolinks/issues)
- 💬 **Discussions** - [GitHub Discussions](https://github.com/natatoolie/rolinks/discussions)

## ⭐ Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [PayloadCMS](https://payloadcms.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Made with ❤️ for the Roblox community**
