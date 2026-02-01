'use client';

import { Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import MainSection from '../src/components/sections/MainSection';
import { weddingConfig } from '../src/config/wedding-config';

// Dynamic imports for code splitting and lazy loading
const DateSection = dynamic(() => import('../src/components/sections/DateSection'), {
  loading: () => <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Loading...</div>
});

// Kakao Map API should be loaded on the client only
const VenueSection = dynamic(() => import('../src/components/sections/VenueSection'), {
  ssr: false,
  loading: () => <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Loading...</div>
});

const GallerySection = dynamic(() => import('../src/components/sections/GallerySection'), {
  loading: () => <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Loading...</div>
});

const InvitationSection = dynamic(() => import('../src/components/sections/InvitationSection'));
const RsvpSection = dynamic(() => import('../src/components/sections/RsvpSection'));
const AccountSection = dynamic(() => import('../src/components/sections/AccountSection'));
const Footer = dynamic(() => import('../src/components/sections/Footer'));

export default function Home() {
  // Gallery position setting
  const galleryPosition = weddingConfig.gallery.position || 'middle';
  const showRsvp = weddingConfig.rsvp?.enabled ?? true;

  // Calculate the render order to assign alternating section colors
  const sectionColorMap = useMemo(() => {
    const sections = [];
    
    // MainSection is excluded from color calculation (always base style)
    sections.push('invitation'); // InvitationSection
    sections.push('date'); // DateSection  
    sections.push('venue'); // VenueSection
    
    if (galleryPosition === 'middle') {
      sections.push('gallery-middle'); // GallerySection (middle)
    }
    
    if (showRsvp) {
      sections.push('rsvp'); // RsvpSection
    }
    
    sections.push('account'); // AccountSection
    
    if (galleryPosition === 'bottom') {
      sections.push('gallery-bottom'); // GallerySection (bottom)
    }
    
    // Assign alternating colors per section (starting at 0)
    const colorMap: Record<string, 'white' | 'beige'> = {};
    sections.forEach((section, index) => {
      colorMap[section] = index % 2 === 0 ? 'white' : 'beige';
    });
    
    return colorMap;
  }, [galleryPosition, showRsvp]);

  return (
    <main>
      <MainSection />
      <InvitationSection bgColor={sectionColorMap['invitation']} />
      <DateSection bgColor={sectionColorMap['date']} />
      <VenueSection bgColor={sectionColorMap['venue']} />
      {galleryPosition === 'middle' && <GallerySection bgColor={sectionColorMap['gallery-middle']} />}
      {showRsvp && <RsvpSection bgColor={sectionColorMap['rsvp']} />}
      <AccountSection bgColor={sectionColorMap['account']} />
      {galleryPosition === 'bottom' && <GallerySection bgColor={sectionColorMap['gallery-bottom']} />}
      <Footer />
    </main>
  );
}
