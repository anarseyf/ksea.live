import React from "react";
import { Paragraph } from "./Paragraph";

export const Sources = () => {
  const title = <span id="sources">Data Sources</span>;

  const sources = (
    <>
      <p>
        The primary data source is{" "}
        <a href="http://www2.seattle.gov/fire/realTime911/">
          Real-Time 911 Dispatch
        </a>
        . Geolocation data for each incident is retrieved from{" "}
        <a href="https://data.seattle.gov/Public-Safety/Seattle-Real-Time-Fire-911-Calls/kzjm-xkqj">
          data.seattle.gov
        </a>. City and
        neighborhood boundary data is from{" "}
        <a href="https://github.com/seattleflu/seattle-geojson/tree/master/seattle_geojsons">
          seattleflu/seattle-geojson
        </a>
        . Map powered by <a href="http://leafletjs.com">Leaflet</a> via{" "}
        <a href="https://react-leaflet.js.org">react-leaflet</a>. Map tiles
        provided by{" "}
        <a href="https://www.jawg.io/docs/apidocs/static-maps/">Jawg Maps</a>.
        Visualizations powered by <a href="https://d3js.org">D3</a>. Annotations by <a href="https://d3-annotation.susielu.com/">D3-Annotation</a>.
      </p>
    </>
  );

  return <Paragraph title={title} content={sources} />;
};
