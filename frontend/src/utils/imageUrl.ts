const SPACES_BASE = 'https://marketplacegroup20.sfo3.digitaloceanspaces.com';

export function getImageUrl(key: string | undefined | null): string {
  if (!key || key.trim() === '') return '';
  return key.startsWith('http') ? key : `${SPACES_BASE}/${key}`;
}
