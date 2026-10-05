import React from 'react';
import { ResumeTemplateConfig, ColumnTarget } from '../types/resume';
import { EditableText } from './EditableText';
import {
  ChevronUp,
  ChevronDown,
  ArrowLeftRight,
  Trash2,
  Plus,
  Sliders,
  GripVertical,
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

  return (
    <div
      className="group/section-header relative mb-2.5 transition-colors"
      {...dragHandleProps}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-grow">
          {/* Drag Handle in Edit Mode */}
          {isEditing && (
            <span
              className="opacity-0 group-hover/section-header:opacity-100 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-0.5 -ml-2 rounded transition-opacity no-print"
              title="Drag to reorder section"
            >
              <GripVertical size={13} />
            </span>
          )}

          <EditableText
            tag="h2"
            isEditing={isEditing}
            value={title}
            onChange={onUpdateTitle}
            placeholder="SECTION TITLE"
            className="font-bold uppercase tracking-wider block"
            style={{
              fontSize: `${typography.headingSize}px`,
              color: colors.primaryText,
              letterSpacing: '0.08em',
            }}
          />
        </div>

        {/* Action buttons visible during edit mode on hover */}
        {isEditing && (
          <div className="opacity-0 group-hover/section-header:opacity-100 transition-opacity flex items-center gap-0.5 bg-white/95 px-1 py-0.5 rounded-md shadow-xs border border-slate-200 text-slate-500 no-print z-10">
            {onAddItem && (
              <button
                type="button"
                onClick={onAddItem}
                title="Add new entry"
                className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors text-xs flex items-center gap-0.5"
              >
                <Plus size={13} />
              </button>
            )}

            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                title="Configure visible fields & section settings"
                className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
              >
                <Sliders size={12} />
              </button>
            )}

            {canMoveUp && onMoveUp && (
              <button
                type="button"
                onClick={onMoveUp}
                title="Move section up"
                className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
              >
                <ChevronUp size={13} />
              </button>
            )}
            {canMoveDown && onMoveDown && (
              <button
                type="button"
                onClick={onMoveDown}
                title="Move section down"
                className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
              >
                <ChevronDown size={13} />
              </button>
            )}
            {onToggleColumn && (
              <button
                type="button"
                onClick={onToggleColumn}
                title={`Move to ${column === 'main' ? 'Sidebar' : 'Main'} column`}
                className="p-1 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
              >
                <ArrowLeftRight size={13} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                title="Delete section"
                className="p-1 hover:text-red-600 hover:bg-slate-100 rounded transition-colors"
              >
                <Trash2 size={13} />
              </button>
            )}
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
