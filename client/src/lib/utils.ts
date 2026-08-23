import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateForInput(
  dateString: string | Date | undefined
): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

export function formatDateForDisplay(
  dateString: string | Date | undefined
): string {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return '-';
  }
}
