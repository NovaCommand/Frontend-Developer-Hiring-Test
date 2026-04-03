/**
 * Card Component
 * 
 * Reusable card container with optional header and footer.
 * Can be interactive (clickable) based on props.
 * 
 * Props:
 *   - children: ReactNode - Card body content
 *   - title: string - Optional card title (creates header)
 *   - footer: ReactNode - Optional footer content
 *   - clickable: boolean - If true, card is interactive
 *   - onClick: function - Click handler for clickable cards
 *   - className: string - Additional CSS classes
 * 
 * Example:
 *   <Card title="User Info" footer={<Button>Save</Button>}>
 *     User details go here
 *   </Card>
 */

export function Card({
  children,
  title,
  footer,
  clickable = false,
  onClick,
  className = '',
}) {
  const cardClass = clickable ? 'card card--clickable' : 'card';
  const classes = [cardClass, className].filter(Boolean).join(' ');
  
  return (
    <div
      className={classes}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyPress={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClick?.(e);
              }
            }
          : undefined
      }
    >
      {title && (
        <div className="card__header">
          <h2 className="card__title">{title}</h2>
        </div>
      )}
      
      <div className="card__body">{children}</div>
      
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}

export default Card;
