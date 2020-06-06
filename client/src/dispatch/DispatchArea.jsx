import React from "react";
import { Map } from "./Map";
import { TweetsProvider } from "./TweetsProvider";
import { GroupByType } from "./GroupByType";
import { Header } from "./Header";
import { Tweets } from "./Tweets";
import { MapOptions } from "./mapOptions";

export function DispatchArea({ area }) {
  return (
    <TweetsProvider filters={{ area }}>
      <Header area={area} />
      <Map area={area} tileOptions={MapOptions.CartoDB} />
      <Map area={area} tileOptions={MapOptions.JawgDark} />
      <Map area={area} tileOptions={MapOptions.JawgLight} />
      <Map area={area} tileOptions={MapOptions.Stadia} />
      <Map area={area} tileOptions={MapOptions.Stamen} />
      {/* <Map area={area} tileOptions={MapOptions.Localhost} /> */}
      <Tweets />
      <GroupByType area={area} cumulative={true} />
    </TweetsProvider>
  );
}
