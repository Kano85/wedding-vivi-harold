import { NextResponse } from 'next/server';
import { isAdminCodeValid, updateGalleryItemStatus } from '@/src/lib/gallery-wall';

export const runtime = 'nodejs';

interface ModeratePayload {
  id?: string;
  action?: 'approve' | 'reject';
  adminCode?: string;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ModeratePayload;

    if (!isAdminCodeValid(payload.adminCode || null)) {
      return NextResponse.json({ error: 'Invalid admin code.' }, { status: 401 });
    }

    if (!payload.id || !payload.action) {
      return NextResponse.json({ error: 'Missing item id or action.' }, { status: 400 });
    }

    const nextStatus = payload.action === 'approve' ? 'approved' : 'rejected';
    const updatedItem = await updateGalleryItemStatus(payload.id, nextStatus);

    if (!updatedItem) {
      return NextResponse.json({ error: 'Image not found.' }, { status: 404 });
    }

    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    console.error('Gallery moderation error:', error);
    return NextResponse.json({ error: 'Failed to moderate image.' }, { status: 500 });
  }
}
