import React from "react";
import { Map } from "./Map";
import { TweetsProvider } from "./TweetsProvider";
import { GroupByType } from "./GroupByType";
import { Header } from "./Header";
import { Tweets } from "./Tweets";

export function DispatchArea({ area }) {
  return (
    <TweetsProvider filters={{ area }}>
      <Header area={area} />
      <Map area={area} />
      <Tweets />
      {/* <GroupByType area={area} cumulative={true} /> */}
    </TweetsProvider>
  );
}
