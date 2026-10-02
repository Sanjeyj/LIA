import { Component, type ReactNode } from "react";

interface WebGLFallbackProps {
  children: ReactNode;
}

interface WebGLFallbackState {
  hasError: boolean;
  webglSupported: boolean;
}

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export class WebGLFallback extends Component<WebGLFallbackProps, WebGLFallbackState> {
  constructor(props: WebGLFallbackProps) {
    super(props);
    this.state = {
      hasError: false,
      webglSupported: isWebGLAvailable(),
    };
  }

  static getDerivedStateFromError(): Partial<WebGLFallbackState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("WebGL Canvas encountered an issue, displaying graceful liquid glass CSS fallback:", error, errorInfo);
  }

  render() {
    if (this.state.hasError || !this.state.webglSupported) {
      return (
        <div
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          {/* CSS Liquid Glass Orb Fallback */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full glass-primary border border-[#D7B65A]/30 shadow-2xl animate-pulse-subtle flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#174EA6]/30 via-transparent to-[#D7B65A]/20 blur-xl" />
            <div className="w-40 h-40 rounded-full bg-[#D7B65A]/10 border border-[#D7B65A]/40 blur-md" />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
