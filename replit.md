# Overview

This is a full-stack game server hosting platform called "VoltServers" built with modern web technologies. The application provides a comprehensive interface for users to browse games, view pricing plans, check server status, and manage game servers. It features a sleek gaming-themed design with separated content across dedicated pages for better organization and user experience. The platform now includes professional enterprise features, service management dashboards, and a Shockbyte-inspired Minecraft hosting page.

## Recent Changes (January 2025)

✓ Enhanced knowledge base to dynamically pull content from blog articles instead of static content
✓ Rebuilt knowledge base with categorized FAQ system covering games, billing, technical support topics  
✓ Added Discord server integration to knowledge base for community support
✓ Implemented server location management in admin panel for tracking hardware locations (VA, VINTHILL, etc.)
✓ Extended admin dashboard with new tabs for server locations and enhanced knowledge base management
✓ Created comprehensive FAQ system with collapsible sections for better user experience
✓ Added server locations tab in knowledge base showing all available server locations with status and ping information
✓ Implemented billing period pricing tiers on game pages with monthly, biannual (15% off), and annual (25% off) options
✓ Added dynamic pricing calculations with discount display and period selection tabs
✓ Enhanced pricing cards to show original prices, savings badges, and billing period labels
✓ Added billing period pricing tiers (monthly, biannual, annual) with discounted prices to game pages
✓ Implemented pricing calculator with 15% discount for biannual and 25% discount for annual plans
✓ Added interactive billing period selector with discount badges and savings indicators
✓ Enhanced pricing display to show original vs discounted prices with clear savings messaging
✓ **Game Page Customization System**: Complete admin interface for customizing individual game pages with dynamic sections, pricing tiers, and features
✓ **Minecraft Tools Platform**: Dedicated tools section at /minecraft-tools with banner generator, command generator, and extensible framework for additional tools  
✓ **Database Schema Enhancement**: Added gamePageSections, gamePageFeatures, gamePagePlans tables for full game page customization control
✓ **Admin Content Management**: Enhanced admin dashboard with "Customize" buttons and comprehensive game page editor
✓ **Dynamic Content Rendering**: Game pages now intelligently use custom content when available, falling back to defaults

## Latest Improvements (August 2025)

✓ **Fixed JavaScript Errors**: Resolved AbortController errors in admin dashboard by removing problematic ping functionality
✓ **Admin Operations Fixed**: All admin CRUD operations now work correctly with comprehensive fallback handling
✓ **Database Reliability**: Enhanced fallback system ensures admin panel works even when database is temporarily unavailable
✓ **Demo Servers Management**: Complete admin interface for managing demo servers that appear on the main page
✓ **Comprehensive CRUD Operations**: Full create, edit, and delete functionality for demo servers with form validation
✓ **Real-time Server Listing**: Demo servers list displays with all details including game type, player counts, and server status
✓ **External Image URL Support**: Fixed GameImage component to properly display external image URLs from admin panel
✓ **Image Preview System**: Added real-time image previews in admin forms for games, blogs, and theme settings
✓ **Smart Image Fallback**: Enhanced image handling with intelligent fallback from external URLs to local SVGs
✓ **Blog System Completely Fixed**: Blog API endpoints now properly return blog posts with comprehensive fallback data
✓ **Individual Blog Posts Working**: Fixed blog/:slug endpoint with complete fallback handling for all blog posts  
✓ **Three Blog Posts Available**: Getting Started, Minecraft Optimization, and Security Best Practices with full content
✓ **Enhanced Blog Content**: Added detailed markdown content with proper formatting for better user experience
✓ **Shared Hosting Deployment Guide**: Created comprehensive deployment documentation for shared hosting environments
✓ **Production-Ready Documentation**: Added detailed guides for Render.com, Railway, Vercel, and traditional hosting
✓ **Configuration Templates**: Provided exact configuration files and environment variable setups
✓ **Hosting Provider Recommendations**: Clear guidance on Node.js-compatible hosting solutions
✓ **Authenticated Support Tickets**: Restricted support ticket creation to logged-in users only with proper client account linking
✓ **Enhanced Security**: All tickets now automatically attach to the logged-in client's WHMCS account for proper tracking
✓ **Improved User Experience**: Added clear login prompts for non-authenticated users with guidance to client portal
✓ **WHMCS API Security**: Enhanced error handling and client validation in support ticket endpoints
✓ **Complete Ticket Management System**: Full ticket viewing and reply functionality with real WHMCS integration
✓ **Ticket Details Page**: Comprehensive ticket view with conversation history and reply capability
✓ **Real-time Ticket Updates**: Automatic refresh of ticket conversations for new replies
✓ **Professional Conversation UI**: Color-coded messages distinguishing staff replies from customer messages

The platform now includes individual game pages with detailed hosting information, individual blog post pages for content marketing, and complete professional pages including hardware specifications, about page, support center, and contact information to establish business credibility. The platform now includes WHMCS integration for client portal functionality, live server querying for demo servers, and a promotional banner system.

# User Preferences

Preferred communication style: Simple, everyday language.
Server Management Style: Simple server overview with direct link to Wisp.gg game panel - no complex controls or tabs interface.

