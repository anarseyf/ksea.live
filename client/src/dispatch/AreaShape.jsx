import React, { useContext } from "react";
import { Map as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import { featuresForArea, centroid } from "./geojson";
import { mapOptions } from "./mapOptions";
import { ErrorBoundary } from "./ErrorBoundary";
import { isPhone, getStyleProp } from "../clientUtils";
import classnames from "classnames";
import styles from "./areashape.module.scss";
import { ThemeContext } from "./ThemeContext";

export const AreaShape = ({ area }) => {
  const { theme } = useContext(ThemeContext);
  const features = featuresForArea(area);
  if (!features || !features.length) {
    console.warn("AreaShape/no features for area", area);
    return null;
  }

  const geoColor = getStyleProp("--geo");

  const geojsonStyle = {
    color: geoColor,
    fillColor: geoColor,
    fillOpacity: 0.1,
    weight: 2,
  };

  const center = centroid(features);
  const zoom = 10;
  const phone = isPhone();
  const tileOptions = mapOptions(theme, phone);

  return (
    <ErrorBoundary>
      <LeafletMap
        className={classnames(styles.container, { [styles.phone]: phone })}
        center={center}
        zoom={zoom}
        minZoom={zoom}
        maxZoom={zoom}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        keyboard={false}
      >
        <TileLayer {...tileOptions} />
        <GeoJSON data={features} style={geojsonStyle} />
      </LeafletMap>
    </ErrorBoundary>
  );
};
