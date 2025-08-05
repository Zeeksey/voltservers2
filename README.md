# Game Hosting Platform

A modern, responsive game server hosting platform built with React, Express.js, and PostgreSQL. Features instant deployment, performance optimization, and comprehensive management tools for multiplayer game servers.

## 🚀 Quick Start

### For Development (Replit)
1. Click "Run" to start the development server
2. Access admin panel at `/admin-login` (admin/admin123)
3. Customize games, pricing, and branding via admin interface

### For Production Deployment
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

**⚠️ Important for Shared Hosting:**
Most traditional shared hosting (cPanel, GoDaddy, Bluehost) does NOT support Node.js applications. 

**Recommended hosting providers:**
- **Render.com** (Free tier available)
- **Railway.app** (Simple deployment)
- **DigitalOcean App Platform** ($5/month)
- **Vercel** (Free tier with serverless)

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Express.js, Node.js
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Passport.js with local strategy
- **UI Components:** Radix UI + shadcn/ui
- **Deployment:** Ready for cloud platforms

## ✨ Features

### Core Features
- **Game Server Management** - Support for Minecraft, Rust, CS2, Palworld, and more
- **Real-time Server Monitoring** - Live server status and player counts
- **Dynamic Pricing Plans** - Flexible pricing tiers per game
- **Admin Dashboard** - Complete control panel for management
- **Responsive Design** - Mobile-first, works on all devices

### Admin Features
- Game management (add/edit/delete games)
- Pricing plan configuration
- Blog post management
- Server location management
- Theme customization
- Promotional banner settings
- User-friendly admin interface

### Technical Features
- **Database Fallback System** - Graceful handling of database outages
- **Error Recovery** - Comprehensive error handling
- **Performance Optimized** - Fast loading and responsive UI
- **SEO Ready** - Proper meta tags and structured data
- **Security First** - Secure authentication and data handling

## 🎮 Supported Games

- Minecraft Java Edition
- Minecraft Bedrock
- Rust
- Counter-Strike 2
- Garry's Mod
- Palworld
- ARK: Survival Evolved
- Valheim
- Satisfactory

Easy to add more games via admin panel or configuration files.

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── hooks/         # Custom React hooks
├── server/                # Express.js backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data layer
│   └── db.ts             # Database connection
├── shared/                # Shared types and schemas
└── DEPLOYMENT_GUIDE.md   # Detailed deployment instructions
```

## 🔧 Configuration

### Environment Variables
```env
DATABASE_URL=postgresql://username:password@host/database
NODE_ENV=production
PORT=5000
```

### Admin Access
- URL: `/admin-login`
- Default credentials: admin/admin123
- Change in admin panel after first login

## 📖 Customization

### Branding
- Update company name in `client/src/components/navigation.tsx`
- Modify colors in `client/src/index.css`
- Replace logo/icons as needed

### Content
- Games: Add via admin panel or `server/storage.ts`
- Pricing: Configure in admin dashboard
- Blog: Manage through admin interface
- Server locations: Update in admin panel

### Styling
- Built with Tailwind CSS
- Custom gaming theme with dark/light mode
- Responsive design for all screen sizes

## 🚀 Deployment Options

### Cloud Platforms (Recommended)
1. **Render.com** - Easiest for beginners
2. **Railway.app** - Developer-friendly
3. **DigitalOcean** - Production-ready
4. **Vercel** - Serverless deployment

### Traditional Hosting
- Requires Node.js support
- Not compatible with standard shared hosting
- See deployment guide for alternatives

## 🔒 Security

- Secure authentication with bcrypt password hashing
- Environment variable configuration
- SQL injection prevention with Drizzle ORM
- CORS protection
- Session management

## 📊 Performance

- Optimized React components
- Lazy loading for images
- Efficient database queries
- Caching strategies
- Production build optimization

## 🤝 Support

For deployment assistance or customization help, refer to:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Issues](https://github.com/your-repo/issues) - Bug reports and feature requests

## 📄 License

MIT License - See LICENSE file for details

---

**Ready to launch your game hosting business?** 
Follow the [deployment guide](./DEPLOYMENT_GUIDE.md) to get started!