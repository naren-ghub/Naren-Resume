import { DateRange } from '../types/resume';

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MONTH_ABBRS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Formats a DateRange object into a standard resume date string.
 * Examples:
 * - "Jan 2026 – Apr 2026"
 * - "Jul 2026 – Present"
 * - "2025 – 2026"
 * - "2024"
 */
export const formatDateRange = (
  range?: DateRange,
  fallbackString?: string
): string => {
  if (!range) {
    return fallbackString ? fallbackString.trim() : '';
  }

  const { startMonth, startYear, endMonth, endYear, ongoing } = range;

  // Format start part
  let startPart = '';
  if (startYear) {
    if (startMonth && startMonth >= 1 && startMonth <= 12) {
      startPart = `${MONTH_ABBRS[startMonth - 1]} ${startYear}`;
    } else {
      startPart = `${startYear}`;
    }
  }

  // Format end part
  let endPart = '';
  if (ongoing) {
    endPart = 'Present';
  } else if (endYear) {
    if (endMonth && endMonth >= 1 && endMonth <= 12) {
      endPart = `${MONTH_ABBRS[endMonth - 1]} ${endYear}`;
    } else {
      endPart = `${endYear}`;
    }
  }

  if (startPart && endPart) {
    return `${startPart} – ${endPart}`;
  }

  if (startPart) {
    return startPart;
  }

  if (endPart) {
    return endPart;
  }

  return fallbackString ? fallbackString.trim() : '';
};

/**
 * Intelligent parser that converts legacy or typed date strings into structured DateRange
 * Examples handled:
 * - "01/2026 – 04/2026", "01/2022 - Present", "Jan 2026 - Apr 2026", "2019 – 2023", "2024"
 */
export const parseDateString = (str?: string): DateRange | undefined => {
  if (!str || !str.trim()) return undefined;

  const clean = str.trim();

  // Normalize dash separators: en-dash, em-dash, hyphen, "to"
  const parts = clean.split(/\s*(?:–|—|-|\bto\b)\s*/i);

  const parsePart = (
    part: string
  ): { month?: number; year?: number; isPresent?: boolean } => {
    const trimmed = part.trim();
    if (/^(present|ongoing|current|now)$/i.test(trimmed)) {
      return { isPresent: true };
    }

    // Check "MM/YYYY" or "M/YYYY"
    const mmYyyy = trimmed.match(/^(\d{1,2})\/(\d{4})$/);
    if (mmYyyy) {
      return {
        month: parseInt(mmYyyy[1], 10),
        year: parseInt(mmYyyy[2], 10),
      };
    }

    // Check "Month YYYY", e.g. "Jan 2026", "January 2026"
    const nameYyyy = trimmed.match(/^([a-zA-Z]+)\s+(\d{4})$/);
    if (nameYyyy) {
      const monthIdx = MONTH_ABBRS.findIndex(
        (m) => m.toLowerCase() === nameYyyy[1].slice(0, 3).toLowerCase()
      );
      if (monthIdx !== -1) {
        return {
          month: monthIdx + 1,
          year: parseInt(nameYyyy[2], 10),
        };
      }
    }

    // Check "YYYY", e.g. "2026"
    const justYyyy = trimmed.match(/^(\d{4})$/);
    if (justYyyy) {
      return {
        year: parseInt(justYyyy[1], 10),
      };
    }

    return {};
  };

  if (parts.length === 1) {
    const parsed = parsePart(parts[0]);
    if (parsed.year) {
      return {
        startMonth: parsed.month,
        startYear: parsed.year,
        ongoing: parsed.isPresent,
      };
    }
  } else if (parts.length >= 2) {
    const start = parsePart(parts[0]);
    const end = parsePart(parts[1]);

    return {
      startMonth: start.month,
      startYear: start.year,
      endMonth: end.month,
      endYear: end.year,
      ongoing: end.isPresent,
    };
  }

  return undefined;
};
