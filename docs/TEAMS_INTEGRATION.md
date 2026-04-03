# Teams Integration Guide

## Overview

This document provides implementation details for the Microsoft Teams integration in the Frontend Developer Hiring Test application.

---

## Teams Integration Approach

### Design Philosophy

**Progressive Enhancement with Graceful Degradation**

The application is designed to work in two contexts:

1. **Standalone Mode**: Works in any modern browser without Teams
2. **Teams Mode**: Enhanced features when running in Teams

This approach ensures:
- No hard dependency on Teams SDK
- Development and testing possible without Teams
- Full functionality available in Teams context

---

## Technical Implementation

### Teams SDK Integration

#### 1. Lazy Loading Strategy

The Teams SDK is loaded dynamically only when needed:

```javascript
// teamsService.js
async function loadTeamsSDK() {
  if (microsoftTeams) return microsoftTeams
  
  return new Promise((resolve, reject) => {
    if (!window.microsoftTeams) {
      // Load from CDN
      const script = document.createElement('script')
      script.src = 'https://res.cdn.office.net/teams-js/2.11.0/js/microsoft.teams.min.js'
      script.onload = () => {
        microsoftTeams = window.microsoftTeams
        microsoftTeams.app.initialize()
        resolve(microsoftTeams)
      }
    }
  })
}
```

**Benefits**:
- ✅ No SDK overhead in standalone mode
- ✅ Faster initial load
- ✅ SDK only loaded if needed

#### 2. Service Layer Abstraction

All Teams SDK interactions go through `teamsService`:

```javascript
// Usage in components
const context = await teamsService.getContext()

// Not directly calling Teams SDK:
// const context = await microsoftTeams.app.getContext()
```

**Benefits**:
- ✅ Single point of Teams SDK integration
- ✅ Easy to mock for testing
- ✅ SDK updates only require changes in one place

### 3. Context Caching

Contexts from Teams SDK are cached to avoid repeated calls:

```javascript
// Module-level storage
let cachedContext = null
let cachePromise = null

// First call: Fetches and caches
const context = await teamsService.getContext()

// Subsequent calls: Instant
const context = await teamsService.getContext() // No SDK call
```

---

## Available Team Features

### 1. Context Detection

**Detect if running in Teams**:

```javascript
const { isTeamsApp, user, theme, locale } = await teamsService.getContext()

if (isTeamsApp) {
  // Show Teams-specific features
}
```

**Returned Object**:

```javascript
{
  isTeamsApp: boolean,        // true if in Teams
  user: {
    id: string,               // Teams user ID
    name: string,             // Display name
    email: string,            // User email
  },
  theme: string,              // 'light' | 'dark' | 'contrast'
  host: string,               // 'Teams' | 'Standalone'
  locale: string,             // 'en-US', 'fr-FR', etc
}
```

### 2. Theme Awareness

**Automatic Theme Detection**:

```javascript
const { theme } = await teamsService.getContext()

// In CSS:
// @media (prefers-color-scheme: dark) { }
// 
// Or programmatically:
if (theme === 'dark') {
  document.documentElement.classList.add('dark-theme')
}
```

**Teams Themes**:
- `light`: Light theme
- `dark`: Dark theme  
- `contrast`: High contrast

### 3. User Information

**Get Current User Details**:

```javascript
const { user } = await teamsService.getContext()

// Display user name
<span>{user.name}</span>

// Show avatar with initials
const initials = user.name
  .split(' ')
  .map(n => n[0])
  .join('')
```

**Available User Info**:
- `id`: Unique Teams user identifier
- `name`: Display name from Teams profile
- `email`: User's email address

### 4. Notifications

**Send Notification to Teams**:

```javascript
import { teamsService } from './services/teamsService'

await teamsService.notifyInTeams(
  'Task Updated',
  'Your task has been marked as complete'
)
```

**Use Cases**:
- Task completion notifications
- Deadline reminders
- Mention alerts

### 5. Deep Linking

**Open URL in Teams Context**:

```javascript
await teamsService.openInTeams(
  'https://app.example.com/tasks/123',
  '_blank'
)
```

---

## Integration with Components

### Using Teams Context in Components

**useTeamsContext Hook**:

```javascript
import { useTeamsContext } from '../hooks/useTeamsContext'

function Header() {
  const { isTeamsApp, user, theme, loading, error } = useTeamsContext()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <header>
      <h1>Dashboard {isTeamsApp ? '(Teams)' : '(Standalone)'}</h1>
      <p>Welcome, {user?.name}</p>
    </header>
  )
}
```

**Hook Features**:
- Automatic Teams initialization
- Context caching across components
- Error handling
- Refresh capability

### Example: Task List with Teams Features

```javascript
import { useTeamsContext } from '../hooks/useTeamsContext'
import { teamsService } from '../services/teamsService'
import { TaskList } from '../components/TaskList'

export function TasksPage() {
  const { isTeamsApp, user } = useTeamsContext()
  const [tasks, setTasks] = useState([])
  
  const handleTaskComplete = async (taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    ))
    
    // Notify in Teams
    if (isTeamsApp) {
      await teamsService.notifyInTeams(
        'Task Completed',
        `Task completed by ${user?.name}`
      )
    }
  }
  
  return (
    <TaskList 
      tasks={tasks}
      onTaskToggle={handleTaskComplete}
    />
  )
}
```

---

## Deployment to Microsoft Teams

### Step 1: Register App in M365

