import React from "react";
import { Map } from "./Map";
import { TweetsProvider } from "./TweetsProvider";
import { GroupByType } from "./GroupByType";
import { Header } from "./Header";
import { Tweets } from "./Tweets";
import { MapOptions } from "./mapOptions";
import { Rehoboam } from "./Rehoboam";

export function DispatchArea({ area }) {
  return (
    <TweetsProvider filters={{ area }}>
      <Rehoboam area={area} />
      <Header area={area} />
      <Map area={area} tileOptions={MapOptions.Jawg_Dark} />
      <Map area={area} tileOptions={MapOptions.CartoDB_DarkMatter} />
      <Map area={area} tileOptions={MapOptions.Stadia_Alidade} />
      <Map area={area} tileOptions={MapOptions.Stamen_Toner} />
      <Map area={area} tileOptions={MapOptions.CartoDB_Positron} />
      <Map area={area} tileOptions={MapOptions.Jawg_Light} />
      {/* <Map area={area} tileOptions={MapOptions.Localhost} /> */}
      <Tweets />
      <GroupByType area={area} cumulative={true} />
    </TweetsProvider>
  );
}
