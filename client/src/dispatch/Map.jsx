import React, { useContext } from "react";
import { Map as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import zipcodes from "./zip-codes.json";
import { centroid } from "./geojson";
import "./map.css";
import { Dot, Appearance } from "./Dot";
import { TweetsContext } from "./TweetsProvider";
import { UserContext, UserContextKeys } from "./UserProvider";

const minZoom = 10,
  maxZoom = 14,
  defaultZoom = 11;
let zoom = defaultZoom;

const overlayColor = "dodgerblue";
const activeColor = "orangered";
const geojsonStyleActive = {
  color: activeColor,
  fillColor: activeColor,
  fillOpacity: 0.4,
  weight: 2,
};
const geojsonStyleHidden = {
  color: overlayColor,
  fillColor: overlayColor,
  fillOpacity: 0.1,
  weight: 1,
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
  const { groupedByType } = useContext(TweetsContext);

  if (!groupedByType.length) {
    return null;
  }

  const selectedTweet = user[UserContextKeys.SelectedTweet];
  const hoverArea = user[UserContextKeys.HoverArea];

  const activeArea = hoverArea || area;
  // console.log("MAP/active area", activeArea);

  const selectedAreaFilter = ({ properties: { GEOID10 } }) =>
    area ? GEOID10 === area : true;

  const activeAreaFilter = ({ properties: { GEOID10 } }) =>
    activeArea ? GEOID10 === activeArea : true;

  const { features, ...rest } = zipcodes;
  const geojson = {
    features: features.filter(selectedAreaFilter),
    ...rest,
  };

  if (activeArea || selectedTweet) {
    zoom = 12;
  }

  const center = selectedTweet
    ? [selectedTweet.derived.lat, selectedTweet.derived.long]
    : activeArea
    ? centroid(geojson.features.filter(activeAreaFilter))
    : centroid(geojson.features.filter(selectedAreaFilter));

  const highlightedAreaFilter = (f) =>
    activeArea ? activeAreaFilter(f) : selectedAreaFilter(f);

  console.log("MAP/center", center);

  const mapper = ({ color, intervals }) =>
    intervals[0].values.map(({ id_str, derived: { lat, long } }) => ({
      id_str,
      lat,
      long,
      color,
    }));

  let data = groupedByType.map(mapper).flat();

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

  console.log(
    `MAP/rendering with ${data.length} dots, ${geojson.features.length} geo`
  );

  return (
    <LeafletMap
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      zoomControl={false}
    >
      <TileLayer {...tileOptions} />
      {geojson.features.map((feature) => (
        <GeoJSON
          data={feature}
          style={() =>
            highlightedAreaFilter(feature)
              ? geojsonStyleActive
              : geojsonStyleHidden
          }
        />
      ))}
      {data.map((d) => (
        <Dot
          coordinates={[d.lat, d.long]}
          color={d.color}
          appearance={appearanceFn(d)}
        ></Dot>
      ))}
    </LeafletMap>
  );
}
