import React, { useState, useMemo, useEffect, useContext } from "react";
import { CoffeeMap } from "./CoffeeMap";
import { Histogram } from "./Histogram";
import { TweetsProvider } from "./TweetsProvider";
import { MultiLine } from "./MultiLine";
import { ChartGroup } from "./ChartGroup";

export function Coffee() {
  return (
    <TweetsProvider>
      <CoffeeMap />
      <Histogram />
      <ChartGroup />
    </TweetsProvider>
  );
}
