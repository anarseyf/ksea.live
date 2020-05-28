import React, { useContext } from "react";
import { Map as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import zipcodes from "./zip-codes.json";

// import styles from "./map.module.css";
import "./styles.css";
import { Dot } from "./Dot";
import { TweetsContext } from "./TweetsProvider";
// import "../../../node_modules/leaflet/dist/leaflet.css";

const zipcodeGeoJSON = zipcodes;
const coordinates = [47.606, -122.343];
const svgBounds = [
  coordinates.map((c) => c - 0.05),
  coordinates.map((c) => c + 0.05),
];
const zoom = 11,
  minZoom = 10,
  maxZoom = 14;

const fillColor = "red";
const overlayColor = "dodgerblue";
const geojsonStyle = {
  color: overlayColor,
  fillColor: overlayColor,
  fillOpacity: 0.2,
  weight: 2,
};

export function CoffeeMap() {
  const tweets = useContext(TweetsContext);

  const data = tweets.map(({ derived: { lat, long } }) => [lat, long]);

  const options = {
    url: "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}",
    ext: "png",
    accessToken:
      "pk.eyJ1IjoiYW5hcnNleWYiLCJhIjoiY2thZXlra3llMGF4MDJ4cXYzY2ZkamVkdyJ9.K8CENC0jz2D0O6ziL_jnNg", // Mapbox: 'coffee' token
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  };

  return (
    <LeafletMap
      center={coordinates}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      zoomControl={false}
    >
      <TileLayer {...options} />
      <GeoJSON data={zipcodeGeoJSON} style={geojsonStyle}></GeoJSON>
      {data.map((d) => (
        <Dot coordinates={d} color={fillColor}></Dot>
      ))}
      {/* <SVGOverlay
                    bounds={svgBounds}
                    // viewBox="0 0 100 100"
                    opacity="0.7"
                >
                    <circle r="10" cx="50%" cy="50%" fill={fillColor} />
                </SVGOverlay> */}
    </LeafletMap>
  );
}
