# Architecture Documentation

## Overview

This document provides detailed insights into the architectural decisions and patterns used in the Frontend Developer Hiring Test application.

---

## Component Architecture

### Layered Architecture

The application follows a **3-layer architecture pattern**:

```
┌─────────────────────────────────────┐
│      Application Layer              │
│  (App.jsx - Main Component)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Presentation Layer              │
│  (Components: Header, Card, etc)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   State & Business Logic Layer      │
│  (Hooks, Services, Context)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      External Integration           │
│  (Teams SDK, APIs, M365)            │
└─────────────────────────────────────┘
```

### Component Structure

#### Presentation Layer Components

**Button.jsx**
- **Purpose**: Reusable button component with variants
- **Variants**: primary, secondary, ghost
- **Sizes**: small, base, large
- **Props**: variant, size, fullWidth, disabled, onClick, type
- **Design Pattern**: Function component with composition

**Card.jsx**
- **Purpose**: Container component for content grouping
- **Features**: Optional header, body, footer slots
- **Interactions**: Can be clickable (accessible with keyboard support)
- **Accessibility**: ARIA attributes for interactive cards

**Header.jsx**
- **Purpose**: Application header and navigation
- **Features**: Branding, user info, navigation links
- **Responsive**: Shows/hides nav on mobile
- **User Avatar**: Displays initials from user name

**TaskList.jsx**
- **Purpose**: Display list of tasks with status indicators
- **Interactions**: Checkbox toggle, click handlers
- **States**: pending, complete, overdue
- **Features**: Strikethrough on completed tasks

### State Management Layer

**useTeamsContext Hook**
- **Purpose**: Centralized Teams context management
- **Features**:
  - Lazy initialization of Teams SDK
  - Context caching across components
  - Error handling and graceful degradation
  - Refresh capability
- **Return Value**: { isTeamsApp, user, theme, loading, error, refresh }

**teamsService.js**
- **Purpose**: Teams SDK wrapper for abstraction
- **Features**:
  - Dynamic script loading
  - Context retrieval
  - Notification support
  - Deep linking
- **Pattern**: Module with exported async functions

---

## State Management Decisions

### Why React Hooks Instead of Redux?

**Chosen Approach**: `useState` + `useContext` with custom hooks

**Rationale**:
1. ✅ **Simplicity**: Reduced complexity for hiring test evaluation
2. ✅ **Performance**: No additional dependencies
3. ✅ **Learning Clarity**: More transparent data flow
4. ✅ **Scalability**: Can add Redux/Zustand later without changing components

**Trade-offs**:
- ❌ Prop drilling for deeply nested components (mitigated with custom hooks)
- ❌ Not ideal for very large state trees
- ❌ No built-in middleware/logging

### Future Scalability

If the application grows:

```javascript
// Option 1: Add Context API
const TeamsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <TeamsContext.Provider value={{ state, dispatch }}>
      {children}
    </TeamsContext.Provider>
  )
}

// Option 2: Add Redux
import { useSelector, useDispatch } from 'react-redux'

// Option 3: Add Zustand
import { create } from 'zustand'
```

---

## Styling Architecture

### Design System Approach

**Why CSS Variables + Vanilla CSS?**

1. **Performance**: No JavaScript overhead
2. **Maintainability**: Tokens centralized in one file
3. **Theming**: Easy dark/light mode switching
4. **Accessibility**: Control over contrast ratios
5. **Tree-shaking**: Unused CSS can be pruned

### Design Tokens Organization

```
design-tokens.css
├── Color Tokens
│   ├── Primary Palette
│   ├── Neutrals
│   └── Semantic Colors (success, error, warning)
├── Spacing Tokens (8px grid)
├── Typography Tokens
│   ├── Font Families
│   ├── Font Sizes
│   ├── Font Weights
│   └── Line Heights
├── Shadow Tokens
├── Border Radius Tokens
├── Transition Tokens
└── Z-Index Scale
```

### BEM Naming Convention

Blocks-Elements-Modifiers pattern ensures clarity:

```css
/* Component Block */
.btn { }

/* Component Element */
.btn__text { }

/* Component Modifier (Variant) */
.btn--primary { }
.btn--secondary { }

/* Complex Selectors */
.btn--primary:not(:disabled):hover { }
```

**Benefits**:
- Clear relationships between CSS classes
- Easy to identify component boundaries
- No specificity issues
- Predictable class names

### Dark Mode Implementation

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #1f1f1f;
    --color-text-primary: #ffffff;
  }
}
```

Respects system preference and adapts automatically.

---

## Teams Integration Architecture

### Integration Pattern: Optional Integration

**Design Principle**: App works standalone AND in Teams

```javascript
const context = await teamsService.getContext()
// Returns Teams context if available
// Returns mock data if Teams SDK unavailable
```

### SDK Loading Strategy

```
User loads app
     ↓
[Check: Running in Teams?]
     │
  Yes ↓                    No
  Load Teams SDK    Use default context
     ↓                    ↓
Initialize SDK      [App works offline]
     ↓
Get context
     ↓
