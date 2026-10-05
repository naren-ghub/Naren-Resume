import React, { useState, useRef } from 'react';
import { ResumeTypography, ResumeColors } from '../types/resume';
import { getBodyLetterSpacing } from '../utils/typography';
import { X, Plus, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';

interface SkillsTagEditorProps {
  skillsList: string[];
  isEditing: boolean;
  typography: ResumeTypography;
  colors: ResumeColors;
  onChange: (newList: string[]) => void;
}

export const SkillsTagEditor: React.FC<SkillsTagEditorProps> = ({
  skillsList = [],
  isEditing,
  typography,
  colors,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Border color for the subtle underline
  const underlineColor = colors.dividerColor || '#e2e8f0';

  // PREVIEW / PRINT MODE: Clean inline horizontal packing with subtle light underlines, NO dots, NO pills
  if (!isEditing) {
    if (!skillsList || skillsList.length === 0) return null;

    return (
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 mt-0.5">
        {skillsList.map((skill, idx) => (
          <span
            key={idx}
            className="inline-block pb-0.5 shrink-0 font-semibold"
            style={{
              borderBottom: `1px solid ${underlineColor}`,
              fontSize: `${typography.bodySize}px`,
              lineHeight: '1.25',
              letterSpacing: getBodyLetterSpacing(typography.letterSpacing),
              color: colors.primaryText,
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    );
  }

  // EDIT MODE
  const commitSkill = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;

    // Check if skill already exists
    if (!skillsList.includes(trimmed)) {
      onChange([...skillsList, trimmed]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // ENTER or COMMA commits the skill (Space is normal text!)
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitSkill(inputValue);
      return;
    }

    // Backspace on empty input removes previous skill
    if (e.key === 'Backspace' && !inputValue && skillsList.length > 0) {
      e.preventDefault();
      const updated = [...skillsList];
      updated.pop();
      onChange(updated);
    }
  };

  // Handle multi-skill pasting (e.g. newline-separated or comma-separated)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted && (pasted.includes('\n') || pasted.includes(',') || pasted.includes('·'))) {
      e.preventDefault();
      const tokens = pasted
        .split(/[\n,·]+/)
        .map((t) => t.trim())
        .filter(Boolean);

      const combined = [...skillsList];
      tokens.forEach((t) => {
        if (!combined.includes(t)) {
          combined.push(t);
        }
      });
      onChange(combined);
      setInputValue('');
    }
  };

  const removeSkill = (index: number) => {
    const updated = skillsList.filter((_, i) => i !== index);
    onChange(updated);
  };

  const startEditingSkill = (index: number) => {
    setEditingIndex(index);
    setEditValue(skillsList[index]);
  };

  const saveEditedSkill = (index: number) => {
    const trimmed = editValue.trim();
    if (trimmed) {
      const updated = [...skillsList];
      updated[index] = trimmed;
      onChange(updated);
    } else {
      removeSkill(index);
    }
    setEditingIndex(null);
  };

  // Drag and drop reordering (Requirement 3: e.g. dragging RAG to 4th position)
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    e.stopPropagation();
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== targetIdx) {
      setDragOverIdx(targetIdx);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }
    const updated = [...skillsList];
    const [moved] = updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, moved);
    onChange(updated);
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  // Nudge skill position left or right
  const moveSkill = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= skillsList.length) return;
    const updated = [...skillsList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    onChange(updated);
  };

  return (
    <div className="mt-0.5">
      {/* Enhancv Modern Underline Layout: Wrapping, horizontal packing, individual items with drag reorder */}
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        {skillsList.map((skill, idx) => {
          if (editingIndex === idx) {
            return (
              <input
                key={idx}
                autoFocus
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEditedSkill(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    saveEditedSkill(idx);
                  } else if (e.key === 'Escape') {
                    setEditingIndex(null);
                  }
                }}
                className="px-1 py-0 border-b-2 border-blue-500 bg-transparent text-xs text-slate-900 outline-none"
                style={{ minWidth: '50px', width: `${Math.max(editValue.length * 8, 55)}px` }}
              />
            );
          }

          const isBeingDragged = draggedIdx === idx;
          const isTargeted = dragOverIdx === idx && draggedIdx !== idx;

          return (
            <span
              key={idx}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={() => {
                setDraggedIdx(null);
                setDragOverIdx(null);
              }}
              className={`group/skill relative inline-flex items-center gap-0.5 pb-0.5 font-semibold transition-all cursor-grab active:cursor-grabbing select-none ${
                isBeingDragged ? 'opacity-30 scale-95' : ''
              } ${isTargeted ? 'ring-2 ring-blue-500 rounded-xs bg-blue-50/50 px-1' : ''}`}
              style={{
                borderBottom: `1px solid ${underlineColor}`,
                fontSize: `${typography.bodySize}px`,
                lineHeight: '1.25',
                letterSpacing: getBodyLetterSpacing(typography.letterSpacing),
                color: colors.primaryText,
              }}
              title="Drag to change position in list, or click to edit"
            >
              {/* Subtle Drag Handle Icon visible on hover */}
              <GripVertical
                size={9}
                className="opacity-0 group-hover/skill:opacity-100 text-slate-400 hover:text-slate-700 shrink-0 transition-opacity no-print"
                aria-hidden="true"
              />

              <span
                onClick={(e) => {
                  e.stopPropagation();
                  startEditingSkill(idx);
                }}
                className="hover:text-blue-600 transition-colors"
              >
                {skill}
              </span>

              {/* Quick Reorder Arrow Buttons on Hover */}
              <span className="opacity-0 group-hover/skill:opacity-100 inline-flex items-center transition-opacity no-print ml-0.5">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSkill(idx, 'left');
                    }}
                    title="Move skill earlier"
                    className="p-0.5 text-slate-400 hover:text-blue-600 rounded"
                  >
                    <ChevronLeft size={10} />
                  </button>
                )}
                {idx < skillsList.length - 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSkill(idx, 'right');
                    }}
                    title="Move skill later"
                    className="p-0.5 text-slate-400 hover:text-blue-600 rounded"
                  >
                    <ChevronRight size={10} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSkill(idx);
                  }}
                  title="Remove skill"
                  className="hover:text-red-600 text-slate-400 p-0.5 transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            </span>
          );
        })}

        {/* Minimal inline input for adding a skill (Press Enter to add) */}
        <div className="inline-flex items-center gap-1 no-print">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={skillsList.length === 0 ? '+ Add skill...' : '+ Add'}
            className="pb-0.5 border-b border-dashed border-slate-300 hover:border-blue-400 focus:border-blue-500 focus:border-solid bg-transparent text-xs text-slate-600 outline-none transition-colors"
            style={{ width: inputValue ? `${Math.max(inputValue.length * 8, 55)}px` : '55px' }}
          />
          {inputValue.trim() && (
            <button
              type="button"
              onClick={() => commitSkill(inputValue)}
              title="Add skill (Enter)"
              className="text-blue-600 hover:text-blue-800 p-0.5"
            >
              <Plus size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
