import React from "react";
import { CoffeeMap } from "./CoffeeMap";
import { TweetsProvider } from "./TweetsProvider";
import { GroupByArea } from "./GroupByArea";
import { GroupByType } from "./GroupByType";
import { Header } from "./Header";
import { Tweets } from "./Tweets";
import styles from "./coffee.module.css";

export function Coffee() {
  return (
    <div className={styles.container}>
      <TweetsProvider>
        <Header />
        <CoffeeMap />
        <Tweets />
        <GroupByArea />
        <GroupByType cumulative={false} />
        <GroupByType cumulative={true} />
      </TweetsProvider>
    </div>
  );
}
