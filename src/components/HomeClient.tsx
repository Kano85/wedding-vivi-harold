'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import MusicSection from './sections/MusicSection';
import RsvpSection from './sections/RsvpSection';
import AccountSection from './sections/AccountSection';
import Footer from './sections/Footer';
import { weddingConfig } from '../config/wedding-config';
import { LANGUAGE_STORAGE_KEY, type SiteLanguage } from '../lib/i18n';

const MainSection = dynamic(() => import('./sections/MainSection'), {
  ssr: false,
});

const InvitationSection = dynamic(() => import('./sections/InvitationSection'), {
  ssr: false,
});

const DateSection = dynamic(() => import('./sections/DateSection'), {
  ssr: false,
});

const VenueSection = dynamic(() => import('./sections/VenueSection'), {
  ssr: false,
});

const GallerySection = dynamic(() => import('./sections/GallerySection'), {
  ssr: false,
});

export default function HomeClient() {
  const [language, setLanguage] = useState<SiteLanguage>('en');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
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

  const galleryPosition = weddingConfig.gallery.position || 'middle';
  const showRsvp = weddingConfig.rsvp?.enabled ?? true;
  const showAccount = weddingConfig.account?.enabled ?? true;

  const sectionColorMap = useMemo(() => {
    const sections = [];

    sections.push('invitation');
    sections.push('date');
    sections.push('venue');
    sections.push('music');

    if (galleryPosition === 'middle') {
      sections.push('gallery-middle');
    }

    if (showRsvp) {
      sections.push('rsvp');
    }

    if (showAccount) {
      sections.push('account');
    }

    if (galleryPosition === 'bottom') {
      sections.push('gallery-bottom');
    }

    const colorMap: Record<string, 'white' | 'beige'> = {};
    sections.forEach((section, index) => {
      colorMap[section] = index % 2 === 0 ? 'white' : 'beige';
    });

    return colorMap;
  }, [galleryPosition, showRsvp, showAccount]);

  if (!hasMounted) {
    return null;
  }

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
      {galleryPosition === 'middle' && (
        <GallerySection bgColor={sectionColorMap['gallery-middle']} language={language} />
      )}
      {showRsvp && <RsvpSection bgColor={sectionColorMap['rsvp']} language={language} />}
      {showAccount && (
        <AccountSection bgColor={sectionColorMap['account']} language={language} />
      )}
      {galleryPosition === 'bottom' && (
        <GallerySection bgColor={sectionColorMap['gallery-bottom']} language={language} />
      )}
      <Footer language={language} />
    </main>
  );
}
