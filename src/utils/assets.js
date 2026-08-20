/**
 * Resolves static asset URLs relative to Vite's base path (e.g. for GitHub Pages subpath deployment).
 * @param {string} path - Relative asset path (e.g. 'pydata-logo-circle.png' or '/pydata-logo-circle.png')
 * @returns {string} Fully resolved asset URL
 */
export function getAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = import.meta.env.BASE_URL || './';
  return baseUrl.endsWith('/') ? `${baseUrl}${cleanPath}` : `${baseUrl}/${cleanPath}`;
}
