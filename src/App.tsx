import React, { useState, useEffect } from 'react';
import { initialResumeData } from './data/initialTemplate';
import {
  ResumeData,
  ResumeSection,
  ColumnTarget,
  SectionType,
  ResumeTemplateConfig,
} from './types/resume';
import { ResumeDocument } from './components/ResumeDocument';
import { Toolbar } from './components/Toolbar';
import { CustomizerDrawer } from './components/CustomizerDrawer';

const STORAGE_KEY = 'enhancv_modern_resume_data_v1';

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure portfolio is removed and 12mm margin applied as requested
        if (parsed.header) {
          parsed.header.website = '';
        }
        if (parsed.config?.layout) {
          if (!parsed.config.layout.pageMargin || parsed.config.layout.pageMargin === 'standard') {
            parsed.config.layout.pageMargin = '12mm';
          }
        }
        return parsed;
      }
    } catch {
      // Ignore local storage parse error
    }
    return initialResumeData;
  });

  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1.0);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch {
      // Ignore quota exceeded error
    }
  }, [resumeData]);

  // Handle Print
  const handlePrint = () => {
    // Switch to preview mode briefly if desired, then print
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
          setResumeData(parsed);
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

  // Move Section Up or Down within its Column
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

      // Recombine maintaining overall sequence
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
    if (window.confirm('Are you sure you want to remove this section?')) {
      setResumeData((prev) => ({
        ...prev,
        sections: prev.sections.filter((sec) => sec.id !== sectionId),
      }));
    }
  };

  // Add Section
  const handleAddSection = (column: ColumnTarget, type: SectionType) => {
    const timestamp = Date.now();
    const newId = `sec-${timestamp}`;

    let newSection: ResumeSection = {
      id: newId,
      type,
      title: type.toUpperCase(),
      column,
      visible: true,
    };

    switch (type) {
      case 'summary':
        newSection.title = 'PROFILE';
        newSection.summaryText =
          '[Write a summary of your professional strengths, key domain experiences, and career objectives.]';
        break;
      case 'experience':
        newSection.title = 'EXPERIENCE';
        newSection.experienceEntries = [
          {
            id: `exp-${timestamp}`,
            title: '[Job Title]',
            company: '[Company Name]',
            date: '2023 – Present',
            location: '[City, Country]',
            bullets: [
              '[Action verb] [key project or achievement] resulting in [quantifiable outcome or metric].',
            ],
          },
        ];
        break;
      case 'projects':
        newSection.title = 'PROJECTS';
        newSection.projectEntries = [
          {
            id: `proj-${timestamp}`,
            name: '[Project Name]',
            technologies: '[Technologies: React · TypeScript · Node.js]',
            bullets: [
              'Designed and developed [solution] delivering [benefit/performance].',
            ],
          },
        ];
        break;
      case 'education':
        newSection.title = 'EDUCATION';
        newSection.educationEntries = [
          {
            id: `edu-${timestamp}`,
            degree: '[Degree Name]',
            institution: '[University Name]',
            date: '2019 – 2023',
            grade: 'GPA: 3.8',
          },
        ];
        break;
      case 'skills':
        newSection.title = 'SKILLS';
        newSection.skillGroups = [
          {
            id: `sg-${timestamp}`,
            category: '[NEW SKILL GROUP]',
            skills: '[Skill 1] · [Skill 2] · [Skill 3]',
          },
        ];
        break;
      case 'certifications':
        newSection.title = 'CERTIFICATIONS';
        newSection.certificationEntries = [
          {
            id: `cert-${timestamp}`,
            name: '[Certification Name]',
            issuer: '[Issuing Authority]',
            date: '2024',
            achievement: 'Certified',
          },
        ];
        break;
      case 'languages':
        newSection.title = 'LANGUAGES';
        newSection.languageEntries = [
          {
            id: `lang-${timestamp}`,
            language: '[Language Name]',
            proficiency: 'Fluent',
            level: 5,
          },
        ];
        break;
      case 'custom':
      default:
        newSection.title = 'HIGHLIGHTS';
        newSection.customEntries = [
          {
            id: `custom-${timestamp}`,
            title: '[Highlight / Achievement Title]',
            subtitle: '[Organization / Context]',
            date: '2023',
            bullets: [
              '[Key detail describing the achievement, publication, or award.]',
            ],
          },
        ];
        break;
    }

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
