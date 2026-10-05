import React, { useState, useEffect } from 'react';
import { DateRange } from '../types/resume';
import { MONTH_NAMES, formatDateRange, parseDateString } from '../utils/dateUtils';
import { Calendar, X, Check, Trash2 } from 'lucide-react';

interface DateRangePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRange?: DateRange;
  initialDateString?: string;
  onSave: (range: DateRange, formatted: string) => void;
  onClear: () => void;
}

export const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
  isOpen,
  onClose,
  initialRange,
  initialDateString,
  onSave,
  onClear,
}) => {
  const currentYear = new Date().getFullYear();
  const [startMonth, setStartMonth] = useState<number | undefined>(undefined);
  const [startYear, setStartYear] = useState<number | undefined>(currentYear);
  const [endMonth, setEndMonth] = useState<number | undefined>(undefined);
  const [endYear, setEndYear] = useState<number | undefined>(currentYear);
  const [ongoing, setOngoing] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const existing = initialRange || parseDateString(initialDateString);
      if (existing) {
        setStartMonth(existing.startMonth);
        setStartYear(existing.startYear || currentYear);
        setEndMonth(existing.endMonth);
        setEndYear(existing.endYear || currentYear);
        setOngoing(Boolean(existing.ongoing));
      } else {
        setStartMonth(undefined);
        setStartYear(currentYear);
        setEndMonth(undefined);
        setEndYear(currentYear);
        setOngoing(false);
      }
    }
  }, [isOpen, initialRange, initialDateString, currentYear]);

  if (!isOpen) return null;

  // Generate year options from currentYear + 5 down to 1980
  const yearOptions: number[] = [];
  for (let y = currentYear + 5; y >= 1980; y--) {
    yearOptions.push(y);
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const range: DateRange = {
      startMonth: startMonth ? Number(startMonth) : undefined,
      startYear: startYear ? Number(startYear) : undefined,
      endMonth: !ongoing && endMonth ? Number(endMonth) : undefined,
      endYear: !ongoing && endYear ? Number(endYear) : undefined,
      ongoing,
    };
    const formatted = formatDateRange(range);
    onSave(range, formatted);
    onClose();
  };

  const previewString = formatDateRange({
    startMonth,
    startYear,
    endMonth: !ongoing ? endMonth : undefined,
    endYear: !ongoing ? endYear : undefined,
    ongoing,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 no-print"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-blue-600" />
            <h3 className="font-bold text-slate-900 text-xs">Edit Month & Year</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleApply} className="p-4 space-y-3.5 text-xs">
          {/* Live Preview */}
          <div className="px-3 py-2 bg-blue-50/60 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-[11px] text-blue-900 font-medium">Display Preview:</span>
            <span className="text-xs font-bold text-blue-950 font-mono">
              {previewString || 'No date set'}
            </span>
          </div>

          {/* FROM */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              From (Start Date)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={startMonth || ''}
                onChange={(e) =>
                  setStartMonth(e.target.value ? Number(e.target.value) : undefined)
                }
                className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs text-slate-800 focus:outline-blue-500"
              >
                <option value="">Month (Optional)</option>
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx + 1}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={startYear || ''}
                onChange={(e) =>
                  setStartYear(e.target.value ? Number(e.target.value) : undefined)
                }
                className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs text-slate-800 focus:outline-blue-500"
              >
                <option value="">Year</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TO */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-800">
                To (End Date)
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={ongoing}
                  onChange={(e) => setOngoing(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-[11px] font-medium text-slate-700">
                  Ongoing / Present
                </span>
              </label>
            </div>

            <div className={`grid grid-cols-2 gap-2 ${ongoing ? 'opacity-40 pointer-events-none' : ''}`}>
              <select
                disabled={ongoing}
                value={endMonth || ''}
                onChange={(e) =>
                  setEndMonth(e.target.value ? Number(e.target.value) : undefined)
                }
                className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs text-slate-800 focus:outline-blue-500"
              >
                <option value="">Month (Optional)</option>
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx + 1}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                disabled={ongoing}
                value={endYear || ''}
                onChange={(e) =>
                  setEndYear(e.target.value ? Number(e.target.value) : undefined)
                }
                className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs text-slate-800 focus:outline-blue-500"
              >
                <option value="">Year</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onClear();
                onClose();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <Trash2 size={12} /> Clear Date
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Check size={12} /> Apply
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
