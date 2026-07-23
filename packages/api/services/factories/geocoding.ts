

import { GeocodingService } from "../GeocodingService";
import { GoogleGeocodingProvider } from "../providers/google/GoogleGeocodingProvider";
import { OsmGeocodingProvider } from "../providers/osm/OsmGeocodingProvider";

export function createGeocoder() {
  switch (
    process.env.GEOCODING_PROVIDER
  ) {
    case "osm":
      return new GeocodingService(
        new OsmGeocodingProvider()
      );

    case "google":
    default:
      return new GeocodingService(
        new GoogleGeocodingProvider()
      );
  }
}