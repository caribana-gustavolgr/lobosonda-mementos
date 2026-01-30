// Interfaces para los servicios CAPSULE

export interface Ship {
  _id: string;
  name: string;
  capacity: number;
  type: string;
}

export interface SessionInfo {
  sessionInfo: {
    ships: Ship[];
  };
}

export interface TripGuide {
  _id: string;
  name: string;
  lastName: string;
}

export interface Sighting {
  specieId: string;
  specieName: string;
  specieDescription: string;
}

export interface Trip {
  tripDate: string;
  tripTime: string;
  tripGuide: TripGuide;
  tripBoat: string;
  sightings: Sighting[];
  temp: string;
  wind: string;
  bright: string;
}

export interface UserTrip {
  _id: string;
  collectionName: string;
  trip: Trip;
  photosAmount: number;
}

export interface UserTrips {
  userId: string;
  collections: UserTrip[];
}

export interface PhotoAuthor {
  _id: string;
  name: string;
  lastName: string;
}

export interface Photo {
  _id: string;
  name: string;
  originalName: string;
  thumbnail: string;
  edited: string;
  votes: number;
  type: string;
  availableToShare: boolean;
  availableForOthers: boolean;
  author: PhotoAuthor;
}

export interface TripDetail {
  collection: {
    collectionName: string;
    trip: Trip;
    photosAmount: number;
    photos: Photo[];
  };
}
