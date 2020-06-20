import React, { useContext } from "react";
import { Map } from "./Map";
import { DataProvider } from "./DataProvider";
import { GroupByArea } from "./GroupByArea";
import { Header } from "./Header";
import { Rehoboam } from "./Rehoboam";
import { Section } from "./Section";
import { Paragraph } from "./Paragraph";
import { History } from "./History";
import { TweetsActive } from "./TweetsActive";
import { TweetsMajor } from "./TweetsMajor";
import { SvgDot } from "./SvgDot";
import * as d3 from "d3";
import { ErrorBoundary } from "./ErrorBoundary";
import { StatusContext } from "./StatusContext";

const formatter = d3.timeFormat("%-I:%M %p");

export const DispatchAll = () => {
  const { status = {} } = useContext(StatusContext);
  const time = status.lastUpdated
    ? formatter(new Date(status.lastUpdated))
    : undefined;

  const intro = (
    <p>
      A near-real-time visualization of Seattle Fire Department 911 dispatches. Active incidents are
      marked <SvgDot active={true} />. Incidents with five or more units dispatched are
      marked <SvgDot sev1={true} />, with ten or more <SvgDot sev2={true} />. All timestamps are in Seattle time (Pacific timezone). See notes at the bottom for more details.
    </p>
  );

  const pastWeek = `Cumulative number of dispatches for Seattle today, compared to the past 7 days`;

  const map = "";

  const major = (
    <p>
      Incidents in the past 24 hours with <strong>ten or more</strong> units
      deployed
    </p>
  );

  const areas =
    "Select an area of the city to see all of today's incidents there. (TODO - update this text.)";

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
      <p>
        {time && (
          <span>
            {" "}
            Data is current as of <strong> {time}</strong>.{" "}
          </span>
        )}
        Incidents for which no geolocation data is available are not shown and
        not counted.
      </p>
      <p>
        Visualization by{" "}
        <a href="http://linkedin.com/in/anarseyf/">Anar Seyf</a>.
      </p>
    </>
  );

  return (
    <DataProvider>
      <Section styleOption={1}>
        <Paragraph title="Seattle Fire Real-Time Dispatch" content={intro} />
        <Rehoboam />
        <Paragraph title="Past Week" content={pastWeek} />
        <Header />
      </Section>

      <Section edgeToEdge={true} styleOption={2}>
        <Paragraph title="Today" content={map} margin={true} />
        <ErrorBoundary>
          <Map />
        </ErrorBoundary>
      </Section>

      <Section styleOption={1}>
        <Paragraph title="Active Incidents" content={""} />
        <TweetsActive />
        <Paragraph title="Major Incidents (24 Hours)" content={major} />
        <TweetsMajor />
      </Section>

      <Section styleOption={2} edgeToEdge={true}>
        <Paragraph title="City Areas" content={areas} margin={true} />
        <GroupByArea />
      </Section>

      <Section styleOption={1}>
        <Paragraph title="Last Year vs This Year" content={history} />
        <History />
      </Section>

      <Section styleOption={2}>
        <Paragraph title="Data Sources" content={sources} />
        <Paragraph title="Notes" content={notes} />
      </Section>
    </DataProvider>
  );
};
