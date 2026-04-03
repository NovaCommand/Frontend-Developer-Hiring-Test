/**
 * TaskList Component
 * 
 * Displays a list of tasks with completion status and metadata.
 * Each task can be interacted with (checked/unchecked).
 * 
 * Props:
 *   - tasks: array - Task items with structure:
 *     { id, title, description, status: 'pending'|'complete'|'overdue', completed: boolean }
 *   - onTaskToggle: function - Called when task is checked/unchecked
 *   - onTaskClick: function - Called when task is clicked
 *   - emptyMessage: string - Message when no tasks
 * 
 * Example:
 *   <TaskList 
 *     tasks={tasks} 
 *     onTaskToggle={(taskId) => console.log(taskId)}
 *   />
 */

export function TaskList({
  tasks = [],
  onTaskToggle,
  onTaskClick,
  emptyMessage = 'No tasks to display',
}) {
  if (tasks.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--spacing-xl)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`task-item ${task.completed ? 'task-item--completed' : ''}`}
          onClick={() => onTaskClick?.(task.id)}
        >
          <input
            type="checkbox"
            className="task-item__checkbox"
            checked={task.completed || false}
            onChange={(e) => {
              e.stopPropagation();
              onTaskToggle?.(task.id);
            }}
            aria-label={`Toggle ${task.title}`}
          />
          
          <div className="task-item__content">
            <h3 className="task-item__title">{task.title}</h3>
            {task.description && (
              <p className="task-item__description">{task.description}</p>
            )}
          </div>
          
          {task.status && (
            <span className={`task-item__status task-item__status--${task.status}`}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
