import React from 'react';

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
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  placeholder,
  isEditing,
  className = '',
  style,
  multiline = false,
  tag = 'span',
}) => {
  if (!isEditing) {
    return React.createElement(
      tag,
      { className, style },
      value || placeholder
    );
  }

  // When editing, render contentEditable tag for smooth inline document editing
  return React.createElement(
    tag,
    {
      className: `outline-none transition-colors rounded-xs focus:ring-1 focus:ring-blue-400 focus:bg-blue-50/40 hover:bg-slate-50/70 px-0.5 -mx-0.5 ${className}`,
      style,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        const text = e.currentTarget.textContent || '';
        if (text !== value) {
          onChange(text);
        }
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      },
      title: 'Click to edit text directly',
    },
    value
  );
};
