'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import InvitationSection from '../src/components/sections/InvitationSection';
import DateSection from '../src/components/sections/DateSection';
import VenueSection from '../src/components/sections/VenueSection';
import MusicSection from '../src/components/sections/MusicSection';
import RsvpSection from '../src/components/sections/RsvpSection';
import AccountSection from '../src/components/sections/AccountSection';
import Footer from '../src/components/sections/Footer';
import { weddingConfig } from '../src/config/wedding-config';
import { LANGUAGE_STORAGE_KEY, type SiteLanguage } from '../src/lib/i18n';

const MainSection = dynamic(() => import('../src/components/sections/MainSection'), {
  ssr: false,
});

const GallerySection = dynamic(() => import('../src/components/sections/GallerySection'), {
  ssr: false,
});

export default function Home() {
  const [language, setLanguage] = useState<SiteLanguage>('en');

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage === 'es') {
      setLanguage('es');
      return;
    }
    if (storedLanguage === 'en') {
      setLanguage('en');
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

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
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid #e5e7eb',
          borderRadius: '999px',
          padding: '0.25rem',
          boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
          display: 'flex',
          gap: '0.25rem',
          width: 'min(92vw, 320px)',
        }}
      >
        <button
          type="button"
          onClick={() => setLanguage('en')}
          aria-pressed={language === 'en'}
          style={{
            flex: 1,
            border: 'none',
            borderRadius: '999px',
            padding: '0.45rem 0.7rem',
            cursor: 'pointer',
            fontSize: '0.86rem',
            background: language === 'en' ? '#d4b797' : 'transparent',
            color: language === 'en' ? 'white' : '#374151',
            fontWeight: 600,
          }}
        >
          🇩🇪 Deutsch
        </button>
        <button
          type="button"
          onClick={() => setLanguage('es')}
          aria-pressed={language === 'es'}
          style={{
            flex: 1,
            border: 'none',
            borderRadius: '999px',
            padding: '0.45rem 0.7rem',
            cursor: 'pointer',
            fontSize: '0.86rem',
            background: language === 'es' ? '#d4b797' : 'transparent',
            color: language === 'es' ? 'white' : '#374151',
            fontWeight: 600,
          }}
        >
          🇪🇸 Español
        </button>
      </div>

      <MainSection language={language} />
      <InvitationSection bgColor={sectionColorMap['invitation']} language={language} />
      <DateSection bgColor={sectionColorMap['date']} language={language} />
      <VenueSection bgColor={sectionColorMap['venue']} language={language} />
      <MusicSection bgColor={sectionColorMap['music']} language={language} />
      {galleryPosition === 'middle' && <GallerySection bgColor={sectionColorMap['gallery-middle']} language={language} />}
      {showRsvp && <RsvpSection bgColor={sectionColorMap['rsvp']} language={language} />}
      <AccountSection bgColor={sectionColorMap['account']} language={language} />
      {galleryPosition === 'bottom' && <GallerySection bgColor={sectionColorMap['gallery-bottom']} language={language} />}
      <Footer language={language} />
    </main>
  );
}
