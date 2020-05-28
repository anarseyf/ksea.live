import React, { useState, useMemo, useEffect, useContext } from "react";
import { CoffeeMap } from "./CoffeeMap";
import { Histogram } from "./Histogram";
import { TweetsProvider } from "./TweetsProvider";
import { MultiLine } from "./MultiLine";
import { ChartGroup } from "./ChartGroup";
import { Header } from "./Header";
import styles from "./coffee.module.css";

export function Coffee() {
  return (
    <div className={styles.container}>
      <TweetsProvider>
        <CoffeeMap />
        <Header />
        <Histogram />
        <ChartGroup cumulative={true} />
        <ChartGroup />
      </TweetsProvider>
    </div>
  );
}
