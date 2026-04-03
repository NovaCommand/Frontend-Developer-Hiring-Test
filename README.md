<<<<<<< HEAD
# Frontend-Developer-Hiring-Test
=======
# Frontend Developer Hiring Test - Dashboard Application

## Purpose of the Project

This project is a **frontend hiring test demonstrator** designed to showcase a modern React application that integrates with Microsoft Teams and M365 platforms. It demonstrates key competencies in:

- **React Architecture**: Component composition, state management, and hooks patterns
- **Design Systems**: Reusable UI components with consistent styling and accessibility
- **Microsoft Teams Integration**: Using the Teams JavaScript SDK for app context and cross-platform capabilities
- **Frontend Best Practices**: Code organization, performance, documentation, and testing readiness

The application simulates a **Task Dashboard** that displays user tasks and integrates with Microsoft Teams for notifications and context awareness.

---

## Frontend Architecture Overview

### Project Structure

```
frontend-developer-hiring-test/
├── src/
│   ├── components/              # UI components library
│   │   ├── Button.jsx          # Reusable button component
│   │   ├── Card.jsx            # Card layout component
│   │   ├── TaskList.jsx        # Task list display component
│   │   └── Header.jsx          # Application header
│   ├── hooks/                  # Custom React hooks
│   │   └── useTeamsContext.js  # Teams SDK integration hook
│   ├── services/               # Business logic & API integration
│   │   └── teamsService.js     # Teams SDK wrapper
│   ├── styles/
│   │   ├── design-tokens.css   # Color, spacing, typography tokens
│   │   └── components.css      # Component-specific styles
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── docs/                       # Additional documentation
│   ├── ARCHITECTURE.md         # Detailed architecture decisions
│   └── TEAMS_INTEGRATION.md    # Teams SDK implementation guide
├── package.json
├── vite.config.js
└── README.md
```

### Architecture Pattern: Layered Component Architecture

```
View Layer (Components)
    ↓
State Management (useTeamsContext hook)
    ↓
Business Logic Layer (services)
    ↓
External APIs (Teams SDK, M365)
```

### Key Components

| Component | Purpose | Responsibility |
|-----------|---------|-----------------|
| **App.jsx** | Root component | Initializes Teams context, renders layout |
| **Header** | Navigation header | Displays user info, navigation links |
| **TaskList** | Task display | Renders list of tasks, handles interactions |
| **Card** | Content container | Generic reusable container with consistent styling |
| **Button** | Interactive element | Accessible button with variants |

### Custom Hooks

- **`useTeamsContext`**: Provides Teams context, user info, and theme preferences
  - Returns: `{ isTeamsApp, user, theme }`

### Services Layer

- **`teamsService.js`**: Encapsulates Teams SDK interactions
  - Initializes the Teams app
  - Retrieves context (user, theme, locale)
  - Handles notifications

---

## Key Technical Decisions

### 1. **Framework & Bundler: React + Vite**
- **Why Vite**: Fast HMR (Hot Module Replacement), optimized build output, excellent developer experience
- **Why React**: Industry standard, component reusability, large ecosystem, familiar to most developers
- **Trade-off**: Not using TypeScript in this version for simplicity, but production version should include it

### 2. **No Complex State Management (Redux/Zustand)**
- **Decision**: Using React hooks (`useState`, `useContext`) for simplicity
- **Rationale**: Appropriate for demonstration-scale apps; reduces complexity for review
- **Scalability**: In production, would add Redux or Zustand for larger state trees

### 3. **Design System Approach: CSS Variables + Vanilla CSS**
- **Why**: No dependency bloat, pure CSS provides performance and clarity
- **Design Tokens**: Centralized in `design-tokens.css` (colors, spacing, typography)
- **Component Isolation**: CSS classes with BEM naming convention for clarity
- **Scalability**: Could migrate to CSS-in-JS (styled-components) or Tailwind CSS in production

### 4. **Teams Integration: Lazy Loading**
- **Decision**: Teams SDK loaded conditionally only if running in Teams context
- **Benefit**: App works standalone for development and also in Teams without errors
- **Pattern**: Service layer abstracts Teams SDK, making it optional

