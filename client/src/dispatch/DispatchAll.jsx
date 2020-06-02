import React from "react";
import { Map } from "./Map";
import { TweetsProvider } from "./TweetsProvider";
import { GroupByType } from "./GroupByType";
import { GroupByArea } from "./GroupByArea";
import { Header } from "./Header";
import { Tweets } from "./Tweets";

export function DispatchAll() {
  return (
    <TweetsProvider>
      <Header />
      <Map />
      <Tweets />
      {/* <GroupByType cumulative={true} /> */}
      {/* <GroupByArea /> */}
    </TweetsProvider>
  );
}
