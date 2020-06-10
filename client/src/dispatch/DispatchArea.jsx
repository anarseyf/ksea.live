import React from "react";
import { Map } from "./Map";
import { TweetsProvider } from "./TweetsProvider";
import { Header } from "./Header";
import { Tweets } from "./Tweets";
import { Rehoboam } from "./Rehoboam";
import { LegendSection } from "./Legend";
import { Histogram } from "./Histogram";
import { Paragraph } from "./Paragraph";

export function DispatchArea({ area }) {
  const howTo = "How to use this page";
  const sources = "Data sources";

  return (
    <TweetsProvider filters={{ area }}>
      <Rehoboam area={area} />
      <Header area={area} />
      <Histogram />
      <Map area={area} />
      <LegendSection />
      <Tweets />
      <Paragraph text={howTo} />
      <Paragraph text={sources} />
    </TweetsProvider>
  );
}
