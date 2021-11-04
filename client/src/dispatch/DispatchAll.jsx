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
import { SvgDot } from "./SvgDot";

export const DispatchAll = () => {
  const intro = (
    <p>A visualization of Seattle Fire Department's 911 dispatch data.</p>
  );

  const live = (
    <p>
      <span>A near-real-time view of today's incidents.</span> <Freshness />
    </p>
  );

  const week = `An aggregate view of year-to-date dispatches by day of week and by time of day.`;

  const lists = <p>Select an incident to view dispatch details.</p>;

  const areas = "Select an area to see all of today's incidents in it.";

  const history = (
    <p>
      A side-by-side comparison of this year's daily dispatch volume against
      last year's. <SvgDot sev2={true} /> 10+ unit incidents are shown along the
      axis.
    </p>
  );

  const notes = (
    <p>
      Created by <a href="https://linkedin.com/in/anarseyf/">Anar Seyf</a> in 2020.
    </p>
  );

  return (
    <DataProvider>
      <Section styleOption={1}>
        <Paragraph h1="Seattle Fire 911 Dispatch" content={intro} />
      </Section>

      <Section styleOption={2}>
        <Paragraph title="Today" content={live} />
        <Rehoboam />
        <Paragraph content={<Legend />} />
      </Section>

      <Section styleOption={2} edgeToEdge={true}>
        <ErrorBoundary>
          <Map />
        </ErrorBoundary>
        <Paragraph content={lists} margin={true} />
        <Paragraph title="Active Incidents" margin={true} />
        <TweetsActive />
        <Paragraph title="Major Incidents" margin={true} />
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
        <Sources />
        <Units />
        <Paragraph title="Themes" content={<ThemeSwitch />} />
        <Paragraph title="About" content={notes} />
      </Section>
    </DataProvider>
  );
};
