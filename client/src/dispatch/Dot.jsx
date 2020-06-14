import React from "react";
import { Circle } from "react-leaflet";
import App from "../App";

export const Appearance = {
  Normal: 0,
  Dimmed: -1,
  Highlighted: 1,
};

export function Dot({ coordinates, severity = 0, active = false }) {
  const color = active ? "red" : "white";
  let opacity = 0.4;
  if (severity >= 1) {
    opacity = 0.7;
  }
  if (severity >= 2 || active) {
    opacity = 0.9;
  }

  return (
    <>
      <Circle
        center={coordinates}
        radius={150}
        color={color}
        fill={true}
        fillOpacity={opacity}
        stroke={false}
      ></Circle>
      {severity >= 1 && (
        <Circle
          center={coordinates}
          radius={300}
          weight={3}
          color={color}
          opacity={opacity}
          fill={false}
        ></Circle>
      )}
      {severity >= 2 && (
        <Circle
          center={coordinates}
          radius={500}
          weight={2}
          color={color}
          opacity={opacity}
          fill={false}
        ></Circle>
      )}
    </>
  );
}
