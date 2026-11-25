"use client";

import React from "react";

/**
 * Keeps a template render error from blanking the preview silently.
 * Shows the error so it can be reported, and resets when `resetKey` changes.
 */
export class PreviewErrorBoundary extends React.Component<
  { children: React.ReactNode; resetKey?: string | number },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[preview] template render failed", error, info.componentStack);
  }

  componentDidUpdate(prev: { resetKey?: string | number }) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", color: "#b91c1c", background: "#fef2f2" }}>
          <strong>Preview gagal dirender.</strong>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, marginTop: 8 }}>{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
