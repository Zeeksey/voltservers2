# Overview

VoltServers is a full-stack game server hosting platform providing a comprehensive interface for users to browse games, view pricing, check server status, and manage game servers. The platform features a gaming-themed design with dedicated pages for organization and user experience. It includes professional enterprise features, service management dashboards, a Shockbyte-inspired Minecraft hosting page, and robust integration with WHMCS for client portal functionality, support tickets, account management, and dynamic product pricing. Key capabilities include individual game pages with detailed hosting information, individual blog posts, hardware specifications, an about page, support center, and contact information.

## Recent Changes (August 2025)
- Successfully integrated WHMCS API with IP whitelisting (104.196.223.28)
- Fixed games flashing issue with improved React Query caching
- Configured Vercel deployment with optimized build process
- Added comprehensive environment variable configuration
- Implemented VS Code Git integration for GitHub uploads
- **Major Admin Panel Enhancement (Latest)**: Expanded game customization with 8 comprehensive component types (Hero, Features, Pricing, Gallery, Testimonials, FAQ, CTA, Server Specs), full content and style editing capabilities, tabbed interface for better UX, and enhanced save/update functionality with proper cache invalidation

# User Preferences

Preferred communication style: Simple, everyday language.
Server Management Style: Simple server overview with direct link to Wisp.gg game panel - no complex controls or tabs interface.
Deployment Platform: Vercel (switched from Render for better build support)
Development Environment: Windows with VS Code and GitHub integration

# System Architecture

## Frontend Architecture
The client-side is built with React and TypeScript, using Vite for development and build. UI components are from shadcn/ui (built on Radix UI primitives) and styled with Tailwind CSS, following a custom gaming theme. Wouter is used for client-side routing, and TanStack Query for data fetching and caching. The design follows a component-based architecture. Content is organized into dedicated pages like `/enterprise`, `/dashboard`, `/client-portal`, `/minecraft`, `/knowledgebase`, and `/contact` to improve navigation.

## Backend Architecture
The server is implemented using Express.js with TypeScript, following a RESTful API design pattern. It uses an in-memory storage implementation with interfaces designed for easy migration to persistent storage. Routes are organized by resource type with consistent error handling.

## Database Layer
The application uses Drizzle ORM with PostgreSQL as the target database, currently implementing an in-memory storage pattern. The schema is well-defined with proper typing, including tables for users, games, pricing plans, server status, server locations, Minecraft tools, game page sections, features, and plans.

## Data Management
State management uses TanStack Query for server state and React's built-in state for UI state. Data flows from backend REST endpoints to frontend components, with proper loading states and error boundaries.

## UI/UX Design System
A comprehensive design system uses shadcn/ui components with a custom gaming theme. Color schemes include gaming-specific variables and support light/dark modes. The design emphasizes visual hierarchy, responsive layouts, and accessible interactions.

## Development Tooling
The project uses TypeScript for type safety, ESLint for code quality, and Vite for fast development builds.

# External Dependencies

## Core Framework Dependencies
- **React**: Frontend framework
- **Express.js**: Backend web framework
- **Vite**: Development build tool
- **Wouter**: Client-side routing

## Database and ORM
- **Drizzle ORM**: Type-safe SQL toolkit
- **@neondatabase/serverless**: PostgreSQL driver
- **Drizzle-kit**: Database migration tools

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless component library
- **shadcn/ui**: Component library based on Radix UI
- **Lucide React**: Icon library
- **class-variance-authority**: Utility for variant-based components

## Data Fetching and State Management
- **TanStack Query**: Server state management
- **React Hook Form**: Form handling with validation

## Development and Build Tools
- **TypeScript**: Static type checking
- **esbuild**: JavaScript bundler
- **PostCSS**: CSS processing

## Additional Utilities
- **date-fns**: Date manipulation
- **clsx**: Conditional className utility
- **nanoid**: Unique ID generation
- **zod**: Runtime type validation