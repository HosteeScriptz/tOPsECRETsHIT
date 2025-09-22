# Game of Doom Truth or Dare Design Guidelines

## Design Approach
**Dark Party Theme**: Drawing inspiration from nightclub aesthetics, dark gaming interfaces, and premium party experiences. Think sleek, mysterious, and exciting with dramatic lighting effects and neon accents that create an immersive party atmosphere.

## Core Design Elements

### A. Color Palette
**Dark Party Theme:**
- Primary: Electric purple (280 100% 70%) with neon glow effects
- Secondary: Hot pink (320 100% 60%) for danger/extreme accents
- Accent: Cyan blue (180 100% 50%) for highlights and success
- Background: Deep black (0 0% 5%) with subtle gradient overlays
- Card backgrounds: Dark gray (220 15% 8%) with subtle borders
- Text: High contrast whites and neon colors for readability

**Neon Colors:**
- Electric Purple: (280 100% 70%)
- Hot Pink: (320 100% 60%) 
- Cyan: (180 100% 50%)
- Lime Green: (90 100% 50%) for success
- Warning Orange: (30 100% 60%)
- Danger Red: (0 100% 60%)

### B. Typography
**Font Stack**: Inter from Google Fonts for clean readability
- Headers: Bold weights (700-800) for game titles and modes
- Body: Regular (400) and medium (500) for game content
- UI Elements: Medium (500) for buttons and navigation
- Game prompts: Large, readable sizes (18-24px) for group visibility

### C. Layout System
**Spacing**: Tailwind units of 2, 4, 6, 8, and 12 for consistent rhythm
- Tight spacing (p-2, m-2) for compact UI elements
- Medium spacing (p-4, m-4) for card content and buttons
- Generous spacing (p-8, m-8) for section separation
- Extra spacing (p-12) for hero sections and major layouts

### D. Component Library

**Core Components:**
- **Game Mode Cards**: Large, colorful cards with gradients for Friends/Crush/Spouse selection
- **Difficulty Badges**: Color-coded pills (green/orange/red) with clear labeling
- **Player Cards**: Rounded avatars with names and live point tracking
- **Prompt Display**: Central, large text area for truth/dare questions
- **Action Buttons**: Bold, rounded buttons for "Complete" and "Skip" actions
- **Join Code Input**: Large, prominent code entry with visual feedback
- **Room Status**: Live player list with turn indicators

**Navigation:**
- Clean header with game logo and room code display
- Minimal navigation focused on game flow
- Clear back/exit buttons for easy navigation

**Forms:**
- Simple, large input fields for names and room codes
- Prominent submit buttons with loading states
- Clear validation messaging

**Data Displays:**
- Real-time scoreboard with animated point changes
- Turn indicator with highlighting for active player
- Game statistics and progress tracking

**Overlays:**
- Age verification modal for Medium/Extreme modes
- Game completion celebration overlay
- Settings and rules modals

### E. Visual Treatment

**Gradients**: Subtle purple-to-pink gradients on primary cards and hero sections
**Background**: Clean, minimal backgrounds with optional subtle patterns
**Cards**: Elevated cards with soft shadows and rounded corners (rounded-xl)
**Buttons**: Bold, pill-shaped buttons with clear hierarchy
**Icons**: Playful icons from Heroicons for game actions and navigation

### F. Responsive Design
- Mobile-first approach for group gaming scenarios
- Large touch targets for easy group interaction
- Clear typography visible from multiple viewing angles
- Optimized layouts for both phone and tablet group play

### G. Animations & Effects
**Party Atmosphere Animations:**
- Neon glow effects on hover with pulsing animations
- Smooth slide transitions between pages/sections
- Card animations with 3D transforms and shadow effects
- Floating particle effects in backgrounds
- Score change animations with neon burst effects
- Loading animations with pulsing neon rings
- Button press animations with ripple effects
- Gradient animations on backgrounds
- Text reveal animations with neon typewriter effects

## Images
No hero images required. Focus on clean typography and colorful UI elements. Use emoji or simple icons to represent different game modes and difficulty levels rather than complex imagery.

This playful yet clean design approach will create an engaging party game atmosphere while maintaining usability across different group sizes and social contexts.