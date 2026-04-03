/**
 * Teams Service
 * 
 * Wrapper for Microsoft Teams JavaScript SDK
 * Encapsulates Teams SDK interactions and provides clean interface
 * 
 * Features:
 *   - Lazy loading: SDK loaded only when needed
 *   - Error handling: Gracefully handles SDK load failures
 *   - Mock data: Works standalone without Teams SDK
 * 
 * Usage:
 *   import { teamsService } from './teamsService'
 *   
 *   teamsService.initialize()
 *   const context = await teamsService.getContext()
 */

let microsoftTeams = null;
let isInitialized = false;
let initializeError = null;

/**
 * Lazy load Teams SDK script
 * Only loads if running in Teams context and SDK not already loaded
 */
async function loadTeamsSDK() {
  if (microsoftTeams) return microsoftTeams;
  
  return new Promise((resolve, reject) => {
    // Check if running in Teams
    if (typeof window === 'undefined') {
      reject(new Error('Not in browser environment'));
      return;
    }
    
    // Script already loaded?
    if (window.microsoftTeams) {
      microsoftTeams = window.microsoftTeams;
      resolve(microsoftTeams);
      return;
    }
    
    // Load Teams SDK script
    const script = document.createElement('script');
    script.src = 'https://res.cdn.office.net/teams-js/2.11.0/js/microsoft.teams.min.js';
    
    script.onload = () => {
      // SDK loaded, initialize via callback
      microsoftTeams = window.microsoftTeams;
      microsoftTeams.app.initialize();
      resolve(microsoftTeams);
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Teams SDK'));
    };
    
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  });
}

/**
 * Initialize Teams integration
 * Safe to call multiple times - will only initialize once
 */
export async function initialize() {
  if (isInitialized) return true;
  
  try {
    await loadTeamsSDK();
    isInitialized = true;
    return true;
  } catch (error) {
    // Teams SDK not available - app will run standalone
    initializeError = error;
    console.warn('Teams SDK initialization skipped:', error.message);
    return false;
  }
}

/**
 * Get Teams context information
 * Returns mock data if Teams SDK not available
 */
export async function getContext() {
  try {
    if (!microsoftTeams) {
      await initialize();
    }
    
    if (microsoftTeams) {
      const context = await microsoftTeams.app.getContext();
      return {
        isTeamsApp: true,
        user: {
          id: context.user?.id || 'unknown',
          name: context.user?.displayName || 'User',
          email: context.user?.userPrincipalName || '',
        },
        theme: context.app?.theme || 'light',
        host: context.app?.host?.name || 'Teams',
        locale: context.app?.locale || 'en-US',
      };
    }
  } catch (error) {
    console.debug('Teams SDK not available, using default context');
  }
  
  // Return default context for standalone mode
  return {
    isTeamsApp: false,
    user: {
      id: 'standalone-user',
      name: 'Demo User',
      email: 'demo@example.com',
    },
    theme: 'light',
    host: 'Standalone',
    locale: 'en-US',
  };
}

/**
 * Notify in Teams
 * Sends a notification to Teams chat (if available)
 */
export async function notifyInTeams(title, body) {
  try {
    if (!microsoftTeams) return false;
    
    // Teams SDK v2 notification API
    if (microsoftTeams.notification?.show) {
      microsoftTeams.notification.show({
        title,
        message: body,
      });
      return true;
    }
  } catch (error) {
    console.debug('Cannot notify in Teams:', error.message);
  }
  
  return false;
}

/**
 * Open URL in Teams
 * Opens deep link or URL in Teams context
 */
export async function openInTeams(url, target = '_blank') {
  try {
    if (!microsoftTeams) return false;
    
    if (microsoftTeams.pages?.open) {
      microsoftTeams.pages.open({
        url,
      });
      return true;
    }
  } catch (error) {
    console.debug('Cannot open in Teams:', error.message);
  }
  
  // Fallback to regular window.open
  window.open(url, target);
  return false;
}

/**
 * Check if currently running in Teams
 */
export async function isTeamsContext() {
  try {
    const context = await getContext();
    return context.isTeamsApp;
  } catch {
    return false;
  }
}

export const teamsService = {
  initialize,
  getContext,
  notifyInTeams,
  openInTeams,
  isTeamsContext,
};

export default teamsService;
