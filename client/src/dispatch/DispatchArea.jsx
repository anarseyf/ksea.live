import React from "react";
import { Map } from "./Map";
import { TweetsProvider } from "./TweetsProvider";
import { Header } from "./Header";
import { Tweets } from "./Tweets";
import { Rehoboam } from "./Rehoboam";
import { LegendSection } from "./Legend";
import { Histogram } from "./Histogram";

export function DispatchArea({ area }) {
  return (
    <TweetsProvider filters={{ area }}>
      <Rehoboam area={area} />
      <Header area={area} />
      <Histogram />
      <Map area={area} />
      <LegendSection />
      <Tweets />
    </TweetsProvider>
  );
}
