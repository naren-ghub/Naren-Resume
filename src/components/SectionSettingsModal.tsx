import React from 'react';
import { ResumeSection, SectionFieldConfig, ColumnTarget } from '../types/resume';
import { X, Sliders, Trash2, ArrowLeftRight, Eye, EyeOff } from 'lucide-react';

interface SectionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: ResumeSection;
  onUpdateSection: (updated: Partial<ResumeSection>) => void;
  onDeleteSection: () => void;
  onToggleColumn: () => void;
}

export const SectionSettingsModal: React.FC<SectionSettingsModalProps> = ({
  isOpen,
  onClose,
  section,
  onUpdateSection,
  onDeleteSection,
  onToggleColumn,
}) => {
  if (!isOpen) return null;

  const config = section.fieldConfig || {};

  const toggleField = (fieldKey: keyof SectionFieldConfig) => {
    const updatedConfig: SectionFieldConfig = {
      ...config,
      [fieldKey]: config[fieldKey] === false ? true : false,
    };
    onUpdateSection({ fieldConfig: updatedConfig });
  };

  const getFieldLabels = () => {
    switch (section.type) {
      case 'experience':
        return [
          { key: 'showTitle' as const, label: 'Job Title' },
          { key: 'showSubtitle' as const, label: 'Company Name' },
          { key: 'showDate' as const, label: 'Date / Date Range' },
          { key: 'showLocation' as const, label: 'Location' },
          { key: 'showDescription' as const, label: 'Summary Description' },
          { key: 'showBullets' as const, label: 'Bullet Points' },
          { key: 'showLink' as const, label: 'Website / Link' },
        ];
      case 'projects':
        return [
          { key: 'showTitle' as const, label: 'Project Name' },
          { key: 'showSubtitle' as const, label: 'Technologies / Tech Stack' },
          { key: 'showDate' as const, label: 'Date' },
          { key: 'showLink' as const, label: 'Project Link / Demo' },
          { key: 'showDescription' as const, label: 'Project Description' },
          { key: 'showBullets' as const, label: 'Bullet Points' },
          { key: 'showLocation' as const, label: 'Location' },
        ];
      case 'education':
        return [
          { key: 'showTitle' as const, label: 'Degree / Program' },
          { key: 'showSubtitle' as const, label: 'Institution / University' },
          { key: 'showDate' as const, label: 'Date / Graduation' },
          { key: 'showGrade' as const, label: 'GPA / Honors / Grade' },
          { key: 'showDescription' as const, label: 'Coursework / Details' },
          { key: 'showLocation' as const, label: 'Location' },
          { key: 'showBullets' as const, label: 'Bullet Points' },
        ];
      case 'certifications':
        return [
          { key: 'showTitle' as const, label: 'Certification Name' },
          { key: 'showSubtitle' as const, label: 'Issuing Organization' },
          { key: 'showDate' as const, label: 'Date / Year' },
          { key: 'showGrade' as const, label: 'Achievement / Distinction' },
          { key: 'showDescription' as const, label: 'Credential Details' },
          { key: 'showLink' as const, label: 'Credential URL' },
        ];
      case 'languages':
        return [
          { key: 'showTitle' as const, label: 'Language Name' },
          { key: 'showSubtitle' as const, label: 'Proficiency Label' },
          { key: 'showProficiency' as const, label: 'Proficiency Dots (Rating)' },
          { key: 'showDescription' as const, label: 'Optional Description / Notes' },
        ];
      case 'skills':
        return [
          { key: 'showTitle' as const, label: 'Category Name' },
          { key: 'showDescription' as const, label: 'Optional Description / Context' },
          { key: 'showProficiency' as const, label: 'Proficiency Rating' },
        ];
      case 'custom':
      default:
        return [
          { key: 'showTitle' as const, label: 'Entry Title' },
          { key: 'showSubtitle' as const, label: 'Subtitle / Organization' },
          { key: 'showDate' as const, label: 'Date / Year' },
          { key: 'showLocation' as const, label: 'Location' },
          { key: 'showLink' as const, label: 'Link / URL' },
          { key: 'showDescription' as const, label: 'Description' },
          { key: 'showBullets' as const, label: 'Bullet Points' },
        ];
    }
  };

  const fieldList = getFieldLabels();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 no-print"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Section Settings</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Section Title */}
          <div>
            <label className="block font-semibold text-slate-900 mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => onUpdateSection({ title: e.target.value.toUpperCase() })}
              placeholder="SECTION TITLE"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold uppercase tracking-wider focus:outline-blue-500"
            />
          </div>

          {/* Section Column & Visibility */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                Column Placement
              </label>
              <button
                type="button"
                onClick={onToggleColumn}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700 capitalize"
              >
                <ArrowLeftRight size={13} className="text-blue-600" />
                {section.column} Column
              </button>
            </div>
            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                Visibility
              </label>
              <button
                type="button"
                onClick={() => onUpdateSection({ visible: !section.visible })}
                className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 border rounded-lg transition-colors font-medium ${
                  section.visible
                    ? 'border-blue-200 bg-blue-50 text-blue-800'
                    : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                }`}
              >
                {section.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                {section.visible ? 'Visible' : 'Hidden'}
              </button>
            </div>
          </div>

          {/* Dynamic Field Visibility Toggles for this Section */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-semibold text-slate-900">
                Visible Fields in this Section
              </label>
              <span className="text-[10px] text-slate-500">
                Unchecked fields leave 0 blank space
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              {fieldList.map(({ key, label }) => {
                const isEnabled = config[key] !== false;
                return (
                  <label
                    key={key}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-white transition-colors cursor-pointer select-none"
                  >
                    <span className="text-xs text-slate-800 font-medium">
                      {label}
                    </span>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => toggleField(key)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete section "${section.title}"?`)) {
                  onDeleteSection();
                  onClose();
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <Trash2 size={13} /> Delete Section
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
