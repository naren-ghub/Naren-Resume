import React, { useRef, useState, useEffect, useCallback } from 'react';
import { sanitizePastedContent, cleanHtmlForStorage } from '../utils/sanitizeHtml';
import { RichTextFloatingToolbar, ToolbarPosition } from './RichTextFloatingToolbar';

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
  onRemove?: () => void; // Deprecated: inline X removed per Section 10
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
}) => {
  const elRef = useRef<HTMLElement>(null);
  const [toolbarPos, setToolbarPos] = useState<ToolbarPosition | null>(null);

  // Check selection to position floating toolbar with viewport collision awareness
  const checkSelection = useCallback(() => {
    if (!richText || !isEditing) {
      setToolbarPos(null);
      return;
    }

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !elRef.current) {
      setToolbarPos(null);
      return;
    }

    // Check if selection is inside this editable element
    if (elRef.current.contains(sel.anchorNode) && elRef.current.contains(sel.focusNode)) {
      try {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect && rect.width > 0) {
          // Viewport collision handling: if selection is near top of viewport, flip below
          const placeBelow = rect.top < 65;
          const top = placeBelow ? rect.bottom + 8 : rect.top - 8;
          // Clamp horizontally to stay inside viewport
          const clampedLeft = Math.max(120, Math.min(window.innerWidth - 120, rect.left + rect.width / 2));

          setToolbarPos({
            top,
            left: clampedLeft,
            placement: placeBelow ? 'bottom' : 'top',
          });
          return;
        }
      } catch (err) {
        // Range getBoundingClientRect could fail in edge cases
      }
    }

    setToolbarPos(null);
  }, [richText, isEditing]);

  useEffect(() => {
    const handleDocSelectionChange = () => {
      // Small timeout to allow mouseup/selection to settle
      setTimeout(checkSelection, 10);
    };

    if (isEditing && richText) {
      document.addEventListener('selectionchange', handleDocSelectionChange);
    }
    return () => {
      document.removeEventListener('selectionchange', handleDocSelectionChange);
    };
  }, [isEditing, richText, checkSelection]);

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

  // Controlled Paste Behavior (Strips external styles, keeps semantic bold/italic/underline/link)
  const handlePaste = (e: React.ClipboardEvent<HTMLElement>) => {
    e.preventDefault();

    if (!richText) {
      const text = e.clipboardData.getData('text/plain') || '';
      document.execCommand('insertText', false, text);
      return;
    }

    const html = e.clipboardData.getData('text/html');
    if (html) {
      const cleaned = sanitizePastedContent(html);
      document.execCommand('insertHTML', false, cleaned);
    } else {
      const text = e.clipboardData.getData('text/plain') || '';
      document.execCommand('insertText', false, text);
    }

    // Immediately trigger change to retain clean HTML
    if (elRef.current) {
      const updatedHtml = cleanHtmlForStorage(elRef.current.innerHTML || '');
      onChange(updatedHtml);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    // Rich text shortcuts (Ctrl/Cmd + B, I, U)
    if (richText && (e.ctrlKey || e.metaKey)) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        document.execCommand('bold', false);
        syncValue();
        return;
      }
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        document.execCommand('italic', false);
        syncValue();
        return;
      }
      if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        document.execCommand('underline', false);
        syncValue();
        return;
      }
    }

    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const syncValue = () => {
    if (!elRef.current) return;
    if (richText) {
      const html = cleanHtmlForStorage(elRef.current.innerHTML || '');
      const textOnly = elRef.current.textContent || '';
      if (!textOnly.trim()) {
        if (value !== '') onChange('');
      } else if (html !== value) {
        onChange(html);
      }
    } else {
      const text = (elRef.current.textContent || '').trim();
      if (text !== value) {
        onChange(text);
      }
    }
  };

  const handleBlur = () => {
    syncValue();
    setToolbarPos(null);
  };

  const handleFloatingFormat = (
    command: 'bold' | 'italic' | 'underline' | 'createLink' | 'removeFormat',
    val?: string
  ) => {
    if (!elRef.current) return;
    elRef.current.focus();

    if (command === 'createLink' && val) {
      document.execCommand('createLink', false, val);
      // Ensure link opens in new tab and doesn't have broken styling
      const links = elRef.current.querySelectorAll('a');
      links.forEach((a) => {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        a.removeAttribute('style');
      });
    } else if (command === 'removeFormat') {
      document.execCommand('removeFormat', false);
      document.execCommand('unlink', false);
    } else {
      document.execCommand(command, false);
    }

    syncValue();
    setTimeout(checkSelection, 50);
  };

  const contentElement = React.createElement(tag, {
    ref: elRef,
    className: `outline-none transition-colors rounded-xs focus:ring-1 focus:ring-blue-400 focus:bg-blue-50/30 hover:bg-slate-50/60 px-0.5 -mx-0.5 ${
      isEmpty ? 'text-slate-400 italic' : ''
    } ${className}`,
    style,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onPaste: handlePaste,
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
    onMouseUp: checkSelection,
    onKeyUp: checkSelection,
    dangerouslySetInnerHTML: richText && value ? { __html: value } : undefined,
    children: richText && value ? undefined : isEmpty ? placeholder : value,
    title: richText
      ? 'Click to edit (select text for Bold/Italic/Underline toolbar)'
      : 'Click to edit text directly',
  });

  return (
    <>
      {richText && isEditing && (
        <RichTextFloatingToolbar
          position={toolbarPos}
          onFormat={handleFloatingFormat}
        />
      )}
      {contentElement}
    </>
  );
};
