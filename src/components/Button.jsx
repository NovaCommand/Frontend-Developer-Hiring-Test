/**
 * Button Component
 * 
 * Reusable button with multiple variants and sizes.
 * 
 * Props:
 *   - children: ReactNode - Button text or content
 *   - variant: 'primary' | 'secondary' | 'ghost' - Button style (default: 'primary')
 *   - size: 'small' | 'base' | 'large' - Button size (default: 'base')
 *   - fullWidth: boolean - Makes button 100% width
 *   - disabled: boolean - Disabled state
 *   - onClick: function - Click handler
 *   - type: 'button' | 'submit' | 'reset' - Button type (default: 'button')
 *   - className: string - Additional CSS classes
 * 
 * Example:
 *   <Button variant="primary" size="large" onClick={handleClick}>
 *     Click me
 *   </Button>
 */

export function Button({
  children,
  variant = 'primary',
  size = 'base',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) {
  const baseClass = 'btn';
  const variantClass = `${baseClass}--${variant}`;
  const sizeClass = size !== 'base' ? `${baseClass}--${size}` : '';
  const widthClass = fullWidth ? `${baseClass}--block` : '';
  
  const classes = [baseClass, variantClass, sizeClass, widthClass, className]
    .filter(Boolean)
    .join(' ');
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
