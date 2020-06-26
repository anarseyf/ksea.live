import React from "react";
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
import { ErrorBoundary } from "./ErrorBoundary";
import { Sources } from "./Sources";
import { Freshness } from "./Freshness";
import { Legend } from "./Legend";
import { ThemeSwitch } from "./ThemeSwitch";

export const DispatchAll = () => {
  const intro = (
    <p>
      A visualization of Seattle Fire Department 911 dispatch data: real-time
      view of incidents across the city; per-neighborhood breakdown; overview of
      the year's cumulative data.{" "}
    </p>
  );

  const live = (
    <p>
      <span>
        A near-real-time view of today's incidents. All timestamps are in
        Seattle local time.
      </span>{" "}
      <Freshness />
    </p>
  );

  const todayText = "";

  const pastWeek = `The past 7 days of dispatches.`;

  const active = (
    <p>
      Select an incident to view dispatch details. If geolocation data is
      available (typically within 5 minutes) the map will zoom in to the spot.
    </p>
  );

  const major = (
    <p>
      Today's incidents with <strong>five or more</strong> units dispatched.
    </p>
  );

  const areas = "Select an area to zoom in on today's incidents there.";

  const history = (
    <p>
      Zooming out even further, this view presents a year's worth of data. Lines
      trace daily dispatch totals for all of Seattle. Circles represent major
      incidents (those with 10 or more units dispatched).
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
      </Section>

      <Section styleOption={2}>
        <Paragraph title="Live View" content={live} />
        <Rehoboam />
        <Paragraph content={<Legend />} />
      </Section>

      <Section styleOption={3} edgeToEdge={true}>
        <Paragraph title="" content={todayText} margin={true} />
        <ErrorBoundary>
          <Map />
        </ErrorBoundary>
      </Section>

      <Section styleOption={4}>
        <Paragraph title="Active Incidents" content={active} />
        <TweetsActive />
        <Paragraph title="Major Incidents" content={major} />
        <TweetsMajor />
      </Section>

      <Section styleOption={5} edgeToEdge={true}>
        <Paragraph title="City Areas" content={areas} margin={true} />
        <GroupByArea />
      </Section>

      <Section styleOption={6}>
        <Paragraph title="Past Week" content={pastWeek} />
        <Header />
      </Section>

      <Section styleOption={7} edgeToEdge={true}>
        <Paragraph
          title="This Year compared to Last Year"
          content={history}
          margin={true}
        />
        <History />
      </Section>

      <Section styleOption={8}>
        <Sources />
        <Paragraph title="Themes" content={<ThemeSwitch />} />
        <Paragraph title="About" content={notes} />
      </Section>
    </DataProvider>
  );
};
