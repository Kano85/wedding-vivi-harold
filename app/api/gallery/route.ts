import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { weddingConfig } from '../../../src/config/wedding-config';

export async function GET() {
  try {
    // Gallery folder path
    const galleryDir = path.join(process.cwd(), 'public/images/gallery');
    
    // Read files in the folder
    const files = fs.readdirSync(galleryDir);
    
    // Filter image files
    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });
    
    // Order images based on config
    const configImages = weddingConfig.gallery.images;
    const orderedImages: string[] = [];
    
    // Only add files that exist, following config order
    for (const configImagePath of configImages) {
      const filename = path.basename(configImagePath);
      if (imageFiles.includes(filename)) {
        orderedImages.push(configImagePath);
      }
    }
    
    // Append images not in config (sorted by filename)
    const remainingFiles = imageFiles
      .filter(file => !configImages.some((configPath: string) => path.basename(configPath) === file))
      .sort((a, b) => a.localeCompare(b))
      .map(file => `/images/gallery/${file}`);
    
    const finalImages = [...orderedImages, ...remainingFiles];
    
    return NextResponse.json({ images: finalImages });
  } catch (error) {
    console.error('Gallery image load error:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred while loading gallery images.',
        images: weddingConfig.gallery.images // Return config list on error
      }, 
      { status: 500 }
    );
  }
} 
