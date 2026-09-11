"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
} from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Plus, Minus } from "lucide-react";

import type { OrderStatus } from "@africasuk/types";
import { LOGISTICS_POINTS } from "@/constants/logisticsCoordinates";

interface Props {
  status: OrderStatus;
}

function interpolate(
  start: [number, number],
  end: [number, number],
  progress: number
): [number, number] {
  return [
    start[0] + (end[0] - start[0]) * progress,
    start[1] + (end[1] - start[1]) * progress,
  ];
}

function MapInstanceBridge({
  onMapReady,
}: {
  onMapReady: (map: LeafletMap) => void;
}) {
  const map = useMap();

  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);

  return null;
}

function RouteBoundsManager({
  points,
}: {
  points: [number, number][];
}) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const bounds = L.latLngBounds(
      points.map(([lat, lng]) => [lat, lng])
    );

    map.fitBounds(bounds, {
      padding: [48, 48],
      maxZoom: 8.5,
      animate: false,
    });
  }, [map, points]);

  return null;
}

const createHubPin = (
  label: string,
  sublabel: string,
  type: "origin" | "border" | "destination"
) => {
  const isDest = type === "destination";
  const isBorder = type === "border";

  return L.divIcon({
    className: "custom-hub-pin",
    html: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        transform:translate(-50%, ${
          isDest ? "-115%" : isBorder ? "-50%" : "-115%"
        });
        pointer-events:none;
      ">
        <div style="
          background-color:#ffffff;
          border:1.5px solid #18181b;
          padding:4px 9px;
          border-radius:10px;
          box-shadow:0 4px 14px rgba(0,0,0,0.12);
          white-space:nowrap;
          display:flex;
          align-items:center;
          gap:6px;
        ">
          <span style="
            width:7px;
            height:7px;
            border-radius:50%;
            background-color:${
              isDest
                ? "#10b981"
                : isBorder
                  ? "#f59e0b"
                  : "#18181b"
            };
            flex-shrink:0;
          "></span>

          <div style="
            display:flex;
            flex-direction:column;
            text-align:left;
          ">
            <span style="
              font-size:10.5px;
              font-weight:700;
              color:#18181b;
              line-height:1.1;
            ">
              ${label}
            </span>

            <span style="
              font-size:8.5px;
              font-weight:500;
              color:#71717a;
              line-height:1.1;
            ">
              ${sublabel}
            </span>
          </div>
        </div>

        <div style="
          width:2px;
          height:6px;
          background-color:#18181b;
        "></div>
      </div>
    `,
    iconSize: [0, 0],
  });
};

const createTruckPin = () =>
  L.divIcon({
    className: "custom-truck-pin",
    html: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        transform:translate(-50%, -50%);
      ">
        <div style="position:relative;">
          <div style="
            position:absolute;
            inset:-6px;
            border-radius:50%;
            background-color:rgba(16,185,129,0.25);
            animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;
          "></div>

          <div style="
            position:relative;
            background-color:#18181b;
            width:34px;
            height:34px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            border:2.5px solid #ffffff;
            box-shadow:0 4px 16px rgba(0,0,0,0.3);
          ">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
              <circle cx="17" cy="18" r="2"/>
              <circle cx="7" cy="18" r="2"/>
            </svg>
          </div>
        </div>

        <div style="
          background-color:#18181b;
          padding:2px 7px;
          border-radius:6px;
          color:#ffffff;
          font-size:8.5px;
          font-weight:700;
          text-transform:uppercase;
          margin-top:4px;
          box-shadow:0 2px 6px rgba(0,0,0,0.2);
          display:flex;
          align-items:center;
          gap:3.5px;
        ">
          <span style="
            width:4px;
            height:4px;
            border-radius:50%;
            background-color:#10b981;
          "></span>
          En Route
        </div>
      </div>
    `,
    iconSize: [0, 0],
  });

export default function TrackingMap({ status }: Props) {
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
  const [fullRoadRoute, setFullRoadRoute] = useState<
    [number, number][]
  >([]);

  const keyWaypoints = useMemo<[number, number][]>(
    () => [
      [
        LOGISTICS_POINTS.nairobi.coordinates[1],
        LOGISTICS_POINTS.nairobi.coordinates[0],
      ],
      [
        LOGISTICS_POINTS.nimule.coordinates[1],
        LOGISTICS_POINTS.nimule.coordinates[0],
      ],
      [
        LOGISTICS_POINTS.juba.coordinates[1],
        LOGISTICS_POINTS.juba.coordinates[0],
      ],
    ],
    []
  );

  const truckCoords = useMemo<[number, number]>(() => {
    let point: [number, number];

    switch (status) {
      case "PENDING":
        point = LOGISTICS_POINTS.nairobi.coordinates;
        break;

      case "CONFIRMED":
        point = interpolate(
          LOGISTICS_POINTS.nairobi.coordinates,
          LOGISTICS_POINTS.nimule.coordinates,
          0.25
        );
        break;

      case "PROCESSING":
        point = interpolate(
          LOGISTICS_POINTS.nairobi.coordinates,
          LOGISTICS_POINTS.nimule.coordinates,
          0.55
        );
        break;

      case "IN_TRANSIT":
        point = interpolate(
          LOGISTICS_POINTS.nairobi.coordinates,
          LOGISTICS_POINTS.nimule.coordinates,
          0.85
        );
        break;

      case "AT_BORDER":
        point = LOGISTICS_POINTS.nimule.coordinates;
        break;

      case "AT_JUBA_WAREHOUSE":
        point = LOGISTICS_POINTS.juba.coordinates;
        break;

      case "OUT_FOR_DELIVERY":
        point = interpolate(
          LOGISTICS_POINTS.juba.coordinates,
          LOGISTICS_POINTS.customer.coordinates,
          0.6
        );
        break;

      case "DELIVERED":
        point = LOGISTICS_POINTS.customer.coordinates;
        break;

      default:
        point = LOGISTICS_POINTS.nairobi.coordinates;
        break;
    }

    return [point[1], point[0]];
  }, [status]);

  useEffect(() => {
    async function fetchRealRoads() {
      try {
        const waypoints = [
          LOGISTICS_POINTS.nairobi.coordinates,
          LOGISTICS_POINTS.nimule.coordinates,
          LOGISTICS_POINTS.juba.coordinates,
        ];

        const coordString = waypoints
          .map(([lng, lat]) => `${lng},${lat}`)
          .join(";");

        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`
        );

        if (!res.ok) throw new Error("OSRM error");

        const data = await res.json();

        if (data.routes?.[0]?.geometry?.coordinates) {
          setFullRoadRoute(
            data.routes[0].geometry.coordinates.map(
              ([lng, lat]: [number, number]) => [lat, lng]
            )
          );
        }
      } catch (err) {
        console.error("OSRM unavailable", err);
      }
    }

    fetchRealRoads();
  }, []);

  const { completedPolyline, remainingPolyline } = useMemo(() => {
    if (!fullRoadRoute.length) {
      return {
        completedPolyline: [],
        remainingPolyline: [],
      };
    }

    let closestIndex = 0;
    let minDistance = Infinity;

    fullRoadRoute.forEach((pt, idx) => {
      const dist = Math.hypot(
        pt[0] - truckCoords[0],
        pt[1] - truckCoords[1]
      );

      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    return {
      completedPolyline: fullRoadRoute.slice(0, closestIndex + 1),
      remainingPolyline: fullRoadRoute.slice(closestIndex),
    };
  }, [fullRoadRoute, truckCoords]);

  return (
    <div className="relative h-120 w-full select-none overflow-hidden rounded-2xl border border-zinc-200/90 bg-zinc-100 shadow-xs sm:h-135 lg:h-150">
      {/* Zoom Controls */}
      <div className="absolute right-4 top-4 z-999 flex flex-col overflow-hidden rounded-xl border border-zinc-200/90 bg-white shadow-md">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            mapInstance?.zoomIn();
          }}
          aria-label="Zoom in"
          className="flex h-9 w-9 cursor-pointer items-center justify-center border-b border-zinc-150 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200"
        >
          <Plus className="h-4 w-4 stroke-2" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            mapInstance?.zoomOut();
          }}
          aria-label="Zoom out"
          className="flex h-9 w-9 cursor-pointer items-center justify-center text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200"
        >
          <Minus className="h-4 w-4 stroke-2" />
        </button>
      </div>

      <MapContainer
        center={[1.5, 35.5]}
        zoom={6}
        zoomControl={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        className="z-0 h-full w-full [&_.leaflet-tile]:grayscale [&_.leaflet-tile]:contrast-[0.88] [&_.leaflet-tile]:brightness-[1.04]"
      >
        <MapInstanceBridge onMapReady={setMapInstance} />

        <RouteBoundsManager points={keyWaypoints} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />

        {/* Completed Route */}
        {completedPolyline.length > 1 && (
          <Polyline
            positions={completedPolyline}
            pathOptions={{
              color: "#18181b",
              weight: 5,
              opacity: 0.95,
              lineCap: "round",
            }}
          />
        )}

        {/* Remaining Route */}
        {remainingPolyline.length > 1 && (
          <Polyline
            positions={remainingPolyline}
            pathOptions={{
              color: "#71717a",
              weight: 3.5,
              dashArray: "6, 8",
              opacity: 0.75,
              lineCap: "round",
            }}
          />
        )}

        {/* Nairobi */}
        <Marker
          position={[
            LOGISTICS_POINTS.nairobi.coordinates[1],
            LOGISTICS_POINTS.nairobi.coordinates[0],
          ]}
          icon={createHubPin(
            "Nairobi Hub",
            "Product Sourcing",
            "origin"
          )}
        />

        {/* Nimule */}
        <Marker
          position={[
            LOGISTICS_POINTS.nimule.coordinates[1],
            LOGISTICS_POINTS.nimule.coordinates[0],
          ]}
          icon={createHubPin(
            "Nimule Border",
            "Customs Clearance",
            "border"
          )}
        />

        {/* Juba */}
        <Marker
          position={[
            LOGISTICS_POINTS.juba.coordinates[1],
            LOGISTICS_POINTS.juba.coordinates[0],
          ]}
          icon={createHubPin(
            "Juba Hub",
            "Africa Suk",
            "destination"
          )}
        />

        {/* Truck */}
        <Marker position={truckCoords} icon={createTruckPin()} />
      </MapContainer>
    </div>
  );
}