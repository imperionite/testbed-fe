import { Component } from 'react'

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled application error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>Something went wrong</h1>
          <p>An unexpected error occurred. Please reload the page and try again.</p>
          <button onClick={this.handleReload}>Reload page</button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
