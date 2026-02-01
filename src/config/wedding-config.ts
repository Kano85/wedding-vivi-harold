const uniqueIdentifier = 'JWK-WEDDING-TEMPLATE-V1';

// Gallery layout type definitions
type GalleryLayout = 'scroll' | 'grid';
type GalleryPosition = 'middle' | 'bottom';

interface GalleryConfig {
  layout: GalleryLayout;
  position: GalleryPosition;
  images: string[];
}

export const weddingConfig = {
  // Meta info
  meta: {
    title: 'You are invited to our wedding',
    description: 'Wedding invitation',
    ogImage: '/images/image11.jpg',
    noIndex: true,
    _jwk_watermark_id: uniqueIdentifier,
  },

  // Main section
  main: {
    title: 'Wedding Invitation',
    image: '/images/image11.jpg',
    date: 'Saturday, June 6, 2026',
    venue: 'La Farinera de\nSant Lluis',
  },

  // Intro
  intro: {
    title: '',
    text: 'Our steps, taken while looking at each other,\nnow join into one path.\n\nWith love and trust,\nwe are starting a new family together.\nPlease celebrate this small beginning with us.',
  },

  // Wedding date/time
  date: {
    year: 2026,
    month: 6,
    day: 6,
    hour: 15,
    minute: 0,
    displayDate: '2026.06.06 SAT 15:00',
  },

  // Venue info
  venue: {
    name: 'Wedding Hall Name',
    address: '123 Teheran-ro, Gangnam-gu, Seoul\nWedding Hall Name',
    tel: '02-1234-5678',
    naverMapId: 'Wedding Hall Name', // Place name for Naver Map search
    coordinates: {
      latitude: 37.5665,
      longitude: 126.978,
    },
    placeId: '123456789', // Naver Map place ID
    mapZoom: '17', // Map zoom level
    mapNaverCoordinates: '14141300,4507203,15,0,0,0,dh', // Naver Map directions URL coordinates (legacy format)
    transportation: {
      subway: '5-minute walk from Exit 1',
      bus: 'Main\n 101, 102, 103\nLocal\n 1234, 5678',
    },
    parking: 'Basement parking available (2 hours free)',
    // Groom side shuttle
    groomShuttle: {
      location: 'Groom shuttle pickup location',
      departureTime: 'Departs at 10:30 AM',
      contact: {
        name: 'Contact name',
        tel: '010-1234-5678',
      },
    },
    // Bride side shuttle
    brideShuttle: {
      location: 'Bride shuttle pickup location',
      departureTime: 'Departs at 11:00 AM',
      contact: {
        name: 'Contact name',
        tel: '010-9876-5432',
      },
    },
  },

  // Gallery
  gallery: {
    layout: 'grid' as GalleryLayout, // Choose "scroll" or "grid"
    position: 'bottom' as GalleryPosition, // Choose "middle" (current spot) or "bottom" (end)
    images: [
      '/images/gallery/image1.jpg',
      '/images/gallery/image2.jpg',
      '/images/gallery/image3.jpg',
      '/images/gallery/image4.jpg',
      '/images/gallery/image5.jpg',
      '/images/gallery/image6.jpg',
      '/images/gallery/image7.jpg',
      '/images/gallery/image8.jpg',
      '/images/gallery/image9.jpg',
    ],
  } as GalleryConfig,

  // Invitation message
  invitation: {
    message: [
      'We’re getting married on the Costa Brava',
      '',
      '',
      'We can’t wait to celebrate',
      'with our favorite people',
      'from different places',
      '',
      '',
      'Enjoy good vibes',
      '',
      '',
      'And make great memories together',
      '',
      '',
      'Your presence',
      'will mean everything to us',
    ].join('\n'),

    groom: {
      name: 'Harold Cano Cardenas',
    },

    bride: {
      name: 'Vivian Strube',
    },
  },

  // Bank account info
  account: {
    groom: {
      bank: 'Bank Name',
      number: '123-456-789012',
      holder: 'Groom Name',
    },
    bride: {
      bank: 'Bank Name',
      number: '987-654-321098',
      holder: 'Bride Name',
    },
    groomFather: {
      bank: 'Bank Name',
      number: '111-222-333444',
      holder: 'Groom Father',
    },
    groomMother: {
      bank: 'Bank Name',
      number: '555-666-777888',
      holder: 'Groom Mother',
    },
    brideFather: {
      bank: 'Bank Name',
      number: '999-000-111222',
      holder: 'Bride Father',
    },
    brideMother: {
      bank: 'Bank Name',
      number: '333-444-555666',
      holder: 'Bride Mother',
    },
  },

  // RSVP settings
  rsvp: {
    enabled: false, // Show RSVP section
    showMealOption: false, // Show meal option field
  },

  // Slack notification settings
  slack: {
    webhookUrl: process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL || '',
    channel: '#wedding-response',
    compactMessage: true, // Keep Slack messages concise
  },
};
