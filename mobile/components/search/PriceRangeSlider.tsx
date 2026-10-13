
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
} from "react-native";

const GREEN = "#005c2e";
const THUMB_SIZE = 28;

type Props = {
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onValuesChange: (min: number, max: number) => void;
};

export default function PriceRangeSlider({
  min,
  max,
  minValue,
  maxValue,
  onValuesChange,
}: Props) {
  const widthRef = useRef(0);
  const callbackRef = useRef(onValuesChange);
  const valuesRef = useRef({ minValue, maxValue });
  const gestureRef = useRef({
    startX: 0,
    startMin: minValue,
    startMax: maxValue,
  });

  useEffect(() => {
    callbackRef.current = onValuesChange;
  }, [onValuesChange]);

  useEffect(() => {
    valuesRef.current = { minValue, maxValue };
  }, [minValue, maxValue]);

  const range = Math.max(0, max - min);

  const clamp = (value: number, lower: number, upper: number) =>
    Math.max(lower, Math.min(value, upper));

  const positionOf = (value: number) =>
    range === 0
      ? 0
      : ((value - min) / range) * widthRef.current;

  const valueAt = (position: number) =>
    range === 0 || widthRef.current <= 0
      ? min
      : min +
        (clamp(position, 0, widthRef.current) /
          widthRef.current) *
          range;

  const round = (value: number) => {
    const step =
      range >= 100000 ? 1000 :
      range >= 10000 ? 100 :
      range >= 1000 ? 10 : 1;

    return Math.round(value / step) * step;
  };

  const update = (nextMin: number, nextMax: number) => {
    valuesRef.current = {
      minValue: nextMin,
      maxValue: nextMax,
    };
    callbackRef.current(nextMin, nextMax);
  };

  const createHandleResponder = (handle: "min" | "max") =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const current = valuesRef.current;
        gestureRef.current = {
          startX: positionOf(
            handle === "min"
              ? current.minValue
              : current.maxValue,
          ),
          startMin: current.minValue,
          startMax: current.maxValue,
        };
      },
      onPanResponderMove: (_, gesture) => {
        const start = gestureRef.current;
        const next = round(
          valueAt(start.startX + gesture.dx),
        );

        if (handle === "min") {
          update(
            clamp(next, min, start.startMax),
            start.startMax,
          );
        } else {
          update(
            start.startMin,
            clamp(next, start.startMin, max),
          );
        }
      },
    });

  const barResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const current = valuesRef.current;
        gestureRef.current = {
          startX: 0,
          startMin: current.minValue,
          startMax: current.maxValue,
        };
      },
      onPanResponderMove: (_, gesture) => {
        const start = gestureRef.current;
        const span = start.startMax - start.startMin;

        if (widthRef.current <= 0 || range <= 0) return;

        const delta =
          (gesture.dx / widthRef.current) * range;

        const nextMin = clamp(
          round(start.startMin + delta),
          min,
          max - span,
        );

        update(nextMin, nextMin + span);
      },
    }),
  ).current;

  const minResponder = useRef(
    createHandleResponder("min"),
  ).current;

  const maxResponder = useRef(
    createHandleResponder("max"),
  ).current;

  const left = positionOf(minValue);
  const right = positionOf(maxValue);

  return (
    <View style={styles.container}>
      <View
        style={styles.trackArea}
        onLayout={(event) => {
          widthRef.current = Math.max(
            0,
            event.nativeEvent.layout.width - THUMB_SIZE,
          );
        }}
      >
        <View style={styles.track} />

        {/* The green selected bar can be dragged as a whole. */}
        <View
          {...barResponder.panHandlers}
          style={[
            styles.selectedTrack,
            {
              left: left + THUMB_SIZE / 2,
              width: Math.max(0, right - left),
            },
          ]}
        />

        <View
          {...minResponder.panHandlers}
          style={[styles.thumb, { left }]}
        />

        <View
          {...maxResponder.panHandlers}
          style={[styles.thumb, { left: right }]}
        />
      </View>

      <View style={styles.labels}>
        <Text style={styles.label}>
          {Math.round(minValue).toLocaleString()}
        </Text>
        <Text style={styles.label}>
          {Math.round(maxValue).toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 12,
  },
  trackArea: {
    height: 44,
    justifyContent: "center",
    marginHorizontal: THUMB_SIZE / 2,
  },
  track: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#e5e7eb",
  },
  selectedTrack: {
    position: "absolute",
    height: 6,
    borderRadius: 4,
    backgroundColor: GREEN,
    zIndex: 1,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: GREEN,
    top: 8,
    elevation: 5,
    zIndex: 2,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  label: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "700",
  },
});
