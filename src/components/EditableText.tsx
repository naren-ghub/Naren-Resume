import React, { useRef } from 'react';
import { X } from 'lucide-react';

type SupportedTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  isEditing: boolean;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  tag?: SupportedTag;
  richText?: boolean;
  onRemove?: () => void;
  removeTitle?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  placeholder = '',
  isEditing,
  className = '',
  style,
  multiline = false,
  tag = 'span',
  richText = false,
  onRemove,
  removeTitle = 'Remove field',
}) => {
  const elRef = useRef<HTMLElement>(null);

  // PREVIEW / PRINT MODE
  if (!isEditing) {
    const cleanValue = value ? value.trim() : '';
    // If empty in preview/print, do NOT render anything into the document!
    if (!cleanValue) {
      return null;
    }

    if (richText) {
      return React.createElement(tag, {
        className,
        style,
        dangerouslySetInnerHTML: { __html: cleanValue },
      });
    }

    return React.createElement(tag, { className, style }, cleanValue);
  }

  // EDIT MODE
  const isEmpty = !value || !value.trim();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    // Rich text shortcuts (Ctrl/Cmd + B, I, U)
    if (richText && (e.ctrlKey || e.metaKey)) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        document.execCommand('bold', false);
        return;
      }
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        document.execCommand('italic', false);
        return;
      }
      if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        document.execCommand('underline', false);
        return;
      }
    }

    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    if (richText) {
      const html = e.currentTarget.innerHTML || '';
      // If user typed only whitespace or empty tags, clean it up
      const textOnly = e.currentTarget.textContent || '';
      if (!textOnly.trim()) {
        if (value !== '') onChange('');
      } else if (html !== value) {
        onChange(html);
      }
    } else {
      const text = e.currentTarget.textContent || '';
      if (text !== value) {
        onChange(text.trim());
      }
    }
  };

  const contentElement = React.createElement(
    tag,
    {
      ref: elRef,
      className: `outline-none transition-colors rounded-xs focus:ring-1 focus:ring-blue-400 focus:bg-blue-50/40 hover:bg-slate-50/80 px-0.5 -mx-0.5 ${
        isEmpty ? 'text-slate-400 italic' : ''
      } ${className}`,
      style,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
      dangerouslySetInnerHTML: richText && value ? { __html: value } : undefined,
      children: richText && value ? undefined : isEmpty ? placeholder : value,
      title: richText ? 'Click to edit (Ctrl+B for bold, Ctrl+I for italic)' : 'Click to edit text directly',
    }
  );

  if (onRemove && isEditing) {
    return (
      <span className="group/field relative inline-flex items-center gap-1">
        {contentElement}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title={removeTitle}
          className="opacity-0 group-hover/field:opacity-100 hover:opacity-100 p-0.5 text-slate-400 hover:text-red-600 rounded transition-opacity no-print"
        >
          <X size={11} />
        </button>
      </span>
    );
  }

  return contentElement;
};
