# Overview

This is a full-stack game server hosting platform called "GameHost Pro" built with modern web technologies. The application provides a comprehensive interface for users to browse games, view pricing plans, check server status, and access Minecraft-specific tools. It features a sleek gaming-themed design with a focus on performance and user experience.

The platform now includes individual game pages with detailed hosting information, individual blog post pages for content marketing, and complete professional pages including hardware specifications, about page, support center, and contact information to establish business credibility. The platform now includes WHMCS integration for client portal functionality, live server querying for demo servers, and a promotional banner system.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built using React with TypeScript, utilizing Vite for development and build processes. The UI is constructed with shadcn/ui components built on top of Radix UI primitives, styled with Tailwind CSS using a custom gaming theme. The application uses Wouter for client-side routing and TanStack Query for efficient data fetching and caching. The design follows a component-based architecture with clear separation between presentation and business logic. Key features include:
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