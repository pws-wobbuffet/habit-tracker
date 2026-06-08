import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: '24px',
            fontFamily: 'system-ui, sans-serif',
            color: '#2d2416',
            background: '#f5f2ec',
            minHeight: '100dvh',
          }}
        >
          <h2 style={{ margin: '0 0 8px', fontSize: '18px' }}>Something went wrong</h2>
          <pre
            style={{
              background: '#fff',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '12px',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {this.state.error.message}
            {'\n'}
            {this.state.error.stack}
          </pre>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              background: '#c17a3a',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