1. Go to [Azure Portal](https://portal.azure.com)
2. Create new App Registration
3. Configure Redirect URIs:
   ```
   https://yourdomain.com/auth-end
   ```
4. Note the Application ID

### Step 2: Create Teams Manifest

Create `manifest.json`:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.14/MicrosoftTeams.schema.json",
  "manifestVersion": "1.14",
  "version": "1.0.0",
  "id": "YOUR_APP_ID_HERE",
  "name": {
    "short": "Task Dashboard",
    "full": "Task Dashboard Application"
  },
  "description": {
    "short": "Manage your tasks efficiently",
    "full": "A comprehensive task dashboard for managing and tracking tasks within Teams"
  },
  "icons": {
    "outline": "icon-outline.png",
    "color": "icon-color.png"
  },
  "tabs": [
    {
      "entityId": "tasks",
      "name": "Tasks",
      "contentUrl": "https://yourdomain.com/tasks",
      "websiteUrl": "https://yourdomain.com",
      "scopes": ["personal"]
    }
  ],
  "staticTabs": [
    {
      "entityId": "about",
      "name": "About",
      "contentUrl": "https://yourdomain.com/about",
      "scopes": ["personal"]
    }
  ],
  "permissions": [
    "identity",
    "messageTeamMembers"
  ],
  "validDomains": [
    "yourdomain.com"
  ]
}
```

### Step 3: Create App Package

1. Prepare files:
   - `manifest.json`
   - `icon-outline.png` (32x32)
   - `icon-color.png` (192x192)

2. Create ZIP file:
   ```bash
   zip -r app-package.zip manifest.json icon-*.png
   ```

### Step 4: Deploy to Teams

**Option A: Sideload (Development)**
1. Open Teams
2. Click "..." → "Apps" → "Manage your apps"
3. Click "Upload an app"
4. Select `app-package.zip`

**Option B: Admin Deployment (Production)**
1. Go to Teams Admin Center
2. Teams → Teams apps → Manage apps
3. Upload the app package
4. Configure organization-wide settings

### Step 5: Test in Teams

1. Install app in Teams
2. Open app as a tab in a channel
3. Test all features:
   - User context loads correctly
   - Theme switches when Teams theme changes
   - Notifications appear in Teams

---

## Teams SDK Reference

### Available Methods

```javascript
// Context
const context = await microsoftTeams.app.getContext()

// Notifications
await microsoftTeams.notification.show({
  title: 'Task Updated',
  message: 'Your task is complete'
})

// Deep linking
await microsoftTeams.pages.open({
  url: 'https://app.com/tasks/123'
})

// Share to Teams
await microsoftTeams.sharing.openShareDialog({
  url: 'https://app.com/task-summary'
})
```

### Documentation

For complete Teams SDK documentation:
- [Microsoft Teams JavaScript SDK](https://learn.microsoft.com/en-us/javascript/api/overview/msteams-client)
- [Teams App Schema](https://learn.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema)

---

## Environment Variables

**Optional Configuration**:

```bash
# .env file
REACT_APP_TEAMS_APP_ID=YOUR_APP_ID
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENVIRONMENT=production
```

**Usage in Code**:

```javascript
const appId = process.env.REACT_APP_TEAMS_APP_ID
const apiUrl = process.env.REACT_APP_API_URL
```

---

## Troubleshooting

### SDK Loading Issues

**Problem**: Teams SDK not loading

```javascript
// Check browser console for errors
// Ensure script URL is correct for Teams JS SDK version
// Verify running in Teams context
```

**Solution**:
```javascript
// Test Teams detection
console.log(window.microsoftTeams)

// Check manifest is valid:
// Go to Teams > About > About this app > Source
```

### Context Not Available

**Problem**: `teamsService.getContext()` returns default values

**Solution**:
1. Verify app is running in Teams (not standalone)
2. Check app has proper permissions in manifest
3. Verify SSL certificate is valid
4. Check domain is in `validDomains` in manifest

### Theme Not Updating

**Problem**: Dark mode not working

**Solution**:
```javascript
// Force theme update
const { theme } = await teamsService.getContext()
document.documentElement.style.colorScheme = theme
```

---

## Best Practices

### 1. Always Use Service Layer

```javascript
// ✅ Good
const context = await teamsService.getContext()

// ❌ Avoid
const context = await microsoftTeams.app.getContext()
```

### 2. Handle Initialization Gracefully

```javascript
// ✅ Good
try {
  const context = await teamsService.getContext()
  // Use context
} catch (error) {
  // Handle gracefully, show default
}

// ❌ Avoid
const context = teamsService.getContext() // No error handling
```

### 3. Cache Context to Avoid Repeated Calls

```javascript
// ✅ Good
const { user } = useTeamsContext() // Cached

// ❌ Avoid
const context = await teamsService.getContext() // in render
```

### 4. Use Valid Domains

```json
// manifest.json
"validDomains": [
  "yourdomain.com",
  "api.yourdomain.com"
]
```

---

## Security Considerations

### 1. HTTPS Required

Teams only works with HTTPS. Always use:
```
https://yourdomain.com
```

### 2. Validate Manifest

- Keep Application ID confidential
- Don't expose secrets in client-side code
- Use environment variables for sensitive data

### 3. CORS Configuration

```javascript
// Ensure API endpoints allow Teams domains
// Add to backend CORS headers:
Access-Control-Allow-Origin: https://teams.microsoft.com
```

---

## Useful Resources

- [Teams Developer Documentation](https://learn.microsoft.com/en-us/microsoftteams/platform)
- [Teams JavaScript SDK Reference](https://learn.microsoft.com/en-us/javascript/api/overview/msteams-client)
- [Teams Manifest Schema](https://learn.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema)
- [Teams Design Guidelines](https://www.figma.com/community/file/916836509871353159)

