import React, { useEffect, useState, useRef, useContext } from "react";
import { Topline } from "./Topline";
import { TypeLegend } from "./TypeLegend";
import { TweetsContext } from "./TweetsProvider";
import { useLegend } from "./useLegend";
import { Histogram } from "./Histogram";

export function Header() {
  const tweets = useContext(TweetsContext);
  const legend = useLegend();

  return (
    <div>
      <Topline number={tweets.length} text="Seattle" />
      <TypeLegend legend={legend} />
      {/* <Histogram /> */}
    </div>
  );
}
