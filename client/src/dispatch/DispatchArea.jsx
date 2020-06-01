import React from "react";
import { Map } from "./Map";
import { TweetsProvider } from "./TweetsProvider";
import { GroupByType } from "./GroupByType";
import { Header } from "./Header";
import { Tweets } from "./Tweets";
import styles from "./coffee.module.scss";

export function DispatchArea({ area }) {
  return (
    <div className={styles.container}>
      <TweetsProvider filters={{ area }}>
        <Header area={area} />
        <Map area={area} />
        <Tweets />
        <GroupByType cumulative={true} />
      </TweetsProvider>
    </div>
  );
}
