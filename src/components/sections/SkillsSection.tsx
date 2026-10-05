import React from 'react';
import { SkillGroup, ResumeTemplateConfig } from '../../types/resume';
import { EditableText } from '../EditableText';
import { Plus, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';

interface SkillsSectionProps {
  groups: SkillGroup[];
  config: ResumeTemplateConfig;
  isEditing: boolean;
  onUpdateGroups: (groups: SkillGroup[]) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  groups,
  config,
  isEditing,
  onUpdateGroups,
}) => {
  const { typography, colors, layout } = config;

  const updateGroup = (index: number, updated: Partial<SkillGroup>) => {
    const next = [...groups];
    next[index] = { ...next[index], ...updated };
    onUpdateGroups(next);
  };

  const deleteGroup = (index: number) => {
    onUpdateGroups(groups.filter((_, i) => i !== index));
  };

  const duplicateGroup = (index: number) => {
    const itemToClone = groups[index];
    const cloned: SkillGroup = {
      ...itemToClone,
      id: `sg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const next = [...groups];
    next.splice(index + 1, 0, cloned);
    onUpdateGroups(next);
  };

  const moveGroup = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= groups.length) return;
    const next = [...groups];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onUpdateGroups(next);
  };

  return (
    <div
      className="flex flex-col"
      style={{ gap: `${layout.entrySpacing - 2}px` }}
    >
      {groups.map((group, index) => (
        <div
          key={group.id}
          className="group/skill relative resume-entry-avoid-break"
        >
          {/* Action Bar for Skill Group */}
          {isEditing && (
            <div className="absolute right-0 -top-2 opacity-0 group-hover/skill:opacity-100 transition-opacity flex items-center gap-1 bg-white/95 px-1 py-0.5 rounded shadow-xs border border-slate-200 text-slate-500 z-10 no-print">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveGroup(index, 'up')}
                  title="Move up"
                  className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
                >
                  <ChevronUp size={11} />
                </button>
              )}
              {index < groups.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveGroup(index, 'down')}
                  title="Move down"
                  className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
                >
                  <ChevronDown size={11} />
                </button>
              )}
              <button
                type="button"
                onClick={() => duplicateGroup(index)}
                title="Duplicate skill group"
                className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded"
              >
                <Copy size={11} />
              </button>
              <button
                type="button"
                onClick={() => deleteGroup(index)}
                title="Delete skill group"
                className="p-1 hover:text-red-600 hover:bg-slate-100 rounded"
              >
                <Trash2 size={11} />
              </button>
            </div>
          )}

          {/* Group Category Name (Uppercase, bold, compact) */}
          <div className="tracking-wide uppercase font-semibold">
            <EditableText
              tag="h4"
              isEditing={isEditing}
              value={group.category}
              onChange={(category) => updateGroup(index, { category })}
              placeholder="[CATEGORY NAME]"
              style={{
                fontSize: `${typography.metadataSize}px`,
                color: colors.primaryText,
                letterSpacing: '0.04em',
              }}
            />
          </div>

          {/* Group Skills Content */}
          <div
            className="mt-0.5 font-normal"
            style={{
              fontSize: `${typography.bodySize}px`,
              lineHeight: '1.4',
              color: colors.secondaryText,
            }}
          >
            <EditableText
              multiline
              isEditing={isEditing}
              value={group.skills}
              onChange={(skills) => updateGroup(index, { skills })}
              placeholder="[Skill 1] · [Skill 2] · [Skill 3]"
              className="block"
            />
          </div>
        </div>
      ))}

      {isEditing && (
        <button
          type="button"
          onClick={() => {
            const newGroup: SkillGroup = {
              id: `sg-${Date.now()}`,
              category: '[NEW SKILL CATEGORY]',
              skills: '[Skill A] · [Skill B] · [Skill C]',
            };
            onUpdateGroups([...groups, newGroup]);
          }}
          className="flex items-center justify-center gap-1.5 py-1.5 px-3 border border-dashed border-slate-300 rounded text-xs text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/20 transition-colors no-print"
        >
          <Plus size={12} /> Add Skill Group
        </button>
      )}
    </div>
  );
};
