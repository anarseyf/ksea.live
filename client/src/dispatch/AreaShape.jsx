import React from "react";
import { Map as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import { pathForArea, featureForArea, centroid } from "./geojson";
import styles from "./area.module.scss";
import { MapOptions } from "./mapOptions";

const geojsonStyle = {
  color: "orangered",
  fillColor: "orangered",
  fillOpacity: 0.25,
  weight: 2,
};

export const AreaShape = ({ area }) => {
  const feature = featureForArea(area);
  if (!feature) {
    console.warn("AreaShape/no feature for area", area);
    return null;
  }

  const center = centroid([feature]);
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
      <GeoJSON data={feature} style={geojsonStyle} />
    </LeafletMap>

    // return (<svg className={styles.container}>
    //   <rect x={0} y={0} width={100} height={50} fill="none" stroke="red" />
    // </svg>);
  );
};
