# Game of Doom Truth or Dare

## Overview

A multiplayer party game application built with React and Express that allows players to join game rooms and play truth or dare with varying difficulty levels. The application features a dark, neon-themed party aesthetic inspired by nightclub environments. Players can create or join game rooms, select game modes (friends/crush/spouse) and difficulty levels (easy/medium/extreme), and participate in real-time interactive gameplay with AI-generated prompts and scoring systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui component system
- **Styling**: Tailwind CSS with custom dark party theme featuring neon colors (electric purple, hot pink, cyan)
- **State Management**: React Query for server state, local React state for UI interactions
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: Socket.io client for live multiplayer features

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Real-time Features**: Socket.io server for multiplayer game rooms and live updates
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful endpoints for game/player CRUD operations with Socket.io for real-time events

### Database Schema
- **Users**: Basic authentication with username/password
- **Games**: Room-based games with modes (friends/crush/spouse), difficulty levels, and status tracking
- **Players**: Game participants with scores, host status, and online presence
- **GamePrompts**: Truth/dare prompts with completion tracking and difficulty categorization

### Game Logic
- **Room System**: UUID-based room codes for joining games
- **Turn Management**: Sequential turn-based gameplay with current player tracking
- **Scoring System**: Points awarded for completing prompts, deducted for skipping
- **Prompt Generation**: AI-powered prompt creation using Google Gemini API with fallback prompts

### Design System
- **Theme**: Dark party aesthetic with neon color palette
- **Typography**: Inter font family for clean readability
- **Layout**: Responsive design with mobile-first approach
- **Components**: Modular component library with consistent spacing and interactive states

## External Dependencies

### Third-Party Services
- **Google Gemini AI**: AI prompt generation for truth/dare questions based on game mode and difficulty
- **Neon Database**: PostgreSQL hosting service for production database

### Key Libraries
- **UI/Styling**: Radix UI primitives, Tailwind CSS, class-variance-authority for component variants
- **Data/API**: React Query for server state, Drizzle ORM for database operations, Zod for schema validation
- **Real-time**: Socket.io for multiplayer communication
- **Build Tools**: Vite for development/build, TypeScript for type safety, ESBuild for server bundling

### Development Tools
- **Database Migration**: Drizzle Kit for schema management
- **Code Quality**: TypeScript strict mode, ESLint configuration
- **Development**: Hot module replacement via Vite, runtime error overlay for debugging