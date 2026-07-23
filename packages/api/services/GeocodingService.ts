export interface ReverseGeocodeResult {
  country: string;
  state: string;
  city: string;
  area: string;
  street: string;

  postalCode?: string;

  latitude: number;
  longitude: number;
}

export interface GeocodingProvider {
  reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<ReverseGeocodeResult>;
}

export class GeocodingService {
  constructor(
    private readonly provider: GeocodingProvider
  ) {}

  async reverseGeocode(
    latitude: number,
    longitude: number
  ) {
    return this.provider.reverseGeocode(
      latitude,
      longitude
    );
  }
}