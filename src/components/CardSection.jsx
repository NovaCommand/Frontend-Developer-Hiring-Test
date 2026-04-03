/**
 * CardSection Component
 * 
 * Wrapper component for Cards with dynamic spacing control.
 * Provides consistent, reusable spacing patterns.
 * 
 * Props:
 *   - children: ReactNode - Card component and its content
 *   - spacing: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' - Bottom margin spacing (default: 'lg')
 *   - className: string - Additional CSS classes
 * 
 * Example:
 *   <CardSection spacing="lg">
 *     <Card title="Welcome">Content here</Card>
 *   </CardSection>
 */

export function CardSection({
  children,
  spacing = 'lg',
  className = '',
}) {
  const spacingMap = {
    sm: 'var(--spacing-sm)',    // 8px
    md: 'var(--spacing-md)',    // 16px
    lg: 'var(--spacing-lg)',    // 24px
    xl: 'var(--spacing-xl)',    // 32px
    xxl: 'var(--spacing-xxl)',  // 48px
  };

  const marginBottom = spacingMap[spacing] || spacingMap['lg'];
  const classes = ['card-section', className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{ marginBottom }}
    >
      {children}
    </div>
  );
}
