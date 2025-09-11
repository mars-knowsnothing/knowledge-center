// Utility functions for the application

/**
 * Generate a UUID v4 string
 * @returns A UUID v4 string
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Create a temporary filename based on original filename and UUID
 * @param originalFilename The original filename
 * @param uuid The UUID to append
 * @returns The temporary filename
 */
export function createTempFilename(originalFilename: string, uuid: string): string {
  const extension = originalFilename.split('.').pop() || '';
  const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}-${uuid}.${extension}`;
}

/**
 * Format timestamp for display
 * @param timestamp ISO timestamp string
 * @returns Formatted timestamp
 */
export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Debounce function for optimizing frequent function calls
 * @param func The function to debounce
 * @param wait The wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}