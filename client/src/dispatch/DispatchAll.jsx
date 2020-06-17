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

export function DispatchAll() {
  const intro = `Seattle Fire Department 911 dispatches. This page provides a real-time feed of 911 dispatches of FD units today, along with details and comparisons to previous days.`;

  const active = `Active events`;
  const major = `Major events past 24 hours`;

  const areas =
    "To examine individual events, first select an area of the city.";

  const history =
    "Let's zoom out and see the 2020 numbers so far compared to 2019.";

  const sources = `Data sources are:
  * Twitter
  * Leaflet
  * Jawg Maps
  * Google Location API`;

  return (
    <TweetsProvider>
      <Section styleOption={2}>
        <Paragraph text={intro} />
        <Rehoboam />
        <Header />
        {/* <Histogram /> */}
      </Section>

      <Section edgeToEdge={true} styleOption={1}>
        <Map />
        <LegendSection />
      </Section>

      <Section styleOption={0}>
        <Paragraph text={active} />
        <TweetsActive />
        <Paragraph text={major} />
        <TweetsMajor />
      </Section>

      <Section styleOption={2}>
        <Paragraph text={areas} />
        <GroupByArea />
      </Section>

      <Section styleOption={1}>
        <Paragraph text={history} />
        {/* <History /> */}
      </Section>

      <Section styleOption={2}>
        <p>
          <a href="http://www2.seattle.gov/fire/realtime911/">
            Real-time 911 dispatch
          </a>
        </p>
        <Paragraph text={sources} />
      </Section>
    </TweetsProvider>
  );
}
