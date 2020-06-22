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
import { SvgDot } from "./SvgDot";
import { ErrorBoundary } from "./ErrorBoundary";
import { Sources } from "./Sources";
import { Freshness } from "./Freshness";
import { Legend } from "./Legend";

export const DispatchAll = () => {
  const intro = (
    <p>
      A visualization of Seattle Fire Department 911 dispatches. Combines a
      real-time view of incidents across the city, a breakdown by neighborhood,
      and an overview of the year's cumulative data. See notes at the bottom for
      data sources and details.
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

  const major = (
    <p>
      Incidents in the past 24 hours with <strong>five or more</strong> units
      dispatched.
    </p>
  );

  const areas = "Select an area to zoom in on today's incidents there.";

  const history =
    "Lines trace daily dispatch totals for all of Seattle this year compared to last year. Circles represent major incidents (ten or more units dispatched).";

  const notes = (
    <>
      <p>
        Visualization by{" "}
        <a href="https://linkedin.com/in/anarseyf/">Anar Seyf</a>.
      </p>
    </>
  );

  return (
    <DataProvider>
      <Section styleOption={1}>
        <Paragraph h1="Seattle Fire Department 911 Dispatch" content={intro} />
      </Section>

      <Section styleOption={2}>
        <Paragraph title="Live View" content={live} />
        <Rehoboam />
        <Paragraph content={<Legend />} />
      </Section>

      <Section edgeToEdge={true} styleOption={1}>
        <Paragraph title="" content={todayText} margin={true} />

        <ErrorBoundary>
          <Map />
        </ErrorBoundary>
      </Section>

      <Section styleOption={2}>
        <Paragraph title="Active Incidents" content={""} />
        <TweetsActive />
        <Paragraph title="Major Incidents" content={major} />
        <TweetsMajor />
      </Section>

      <Section styleOption={1}>
        <Paragraph title="Past Week" content={pastWeek} />
        <Header />
      </Section>

      <Section styleOption={2} edgeToEdge={true}>
        <Paragraph title="City Areas" content={areas} margin={true} />
        <GroupByArea />
      </Section>

      <Section styleOption={1} edgeToEdge={true}>
        <Paragraph
          title="Last Year vs This Year"
          content={history}
          margin={true}
        />
        <History />
      </Section>

      <Section styleOption={2}>
        <Sources />
        <Paragraph title="Notes" content={notes} />
      </Section>
    </DataProvider>
  );
};