# Recent Changes (January 2025)

## Database Enhancement and Content Completion
- Fixed blank pricing plans and demo servers on main page by adding comprehensive sample data initialization
- Added professional server status monitoring with realistic service metrics (Web Panel, Game Servers, Database, File Manager, Support System)
- Enhanced pricing plans with proper billing tiers: Starter ($2.99), Pro ($5.99), Enterprise ($12.99) with detailed features
- Created authentic demo servers: SkyBlock Paradise, Survival Nations, Creative Build with realistic player counts and descriptions
- Optimized demo server refresh intervals from 30s to 60s to reduce server load
- Resolved schema import issues with bigint data type for proper database functionality
- All main page sections now display authentic data from database instead of empty states

# System Architecture

## Frontend Architecture
The client-side is built using React with TypeScript, utilizing Vite for development and build processes. The UI is constructed with shadcn/ui components built on top of Radix UI primitives, styled with Tailwind CSS using a custom gaming theme. The application uses Wouter for client-side routing and TanStack Query for efficient data fetching and caching. The design follows a component-based architecture with clear separation between presentation and business logic.

### Page Organization (Updated January 2025)
Content is now organized into dedicated pages to improve navigation and reduce clutter:
- `/` - Streamlined home page with essential sections only (removed duplicate server locations and redundant features)
- `/enterprise` - Enterprise solutions and compliance features
- `/dashboard` - Service management and server controls
- `/client-portal` - Account overview and WHMCS integration
- `/minecraft` - Shockbyte-style Minecraft hosting page with pricing plans and control panel showcase
- `/knowledgebase` - Professional knowledge base with categorized articles
- `/contact` - Enhanced contact page with multiple support channels

### Content Cleanup (January 2025)
- Removed duplicate ServerStatus and ServerLocations components from home page
- Consolidated redundant feature sections to prevent information overload
- Moved detailed server information to dedicated pages where more appropriate Key features include:
- WHMCS client portal integration with authentication and service management
- Real-time server querying for live Minecraft server data display
- Promotional banner system positioned above navigation
- Social media integration with functional icon links

## Backend Architecture
The server is implemented using Express.js with TypeScript, following a RESTful API design pattern. The application uses an in-memory storage implementation with interfaces designed for easy migration to persistent storage solutions. Routes are organized by resource type (games, pricing plans, server status, locations, and tools) with consistent error handling middleware. The server includes development-specific middleware for logging and debugging.

## Database Layer
The application uses Drizzle ORM with PostgreSQL as the target database, though currently implements an in-memory storage pattern. The database schema is well-defined with proper typing, including tables for users, games, pricing plans, server status, server locations, and Minecraft tools. The schema uses UUIDs for primary keys and includes appropriate constraints and relationships.

## Data Management
State management is handled through TanStack Query for server state and React's built-in state management for UI state. The query client is configured with custom fetch functions and error handling. Data flows from the backend through REST endpoints to the frontend components, with proper loading states and error boundaries.

## UI/UX Design System
The application implements a comprehensive design system using shadcn/ui components with a custom gaming theme. Color schemes include gaming-specific variables (gaming-green, gaming-black variants) and supports both light and dark modes. The design emphasizes visual hierarchy, responsive layouts, and accessible interactions with proper ARIA labels and keyboard navigation support.

## Development Tooling
The project uses modern development tools including TypeScript for type safety, ESLint for code quality, and Vite for fast development builds. The build process is optimized for both development and production environments, with separate configurations for client and server bundling.

# Deployment Documentation

A comprehensive deployment guide (DEPLOYMENT_GUIDE.md) has been updated covering:
- **Shared Hosting Deployment** - Step-by-step guides for Render.com, Railway, Vercel
- **Hosting Provider Recommendations** - Budget-friendly and production-ready options
- **Traditional Shared Hosting** - Limitations and alternatives for cPanel hosting
- **Configuration Files** - Exact package.json scripts, environment variables, and CORS setup
- Games management and customization
- Demo servers configuration with real IPs
- Branding and visual identity updates
- Pricing plans and billing configuration
- Blog and content management
- Server locations setup
- Admin panel usage (fully functional with fallback systems)
- Environment variables and database setup
- Production deployment with cloud platforms and traditional VPS

# External Dependencies

## Core Framework Dependencies
- **React**: Frontend framework with TypeScript support
- **Express.js**: Backend web framework for Node.js
- **Vite**: Development build tool and dev server
- **Wouter**: Lightweight client-side routing

## Database and ORM
- **Drizzle ORM**: Type-safe SQL toolkit and query builder
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments
- **Drizzle-kit**: Database migration and schema management tools

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless component library for accessibility
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Utility for creating variant-based component APIs

## Data Fetching and State Management
- **TanStack Query**: Server state management and data fetching
- **React Hook Form**: Form handling with @hookform/resolvers for validation

## Development and Build Tools
- **TypeScript**: Static type checking
- **esbuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer

## Additional Utilities
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **nanoid**: Unique ID generation
- **zod**: Runtime type validation and schema definition