import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare R2 configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // Your R2 public URL (e.g., https://pub-xxx.r2.dev)

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  throw new Error('Missing required R2 environment variables. Please check your .env.local file.');
}

// Create S3 client configured for Cloudflare R2
export const r2Client = new S3Client({
  region: 'auto', // R2 uses 'auto' for region
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export const R2_BUCKET = R2_BUCKET_NAME;

/**
 * Upload a file to Cloudflare R2
 * @param key - The file path/key in the bucket (e.g., "videos/123_video.mp4")
 * @param body - The file buffer
 * @param contentType - The MIME type of the file
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Return the public URL
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/${key}`;
  }
  
  // Fallback to R2.dev subdomain format if public URL not configured
  return `https://pub-${R2_ACCOUNT_ID}.r2.dev/${key}`;
}

/**
 * Delete a file from Cloudflare R2
 * @param key - The file path/key in the bucket to delete
 */
export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * Extract the R2 key from a full URL
 * @param url - The full URL or path (e.g., "https://pub-xxx.r2.dev/videos/123_video.mp4" or "/uploads/videos/123_video.mp4")
 * @returns The R2 key (e.g., "videos/123_video.mp4")
 */
export function extractR2Key(url: string): string {
  // If it's a full URL, extract the path after the domain
  if (url.startsWith('http')) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1); // Remove leading slash
    } catch {
      return url;
    }
  }
  
  // If it's a local path like /uploads/videos/filename, convert it
  if (url.startsWith('/uploads/')) {
    return url.replace('/uploads/', '');
  }
  
  return url;
}
