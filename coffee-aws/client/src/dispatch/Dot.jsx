import React from "react";
import { Circle } from "react-leaflet";

export const Appearance = {
  Normal: 0,
  Dimmed: -1,
  Highlighted: 1,
};

export const Dot = ({ coordinates, severity = 0, active = false }) => {
  const color = active ? "red" : "white";
  let opacity = 0.4;
  if (severity >= 1) {
    opacity = 0.7;
  }
  if (active) {
    opacity = 0.9;
  }
  const baseRadius = active ? 250 : 150;

  return (
    <>
      <Circle
        center={coordinates}
        radius={baseRadius}
        color={color}
        fill={true}
        fillOpacity={opacity}
        stroke={false}
      ></Circle>
      {severity >= 1 && (
        <Circle
          center={coordinates}
          radius={baseRadius + 150}
          weight={2}
          color={color}
          opacity={opacity}
          fill={false}
        ></Circle>
      )}
      {severity >= 2 && (
        <Circle
          center={coordinates}
          radius={baseRadius + 300}
          weight={2}
          color={color}
          opacity={opacity}
          fill={false}
        ></Circle>
      )}
    </>
  );
}
