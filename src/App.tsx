import React, { useState, useEffect } from 'react';
import { initialResumeData } from './data/initialTemplate';
import {
  ResumeData,
  ResumeSection,
  ColumnTarget,
  SectionType,
  ResumeTemplateConfig,
  EntryItem,
} from './types/resume';
import { migrateResumeData, getDefaultFieldConfig } from './utils/migration';
import { ResumeDocument } from './components/ResumeDocument';
import { Toolbar } from './components/Toolbar';
import { CustomizerDrawer } from './components/CustomizerDrawer';

const STORAGE_KEY = 'enhancv_modern_resume_data_v3';

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return migrateResumeData(parsed);
      }
    } catch {
      // Ignore local storage parse error
    }
    return initialResumeData;
  });

  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1.0);

  // Auto-save to localStorage & sync in-memory content to code
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch {
      // Ignore quota exceeded error
    }

    try {
      fetch('/_api/sync-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData),
      }).catch(() => {});
    } catch {
      // Ignore network sync error in offline mode
    }
  }, [resumeData]);

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  // Handle Reset to Default Placeholders
  const handleReset = () => {
    if (
      window.confirm(
        'Reset template to default placeholder values? Any changes you made will be replaced.'
      )
    ) {
      setResumeData(initialResumeData);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'enhancv-modern-resume.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.header && parsed.sections && parsed.config) {
          setResumeData(migrateResumeData(parsed));
        } else {
          alert('Invalid resume JSON format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Update Header
  const handleUpdateHeader = (updated: Partial<ResumeData['header']>) => {
    setResumeData((prev) => ({
      ...prev,
      header: { ...prev.header, ...updated },
    }));
  };

  // Update Section
  const handleUpdateSection = (
    sectionId: string,
    updated: Partial<ResumeSection>
  ) => {
    setResumeData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, ...updated } : sec
      ),
    }));
  };

  // Move Section Up or Down within its Column (Stable Order)
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    setResumeData((prev) => {
      const current = prev.sections.find((s) => s.id === sectionId);
      if (!current) return prev;

      const colSections = prev.sections.filter((s) => s.column === current.column);
      const otherColSections = prev.sections.filter(
        (s) => s.column !== current.column
      );

      const idx = colSections.findIndex((s) => s.id === sectionId);
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= colSections.length) return prev;

      const reordered = [...colSections];
      const [moved] = reordered.splice(idx, 1);
      reordered.splice(targetIdx, 0, moved);

      return {
        ...prev,
        sections: [...reordered, ...otherColSections],
      };
    });
  };

  // Drag-and-drop Reordering within a Column
  const handleReorderSections = (
    column: ColumnTarget,
    fromIdx: number,
    toIdx: number
  ) => {
    setResumeData((prev) => {
      const colSections = prev.sections.filter((s) => s.column === column);
      const otherColSections = prev.sections.filter((s) => s.column !== column);

      if (fromIdx < 0 || fromIdx >= colSections.length || toIdx < 0 || toIdx >= colSections.length) {
        return prev;
      }

      const reordered = [...colSections];
      const [moved] = reordered.splice(fromIdx, 1);
      reordered.splice(toIdx, 0, moved);

      return {
        ...prev,
        sections: [...reordered, ...otherColSections],
      };
    });
  };

  // Toggle Section Column between Main and Sidebar
  const handleToggleSectionColumn = (sectionId: string) => {
    setResumeData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              column: sec.column === 'main' ? 'sidebar' : 'main',
            }
          : sec
      ),
    }));
  };

  // Delete Section
  const handleDeleteSection = (sectionId: string) => {
    setResumeData((prev) => ({
      ...prev,
      sections: prev.sections.filter((sec) => sec.id !== sectionId),
    }));
  };

  // Add Section with Custom Title, Type, and Column
  const handleAddSection = (
    column: ColumnTarget,
    type: SectionType,
    customTitle: string
  ) => {
    const timestamp = Date.now();
    const newId = `sec-${timestamp}`;
    const fieldConfig = getDefaultFieldConfig(type);

    let initialEntries: EntryItem[] = [];
    let summaryText = '';

    switch (type) {
      case 'summary':
        summaryText =
          '[Write a summary of your professional strengths, key domain experiences, and career objectives.]';
        break;
      case 'experience':
        initialEntries = [
          {
            id: `exp-${timestamp}`,
            title: '[Job Title / Role]',
            subtitle: '[Company Name]',
            date: 'Jan 2023 – Present',
            dateRange: {
              startMonth: 1,
              startYear: 2023,
              ongoing: true,
            },
            location: '[City, Country]',
            description: '[Summary overview of scope and key responsibilities]',
            bullets: [
              '[Action verb] [key project or achievement] resulting in [quantifiable outcome or metric].',
            ],
          },
        ];
        break;
      case 'projects':
        initialEntries = [
          {
            id: `proj-${timestamp}`,
            title: '[Project Name]',
            subtitle: '[Technologies: React · TypeScript · Node.js]',
            date: '2024',
            dateRange: {
              startYear: 2024,
            },
            link: 'github.com/project',
            bullets: [
              'Designed and developed [solution] delivering [benefit/performance].',
            ],
          },
        ];
        break;
      case 'education':
        initialEntries = [
          {
            id: `edu-${timestamp}`,
            title: '[Degree / Program Name]',
            subtitle: '[University / Institution]',
            date: '2019 – 2023',
            dateRange: {
              startYear: 2019,
              endYear: 2023,
            },
            grade: 'GPA: 3.8 / 4.0',
          },
        ];
        break;
      case 'skills':
        initialEntries = [
          {
            id: `sg-${timestamp}`,
            title: '[NEW SKILL GROUP]',
            skills: 'Skill 1 · Skill 2 · Skill 3',
            skillsList: ['Skill 1', 'Skill 2', 'Skill 3'],
          },
        ];
        break;
      case 'certifications':
        initialEntries = [
          {
            id: `cert-${timestamp}`,
            title: '[Certification Name]',
            subtitle: '[Issuing Authority]',
            date: '2024',
            grade: 'Certified',
          },
        ];
        break;
      case 'languages':
        initialEntries = [
          {
            id: `lang-${timestamp}`,
            title: '[Language Name]',
            subtitle: 'Fluent',
            proficiency: 'Fluent',
            level: 4,
          },
        ];
        break;
      case 'custom':
      default:
        initialEntries = [
          {
            id: `custom-${timestamp}`,
            title: '[Achievement / Item Title]',
            subtitle: '[Organization / Context]',
            date: '2023',
            description: '[Description of achievement, award, or contribution]',
            bullets: ['[Detail outcome or recognition]'],
          },
        ];
        break;
    }

    const newSection: ResumeSection = {
      id: newId,
      type,
      title: customTitle.trim().toUpperCase(),
      column,
      visible: true,
      fieldConfig,
      entries: initialEntries,
      summaryText,
    };

    setResumeData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  // Update Config
  const handleUpdateConfig = (updated: Partial<ResumeTemplateConfig>) => {
    setResumeData((prev) => ({
      ...prev,
      config: { ...prev.config, ...updated },
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Application Toolbar */}
      <Toolbar
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        isCustomizerOpen={isCustomizerOpen}
        onToggleCustomizer={() => setIsCustomizerOpen(!isCustomizerOpen)}
        onPrint={handlePrint}
        onReset={handleReset}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        zoom={zoom}
        onZoomChange={setZoom}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 py-8 px-4 sm:px-6 overflow-x-auto flex justify-center items-start">
        <div
          className="transition-transform duration-150 origin-top"
          style={{
            transform: zoom !== 1 ? `scale(${zoom})` : undefined,
          }}
        >
          {/* A4 Resume Document */}
          <ResumeDocument
            data={resumeData}
            isEditing={isEditing}
            onUpdateHeader={handleUpdateHeader}
            onUpdateSection={handleUpdateSection}
            onMoveSection={handleMoveSection}
            onReorderSections={handleReorderSections}
            onToggleSectionColumn={handleToggleSectionColumn}
            onDeleteSection={handleDeleteSection}
            onAddSection={handleAddSection}
          />
        </div>
      </main>

      {/* Retractable Customizer Drawer */}
      <CustomizerDrawer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={resumeData.config}
        onUpdateConfig={handleUpdateConfig}
        sections={resumeData.sections}
        onUpdateSection={handleUpdateSection}
        onMoveSection={handleMoveSection}
        onToggleSectionColumn={handleToggleSectionColumn}
        onDeleteSection={handleDeleteSection}
        onAddSection={handleAddSection}
      />
    </div>
  );
}
