import { NextRequest, NextResponse } from 'next/server';
import {
  getAllGalleryItems,
  getApprovedGalleryItems,
  getPendingGalleryItems,
  isAdminCodeValid,
} from '@/src/lib/gallery-wall';
import type { GalleryWallItem } from '@/src/lib/gallery-wall';

export const runtime = 'nodejs';

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);
  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    return fallback;
  }

  return parsedValue;
}

function paginateItems(items: GalleryWallItem[], cursor: number, limit: number) {
  const start = Math.max(0, cursor);
  const end = start + limit;
  const pageItems = items.slice(start, end);

  return {
    items: pageItems,
    hasMore: end < items.length,
    nextCursor: end < items.length ? end : null,
    total: items.length,
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cursor = parsePositiveInt(searchParams.get('cursor'), 0);
    const limit = Math.min(parsePositiveInt(searchParams.get('limit'), 9), 24);
    const status = searchParams.get('status') || 'approved';
    const adminCode = searchParams.get('adminCode');

    let items: GalleryWallItem[] = [];

    if (status === 'pending') {
      if (!isAdminCodeValid(adminCode)) {
        return NextResponse.json({ error: 'Invalid admin code.' }, { status: 401 });
      }
      items = await getPendingGalleryItems();
    } else if (status === 'all') {
      if (!isAdminCodeValid(adminCode)) {
        return NextResponse.json({ error: 'Invalid admin code.' }, { status: 401 });
      }
      items = await getAllGalleryItems();
    } else {
      items = await getApprovedGalleryItems();
    }

    const paginatedData = paginateItems(items, cursor, limit);

    return NextResponse.json({
      ...paginatedData,
      images: paginatedData.items.map(item => item.url),
    });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json({ error: 'Failed to load gallery.' }, { status: 500 });
  }
}
