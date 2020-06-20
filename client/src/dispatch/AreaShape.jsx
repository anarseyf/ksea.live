import React from "react";
import { Map as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import { featuresForArea, centroid } from "./geojson";
import { MapOptions } from "./mapOptions";
import { ErrorBoundary } from "./ErrorBoundary";
import { isPhone } from "../clientUtils";
import classnames from "classnames";
import styles from "./areashape.module.scss";

const geojsonStyle = {
  color: "dodgerblue",
  fillColor: "dodgerblue",
  fillOpacity: 0.15,
  weight: 1,
};

export const AreaShape = ({ area }) => {
  const features = featuresForArea(area);
  if (!features || !features.length) {
    console.warn("AreaShape/no features for area", area);
    return null;
  }

  const center = centroid(features);
  const zoom = 10;
  const tileOptions = MapOptions.NoLabels;

  return (
    <ErrorBoundary>
      <LeafletMap
        className={classnames(styles.container, { [styles.phone]: isPhone() })}
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
