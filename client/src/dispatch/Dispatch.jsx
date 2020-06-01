import React from "react";
import { TweetsProvider } from "./TweetsProvider";
import styles from "./dispatch.module.scss";

export function Dispatch({ area, type, interval, children }) {
  console.log(`Type: ${type}, interval: ${interval}`);
  return (
    <div className={styles.container}>
      <TweetsProvider>{children}</TweetsProvider>
    </div>
  );
}
