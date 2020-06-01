import React, { useContext } from "react";
import { Map as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import zipcodes from "./zip-codes.json";
import { centroid } from "./geojson";
import "./map.css";
import { Dot, Appearance } from "./Dot";
import { TweetsContext } from "./TweetsProvider";
import { groupBy, GroupByOptions } from "../groupby";
import { UserContext, UserContextKeys } from "./UserProvider";

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

const tileOptions = {
  url: "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}",
  ext: "png",
  // accessToken:
  //   "pk.eyJ1IjoiYW5hcnNleWYiLCJhIjoiY2thZXlra3llMGF4MDJ4cXYzY2ZkamVkdyJ9.K8CENC0jz2D0O6ziL_jnNg", // Mapbox: 'coffee' token
  attribution:
    'Tiles by <a href="http://stamen.com">Stamen</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Data &copy; <a href="http://www.openstreetmap.org/copyright">OSM</a>',
};

export function Map({ area }) {
  const [user] = useContext(UserContext);
  const selectedTweet = user[UserContextKeys.SelectedTweet];

  const [_, tweets] = useContext(TweetsContext);

  const areaFilter = ({ properties: { GEOID10 } }) => GEOID10 === area;
  let geojson = zipcodes;
  if (area) {
    const { features, ...rest } = zipcodes;
    geojson = {
      features: features.filter(areaFilter),
      ...rest,
    };
  }

  if (area) {
    zoom = 12;
  }
  if (selectedTweet) {
    zoom = 13;
  }

  let center = selectedTweet
    ? [selectedTweet.derived.lat, selectedTweet.derived.long]
    : centroid(geojson.features);
  console.log("MAP/center", center);

  const tweetsByType = groupBy(GroupByOptions.IncidentType, tweets);
  const mapper = ({ color, values }) =>
    values.map(({ id_str, derived: { lat, long } }) => ({
      id_str,
      lat,
      long,
      color,
    }));

  let data = tweetsByType.map(mapper).flat();

  const isSelectedDot = ({ id_str }) => selectedTweet.id_str === id_str;
  if (selectedTweet) {
    // Render selected dot last, so it appears on top
    const selectedIndex = data.findIndex(isSelectedDot);
    data = [
      ...data.slice(0, selectedIndex),
      ...data.slice(selectedIndex + 1),
      data[selectedIndex],
    ];
  }

  const appearanceFn = (d) => {
    return selectedTweet
      ? isSelectedDot(d)
        ? Appearance.Highlighted
        : Appearance.Dimmed
      : Appearance.Normal;
  };

  console.log("MAP/rendering", data);

  return (
    <LeafletMap
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      zoomControl={false}
    >
      <TileLayer {...tileOptions} />
      <GeoJSON data={geojson} style={geojsonStyle}></GeoJSON>
      {data.map((d) => (
        <Dot
          coordinates={[d.lat, d.long]}
          color={d.color || defaultColor}
          appearance={appearanceFn(d)}
        ></Dot>
      ))}
    </LeafletMap>
  );
}
