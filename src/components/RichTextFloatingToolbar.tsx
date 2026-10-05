import React from 'react';
import { Bold, Italic, Underline, Link as LinkIcon, RemoveFormatting } from 'lucide-react';

export interface ToolbarPosition {
  top: number;
  left: number;
  placement?: 'top' | 'bottom';
}

interface RichTextFloatingToolbarProps {
  position: ToolbarPosition | null;
  onFormat: (command: 'bold' | 'italic' | 'underline' | 'createLink' | 'removeFormat', value?: string) => void;
}

export const RichTextFloatingToolbar: React.FC<RichTextFloatingToolbarProps> = ({
  position,
  onFormat,
}) => {
  if (!position) return null;

  const handleLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = window.prompt('Enter link URL (e.g. https://example.com):');
    if (url && url.trim()) {
      onFormat('createLink', url.trim());
    }
  };

  const isBottom = position.placement === 'bottom';

  return (
    <div
      className="fixed z-50 flex items-center gap-0.5 bg-slate-900 text-white rounded-lg px-1.5 py-1 shadow-2xl border border-slate-700 text-xs no-print select-none animate-in fade-in zoom-in-95 duration-100"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: isBottom ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
      }}
      onMouseDown={(e) => {
        // Prevent losing text selection when clicking toolbar buttons
        e.preventDefault();
      }}
    >
      <button
        type="button"
        title="Bold (Ctrl+B)"
        onClick={(e) => {
          e.preventDefault();
          onFormat('bold');
        }}
        className="p-1 hover:bg-slate-800 rounded transition-colors"
      >
        <Bold size={13} className="stroke-[2.5]" />
      </button>

      <button
        type="button"
        title="Italic (Ctrl+I)"
        onClick={(e) => {
          e.preventDefault();
          onFormat('italic');
        }}
        className="p-1 hover:bg-slate-800 rounded transition-colors"
      >
        <Italic size={13} />
      </button>

      <button
        type="button"
        title="Underline (Ctrl+U)"
        onClick={(e) => {
          e.preventDefault();
          onFormat('underline');
        }}
        className="p-1 hover:bg-slate-800 rounded transition-colors"
      >
        <Underline size={13} />
      </button>

      <div className="w-[1px] h-3.5 bg-slate-700 mx-0.5" />

      <button
        type="button"
        title="Insert Link"
        onClick={handleLink}
        className="p-1 hover:bg-slate-800 rounded transition-colors"
      >
        <LinkIcon size={12} />
      </button>

      <button
        type="button"
        title="Clear Formatting"
        onClick={(e) => {
          e.preventDefault();
          onFormat('removeFormat');
        }}
        className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
      >
        <RemoveFormatting size={12} />
      </button>
    </div>
  );
};
