import React, { useContext } from "react";
import { Map as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import { MapDot, Appearance } from "./MapDot";
import { DataContext, currentInterval } from "./DataProvider";
import { UserContext, UserContextKeys } from "./UserProvider";
import { ThemeContext } from "./ThemeContext";
import { mapOptions } from "./mapOptions";
import { centroid, areas, cityGeojson, mapBounds } from "./geojson";
import classnames from "classnames";
import { isPhone } from "../clientUtils";
import "./leaflet.scss";
import styles from "./map.module.scss";

const minZoom = 10,
  maxZoom = 13,
  defaultZoom = 11;

const activeColor = "dodgerblue";

export const Map = ({ area }) => {
  const { user } = useContext(UserContext);
  const { filteredByArea } = useContext(DataContext);
  const { theme } = useContext(ThemeContext);
  const tileOptions = mapOptions(theme);

  if (!filteredByArea.length) {
    // console.log("MAP/no data");
    return null;
  }

  const geojsonStyleBounds = {
    color: "#1e90ff66", // dodgerblue with alpha
    fillOpacity: 0,
    strokeOpacity: 0.5,
    weight: 4,
  };
  const geojsonStyleActive = {
    color: activeColor,
    fillColor: activeColor,
    fillOpacity: 0.1,
    strokeOpacity: 0.5,
    weight: 2,
  };

  const { geojson, areaProp } = areas;

  const typeFilter = user[UserContextKeys.TypeFilter];
  const selectedTweet = user[UserContextKeys.SelectedTweet];

  const renderFilter = ({ properties }) =>
    area && properties[areaProp] === area;

  const { features } = geojson;
  const rendered = features.filter(renderFilter);

  let zoom = defaultZoom;
  if (area) {
    zoom = defaultZoom + 1;
  }
  if (selectedTweet && selectedTweet.derived.lat) {
    zoom = maxZoom;
  }

  const center =
    selectedTweet && selectedTweet.derived.lat
      ? [selectedTweet.derived.lat, selectedTweet.derived.long]
      : area
      ? centroid(rendered)
      : centroid(cityGeojson.features);

  const mapper = ({
    id_str,
    derived: { lat, long, type, color, active, severity },
  }) => ({
    id_str,
    lat,
    long,
    type,
    color, // TODO - do not use
    active,
    severity,
  });

  const isSelectedDot = ({ id_str }) => selectedTweet.id_str === id_str;

  const importantOnTop = (a, b) => {
    // TODO
    return 0;
  };

  const interval = currentInterval(filteredByArea);
  let data = interval.values
    .map(mapper)
    .filter(({ type }) => !typeFilter || typeFilter === type);
  // .sort(importantOnTop);

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

  const appearanceFn = (d) => {
    return selectedTweet
      ? isSelectedDot(d)
        ? Appearance.Highlighted
        : Appearance.Dimmed
      : Appearance.Normal;
  };

  // console.log(
  //   `MAP/render area=${area || "-"}, zoom=${zoom}, selected:${
  //     (selectedTweet || {}).id_str || "-"
  //   }, features:${rendered.length}/${features.length}, dots:${
  //     data.length
  //   }, geo:${rendered.length}`
  // );
  const city = cityGeojson.features[0];

  return (
    <LeafletMap
      className={classnames(styles.container, {
        [styles.area]: area,
        [styles.phone]: isPhone(),
      })}
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      maxBounds={mapBounds}
      maxBoundsViscosity={0.6}
      zoomControl={false}
    >
      <TileLayer {...tileOptions} />
      {!area && <GeoJSON data={city} style={geojsonStyleBounds} />}
      {rendered.map((feature) => (
        <GeoJSON
          key={feature.properties.CRA_NAM}
          data={feature}
          style={geojsonStyleActive}
        />
      ))}
      {data.map((d) => (
        <MapDot // TODO - group under a single container?
          key={d.id_str}
          coordinates={[d.lat, d.long]}
          severity={d.severity}
          appearance={appearanceFn(d)}
          active={d.active}
        />
      ))}
    </LeafletMap>
  );
};