### 5. **Accessibility-First Components**
- Semantic HTML (`<button>`, `<nav>`, `<main>`)
- ARIA labels for complex components
- Keyboard navigation support
- Color contrast compliance (WCAG AA)

---

## Key UX Decisions

### 1. **Responsive Design**
- Mobile-first approach
- Breakpoints: 640px (tablet), 1024px (desktop)
- Flexible layouts using CSS Grid and Flexbox

### 2. **Teams Theme Awareness**
- App adapts to Teams display theme (light/dark)
- Uses Teams design tokens for consistency
- User preference detection via Teams API

### 3. **Progressive Enhancement**
- Works without Teams SDK (standalone mode)
- Graceful degradation: Teams-specific features optional
- Works in any modern browser (Chrome, Firefox, Safari, Edge)

### 4. **Performance Considerations**
- Component code-splitting ready (Vite lazy loading)
- No unnecessary re-renders (proper dependency arrays)
- CSS optimized for tree-shaking
- Assets optimized for production

---

## How to Run or Review

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation & Development

```bash
# Navigate to project directory
cd frontend-developer-hiring-test

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (or similar).

### Building for Production

```bash
# Create optimized build
npm build

# Preview production build locally
npm run preview
```

### Linting & Code Quality

```bash
# Run ESLint
npm run lint
```

---

## Application Features

### Standalone Mode
- View task dashboard
- See mock user information
- Interact with UI components
- Test responsive design

### Teams Integration Mode (when loaded in Teams)
- Detect Teams context automatically
- Display user's actual Teams profile
- Show Teams theme preference
- Send notifications to Teams

### Component Showcase
- Demonstrates Button component variants
- Card component layouts
- TaskList with interactive items
- Header with responsive menu

---

## Teams/M365 Integration Details

The app integrates with Microsoft Teams via the Teams JavaScript SDK:

### Capabilities Demonstrated

1. **Context Detection**: Detects if running in Teams
2. **User Information**: Retrieves current user's Teams profile
3. **Theme Awareness**: Adapts UI to Teams theme (light/dark)
4. **Notification Ready**: Service layer prepared for Teams notifications

### How to Deploy to Teams

1. Update `manifest.json` with app registration details
2. Create app package (`.zip` with manifest + icons)
3. Upload to Teams App Studio or admin console
4. Configure content URL to point to app domain

See [TEAMS_INTEGRATION.md](docs/TEAMS_INTEGRATION.md) for detailed instructions.

---

## Architectural Decisions Documentation

For deeper insight into architectural choices, see [ARCHITECTURE.md](docs/ARCHITECTURE.md) covering:
- Component composition strategies
- State management rationale
- Styling approach comparison
- Performance optimization techniques
- Testing strategy (testing pyramid)

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19.2.4 |
| **Bundler** | Vite 8.0 |
| **Styling** | CSS3 + Design Tokens |
| **Integration** | Microsoft Teams SDK (optional) |
| **Linting** | ESLint 9.39 |
| **Development** | Hot Module Replacement (HMR) |

---

## Future Enhancements

- Add TypeScript for type safety
- Implement unit tests (Vitest)
- Add component Storybook for documentation
- Migrate to Tailwind or styled-components
- Add state management (Redux/Zustand)
- Implement E2E tests (Playwright)
- Add internationalization (i18n)

---

## Notes for Reviewers

This project demonstrates:
✅ Clean component architecture  
✅ Reusable design system  
✅ Microsoft Teams API integration  
✅ Responsive, accessible UI  
✅ Clear documentation  
✅ Modern development tooling  
✅ Performance-conscious practices  

The code prioritizes **clarity and maintainability** over feature completeness, making it ideal for evaluating frontend engineering fundamentals.

---

## License

Demonstration project for hiring purposes.
>>>>>>> 2a1c17d (feat: add reusable UI components (Button, Card, CardSection, Header, TaskList) and Teams context hook)
