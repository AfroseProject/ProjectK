export interface User {
  uid: string;
  role: 'landowner' | 'responder';
  phone: string;
  language: 'en' | 'ta';
  createdAt: Date;
}

export interface Listing {
  listingId: string;
  ownerId: string;
  district: string;
  approximateLocation: {
    latitude: number;
    longitude: number;
  };
  vegetationType: string;
  density: 'low' | 'medium' | 'high';
  landSize: number; // in acres or sq ft
  terms: 'free' | 'paid' | 'revenue_share' | 'highest_offer';
  photoThumbs: string[];
  status: 'active' | 'cleared' | 'draft';
  createdAt: Date;
}

export interface ListingPrivate {
  listingId: string;
  preciseLocation: {
    latitude: number;
    longitude: number;
  };
  ownerPhone: string;
  coordinates: any; // More detailed polygon if needed
}

export interface Enquiry {
  enquiryId: string;
  listingId: string;
  responderId: string;
  createdAt: Date;
}
