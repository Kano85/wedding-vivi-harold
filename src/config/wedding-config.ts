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
    hour: 17,
    minute: 0,
    displayDate: '2026.06.06 SAT 17:00',
  },

  // Venue info
  venue: {
    name: 'La Farinera Sant Lluís',
    address: 'La Farinera Sant Lluís, N-2, Km.761, 2, 17706 Pont de Molins, Girona, Spain',
    tel: '+34672142651',
    coordinates: {
      latitude: 42.31125,
      longitude: 2.93287,
    },
    mapZoom: 16,
    mapId: 'streets-v2-light',
    transportation: {
      subway: 'The train will bring you to Figueres. We can arrange a shuttle from Figueres. More details will be shared closer to the event date, stay tuned.',
      bus: 'The train will bring you to Figueres. We can arrange a shuttle from Figueres. More details will be shared closer to the event date, stay tuned.',
    },
    parking: 'Parking available on site.',
    // Travel info (local / outside Catalunya)
    travelInfoLocal: {
      title: 'Barcelona / Catalunya',
      details:
        'Please take the train to Figueres. We are planning a shuttle from Figueres to the venue. More details will be shared closer to the event date, stay tuned.',
    },
    travelInfoOutside: {
      title: 'Outside Catalunya / Flying In',
      details:
        'If you are arriving from outside Catalunya, the closest airports are Barcelona (BCN) and Girona (GRO). From there, take a train to Figueres. We are planning a shuttle from Figueres to the venue. More details will be shared closer to the event date, stay tuned.',
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
    enabled: false, // Show gift accounts section
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
