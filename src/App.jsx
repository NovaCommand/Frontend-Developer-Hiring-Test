import { useState } from 'react'
import './styles/design-tokens.css'
import './styles/components.css'
import './App.css'

import { Header } from './components/Header'
import { Card } from './components/Card'
import { Button } from './components/Button'
import { TaskList } from './components/TaskList'
import { CardSection } from './components/CardSection'
import useTeamsContext from './hooks/useTeamsContext'

/**
 * Main Application Component
 * 
 * Demonstrates:
 * - Integration with Teams context hook
 * - Component composition using design system
 * - Responsive layout
 * - State management with hooks
 */
function App() {
  // Get Teams context and user information
  const { isTeamsApp, user, theme, loading, error } = useTeamsContext()
  
  // Local state for task management
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Complete project design',
      description: 'Finish the UI component library design',
      status: 'pending',
      completed: false,
    },
    {
      id: '2',
      title: 'Implement Teams integration',
      description: 'Add Microsoft Teams SDK integration',
      status: 'complete',
      completed: true,
    },
    {
      id: '3',
      title: 'Write documentation',
      description: 'Create architecture and integration guides',
      status: 'overdue',
      completed: false,
    },
    {
      id: '4',
      title: 'Deploy to staging',
      description: 'Push changes to staging environment',
      status: 'pending',
      completed: false,
    },
  ])

  // Show loading state while Teams context is initializing
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-primary)',
      }}>
        <div>
          <h2 style={{ color: 'var(--color-text-primary)' }}>Loading application...</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Initializing Teams context</p>
        </div>
      </div>
    )
  }

  // Handle task toggle (completion status)
  const handleTaskToggle = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ))
  }

  // Handle task click
  const handleTaskClick = (taskId) => {
    console.log('Task clicked:', taskId)
  }

  // Handle mark all complete
  const handleMarkAllComplete = () => {
    setTasks(tasks.map(task => ({ ...task, completed: true })))
  }

  // Count completed tasks
  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Application Header */}
      <Header
        appName="Task Dashboard"
        user={user}
        isTeamsApp={isTeamsApp}
        onUserClick={() => console.log('User clicked')}
      />

      {/* Main Content */}
      <main style={{ flex: 1, padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="container">
          {/* Error State (if any) */}
          {error && (
            <CardSection spacing="lg">
              <Card 
                title="⚠️ Notice"
                className="card--error"
                style={{ borderColor: 'var(--color-error)' }}
              >
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Running in standalone mode. Some features limited without Teams integration.
                </p>
              </Card>
            </CardSection>
          )}

          {/* Welcome Section */}
          <CardSection spacing="xxl">
            <Card 
              title="Welcome"
              className="welcome-card"
            >
              <p style={{ margin: '0 0 var(--spacing-md) 0', color: 'var(--color-text-primary)' }}>
                <strong>Hello, {user?.name || 'User'}!</strong>
              </p>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                This is a frontend hiring test application demonstrating:
              </p>
              <ul style={{ 
                margin: 'var(--spacing-md) 0 0 var(--spacing-lg)',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
              }}>
                <li>React component architecture with reusable design system</li>
                <li>Microsoft Teams and M365 integration patterns</li>
                <li>Responsive, accessible UI components</li>
                <li>Clean code organization and documentation</li>
                <li>Environment: <strong>{isTeamsApp ? '✅ Teams' : '📱 Standalone'}</strong></li>
              </ul>
            </Card>
          </CardSection>

          {/* Statistics Section */}
          <CardSection spacing="lg">
            <div className="grid" style={{ marginBottom: 0 }}>
              <Card title="Task Statistics">
              <div style={{ display: 'flex', gap: 'var(--spacing-lg)', justifyContent: 'space-around' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: 'var(--font-size-2xl)', 
                    fontWeight: 'bold',
                    color: 'var(--color-primary)',
                  }}>
                    {completedCount}/{totalCount}
                  </div>
                  <p style={{ 
                    margin: 'var(--spacing-sm) 0 0 0',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                  }}>
                    Completed
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: 'var(--font-size-2xl)', 
                    fontWeight: 'bold',
                    color: 'var(--color-warning)',
                  }}>
                    {totalCount - completedCount}
                  </div>
                  <p style={{ 
                    margin: 'var(--spacing-sm) 0 0 0',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                  }}>frontend-developer-hiring-test
                    Remaining
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Component Showcase">
              <div className="flex flex--column" style={{ gap: 'var(--spacing-md)' }}>
                <div>
                  <h4 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Button Variants:
                  </h4>
                  <div className="flex" style={{ gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                    <Button variant="primary" size="small">Primary</Button>
                    <Button variant="secondary" size="small">Secondary</Button>
                    <Button variant="ghost" size="small">Ghost</Button>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Component Library:
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Button, Card, Header, TaskList, and more...
                  </p>
                </div>
              </div>
            </Card>
          </div>
          </CardSection>

          {/* Tasks Section */}
          <CardSection spacing="lg">
            <Card 
            title={`My Tasks (${completedCount}/${totalCount} Complete)`}
            footer={
              <Button 
                variant="primary" 
                onClick={handleMarkAllComplete}
                disabled={completedCount === totalCount}
              >
                Mark All Complete
              </Button>
            }
          >
            <TaskList
              tasks={tasks}
              onTaskToggle={handleTaskToggle}
              onTaskClick={handleTaskClick}
              emptyMessage="No tasks to display"
            />
          </Card>
          </CardSection>

          {/* Feature Documentation */}
          <CardSection spacing="lg">
            <div style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--border-radius-lg)' }}>
            <h3 style={{ margin: '0 0 var(--spacing-md) 0', color: 'var(--color-text-primary)' }}>
              📚 Documentation
            </h3>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
              <div>
                <h4 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--color-primary)' }}>
                  Architecture
                </h4>
                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  See <code>docs/ARCHITECTURE.md</code> for component design, state management, and scalability decisions.
                </p>
              </div>
              <div>
                <h4 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--color-primary)' }}>
                  Teams Integration
                </h4>
                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  See <code>docs/TEAMS_INTEGRATION.md</code> for deployment and SDK integration guide.
                </p>
              </div>
              <div>
                <h4 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--color-primary)' }}>
                  Getting Started
                </h4>
                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  See <code>README.md</code> for installation, running, and project overview.
                </p>
              </div>
            </div>
          </div>
          </CardSection>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--color-bg-primary)',
        textAlign: 'center',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text-secondary)',
      }}>
        <p>
          Frontend Developer Hiring Test • 
          Built with React, Vite, and Microsoft Teams SDK • 
          Theme: <strong>{theme}</strong>
        </p>
      </footer>
    </div>
  )
}

export default App;
