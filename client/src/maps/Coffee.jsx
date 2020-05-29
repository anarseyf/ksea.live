import React, { useState, useMemo, useEffect, useContext } from "react";
import { CoffeeMap } from "./CoffeeMap";
import { Histogram } from "./Histogram";
import { TweetsProvider } from "./TweetsProvider";
import { GroupByArea } from "./GroupByArea";
import { GroupByType } from "./GroupByType";
import { Header } from "./Header";
import styles from "./coffee.module.css";
import { Tweets } from "./Tweets";

export function Coffee() {
  return (
    <div className={styles.container}>
      <TweetsProvider>
        <CoffeeMap />
        <Tweets />
        <Header />
        <Histogram />
        <GroupByArea />
        <GroupByType cumulative={false} />
        <GroupByType cumulative={true} />
      </TweetsProvider>
    </div>
  );
}