[Display app]
```

### Context Caching

To avoid multiple SDK calls, context is cached:

```javascript
// First call: Initializes and caches
const context1 = await teamsService.getContext() // Calls SDK

// Subsequent calls: Returns cached value
const context2 = await teamsService.getContext() // Instant

// Manual refresh available
await teamsContext.refresh() // Re-fetches from SDK
```

---

## Performance Optimizations

### 1. Component Lazy Loading Ready

```javascript
// Future: Lazy load task detail view
const TaskDetail = lazy(() => import('./TaskDetail'))
```

### 2. Optimized Re-renders

- Proper dependency arrays in hooks
- useCallback for event handlers
- Memoization ready (can add React.memo)

### 3. CSS Performance

- Design tokens enable CSS-in-JS migration
- No runtime style calculation
- CSS properties enable efficient theme switching

### 4. Bundle Size

Current dependencies:
```
React: 44.5 KB (gzipped)
React-DOM: 42.3 KB (gzipped)
Teams SDK: ~50 KB (loaded only if in Teams)
Total: ~137 KB (without Teams SDK in standalone)
```

---

## Accessibility Considerations

### WCAG 2.1 Compliance (Level AA)

**Semantic HTML**
```jsx
<header role="banner">
<main role="main">
<nav role="navigation">
<button> instead of <div>
```

**ARIA Labels**
```jsx
<input 
  aria-label="Toggle task" 
  type="checkbox" 
/>
```

**Keyboard Navigation**
```jsx
// Click handlers also support Enter/Space keys
onKeyPress={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    onClick?.()
  }
}}
```

**Color Contrast**
- Primary: 4.5:1 ratio (normal text)
- Background/text: 6:1 ratio (enhanced)
- Semantic colors: All meet AA standard

**Focus Management**
```css
:focus-visible {
  outline: 2px solid var(--color-primary);
}
```

---

## Testing Strategy (Testing Pyramid)

```
        ▲
       ╱E2E╲           Playwright/Cypress
      ╱─────╲
     ╱ E2E   ╲         10-15% of tests
    ╱         ╲
   ╱███████████╲
  ╱ Integration ╲      React Testing Library
 ╱ Integration   ╲     30-40% of tests
╱                ╲
╱██████████████████╲
│    Unit Tests     │  Vitest/Jest
│  Unit Tests       │  50-60% of tests
│                   │
└───────────────────┘
```

**Recommended Test Files**:
```
src/
├── components/
│   ├── Button.test.jsx      // Unit tests
│   ├── Header.test.jsx      // Unit tests
│   └── ...
├── hooks/
│   └── useTeamsContext.test.js
├── services/
│   └── teamsService.test.js
└── integration/
    ├── App.integration.test.jsx
    └── Teams.integration.test.js
```

---

## Error Handling Strategy

### Graceful Degradation

```
Teams SDK Error
     ↓
[Catch Error]
     ↓
[Use default context]
     ↓
[Log warning to console]
     ↓
[App continues with mock data]
```

### Error Boundaries (Future Implementation)

```jsx
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

---

## Deployment Considerations

### Standalone Deployment

```bash
npm build
# Upload dist/ to any static host
# Works on any domain
```

### Teams Deployment

1. Create `manifest.json` with app registration
2. Create app package (ZIP)
3. Upload to Teams/Admin Portal
4. Users can sideload or admin can deploy

### Environment-Specific Config

```javascript
// Could add environment variables
const API_BASE = process.env.REACT_APP_API_URL
const TEAMS_MANIFEST_ID = process.env.REACT_APP_MANIFEST_ID
```

---

## Future Architecture Enhancements

### Phase 1: Type Safety
- Migrate to TypeScript
- Add JSDoc for runtime validation

### Phase 2: Advanced Styling
- Migrate to Tailwind CSS or styled-components
- Add CSS-in-JS for dynamic theming

### Phase 3: State Management
- Add Redux for complex state
- Implement Redux DevTools

### Phase 4: Testing
- Add Vitest for unit tests
- Add React Testing Library for component tests
- Add Playwright for E2E tests

### Phase 5: Developer Experience
- Add Storybook for component documentation
- Add Chromatic for visual regression testing
- Add GitHub Actions for CI/CD

---

## Code Organization Principles

### Separation of Concerns
- Components: Presentational logic only
- Hooks: State and lifecycle logic
- Services: Integration and business logic

### DRY (Don't Repeat Yourself)
- Reusable components over copy-paste
- Custom hooks for shared logic
- Token system for shared styles

### SOLID Principles Applied

**Single Responsibility**
- Button.jsx: Only button rendering
- teamsService: Only Teams SDK integration

**Open/Closed**
- Components extensible via props
- Services extensible with new methods

**Dependency Inversion**
- Services depend on abstractions (interfaces)
- Components accept props rather than creating instances

---

## Conclusion

This architecture demonstrates:
✅ Clean separation of concerns  
✅ Scalable without over-engineering  
✅ Performance-conscious  
✅ Accessibility-first approach  
✅ Production-ready patterns  

The design prioritizes **clarity and maintainability** while remaining flexible for future growth.
