import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { Truck } from "lucide-react-native";

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

export default function TrackingMap({ status }: Props) {
  const [fullRoadRoute, setFullRoadRoute] = useState<{ latitude: number; longitude: number }[]>([]);

  // Calculate active truck coordinates { latitude, longitude }
  const truckCoords = useMemo<{ latitude: number; longitude: number }>(() => {
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
    return { latitude: point[1], longitude: point[0] };
  }, [status]);

  // Fetch real highway route geometry from OSRM
 useEffect(() => {
  async function fetchRealRoads() {
    try {
      const waypoints = [
        LOGISTICS_POINTS.kampala.coordinates,
        LOGISTICS_POINTS.nimule.coordinates,
        LOGISTICS_POINTS.juba.coordinates,
        LOGISTICS_POINTS.customer.coordinates,
      ];

      const coordString = waypoints
        .map(([lng, lat]) => `${lng},${lat}`)
        .join(";");

      const url =
        `https://router.project-osrm.org/route/v1/driving/${coordString}` +
        `?overview=full&geometries=geojson`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`OSRM returned ${response.status}`);
      }

      const data = await response.json();

      const coordinates = data.routes?.[0]?.geometry?.coordinates;

      if (!coordinates) {
        throw new Error("No route returned by OSRM");
      }

      const parsedRoute = coordinates.map(
        ([lng, lat]: [number, number]) => ({
          latitude: lat,
          longitude: lng,
        })
      );

      setFullRoadRoute(parsedRoute);
    } catch  {
      console.warn("OSRM unavailable. Map will load without road route.");
      setFullRoadRoute([]);
    }
  }

  fetchRealRoads();
}, []);

  // Split polyline into Completed vs Remaining based on current truck position
  const { completedPolyline, remainingPolyline } = useMemo(() => {
    if (!fullRoadRoute.length) {
      return { completedPolyline: [], remainingPolyline: [] };
    }

    let closestIndex = 0;
    let minDistance = Infinity;

    fullRoadRoute.forEach((pt, idx) => {
      const dist = Math.hypot(pt.latitude - truckCoords.latitude, pt.longitude - truckCoords.longitude);
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
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude: 2.8,
          longitude: 32.2,
          latitudeDelta: 6.0,
          longitudeDelta: 6.0,
        }}
      >
        {/* Completed Route Segment (Solid Emerald Green) */}
        {completedPolyline.length > 1 && (
          <Polyline
            coordinates={completedPolyline}
            strokeColor="#005c2e"
            strokeWidth={4}
          />
        )}

        {/* Remaining Route Segment (Dashed Grey) */}
        {remainingPolyline.length > 1 && (
          <Polyline
            coordinates={remainingPolyline}
            strokeColor="#94a3b8"
            strokeWidth={3}
            lineDashPattern={[6, 8]}
          />
        )}

        {/* Kampala Hub Pin */}
        <Marker
          coordinate={{
            latitude: LOGISTICS_POINTS.kampala.coordinates[1],
            longitude: LOGISTICS_POINTS.kampala.coordinates[0],
          }}
          anchor={{ x: 0.5, y: 1.0 }}
        >
          <CustomPin label="Kampala Hub" color="#002b15" />
        </Marker>

        {/* Nimule Border Pin */}
        <Marker
          coordinate={{
            latitude: LOGISTICS_POINTS.nimule.coordinates[1],
            longitude: LOGISTICS_POINTS.nimule.coordinates[0],
          }}
          anchor={{ x: 0.5, y: 1.0 }}
        >
          <CustomPin label="Nimule Border" color="#d97706" />
        </Marker>

        {/* Juba Hub Pin */}
        <Marker
          coordinate={{
            latitude: LOGISTICS_POINTS.juba.coordinates[1],
            longitude: LOGISTICS_POINTS.juba.coordinates[0],
          }}
          anchor={{ x: 0.5, y: 1.0 }}
        >
          <CustomPin label="Juba Hub" color="#005c2e" />
        </Marker>

        {/* Customer Pin */}
        <Marker
          coordinate={{
            latitude: LOGISTICS_POINTS.customer.coordinates[1],
            longitude: LOGISTICS_POINTS.customer.coordinates[0],
          }}
          anchor={{ x: 0.5, y: 1.0 }}
        >
          <CustomPin label="Customer" color="#dc2626" />
        </Marker>

        {/* Live Truck Marker */}
        <Marker coordinate={truckCoords} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.truckPinContainer}>
            <View style={styles.truckSquare}>
              <Truck size={14} color="#ffffff" />
            </View>
            <View style={styles.truckBadge}>
              <Text style={styles.truckBadgeText}>Live Location</Text>
            </View>
          </View>
        </Marker>
      </MapView>

      {/* Floating Summary Overlay with Sharp Corners */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Est. Distance</Text>
            <Text style={styles.summaryValue}>674.2 km</Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={styles.summaryLabel}>Route Status</Text>
            <Text style={styles.statusText}>On Schedule</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Subcomponent for Custom Waypoint Markers
function CustomPin({ label, color }: { label: string; color: string }) {
  return (
    <View style={styles.pinContainer}>
      <View style={[styles.pinBadge, { backgroundColor: color }]}>
        <Text style={styles.pinText}>{label}</Text>
      </View>
      <View style={[styles.pinStem, { backgroundColor: color }]} />
      <View style={[styles.pinDot, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 480,
    width: "100%",
    borderRadius: 0, // Sharp corners
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  pinContainer: {
    alignItems: "center",
  },
  pinBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
  },
  pinText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "500", // Non-bold
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pinStem: {
    width: 2,
    height: 8,
    opacity: 0.85,
  },
  pinDot: {
    width: 6,
    height: 6,
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  truckPinContainer: {
    alignItems: "center",
  },
  truckSquare: {
    width: 28,
    height: 28,
    borderRadius: 0, // Sharp corners
    backgroundColor: "#005c2e",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  truckBadge: {
    backgroundColor: "#002b15",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    marginTop: 3,
  },
  truckBadgeText: {
    color: "#34d399",
    fontSize: 8,
    fontWeight: "500", // Non-bold
    textTransform: "uppercase",
  },
  summaryCard: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#ffffff",
    borderRadius: 0, // Sharp corners
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "500", // Non-bold
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500", // Non-bold clean weight
    color: "#002b15",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: "#e5e7eb",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500", // Non-bold clean weight
    color: "#005c2e",
    textTransform: "uppercase",
    marginTop: 2,
  },
});