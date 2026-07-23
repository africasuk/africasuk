import { GeocodingProvider, ReverseGeocodeResult } from "../../GeocodingService";


export class GoogleGeocodingProvider
  implements GeocodingProvider
{
  async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<ReverseGeocodeResult> {
    throw new Error(
      "Not implemented."
    );
  }
}