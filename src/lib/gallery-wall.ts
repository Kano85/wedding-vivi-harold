import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { weddingConfig } from '../config/wedding-config';

export type GalleryItemStatus = 'approved' | 'pending' | 'rejected';

export interface GalleryWallItem {
  id: string;
  url: string;
  createdAt: string;
  status: GalleryItemStatus;
  source: 'static' | 'upload';
  guestName?: string;
}

interface StoredGalleryItem extends GalleryWallItem {
  source: 'upload';
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'gallery-wall.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public/images/gallery/uploads');

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/gif',
]);

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.gif']);

function getFileExtension(filename: string): string {
  const rawExtension = path.extname(filename || '').toLowerCase();
  if (IMAGE_EXTENSIONS.has(rawExtension)) {
    return rawExtension;
  }

  return '.jpg';
}

function isImageFile(file: File): boolean {
  if (file.type && IMAGE_MIME_TYPES.has(file.type.toLowerCase())) {
    return true;
  }

  const extension = path.extname(file.name || '').toLowerCase();
  return IMAGE_EXTENSIONS.has(extension);
}

export async function ensureGalleryWallStorage(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

export async function readUploadedGalleryItems(): Promise<StoredGalleryItem[]> {
  let parsedData: unknown;
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf8');
    parsedData = JSON.parse(fileContent) as unknown;
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: unknown }).code)
        : '';

    // In serverless production (e.g. Vercel), writable local FS paths are not guaranteed.
    // For read paths, fail open so static gallery images can still load.
    if (code === 'ENOENT' || code === 'EROFS' || code === 'EPERM') {
      return [];
    }

    throw error;
  }

  if (!Array.isArray(parsedData)) {
    return [];
  }

  return parsedData
    .filter((item): item is StoredGalleryItem => {
      if (!item || typeof item !== 'object') {
        return false;
      }

      const candidate = item as Partial<StoredGalleryItem>;
      return (
        typeof candidate.id === 'string' &&
        typeof candidate.url === 'string' &&
        typeof candidate.createdAt === 'string' &&
        typeof candidate.status === 'string' &&
        candidate.source === 'upload'
      );
    })
    .map(item => ({
      ...item,
      status: normalizeStatus(item.status),
    }));
}

export async function writeUploadedGalleryItems(items: StoredGalleryItem[]): Promise<void> {
  await ensureGalleryWallStorage();
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
}

function normalizeStatus(status: string): GalleryItemStatus {
  if (status === 'approved' || status === 'pending' || status === 'rejected') {
    return status;
  }

  return 'pending';
}

export function isAccessCodeValid(accessCode: string | null): boolean {
  const configuredCode = process.env.GALLERY_ACCESS_CODE || 'BODA120';
  return Boolean(accessCode && accessCode.trim() === configuredCode);
}

export function isAdminCodeValid(adminCode: string | null): boolean {
  const configuredCode = process.env.GALLERY_ADMIN_CODE || 'ADMIN120';
  return Boolean(adminCode && adminCode.trim() === configuredCode);
}

export function getStaticGalleryItems(): GalleryWallItem[] {
  return weddingConfig.gallery.images.map((imageUrl, index) => ({
    id: `static-${index + 1}`,
    url: imageUrl,
    createdAt: new Date(1000 + index).toISOString(),
    status: 'approved',
    source: 'static',
  }));
}

export async function getApprovedGalleryItems(): Promise<GalleryWallItem[]> {
  const uploadedItems = await readUploadedGalleryItems();

  const approvedUploads = uploadedItems.filter(item => item.status === 'approved');
  const staticItems = getStaticGalleryItems();

  return [...approvedUploads, ...staticItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getPendingGalleryItems(): Promise<GalleryWallItem[]> {
  const uploadedItems = await readUploadedGalleryItems();

  return uploadedItems
    .filter(item => item.status === 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllGalleryItems(): Promise<GalleryWallItem[]> {
  const uploadedItems = await readUploadedGalleryItems();
  const staticItems = getStaticGalleryItems();

  return [...uploadedItems, ...staticItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function saveUploadedImages(files: File[], guestName?: string): Promise<StoredGalleryItem[]> {
  await ensureGalleryWallStorage();

  const status: GalleryItemStatus = process.env.GALLERY_AUTO_APPROVE === 'true' ? 'approved' : 'pending';
  const now = Date.now();
  const savedItems: StoredGalleryItem[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];

    if (!isImageFile(file)) {
      continue;
    }

    const extension = getFileExtension(file.name);
    const filename = `${now}-${index}-${randomUUID()}${extension}`;
    const targetPath = path.join(UPLOAD_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(targetPath, buffer);

    savedItems.push({
      id: randomUUID(),
      url: `/images/gallery/uploads/${filename}`,
      createdAt: new Date().toISOString(),
      status,
      source: 'upload',
      guestName: guestName?.trim() || undefined,
    });
  }

  if (savedItems.length === 0) {
    return [];
  }

  const existingItems = await readUploadedGalleryItems();
  await writeUploadedGalleryItems([...savedItems, ...existingItems]);

  return savedItems;
}

export async function updateGalleryItemStatus(
  id: string,
  status: GalleryItemStatus,
): Promise<StoredGalleryItem | null> {
  const items = await readUploadedGalleryItems();
  const itemIndex = items.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return null;
  }

  items[itemIndex] = {
    ...items[itemIndex],
    status,
  };

  await writeUploadedGalleryItems(items);

  return items[itemIndex];
}
