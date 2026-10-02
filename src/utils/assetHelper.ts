// Cache-buster version to bypass browser disk-cache of old placeholder responses
export const ASSET_VERSION = '20261002_v3';

export function getAssetUrl(path?: string | null): string {
  if (!path) return '';
  // If it's already an external URL or data URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath.includes(`v=${ASSET_VERSION}`)) {
    return cleanPath;
  }
  const separator = cleanPath.includes('?') ? '&' : '?';
  return `${cleanPath}${separator}v=${ASSET_VERSION}`;
}
