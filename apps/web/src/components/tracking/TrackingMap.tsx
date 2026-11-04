"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Plus, Minus, LocateFixed } from "lucide-react";

import type { OrderStatus } from "@africasuk/types";
import { LOGISTICS_POINTS } from "@/constants/logisticsCoordinates";

interface Props {
  status: OrderStatus;
}

type LatLng = [number, number];
type Coordinates = [number, number];

function interpolate(
  start: Coordinates,
  end: Coordinates,
  progress: number
): Coordinates {
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

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    const observer = new ResizeObserver(() => {
      map.invalidateSize({ animate: false });
    });

    observer.observe(container);

    const frame = requestAnimationFrame(() => {
      map.invalidateSize({ animate: false });
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [map]);

  return null;
}

function RouteBoundsManager({ points }: { points: LatLng[] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    map.fitBounds(L.latLngBounds(points), {
      padding: [45, 45],
      maxZoom: 8,
      animate: false,
    });
  }, [map, points]);

  return null;
}

function createLocationPin(
  label: string,
  sublabel: string,
  type: "origin" | "border" | "destination"
) {
  const colors = {
    origin: "#18181b",
    border: "#f59e0b",
    destination: "#10b981",
  };

  return L.divIcon({
    className: "africasuk-location-pin",
    html: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        transform:translate(-50%, -115%);
        pointer-events:none;
      ">
        <div style="
          display:flex;
          align-items:center;
          gap:6px;
          padding:5px 8px;
          border:1px solid #e4e4e7;
          border-radius:8px;
          background:#fff;
          box-shadow:0 3px 10px rgba(0,0,0,.12);
          white-space:nowrap;
        ">
          <span style="
            width:6px;height:6px;border-radius:50%;
            background:${colors[type]};
          "></span>
          <div style="display:flex;flex-direction:column;">
            <span style="font-size:9px;font-weight:700;color:#18181b;">
              ${label}
            </span>
            <span style="font-size:7px;color:#71717a;">
              ${sublabel}
            </span>
          </div>
        </div>
        <div style="width:2px;height:6px;background:#a1a1aa;"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function createShipmentPin() {
  return L.divIcon({
    className: "africasuk-shipment-pin",
    html: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        transform:translate(-50%,-50%);
      ">
        <div style="
          position:relative;
          width:34px;height:34px;
          display:flex;align-items:center;justify-content:center;
        ">
          <div style="
            position:absolute;inset:0;border-radius:50%;
            background:rgba(16,185,129,.2);
            animation:africasuk-pulse 2s ease-out infinite;
          "></div>
          <div style="
            position:relative;
            width:25px;height:25px;
            display:flex;align-items:center;justify-content:center;
            border:2px solid white;border-radius:50%;
            background:#18181b;
            box-shadow:0 3px 10px rgba(0,0,0,.25);
          ">
            <svg width="13" height="13" viewBox="0 0 24 24"
              fill="none" stroke="white" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 7h-9"/>
              <path d="M14 3l-4 4 4 4"/>
              <path d="M4 17h9"/>
              <path d="M10 13l4 4-4 4"/>
            </svg>
          </div>
        </div>
        <div style="
          margin-top:1px;padding:3px 6px;border-radius:5px;
          background:#18181b;color:white;font-size:7px;
          font-weight:700;white-space:nowrap;
        ">ESTIMATED POSITION</div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export default function TrackingMap({ status }: Props) {
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
  const [fullRoadRoute, setFullRoadRoute] = useState<LatLng[]>([]);

  const handleMapReady = useCallback((map: LeafletMap) => {
    setMapInstance(map);
  }, []);

  const routeWaypoints = useMemo<Coordinates[]>(
    () => [
      LOGISTICS_POINTS.nairobi.coordinates,
      LOGISTICS_POINTS.nimule.coordinates,
      LOGISTICS_POINTS.juba.coordinates,
      LOGISTICS_POINTS.customer.coordinates,
    ],
    []
  );

  const keyWaypoints = useMemo<LatLng[]>(
    () => routeWaypoints.map(([lng, lat]) => [lat, lng]),
    [routeWaypoints]
  );

  const shipmentCoords = useMemo<LatLng>(() => {
    const nairobi = LOGISTICS_POINTS.nairobi.coordinates;
    const nimule = LOGISTICS_POINTS.nimule.coordinates;
    const juba = LOGISTICS_POINTS.juba.coordinates;
    const customer = LOGISTICS_POINTS.customer.coordinates;

    let point: Coordinates;

    switch (status) {
      case "PENDING":
      case "CONFIRMED":
        point = nairobi;
        break;
      case "PROCESSING":
        point = interpolate(nairobi, nimule, 0.55);
        break;
      case "IN_TRANSIT":
        point = interpolate(nairobi, nimule, 0.85);
        break;
      case "AT_BORDER":
        point = nimule;
        break;
      case "AT_JUBA_WAREHOUSE":
        point = juba;
        break;
      case "OUT_FOR_DELIVERY":
        point = interpolate(juba, customer, 0.6);
        break;
      case "DELIVERED":
        point = customer;
        break;
      default:
        point = nairobi;
    }

    return [point[1], point[0]];
  }, [status]);

  // Load the road route through Nimule.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchRoadRoute() {
      try {
        const coordinateString = routeWaypoints
          .map(([lng, lat]) => `${lng},${lat}`)
          .join(";");

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordinateString}?overview=full&geometries=geojson`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Route unavailable");

        const data = await response.json();
        const coordinates = data.routes?.[0]?.geometry?.coordinates;

        if (Array.isArray(coordinates)) {
          setFullRoadRoute(
            coordinates.map(([lng, lat]: [number, number]) => [lat, lng])
          );
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Shipment route unavailable:", error);
        }
      }
    }

    fetchRoadRoute();

    return () => controller.abort();
  }, [routeWaypoints]);

  const { completedPolyline, remainingPolyline } = useMemo(() => {
    if (!fullRoadRoute.length) {
      return {
        completedPolyline: [] as LatLng[],
        remainingPolyline: [] as LatLng[],
      };
    }

    let closestIndex = 0;
    let minDistance = Infinity;

    fullRoadRoute.forEach((point, index) => {
      const distance = Math.hypot(
        point[0] - shipmentCoords[0],
        point[1] - shipmentCoords[1]
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    return {
      completedPolyline: fullRoadRoute.slice(0, closestIndex + 1),
      remainingPolyline: fullRoadRoute.slice(closestIndex),
    };
  }, [fullRoadRoute, shipmentCoords]);

  const recenterOnShipment = useCallback(() => {
    if (!mapInstance) return;

    mapInstance.flyTo(
      shipmentCoords,
      Math.max(mapInstance.getZoom(), 8),
      { duration: 0.8 }
    );
  }, [mapInstance, shipmentCoords]);

  const shipmentPin = useMemo(() => createShipmentPin(), []);

  const nairobiPin = useMemo(
    () => createLocationPin("Nairobi, Kenya", "Shipping origin", "origin"),
    []
  );

  const nimulePin = useMemo(
    () => createLocationPin("Nimule Border", "Customs checkpoint", "border"),
    []
  );

  const jubaPin = useMemo(
    () => createLocationPin("Juba, South Sudan", "Destination city", "destination"),
    []
  );

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#f4f6f4]">

      {/* CENTER ON SHIPMENT */}
      <button
        type="button"
        onClick={recenterOnShipment}
        aria-label="Center map on shipment"
        title="Center on shipment"
        className="absolute bottom-3 left-3 z-1000 flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-[10px] font-semibold text-zinc-800 shadow-lg transition hover:bg-zinc-50 active:scale-95 sm:bottom-4 sm:left-4"
      >
        <LocateFixed size={16} className="text-emerald-700" />
        <span>Center on shipment</span>
      </button>

      {/* ZOOM CONTROLS */}
      <div className="absolute bottom-3 right-3 z-1000 flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg sm:bottom-4 sm:right-4">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            mapInstance?.zoomIn();
          }}
          aria-label="Zoom in"
          className="flex h-9 w-9 items-center justify-center border-b border-zinc-200 text-zinc-700 hover:bg-zinc-100"
        >
          <Plus size={16} />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            mapInstance?.zoomOut();
          }}
          aria-label="Zoom out"
          className="flex h-9 w-9 items-center justify-center text-zinc-700 hover:bg-zinc-100"
        >
          <Minus size={16} />
        </button>
      </div>

      <MapContainer
        center={[3, 34]}
        zoom={6}
        zoomControl={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        className="z-0 h-full w-full [&_.leaflet-tile]:grayscale [&_.leaflet-tile]:contrast-[0.9] [&_.leaflet-tile]:brightness-[1.04]"
      >
        <MapInstanceBridge onMapReady={handleMapReady} />
        <MapResizeHandler />
        <RouteBoundsManager points={keyWaypoints} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />

        {completedPolyline.length > 1 && (
          <Polyline
            positions={completedPolyline}
            pathOptions={{
              color: "#18181b",
              weight: 4,
              opacity: 0.95,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}

        {remainingPolyline.length > 1 && (
          <Polyline
            positions={remainingPolyline}
            pathOptions={{
              color: "#71717a",
              weight: 3,
              dashArray: "6, 8",
              opacity: 0.75,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}

        <Marker
          position={[
            LOGISTICS_POINTS.nairobi.coordinates[1],
            LOGISTICS_POINTS.nairobi.coordinates[0],
          ]}
          icon={nairobiPin}
        />

        <Marker
          position={[
            LOGISTICS_POINTS.nimule.coordinates[1],
            LOGISTICS_POINTS.nimule.coordinates[0],
          ]}
          icon={nimulePin}
        />

        <Marker
          position={[
            LOGISTICS_POINTS.juba.coordinates[1],
            LOGISTICS_POINTS.juba.coordinates[0],
          ]}
          icon={jubaPin}
        />

        <Marker
          position={shipmentCoords}
          icon={shipmentPin}
          zIndexOffset={1000}
        />
      </MapContainer>

      <style jsx global>{`
        @keyframes africasuk-pulse {
          0% {
            transform: scale(0.75);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        .africasuk-location-pin,
        .africasuk-shipment-pin {
          background: transparent;
          border: none;
        }

        .leaflet-container {
          font-family: inherit;
          background: #f4f6f4;
        }

        .leaflet-control-attribution {
          font-size: 8px !important;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}