import React from "react";
import { Circle } from "react-leaflet";
import App from "../App";

export const Appearance = {
  Normal: 0,
  Dimmed: -1,
  Highlighted: 1,
};

export function Dot({
  coordinates = [51.477, 0], // Greenwich, but why?
  color = "dodgerblue",
  appearance = Appearance.Normal,
}) {
  let opacity = 0.7;
  if (appearance === Appearance.Highlighted) {
    opacity = 0.9;
  } else if (appearance === Appearance.Dimmed) {
    opacity = 0.4;
  }

  return (
    <>
      <Circle
        center={coordinates}
        radius={200}
        color={color}
        fill={true}
        fillOpacity={opacity}
        stroke={false}
      ></Circle>
      {appearance >= Appearance.Highlighted && (
        <Circle
          center={coordinates}
          radius={300}
          weight={3}
          color={color}
          opacity={opacity}
          fill={false}
        ></Circle>
      )}
      {appearance >= Appearance.Highlighted && (
        <Circle
          center={coordinates}
          radius={400}
          weight={2}
          color={color}
          opacity={opacity}
          fill={false}
        ></Circle>
      )}
    </>
  );
}
