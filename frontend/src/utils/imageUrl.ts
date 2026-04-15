const SPACES_PUBLIC_BASE_URL =
  import.meta.env.VITE_SPACES_PUBLIC_BASE_URL ||
  "https://marketplacegroup20.sfo3.digitaloceanspaces.com";

const normalizedBase = SPACES_PUBLIC_BASE_URL.endsWith("/")
  ? SPACES_PUBLIC_BASE_URL.slice(0, -1)
  : SPACES_PUBLIC_BASE_URL;

const bucketHost = (() => {
  try {
    return new URL(normalizedBase).host;
  } catch {
    return '';
  }
})();

const endpointHost = (() => {
  const pieces = bucketHost.split('.');
  if (pieces.length >= 4) {
    return pieces.slice(1).join('.');
  }
  return '';
})();

const bucketName = (() => {
  const pieces = bucketHost.split('.');
  return pieces[0] || '';
})();

export const toPublicImageUrl = (value?: string): string => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${normalizedBase}/${value.replace(/^\/+/, "")}`;
};

export const toImageKey = (value?: string): string => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed)) return trimmed.replace(/^\/+/, "");

  try {
    const url = new URL(trimmed);
    const baseHost = new URL(normalizedBase).host;
    if (url.host === baseHost) {
      return decodeURIComponent(url.pathname.replace(/^\/+/, ""));
    }

    if (endpointHost && bucketName && url.host === endpointHost) {
      const path = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
      const prefix = `${bucketName}/`;
      if (path.startsWith(prefix)) {
        return path.slice(prefix.length);
      }
    }
  } catch {
    // Return original value when parsing fails.
  }

  const prefix = `${normalizedBase}/`;
  if (trimmed.startsWith(prefix)) {
    return decodeURIComponent(trimmed.slice(prefix.length));
  }

  return trimmed;
};
