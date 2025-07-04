import React from 'react';

interface SplineViewerProps {
  url: string;
  className?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url: string;
      };
    }
  }
}

const SplineViewer = ({ url, className = "" }: SplineViewerProps) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <spline-viewer url={url}></spline-viewer>
    </div>
  );
};

export default SplineViewer;