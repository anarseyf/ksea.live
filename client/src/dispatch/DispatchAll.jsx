import React from "react";
import { Map } from "./Map";
import { TweetsProvider } from "./TweetsProvider";
import { GroupByType } from "./GroupByType";
import { GroupByArea } from "./GroupByArea";
import { Header } from "./Header";
import { Tweets } from "./Tweets";
import styles from "./coffee.module.css";

export function DispatchAll() {
  return (
    <div className={styles.container}>
      <TweetsProvider>
        <Header area={"Seattle"} />
        <Map />
        <Tweets />
        <GroupByType cumulative={false} />
        <GroupByType cumulative={true} />
        <GroupByArea />
      </TweetsProvider>
    </div>
  );
}
