import React from "react";
import { Map } from "./Map";
import { TweetsProvider } from "./TweetsProvider";
import { GroupByArea } from "./GroupByArea";
import { Header } from "./Header";
import { Rehoboam } from "./Rehoboam";
import { LegendSection } from "./Legend";
import { Histogram } from "./Histogram";

export function DispatchAll() {
  return (
    <TweetsProvider>
      <Rehoboam />
      <Header />
      <Histogram />
      <Map />
      <LegendSection />
      {/* <GroupByType cumulative={true} /> */}
      <GroupByArea />
    </TweetsProvider>
  );
}
