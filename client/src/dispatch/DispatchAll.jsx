import React from "react";
import { Map } from "./Map";
import { DataProvider } from "./DataProvider";
import { GroupByArea } from "./GroupByArea";
import { Rehoboam } from "./Rehoboam";
import { Section } from "./Section";
import { Paragraph } from "./Paragraph";
import { History } from "./History";
import { TweetsActive } from "./TweetsActive";
import { TweetsMajor } from "./TweetsMajor";
import { ErrorBoundary } from "./ErrorBoundary";
import { Sources } from "./Sources";
import { Freshness } from "./Freshness";
import { Legend } from "./Legend";
import { ThemeSwitch } from "./ThemeSwitch";
import { PunchCard } from "./PunchCard";
import { Units } from "./Units";

export const DispatchAll = () => {
  const intro = (
    <p>
      A visualization of Seattle Fire Department's 911 dispatch data. All
      timestamps are in Seattle local time. The page updates automatically every
      minute. <a href="#sources">Data sources</a> are listed below. Legend as
      follows:
    </p>
  );

  const live = (
    <p>
      <span>A near-real-time view of today's incidents.</span> <Freshness />
    </p>
  );

  const outline = "The outline represents the Seattle city boundary.";

  const week = `An aggregate view of year-to-date dispatches by day of week and by time of day.`;

  const active = (
    <p>
      Select an incident to view dispatch details. If geolocation data is
      available (typically within 5 minutes) the map above will zoom in to the
      spot.
    </p>
  );

  const major = <p>Today's incidents with 5 or more units dispatched.</p>;

  const areas =
    "Select an area to see all of today's incidents in it. Areas are ordered by total number of dispatches.";

  const history = (
    <p>
      A side-by-side comparison of this year's dispatch volume against last
      year's. Lines trace daily totals for all of Seattle. Circles represent
      major incidents (10 or more units dispatched).
    </p>
  );

  const notes = (
    <p>
      Created by <a href="https://linkedin.com/in/anarseyf/">Anar Seyf</a>.
    </p>
  );

  return (
    <DataProvider>
      <Section styleOption={1}>
        <Paragraph h1="Seattle Fire 911 Dispatch" content={intro} />
        <Paragraph content={<Legend />} />
      </Section>

      <Section styleOption={2}>
        <Paragraph title="Today" content={live} />
        <Rehoboam />
      </Section>

      <Section styleOption={2} edgeToEdge={true}>
        <ErrorBoundary>
          <Map />
        </ErrorBoundary>
        <Paragraph content={outline} margin={true} />
        <Paragraph title="Active Incidents" content={active} margin={true} />
        <TweetsActive />
        <Paragraph title="Major Incidents" content={major} margin={true} />
        <TweetsMajor />
      </Section>

      <Section styleOption={3}>
        <Paragraph title="City Areas" content={areas} />
        <GroupByArea />
      </Section>

      <Section styleOption={4} edgeToEdge={true}>
        <Paragraph title="Weekly Highs and Lows" content={week} margin={true} />
        <PunchCard />
        <Paragraph title="This Year" content={history} margin={true} />
        <History />
      </Section>

      <Section styleOption={5}>
        <Units />
        <Sources />
        <Paragraph title="Themes" content={<ThemeSwitch />} />
        <Paragraph title="About" content={notes} />
      </Section>
    </DataProvider>
  );
};
