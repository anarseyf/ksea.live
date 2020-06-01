import React, { useContext } from "react";
import { Map as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import zipcodes from "./zip-codes.json";
import { centroid } from "./geojson";
import "./map.css";
import { Dot } from "./Dot";
import { TweetsContext } from "./TweetsProvider";
import { groupBy, GroupByOptions } from "../groupby";

const minZoom = 10,
  maxZoom = 14;
let zoom = 11;

const defaultColor = "purple";
const overlayColor = "dodgerblue";
const geojsonStyle = {
  color: overlayColor,
  fillColor: overlayColor,
  fillOpacity: 0.2,
  weight: 2,
};

export function Map({ area }) {
  const [_, tweets] = useContext(TweetsContext);

  const areaFilter = ({ properties: { GEOID10 } }) => GEOID10 === area;
  let geojson = zipcodes;
  if (area) {
    const { features, ...rest } = zipcodes;
    geojson = {
      features: features.filter(areaFilter),
      ...rest,
    };

    zoom = 12;
  }

  let center = centroid(geojson.features);
  console.log("center", center);
  console.log("geojson", geojson);

  const tweetsByType = groupBy(GroupByOptions.IncidentType, tweets);
  const mapper = ({ color, values }) =>
    values.map(({ derived: { lat, long } }) => ({ lat, long, color }));

  const data = tweetsByType.map(mapper).flat();

  const options = {
    url: "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}",
    ext: "png",
    // accessToken:
    //   "pk.eyJ1IjoiYW5hcnNleWYiLCJhIjoiY2thZXlra3llMGF4MDJ4cXYzY2ZkamVkdyJ9.K8CENC0jz2D0O6ziL_jnNg", // Mapbox: 'coffee' token
    attribution:
      'Tiles by <a href="http://stamen.com">Stamen</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Data &copy; <a href="http://www.openstreetmap.org/copyright">OSM</a>',
  };

  return (
    <LeafletMap
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      zoomControl={false}
    >
      <TileLayer {...options} />
      <GeoJSON data={geojson} style={geojsonStyle}></GeoJSON>
      {data.map((d) => (
        <Dot
          coordinates={[d.lat, d.long]}
          color={d.color || defaultColor}
        ></Dot>
      ))}
    </LeafletMap>
  );
}
