import React from "react";
import { Map } from "./Map";
import { TweetsProvider } from "./TweetsProvider";
import { GroupByArea } from "./GroupByArea";
import { Header } from "./Header";
import { Rehoboam } from "./Rehoboam";
import { LegendSection } from "./Legend";
import { Histogram } from "./Histogram";
import { Section } from "./Section";
import { Paragraph } from "./Paragraph";
import { History } from "./History";
import { TweetsActive } from "./TweetsActive";
import { TweetsMajor } from "./TweetsMajor";
import { SvgDot } from "./SvgDot";

export const DispatchAll = () => {
  const intro = (
    <div>
      A near-real-time view of Seattle Fire Department 911 dispatches. All
      timestamps are in local time (Pacific timezone). It is now{" "}
      <strong>1:45PM</strong> in Seattle. Active incidents are marked{" "}
      <SvgDot active={true} />. Incidents with ≥10 units dispatched are marked
      as major <SvgDot sev2={true} />.
    </div>
  );

  const pastWeek = `Cumulative number of dispatches for Seattle today, compared to the past 7 days`;

  const map = "Seattle map";

  const major = (
    <div>
      Incidents in the past 24 hours with <strong>ten or more</strong> units
      deployed
    </div>
  );

  const areas =
    "To examine individual events, first select an area of the city.";

  const history =
    "This views shows total dispatches for all of Seattle per day this year compared to last year, with a few callouts for context.";

  const sources = (
    <div>
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
    </div>
  );

  return (
    <TweetsProvider>
      <Section styleOption={2}>
        <Paragraph title="Seattle FD Real-Time Dispatch" content={intro} />
        <Rehoboam />
        <Paragraph title="Past week" content={pastWeek} />
        <Header />
      </Section>

      <Section edgeToEdge={true} styleOption={1}>
        <Paragraph title="Map" content={map} margin={true} />
        <Map />
      </Section>

      <Section styleOption={0}>
        <Paragraph title="Active incidents" content={""} />
        <TweetsActive />
        <Paragraph title="Major incidents" content={major} />
        <TweetsMajor />
      </Section>

      <Section styleOption={2}>
        <Paragraph title="Areas of the city" content={areas} />
        <GroupByArea />
      </Section>

      <Section styleOption={1}>
        <Paragraph title="2020 vs 2019" content={history} />
        <History />
      </Section>

      <Section styleOption={2}>
        <Paragraph title="Data Sources" content={sources} />
      </Section>
    </TweetsProvider>
  );
};
