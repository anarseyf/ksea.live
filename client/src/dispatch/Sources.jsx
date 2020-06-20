import React from "react";
import { Paragraph } from "./Paragraph";

export const Sources = () => {
  const sources = (
    <p>
      The primary data source is{" "}
      <a href="http://www2.seattle.gov/fire/realTime911/">
        Real-Time 911 Dispatch
      </a>
      . GPS locations for each incident are retrieved from{" "}
      <a href="https://dev.socrata.com/foundry/data.seattle.gov/kzjm-xkqj">
        this Socrata dataset
      </a>
      . Seattle neighborhood GeoJSON data is from the{" "}
      <a href="https://github.com/seattleflu/seattle-geojson/tree/master/seattle_geojsons">
        seattleflu/seattle-geojson
      </a>{" "}
      repository. Map powered by <a href="http://leafletjs.com">Leaflet</a> via{" "}
      <a href="https://react-leaflet.js.org">react-leaflet</a>. Map tiles
      provided by{" "}
      <a href="https://www.jawg.io/docs/apidocs/static-maps/">Jawg Maps</a>.
    </p>
  );

  return <Paragraph title="Data Sources" content={sources} />;
};
