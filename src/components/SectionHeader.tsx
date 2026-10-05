import React, { useState, useRef, useEffect } from 'react';
import { ResumeTemplateConfig, ColumnTarget } from '../types/resume';
import { EditableText } from './EditableText';
import { getHeadingLetterSpacing } from '../utils/typography';
import {
  ChevronUp,
  ChevronDown,
  ArrowLeftRight,
  Trash2,
  Plus,
  Sliders,
  GripVertical,
  MoreHorizontal,
} from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  column: ColumnTarget;
  config: ResumeTemplateConfig;
  isEditing: boolean;
  onUpdateTitle: (title: string) => void;
  onOpenSettings?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleColumn?: () => void;
  onDelete?: () => void;
  onAddItem?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  dragHandleProps?: {
    draggable?: boolean;
    onDragStart?: (e: React.DragEvent) => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent) => void;
    onDragEnd?: () => void;
  };
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  column,
  config,
  isEditing,
  onUpdateTitle,
  onOpenSettings,
  onMoveUp,
  onMoveDown,
  onToggleColumn,
  onDelete,
  onAddItem,
  canMoveUp = true,
  canMoveDown = true,
  dragHandleProps,
}) => {
  const { typography, colors } = config;
  const isAccentDivider = colors.headingDividerColor === 'accent';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <div
      className="group/section-header relative mb-2 transition-colors"
      {...dragHandleProps}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-grow min-w-0">
          {/* Subtle Drag Handle in Edit Mode */}
          {isEditing && (
            <span
              className="opacity-0 group-hover/section-header:opacity-100 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-0.5 -ml-2 rounded transition-opacity no-print"
              title="Drag to reorder section"
            >
              <GripVertical size={12} />
            </span>
          )}

          <EditableText
            tag="h2"
            isEditing={isEditing}
            value={title}
            onChange={onUpdateTitle}
            placeholder="SECTION TITLE"
            className="font-bold uppercase block"
            style={{
              fontSize: `${typography.headingSize}px`,
              color: colors.sectionHeadingColor || colors.primaryText,
              letterSpacing: getHeadingLetterSpacing(typography.letterSpacing),
            }}
          />
        </div>

        {/* Compact non-intrusive action controls in Edit Mode */}
        {isEditing && (
          <div className="opacity-0 group-hover/section-header:opacity-100 transition-opacity flex items-center gap-1 no-print z-10 shrink-0">
            {onAddItem && (
              <button
                type="button"
                onClick={onAddItem}
                title="Add new entry to this section"
                className="p-1 hover:text-blue-600 hover:bg-slate-100 text-slate-500 rounded transition-colors text-xs flex items-center gap-0.5"
              >
                <Plus size={13} />
              </button>
            )}

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                title="Section options"
                className="p-1 hover:text-slate-800 hover:bg-slate-100 text-slate-500 rounded transition-colors"
              >
                <MoreHorizontal size={13} />
              </button>

              {isMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-xl p-1.5 z-40 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-75"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {onOpenSettings && (
                    <button
                      type="button"
                      onClick={onOpenSettings}
                      className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-50 text-slate-700"
                    >
                      <Sliders size={12} className="text-blue-600" />
                      <span>Configure Fields</span>
                    </button>
                  )}

                  {canMoveUp && onMoveUp && (
                    <button
                      type="button"
                      onClick={onMoveUp}
                      className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-50 text-slate-700"
                    >
                      <ChevronUp size={12} />
                      <span>Move Up</span>
                    </button>
                  )}

                  {canMoveDown && onMoveDown && (
                    <button
                      type="button"
                      onClick={onMoveDown}
                      className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-50 text-slate-700"
                    >
                      <ChevronDown size={12} />
                      <span>Move Down</span>
                    </button>
                  )}

                  {onToggleColumn && (
                    <button
                      type="button"
                      onClick={onToggleColumn}
                      className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-50 text-slate-700"
                    >
                      <ArrowLeftRight size={12} className="text-indigo-600" />
                      <span>Move to {column === 'main' ? 'Sidebar' : 'Main'}</span>
                    </button>
                  )}

                  {onDelete && (
                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={onDelete}
                        className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded hover:bg-red-50 text-red-600 font-medium"
                      >
                        <Trash2 size={12} />
                        <span>Delete Section</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhancv Modern Underline Divider */}
      <div
        className="w-full mt-1.5"
        style={{
          height: '1.5px',
          backgroundColor: isAccentDivider ? colors.accentColor : colors.dividerColor,
        }}
      />
    </div>
  );
};
