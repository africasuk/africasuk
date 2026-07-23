import { GeocodingProvider, ReverseGeocodeResult } from "../../GeocodingService";

export class OsmGeocodingProvider
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