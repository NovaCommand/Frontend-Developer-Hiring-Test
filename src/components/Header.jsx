/**
 * Header Component
 * 
 * Application header with branding and user info.
 * Displays app title, navigation, and current user information.
 * 
 * Props:
 *   - appName: string - Application name/brand
 *   - user: object - User info { name: string, avatar?: string }
 *   - isTeamsApp: boolean - Whether running in Teams context
 *   - onUserClick: function - Optional handler for user info click
 * 
 * Example:
 *   <Header 
 *     appName="Task Dashboard" 
 *     user={{ name: 'John Doe' }} 
 *     isTeamsApp={true}
 *   />
 */

export function Header({ appName, user, isTeamsApp, onUserClick }) {
  // Extract initials from name for avatar
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';
  
  const environmentLabel = isTeamsApp ? '(Teams)' : '(Standalone)';

  return (
    <header className="header">
      <div className="header__brand">
        {appName}
        <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', fontWeight: 'normal' }}>
          {environmentLabel}
        </span>
      </div>
      
      <nav className="header__nav hide-mobile">
        <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard</a></li>
        <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Tasks</a></li>
        <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Settings</a></li>
      </nav>
      
      <div
        className="header__user-info"
        onClick={onUserClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onUserClick?.();
          }
        }}
      >
        <span>{user?.name || 'Guest User'}</span>
        <div className="header__avatar">{initials}</div>
      </div>
    </header>
  );
}

export default Header;
