import React, { useContext } from "react";
import { Map as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import { Dot, Appearance } from "./Dot";
import { TweetsContext } from "./TweetsProvider";
import { UserContext, UserContextKeys } from "./UserProvider";
import { MapOptions } from "./mapOptions";
import { centroid, areas, cityGeojson, mapBounds } from "./geojson";
import "./leaflet.scss";
import styles from "./map.module.scss";

const minZoom = 10,
  maxZoom = 13,
  defaultZoom = 11;
let zoom = defaultZoom;

const activeColor = "dodgerblue";
const geojsonStyleBounds = {
  color: "#1e90ff66", // dodgerblue with alpha
  fillOpacity: 0,
  strokeOpacity: 0.5,
  weight: 4,
};
const geojsonStyleActive = {
  color: activeColor,
  fillColor: activeColor,
  fillOpacity: 0.15,
  weight: 2,
};

export const Map = ({ area, tileOptions = MapOptions.Default }) => {
  const { byTypeForArea } = useContext(TweetsContext);
  const { user } = useContext(UserContext);
  const typeFilter = user[UserContextKeys.TypeFilter];

  const { geojson, areaProp } = areas;

  const selectedTweet = user[UserContextKeys.SelectedTweet];
  const hoverArea = user[UserContextKeys.HoverArea];

  const activeArea = hoverArea || area;
  // console.log("MAP/active area", activeArea);

  const renderFilter = ({ properties }) =>
    activeArea && properties[areaProp] === activeArea;

  const { features } = geojson;
  const rendered = features.filter(renderFilter);

  if (area) {
    zoom = defaultZoom + 1;
  }
  if (selectedTweet) {
    zoom = maxZoom;
  }

  const center = selectedTweet
    ? [selectedTweet.derived.lat, selectedTweet.derived.long]
    : centroid(features);

  const mapper = ({ intervals }) =>
    intervals[0].values.map(
      ({ id_str, derived: { lat, long, type, color, active, severity } }) => ({
        id_str,
        lat,
        long,
        type,
        color,
        active,
        severity,
      })
    );

  const isSelectedDot = ({ id_str }) => selectedTweet.id_str === id_str;

  let data = [];

  if (byTypeForArea.length) {
    data = byTypeForArea
      .flatMap(mapper)
      .filter(({ type }) => !typeFilter || typeFilter === type);

    console.log("Entries with no lat/long:", data.filter(({lat}) => !lat).map(({id_str})=>id_str));

    if (selectedTweet) {
      // Render selected dot last, so it appears on top
      const selectedIndex = data.findIndex(isSelectedDot);

      data =
        selectedIndex === -1
          ? []
          : [
              ...data.slice(0, selectedIndex),
              ...data.slice(selectedIndex + 1),
              data[selectedIndex],
            ];
    }
  }

  const appearanceFn = (d) => {
    return selectedTweet
      ? isSelectedDot(d)
        ? Appearance.Highlighted
        : Appearance.Dimmed
      : Appearance.Normal;
  };

  console.log(`MAP/rendering with ${data.length} dots, ${rendered.length} geo, center: ${center}`);
  const city = cityGeojson.features[0];

  return (
    <LeafletMap
      className={styles.container}
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      maxBounds={mapBounds}
      maxBoundsViscosity={0.6}
      zoomControl={false}
    >
      <TileLayer {...tileOptions} />
      <GeoJSON data={city} style={geojsonStyleBounds} />
      {rendered.map((feature) => (
        <GeoJSON data={feature} style={geojsonStyleActive} />
      ))}
      {data.map((d) => (
        <Dot // TODO - group under a single container?
          coordinates={[d.lat, d.long]}
          severity={d.severity}
          appearance={appearanceFn(d)}
          active={d.active}
          // color={d.color}
        ></Dot>
      ))}
    </LeafletMap>
  );
};
