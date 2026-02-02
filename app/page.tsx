'use client';

import { useMemo } from 'react';
import MainSection from '../src/components/sections/MainSection';
import InvitationSection from '../src/components/sections/InvitationSection';
import DateSection from '../src/components/sections/DateSection';
import VenueSection from '../src/components/sections/VenueSection';
import MusicSection from '../src/components/sections/MusicSection';
import GallerySection from '../src/components/sections/GallerySection';
import RsvpSection from '../src/components/sections/RsvpSection';
import AccountSection from '../src/components/sections/AccountSection';
import Footer from '../src/components/sections/Footer';
import { weddingConfig } from '../src/config/wedding-config';

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
    sections.push('music'); // MusicSection
    
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
      <MusicSection bgColor={sectionColorMap['music']} />
      {galleryPosition === 'middle' && <GallerySection bgColor={sectionColorMap['gallery-middle']} />}
      {showRsvp && <RsvpSection bgColor={sectionColorMap['rsvp']} />}
      <AccountSection bgColor={sectionColorMap['account']} />
      {galleryPosition === 'bottom' && <GallerySection bgColor={sectionColorMap['gallery-bottom']} />}
      <Footer />
    </main>
  );
}
