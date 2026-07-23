import { NextResponse } from "next/server";

interface ReverseGeocodeRequest {
  latitude: number;
  longitude: number;
}

export async function POST(
  request: Request
) {
  try {
    const {
      latitude,
      longitude,
    }: ReverseGeocodeRequest =
      await request.json();

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid coordinates.",
        },
        {
          status: 400,
        }
      );
    }

    const apiKey =
      process.env.LOCATIONIQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          message:
            "Missing LOCATIONIQ_API_KEY.",
        },
        {
          status: 500,
        }
      );
    }

    const url = new URL(
      "https://us1.locationiq.com/v1/reverse"
    );

    url.searchParams.set(
      "key",
      apiKey
    );

    url.searchParams.set(
      "lat",
      latitude.toString()
    );

    url.searchParams.set(
      "lon",
      longitude.toString()
    );

    url.searchParams.set(
      "format",
      "json"
    );


    const response =
      await fetch(url.toString(), {
        headers: {
          Accept:
            "application/json",
        },
        cache: "no-store",
      });

    const body =
      await response.text();



    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            "Reverse geocoding failed.",
          status:
            response.status,
          body,
        },
        {
          status:
            response.status,
        }
      );
    }

    let data: Record<
      string,
      unknown
    >;

    try {
      data =
        JSON.parse(body);
    } catch {
      return NextResponse.json(
        {
          message:
            "LocationIQ returned an invalid response.",
        },
        {
          status: 500,
        }
      );
    }

    const address =
      (data.address as Record<
        string,
        string
      >) ?? {};

    return NextResponse.json({
      latitude,
      longitude,

      country:
        address.country ??
        "South Sudan",

      state:
        address.state ??
        "Central Equatoria",

      city:
        address.city ??
        address.town ??
        address.village ??
        "Juba",

      area:
        address.suburb ??
        address.neighbourhood ??
        address.county ??
        "",

      street:
        [
          address.house_number,
          address.road,
        ]
          .filter(Boolean)
          .join(" "),

      postalCode:
        address.postcode ??
        "",

      displayName:
        (data.display_name as string) ??
        "",
    });
  } catch (error) {
    console.error(
      "Reverse geocode error:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to determine address.",
      },
      {
        status: 500,
      }
    );
  }
}