import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type OutputViewerProps = { content: string };

const OutputViewer = forwardRef<HTMLDivElement, OutputViewerProps>(({ content }, ref) => (
  <div ref={ref} className="prose prose-blue max-w-none">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  </div>
));

OutputViewer.displayName = 'OutputViewer';
export default OutputViewer;