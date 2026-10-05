import React, { useState } from 'react';
import { SectionType, ColumnTarget } from '../types/resume';
import { X, Plus, Layers } from 'lucide-react';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultColumn?: ColumnTarget;
  onAddSection: (column: ColumnTarget, type: SectionType, title: string) => void;
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  defaultColumn = 'main',
  onAddSection,
}) => {
  const [sectionType, setSectionType] = useState<SectionType>('custom');
  const [sectionTitle, setSectionTitle] = useState('ACHIEVEMENTS');
  const [targetColumn, setTargetColumn] = useState<ColumnTarget>(defaultColumn);

  if (!isOpen) return null;

  const defaultTitles: Record<SectionType, string> = {
    custom: 'ACHIEVEMENTS',
    experience: 'EXPERIENCE',
    projects: 'PROJECTS',
    education: 'EDUCATION',
    skills: 'SKILLS',
    certifications: 'CERTIFICATIONS',
    languages: 'LANGUAGES',
    summary: 'PROFILE',
  };

  const handleTypeChange = (newType: SectionType) => {
    setSectionType(newType);
    setSectionTitle(defaultTitles[newType] || 'NEW SECTION');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = sectionTitle.trim() ? sectionTitle.trim().toUpperCase() : defaultTitles[sectionType];
    onAddSection(targetColumn, sectionType, finalTitle);
    onClose();
  };

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
            <Layers size={16} className="text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Add New Section</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Section Type */}
          <div>
            <label className="block font-semibold text-slate-900 mb-1">
              Section Type
            </label>
            <select
              value={sectionType}
              onChange={(e) => handleTypeChange(e.target.value as SectionType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium bg-white focus:outline-blue-500"
            >
              <option value="custom">Custom (Flexible Fields: Awards, Leadership, etc.)</option>
              <option value="experience">Experience (Work History, Roles)</option>
              <option value="projects">Projects (Open Source, Applications)</option>
              <option value="education">Education (Degrees, Universities)</option>
              <option value="skills">Skills (Categories, Technologies)</option>
              <option value="certifications">Certifications (Licenses, Badges)</option>
              <option value="languages">Languages (Proficiencies)</option>
              <option value="summary">Summary / Profile Statement</option>
            </select>
          </div>

          {/* Custom Section Title */}
          <div>
            <label className="block font-semibold text-slate-900 mb-1">
              Section Title (Heading)
            </label>
            <input
              type="text"
              required
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="e.g. ACHIEVEMENTS, OPEN SOURCE, LEADERSHIP"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold uppercase tracking-wider focus:outline-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Enter any title you wish (e.g. AWARDS, RESEARCH, VOLUNTEERING).
            </p>
          </div>

          {/* Target Column */}
          <div>
            <label className="block font-semibold text-slate-900 mb-1">
              Target Column
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTargetColumn('main')}
                className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors ${
                  targetColumn === 'main'
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Main Column (~68%)
              </button>
              <button
                type="button"
                onClick={() => setTargetColumn('sidebar')}
                className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors ${
                  targetColumn === 'sidebar'
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Sidebar Column (~32%)
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Plus size={14} /> Add Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
