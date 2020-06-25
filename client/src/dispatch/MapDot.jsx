import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { Circle } from "react-leaflet";
import { getStyleProp } from "../clientUtils";

export const Appearance = {
  Normal: 0,
  Dimmed: -1,
  Highlighted: 1,
};

export const MapDot = ({
  coordinates,
  severity = 0,
  active = false,
  appearance = Appearance.Normal,
}) => {
  const { theme } = useContext(ThemeContext);
  const [color, setColor] = useState(null);

  useEffect(() => {
    const regularColor = getStyleProp("--graph-primary");
    const activeColor = getStyleProp("--live");
    setColor(active ? activeColor : regularColor);
  }, [active, theme]);

  // TODO - set opacity in CSS
  let opacity = 0.4;
  if (severity >= 1) {
    opacity = 0.7;
  }
  if (active) {
    opacity = 0.9;
  }
  if (appearance === Appearance.Dimmed) {
    opacity = 0.35;
  }
  if (appearance === Appearance.Highlighted) {
    opacity = 0.9;
  }
  const baseRadius = active ? 250 : 150;

  if (!coordinates[0]) {
    // console.warn(`Dot: coordinates = ${coordinates}`);
    return null;
  }

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
};
