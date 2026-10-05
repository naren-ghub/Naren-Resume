import React, { useRef } from 'react';
import { ResumeData, ColumnTarget, ResumeSection, SectionType } from '../types/resume';
import { Header } from './Header';
import { SectionRenderer } from './SectionRenderer';
import { Plus } from 'lucide-react';

interface ResumeDocumentProps {
  data: ResumeData;
  isEditing: boolean;
  onUpdateHeader: (updated: Partial<ResumeData['header']>) => void;
  onUpdateSection: (sectionId: string, updated: Partial<ResumeSection>) => void;
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
  onToggleSectionColumn: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddSection: (column: ColumnTarget, type: SectionType) => void;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({
  data,
  isEditing,
  onUpdateHeader,
  onUpdateSection,
  onMoveSection,
  onToggleSectionColumn,
  onDeleteSection,
  onAddSection,
}) => {
  const { header, sections, config } = data;
  const { typography, colors, layout } = config;
  const docRef = useRef<HTMLDivElement>(null);

  // Compute padding based on margin setting
  const marginValues: Record<string, string> = {
    '12mm': '12mm 12mm',
    compact: '14mm 14mm',
    standard: '18mm 18mm',
    spacious: '22mm 22mm',
  };
  const paddingValue = marginValues[layout.pageMargin] || '12mm 12mm';

  // Filter sections by column and sort by order
  const mainSections = sections.filter((s) => s.column === 'main' && (s.visible || isEditing));
  const sidebarSections = sections.filter((s) => s.column === 'sidebar' && (s.visible || isEditing));

  // Font family mapping
  const fontClass =
    typography.fontFamily === 'Plus Jakarta Sans'
      ? 'font-["Plus_Jakarta_Sans",sans-serif]'
      : typography.fontFamily === 'Inter'
      ? 'font-["Inter",sans-serif]'
      : typography.fontFamily === 'Outfit'
      ? 'font-["Outfit",sans-serif]'
      : typography.fontFamily === 'DM Sans'
      ? 'font-["DM_Sans",sans-serif]'
      : 'font-["Source_Serif_4",serif]';

  return (
    <div
      ref={docRef}
      id="resume-document"
      className={`a4-screen-sheet a4-print-target shadow-xl mx-auto ${fontClass}`}
      style={
        {
          padding: paddingValue,
          backgroundColor: '#ffffff',
          color: colors.primaryText,
          '--page-padding': paddingValue,
        } as React.CSSProperties
      }
    >
      {/* Visual Page 1 Boundary Guide on Screen */}
      <div className="a4-page-boundary-guide no-print" aria-hidden="true" />

      {/* Full-Width Header */}
      <Header
        data={header}
        config={config}
        isEditing={isEditing}
        onUpdate={onUpdateHeader}
      />

      {/* Two-Column Layout */}
      <div
        className="w-full flex items-start mt-4"
        style={{
          gap: `${layout.columnGap}px`,
        }}
      >
        {/* Main Career Narrative Column (Dominant: ~68%) */}
        <main
          className="flex flex-col min-w-0"
          style={{
            width: `${layout.mainColumnRatio}%`,
            flexGrow: 1,
          }}
        >
          {mainSections.map((section, idx) => (
            <SectionRenderer
              key={section.id}
              section={section}
              column="main"
              config={config}
              isEditing={isEditing}
              canMoveUp={idx > 0}
              canMoveDown={idx < mainSections.length - 1}
              onUpdateSection={(updated) => onUpdateSection(section.id, updated)}
              onMoveUp={() => onMoveSection(section.id, 'up')}
              onMoveDown={() => onMoveSection(section.id, 'down')}
              onToggleColumn={() => onToggleSectionColumn(section.id)}
              onDeleteSection={() => onDeleteSection(section.id)}
            />
          ))}

          {/* Quick Add Section Button for Main Column */}
          {isEditing && (
            <div className="mt-2 pt-2 border-t border-dashed border-slate-200 no-print">
              <button
                type="button"
                onClick={() => onAddSection('main', 'custom')}
                className="w-full py-2 border border-dashed border-slate-300 rounded text-xs text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus size={13} /> Add Section to Main Column
              </button>
            </div>
          )}
        </main>

        {/* Subtle Vertical Hairline Divider between columns */}
        {layout.showVerticalDivider && (
          <div
            className="self-stretch w-[1px] shrink-0"
            style={{ backgroundColor: colors.dividerColor }}
            aria-hidden="true"
          />
        )}

        {/* Sidebar Column (Supporting: ~32%) */}
        <aside
          className="flex flex-col min-w-0 rounded-xs"
          style={{
            width: `${100 - layout.mainColumnRatio}%`,
            backgroundColor:
              colors.sidebarBackground && colors.sidebarBackground !== 'transparent'
                ? colors.sidebarBackground
                : undefined,
            padding:
              colors.sidebarBackground && colors.sidebarBackground !== 'transparent'
                ? '8px 10px'
                : undefined,
          }}
        >
          {sidebarSections.map((section, idx) => (
            <SectionRenderer
              key={section.id}
              section={section}
              column="sidebar"
              config={config}
              isEditing={isEditing}
              canMoveUp={idx > 0}
              canMoveDown={idx < sidebarSections.length - 1}
              onUpdateSection={(updated) => onUpdateSection(section.id, updated)}
              onMoveUp={() => onMoveSection(section.id, 'up')}
              onMoveDown={() => onMoveSection(section.id, 'down')}
              onToggleColumn={() => onToggleSectionColumn(section.id)}
              onDeleteSection={() => onDeleteSection(section.id)}
            />
          ))}

          {/* Quick Add Section Button for Sidebar Column */}
          {isEditing && (
            <div className="mt-2 pt-2 border-t border-dashed border-slate-200 no-print">
              <button
                type="button"
                onClick={() => onAddSection('sidebar', 'skills')}
                className="w-full py-2 border border-dashed border-slate-300 rounded text-xs text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus size={13} /> Add Section to Sidebar
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
