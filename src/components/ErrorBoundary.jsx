import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="m-6 p-4 border border-red-300 bg-red-50 text-red-900 rounded-md text-sm font-mono whitespace-pre-wrap">
          <div className="font-semibold mb-2">Artifact failed to render</div>
          {String(this.state.error.message || this.state.error)}
        </div>
      );
    }
    return this.props.children;
  }
}
