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
    <p>
      A near-real-time visualization of Seattle Fire Department 911 dispatches.
      All timestamps are in local time (Pacific timezone). It is now{" "}
      <strong>1:45PM</strong> in Seattle. Active incidents are marked{" "}
      <SvgDot active={true} />. Incidents with ≥10 units dispatched are marked
      as major <SvgDot sev2={true} />.
    </p>
  );

  const pastWeek = `Cumulative number of dispatches for Seattle today, compared to the past 7 days`;

  const map = "Seattle map";

  const major = (
    <p>
      Incidents in the past 24 hours with <strong>ten or more</strong> units
      deployed
    </p>
  );

  const areas =
    "To examine individual events, first select an area of the city.";

  const history =
    "This views shows total dispatches for all of Seattle per day this year compared to last year, with a few callouts for context.";

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

  const notes = (
    <>
      <p>The data is up-to-date to within a minute or so.</p>
      <p>
        Visualization by{" "}
        <a href="http://linkedin.com/in/anarseyf/">Anar Seyf</a>.
      </p>
    </>
  );

  return (
    <TweetsProvider>
      <Section styleOption={2}>
        <Paragraph title="Seattle Fire Real-Time Dispatch" content={intro} />
        <Rehoboam />
        <Paragraph title="Past Week" content={pastWeek} />
        <Header />
      </Section>

      <Section edgeToEdge={true} styleOption={1}>
        <Paragraph title="Today's Incidents" content={map} margin={true} />
        {/* <Map /> */}
      </Section>

      <Section styleOption={0}>
        <Paragraph title="Active Incidents" content={""} />
        <TweetsActive />
        <Paragraph title="Major Incidents" content={major} />
        <TweetsMajor />
      </Section>

      <Section styleOption={2}>
        <Paragraph title="City Areas" content={areas} />
        {/* <GroupByArea /> */}
      </Section>

      <Section styleOption={1}>
        <Paragraph title="Last Year vs This Year" content={history} />
        {/* <History /> */}
      </Section>

      <Section styleOption={2}>
        <Paragraph title="Data Sources" content={sources} />
        <Paragraph title="Notes" content={notes} />
      </Section>
    </TweetsProvider>
  );
};
