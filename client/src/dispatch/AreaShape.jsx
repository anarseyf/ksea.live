import React from "react";
import { Map as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import { featuresForArea, centroid } from "./geojson";
import { MapOptions } from "./mapOptions";
import styles from "./area.module.scss";

const geojsonStyle = {
  color: "orangered",
  fillColor: "orangered",
  fillOpacity: 0.25,
  weight: 2,
};

export const AreaShape = ({ area }) => {
  const features = featuresForArea(area);
  if (!features.length) {
    console.warn("AreaShape/no features for area", area);
    return null;
  }

  console.log(`AREA/${area} -> `, features);

  const center = centroid(features);
  console.log(`AREA/center: ${area} -> `, center);
  const zoom = 11;
  const tileOptions = MapOptions.NoLabels;

  return (
    <LeafletMap
      className={styles.container}
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

    // return (<svg className={styles.container}>
    //   <rect x={0} y={0} width={100} height={50} fill="none" stroke="red" />
    // </svg>);
  );
};
