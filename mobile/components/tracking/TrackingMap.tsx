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

        const coordString = waypoints.map((pt) => `${pt[0]},${pt[1]}`).join(";");

        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`
        );
        const data = await res.json();

        if (data.routes?.[0]?.geometry?.coordinates) {
          // OSRM provides [lng, lat] -> convert to React Native Maps format { latitude, longitude }
          const parsedRoute = data.routes[0].geometry.coordinates.map(
            (coord: [number, number]) => ({
              latitude: coord[1],
              longitude: coord[0],
            })
          );
          setFullRoadRoute(parsedRoute);
        }
      } catch (error) {
        console.error("Failed to load OSRM road geometry:", error);
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
            strokeWidth={5}
          />
        )}

        {/* Remaining Route Segment (Dashed Grey) */}
        {remainingPolyline.length > 1 && (
          <Polyline
            coordinates={remainingPolyline}
            strokeColor="#94a3b8"
            strokeWidth={3.5}
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
            <View style={styles.truckCircle}>
              <Truck size={14} color="#ffffff" />
            </View>
            <View style={styles.truckBadge}>
              <Text style={styles.truckBadgeText}>Live Location</Text>
            </View>
          </View>
        </Marker>
      </MapView>

      {/* Floating Summary Overlay */}
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
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  pinText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700",
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
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  truckPinContainer: {
    alignItems: "center",
  },
  truckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#005c2e",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
  },
  truckBadge: {
    backgroundColor: "#002b15",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    marginTop: 3,
  },
  truckBadgeText: {
    color: "#34d399",
    fontSize: 8,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  summaryCard: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#002b15",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: "#e5e7eb",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#005c2e",
    textTransform: "uppercase",
    marginTop: 2,
  },
});