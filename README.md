# Dungeon Keeper 3D Game

## Overview

This is a 3D dungeon crawler game built with React Three Fiber for the frontend and Express.js for the backend. The game features procedurally generated dungeons, combat mechanics, inventory management, crafting systems, and a persistent sanctum that serves as the player's home base.

## User Preferences

```
Preferred communication style: Simple, everyday language.
UI/UX preferences: Modern, beautiful interfaces with glassmorphism effects, gradients, and smooth animations.
```

## System Architecture

### Frontend Architecture
- **React Three Fiber**: Main 3D rendering engine using WebGL
- **React with TypeScript**: Component-based UI framework
- **Zustand**: State management for game state, inventory, audio, and sanctum
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Headless component library for accessible UI components
- **Vite**: Build tool and development server

### Backend Architecture
- **Express.js**: Web application framework
- **TypeScript**: Type-safe JavaScript
- **Memory Storage**: In-memory data storage with interface for future database migration
- **RESTful API**: JSON-based API endpoints (currently minimal)

### Key Components

1. **Game Engine**
   - 3D scene management with React Three Fiber
   - Real-time game loop with useFrame hooks
   - Keyboard controls using @react-three/drei
   - Physics and collision detection

2. **Dungeon Generation**
   - Procedural dungeon generation algorithm
   - Room-based layout with corridors
   - Progressive difficulty scaling

3. **Combat System**
   - Turn-based combat mechanics
   - Damage calculation with critical hits
   - Monster AI with pathfinding

4. **Inventory & Crafting**
   - Item management system
   - Recipe-based crafting mechanics
   - Equipment and consumables

5. **Sanctum System**
   - Persistent player base
   - Room upgrades using collected materials
   - Permanent progression mechanics

## Data Flow

### Game State Management
- **useGameState**: Core game logic, player stats, dungeon state
- **useInventory**: Item management and crafting interface
- **useAudio**: Sound effects and music control
- **useSanctum**: Persistent progression and room upgrades

### Rendering Pipeline
1. Vite serves the React application
2. React Three Fiber creates WebGL context
3. Game components render 3D objects and UI overlays
4. Zustand stores manage component state
5. User interactions trigger state updates

### Asset Loading
- Textures and 3D models loaded via useTexture and useLoader
- GLSL shader support for custom visual effects
- Audio files loaded as HTML audio elements

## External Dependencies

### Core Libraries
- **@react-three/fiber**: 3D rendering engine
- **@react-three/drei**: Helper utilities for Three.js
- **@react-three/postprocessing**: Visual effects pipeline
- **@radix-ui/react-**: Accessible UI components
- **@tanstack/react-query**: Data fetching and caching
- **zustand**: State management
- **clsx & tailwind-merge**: CSS utility management

### Development Tools
- **Drizzle ORM**: Database toolkit (configured for PostgreSQL)
- **Vite**: Build tool with React plugin
- **TypeScript**: Type checking
- **ESLint & Prettier**: Code quality tools

### Database Integration
- **@neondatabase/serverless**: PostgreSQL database driver
- **Drizzle**: Type-safe database queries
- **connect-pg-simple**: Session storage (prepared for future use)

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: `npm run dev` starts both frontend and backend
- **Production**: `npm run build` followed by `npm start`
- **Database**: Requires `DATABASE_URL` environment variable

### Key Build Features
- Hot Module Replacement (HMR) in development
- Asset optimization and bundling
- TypeScript compilation
- GLSL shader compilation
- Audio file handling

### Production Considerations
- Express serves both API routes and static files
- Database connection pooling ready
- Error handling middleware implemented
- CORS and security headers (to be configured)
