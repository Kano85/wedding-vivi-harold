export interface AccountInfo {
  bank: string;
  number: string;
  holder: string;
}

export interface WeddingAccountConfig {
  groom: AccountInfo;
  bride: AccountInfo;
  groomFather: AccountInfo;
  groomMother: AccountInfo;
  brideFather: AccountInfo;
  brideMother: AccountInfo;
}

export interface ShuttleContact {
  name: string;
  tel: string;
}

export interface TravelInfo {
  title: string;
  details: string;
}

export interface Venue {
  name: string;
  address: string;
  tel: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  mapZoom: number;
  mapId?: string;
  transportation: {
    subway: string;
    bus: string;
  };
  parking: string;
  travelInfoLocal?: TravelInfo;
  travelInfoOutside?: TravelInfo;
} 

export type GalleryStatus = 'approved' | 'pending' | 'rejected';

export interface GalleryWallItem {
  id: string;
  url: string;
  createdAt: string;
  status: GalleryStatus;
  source: 'static' | 'upload';
  guestName?: string;
}
