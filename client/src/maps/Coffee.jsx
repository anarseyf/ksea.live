import React, { useState, useMemo, useEffect, useContext } from "react";
import { CoffeeMap } from "./CoffeeMap";
import { Histogram } from "./Histogram";
import { TweetsProvider } from "./TweetsProvider";
import { MultiLine } from "./MultiLine";
import { ChartGroup } from "./ChartGroup";
import { Header } from "./Header";
import styles from "./coffee.module.css";
import { GroupByOptions } from "../groupby";
import { Tweets } from "./Tweets";

export function Coffee() {
  return (
    <div className={styles.container}>
      <TweetsProvider>
        <CoffeeMap />
        <Tweets />
        <Header />
        <Histogram />
        <ChartGroup cumulative={true} groupby={GroupByOptions.IncidentType} />
        <ChartGroup cumulative={true} groupby={GroupByOptions.ZipCode} />
        <ChartGroup groupby={GroupByOptions.IncidentType} />
      </TweetsProvider>
    </div>
  );
}
