import React from "react";
import { Map } from "./Map";
import { TweetsProvider } from "./TweetsProvider";
import { GroupByType } from "./GroupByType";
import { GroupByArea } from "./GroupByArea";
import { Header } from "./Header";
import { Tweets } from "./Tweets";
import { Rehoboam } from "./Rehoboam";

export function DispatchAll() {
  return (
    <TweetsProvider>
      <Rehoboam />
      <Header />
      <Tweets />
      <Map />
      {/* <GroupByType cumulative={true} /> */}
      <GroupByArea />
    </TweetsProvider>
  );
}
