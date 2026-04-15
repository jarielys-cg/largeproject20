import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const SPACES_BUCKET = process.env.SPACES_BUCKET || "marketplacegroup20";
const SPACES_REGION = process.env.SPACES_REGION || "sfo3";
const SPACES_ENDPOINT =
  process.env.SPACES_ENDPOINT || `https://${SPACES_REGION}.digitaloceanspaces.com`;
const SPACES_PUBLIC_BASE_URL =
  process.env.SPACES_PUBLIC_BASE_URL ||
  `https://${SPACES_BUCKET}.${SPACES_REGION}.digitaloceanspaces.com`;
const SPACES_SIGNED_GET_TTL_SECONDS = Number(
  process.env.SPACES_SIGNED_GET_TTL_SECONDS || 3600
);

const normalizedPublicBaseUrl = SPACES_PUBLIC_BASE_URL.endsWith("/")
  ? SPACES_PUBLIC_BASE_URL.slice(0, -1)
  : SPACES_PUBLIC_BASE_URL;

const normalizedPublicBaseHost = (() => {
  try {
    return new URL(normalizedPublicBaseUrl).host;
  } catch {
    return "";
  }
})();

const normalizedEndpointHost = (() => {
  try {
    return new URL(SPACES_ENDPOINT).host;
  } catch {
    return "";
  }
})();

const keyFromPossibleSpaceUrl = (raw: string): string => {
  try {
    const parsed = new URL(raw);
    const path = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));

    // Virtual-host style: bucket.region.digitaloceanspaces.com/<key>
    if (normalizedPublicBaseHost && parsed.host === normalizedPublicBaseHost) {
      return path;
    }

    // Endpoint style: region.digitaloceanspaces.com/<bucket>/<key>
    if (normalizedEndpointHost && parsed.host === normalizedEndpointHost) {
      const bucketPrefix = `${SPACES_BUCKET}/`;
      if (path.startsWith(bucketPrefix)) {
        return path.slice(bucketPrefix.length);
      }
    }
  } catch {
    // Not a URL; caller handles fallback.
  }

  return raw;
};

export const spacesConfig = {
  bucket: SPACES_BUCKET,
  region: SPACES_REGION,
  endpoint: SPACES_ENDPOINT,
  publicBaseUrl: normalizedPublicBaseUrl,
};

const spacesClient = new S3Client({
  region: "us-east-1", // required by SDK; Spaces routes by endpoint
  endpoint: SPACES_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  },
});

export const toPublicImageUrl = (value: string): string => {
  const trimmed = value?.trim();
  if (!trimmed) return trimmed;

  const maybeKey = /^https?:\/\//i.test(trimmed)
    ? keyFromPossibleSpaceUrl(trimmed)
    : trimmed;

  // Preserve third-party absolute URLs.
  if (/^https?:\/\//i.test(maybeKey)) return maybeKey;

  return `${spacesConfig.publicBaseUrl}/${maybeKey.replace(/^\/+/, "")}`;
};

export const toSpaceKey = (value: string): string => {
  const trimmed = value?.trim();
  if (!trimmed) return trimmed;

  if (!/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/^\/+/, "");
  }

  const extracted = keyFromPossibleSpaceUrl(trimmed);
  if (!/^https?:\/\//i.test(extracted)) {
    return extracted.replace(/^\/+/, "");
  }

  const prefix = `${spacesConfig.publicBaseUrl}/`;
  if (trimmed.startsWith(prefix)) {
    return decodeURIComponent(trimmed.slice(prefix.length));
  }

  return trimmed;
};

export const toSignedGetImageUrl = async (value: string): Promise<string> => {
  const normalizedKey = toSpaceKey(value);

  // Preserve third-party absolute URLs.
  if (/^https?:\/\//i.test(normalizedKey)) {
    return normalizedKey;
  }

  if (!normalizedKey) {
    return normalizedKey;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: SPACES_BUCKET,
      Key: normalizedKey,
    });

    return await getSignedUrl(spacesClient, command, {
      expiresIn: SPACES_SIGNED_GET_TTL_SECONDS,
    });
  } catch {
    // Fallback for resiliency if signing fails.
    return toPublicImageUrl(normalizedKey);
  }
};

export const mapBusinessImageUrls = async <T extends Record<string, any>>(
  business: T
): Promise<T> => {
  const plain =
    business && typeof (business as any).toObject === "function"
      ? (business as any).toObject()
      : { ...business };

  if (Array.isArray(plain.image)) {
    plain.image = await Promise.all(
      plain.image.map((img: string) => toSignedGetImageUrl(img))
    );
  }

  return plain;
};
