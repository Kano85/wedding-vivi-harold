import { NextResponse } from 'next/server';
import { isAccessCodeValid, saveUploadedImages } from '@/src/lib/gallery-wall';

export const runtime = 'nodejs';

const MAX_FILES_PER_UPLOAD = 10;
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const accessCode = formData.get('accessCode');
    const guestName = formData.get('guestName');

    if (!isAccessCodeValid(typeof accessCode === 'string' ? accessCode : null)) {
      return NextResponse.json({ error: 'Invalid access code.' }, { status: 401 });
    }

    const files = formData
      .getAll('files')
      .filter((value): value is File => value instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: 'Please select at least one image.' }, { status: 400 });
    }

    if (files.length > MAX_FILES_PER_UPLOAD) {
      return NextResponse.json(
        { error: `You can upload up to ${MAX_FILES_PER_UPLOAD} images at once.` },
        { status: 400 },
      );
    }

    const oversizedFile = files.find(file => file.size > MAX_FILE_SIZE_BYTES);
    if (oversizedFile) {
      return NextResponse.json(
        { error: `File ${oversizedFile.name} exceeds the 8MB limit.` },
        { status: 400 },
      );
    }

    const savedItems = await saveUploadedImages(
      files,
      typeof guestName === 'string' ? guestName : undefined,
    );

    if (savedItems.length === 0) {
      return NextResponse.json({ error: 'No valid images were uploaded.' }, { status: 400 });
    }

    const requiresModeration = savedItems.some(item => item.status === 'pending');

    return NextResponse.json({
      message: requiresModeration
        ? 'Images uploaded successfully and are pending approval.'
        : 'Images uploaded successfully.',
      requiresModeration,
      uploadedCount: savedItems.length,
      items: savedItems,
    });
  } catch (error) {
    console.error('Gallery upload error:', error);
    return NextResponse.json({ error: 'Failed to upload images.' }, { status: 500 });
  }
}
