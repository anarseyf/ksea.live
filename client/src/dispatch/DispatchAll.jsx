import React, { useContext } from "react";
import * as d3 from "d3";
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
import { StatusContext } from "./StatusContext";
import { Sources } from "./Sources";

const formatter = d3.timeFormat("%-I:%M %p");

export const DispatchAll = () => {
  const { status = {} } = useContext(StatusContext);

  const time = status.lastUpdated
    ? formatter(new Date(status.lastUpdated))
    : undefined;

  const dataText = time ? (
    <span>
      Data is current as of <strong> {time}</strong>.
    </span>
  ) : (
    <span>&nbsp;</span>
  );

  const intro = (
    <p>
      A near-real-time visualization of Seattle Fire Department 911 dispatches.
      Active incidents are marked <SvgDot active={true} radius={5} />. Incidents
      with five or more units dispatched are marked <SvgDot sev1={true} />, with
      ten or more <SvgDot sev2={true} />. All timestamps are in Seattle time
      (Pacific timezone). See notes at the bottom for more details.
    </p>
  );

  const todayText = "";

  const pastWeek = `The past 7 days of dispatches.`;

  const major = (
    <p>
      Incidents in the past 24 hours with <strong>five or more</strong> units
      deployed.
    </p>
  );

  const areas = "Select an area to zoom in on today's incidents there.";

  const history =
    "This view shows total dispatches for all of Seattle per day this year compared to last year, with a few callouts for context.";

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
      <Section styleOption={2}>
        <Paragraph h1="Seattle Fire Real-Time Dispatch" content={intro} />
        <Rehoboam />
        <Paragraph content={dataText} />
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

      <Section styleOption={1}>
        <Paragraph title="Last Year vs This Year" content={history} />
        <History />
      </Section>

      <Section styleOption={2}>
        <Sources />
        <Paragraph title="Notes" content={notes} />
      </Section>
    </DataProvider>
  );
};
