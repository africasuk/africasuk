"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

// Waypoint Pins (Label sits ABOVE the pin)
const createCustomPin = (label: string, color: string) =>
  L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="background-color: ${color}; padding: 2.5px 8px; border-radius: 9999px; color: white; font-size: 8.5px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; box-shadow: 0 1px 3px rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.9); white-space: nowrap;">
          ${label}
        </div>
        <div style="width: 1.5px; height: 7px; background-color: ${color}; opacity: 0.85;"></div>
        <div style="width: 5px; height: 5px; border-radius: 50%; background-color: ${color}; border: 1px solid white;"></div>
      </div>
    `,
    iconSize: [0, 0],
  });

// Live Truck Marker (Label sits BELOW the icon circle)
const createTruckPin = (label: string = "LIVE LOCATION") =>
  L.divIcon({
    className: "custom-truck-pin",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
        <!-- Truck Icon Circle -->
        <div style="background-color: #005c2e; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.22);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
        </div>
        <!-- Label Badge (Floats below the icon so it never obscures checkpoint names) -->
        <div style="background-color: #002b15; padding: 2px 7px; border-radius: 9999px; color: #34d399; font-size: 8px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.03em; border: 1px solid rgba(255,255,255,0.4); box-shadow: 0 2px 4px rgba(0,0,0,0.15); margin-top: 3px; white-space: nowrap;">
          ${label}
        </div>
      </div>
    `,
    iconSize: [0, 0],
  });
export default function TrackingMap({ status }: Props) {
  const [fullRoadRoute, setFullRoadRoute] = useState<[number, number][]>([]);

  // Calculate active truck coordinates [lat, lng]
  const truckCoords = useMemo<[number, number]>(() => {
    let point: [number, number];
    switch (status) {
      case "PENDING":
        point = LOGISTICS_POINTS.kampala.coordinates;
        break;
      case "CONFIRMED":
        point = interpolate(LOGISTICS_POINTS.kampala.coordinates, LOGISTICS_POINTS.nimule.coordinates, 0.25);
        break;
      case "PROCESSING":
        point = interpolate(LOGISTICS_POINTS.kampala.coordinates, LOGISTICS_POINTS.nimule.coordinates, 0.6);
        break;
      case "READY_FOR_PICKUP":
        point = LOGISTICS_POINTS.kampala.coordinates;
        break;
      case "IN_TRANSIT":
        point = interpolate(LOGISTICS_POINTS.kampala.coordinates, LOGISTICS_POINTS.nimule.coordinates, 0.8);
        break;
      case "AT_BORDER":
        point = LOGISTICS_POINTS.nimule.coordinates;
        break;
      case "AT_JUBA_WAREHOUSE":
        point = LOGISTICS_POINTS.juba.coordinates;
        break;
      case "OUT_FOR_DELIVERY":
        point = interpolate(LOGISTICS_POINTS.juba.coordinates, LOGISTICS_POINTS.customer.coordinates, 0.5);
        break;
      case "DELIVERED":
        point = LOGISTICS_POINTS.customer.coordinates;
        break;
      case "CANCELLED":
      default:
        point = LOGISTICS_POINTS.kampala.coordinates;
        break;
    }
    return [point[1], point[0]];
  }, [status]);

  // Fetch real highway geometry from the free OSRM Routing engine
  useEffect(() => {
    async function fetchRealRoads() {
      try {
        const waypoints = [
          LOGISTICS_POINTS.kampala.coordinates,
          LOGISTICS_POINTS.nimule.coordinates,
          LOGISTICS_POINTS.juba.coordinates,
          LOGISTICS_POINTS.customer.coordinates,
        ];

        const coordString = waypoints.map((pt) => `${pt[0]},${pt[1]}`).join(";");

        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`
        );
        const data = await res.json();

        if (data.routes?.[0]?.geometry?.coordinates) {
          // OSRM provides [lng, lat] -> convert to Leaflet's [lat, lng]
          const parsedRoute: [number, number][] = data.routes[0].geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]]
          );
          setFullRoadRoute(parsedRoute);
        }
      } catch (error) {
        console.error("Failed to load OSRM road geometry:", error);
      }
    }

    fetchRealRoads();
  }, []);

  // Split full road polyline into Completed vs Remaining based on truck position
  const { completedPolyline, remainingPolyline } = useMemo(() => {
    if (!fullRoadRoute.length) {
      return { completedPolyline: [], remainingPolyline: [] };
    }

    // Find closest route index to current truck location
    let closestIndex = 0;
    let minDistance = Infinity;

    fullRoadRoute.forEach((pt, idx) => {
      const dist = Math.hypot(pt[0] - truckCoords[0], pt[1] - truckCoords[1]);
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
    <div className="relative h-145 w-full overflow-hidden rounded-3xl border border-gray-200/80 shadow-md">
      <MapContainer
        center={[2.8, 32.2]}
        zoom={7}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        {/* Free, Clean CartoDB Positron High-Detail Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Active Route Following Real Highways (Emerald Green) */}
        {completedPolyline.length > 1 && (
          <Polyline
            positions={completedPolyline}
            pathOptions={{
              color: "#005c2e",
              weight: 5,
              opacity: 0.95,
              lineCap: "round",
            }}
          />
        )}

        {/* Remaining Highway Segment (Dashed Grey) */}
        {remainingPolyline.length > 1 && (
          <Polyline
            positions={remainingPolyline}
            pathOptions={{
              color: "#94a3b8",
              weight: 3.5,
              dashArray: "6, 8",
              opacity: 0.8,
              lineCap: "round",
            }}
          />
        )}

        {/* Kampala Hub */}
        <Marker
          position={[LOGISTICS_POINTS.kampala.coordinates[1], LOGISTICS_POINTS.kampala.coordinates[0]]}
          icon={createCustomPin("Kampala Hub", "#002b15")}
        />

        {/* Nimule Border */}
        <Marker
          position={[LOGISTICS_POINTS.nimule.coordinates[1], LOGISTICS_POINTS.nimule.coordinates[0]]}
          icon={createCustomPin("Nimule Border", "#d97706")}
        />

        {/* Juba Hub */}
        <Marker
          position={[LOGISTICS_POINTS.juba.coordinates[1], LOGISTICS_POINTS.juba.coordinates[0]]}
          icon={createCustomPin("Juba Hub", "#005c2e")}
        />

        {/* Customer Destination */}
        <Marker
          position={[LOGISTICS_POINTS.customer.coordinates[1], LOGISTICS_POINTS.customer.coordinates[0]]}
          icon={createCustomPin("Customer", "#dc2626")}
        />

        {/* Moving Truck Marker */}
        <Marker position={truckCoords} icon={createTruckPin("Live Location")} />
      </MapContainer>

      {/* Floating Summary Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 sm:left-6 sm:right-auto sm:w-80 rounded-2xl border border-gray-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md select-none">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Est. Distance
            </p>
            <p className="text-xl font-black text-[#002b15]">674.2 km</p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Route Status
            </p>
            <p className="text-sm font-extrabold text-[#005c2e] uppercase">
              On Schedule
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}