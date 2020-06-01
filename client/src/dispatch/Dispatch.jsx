import React from "react";
import { TweetsProvider } from "./TweetsProvider";
import { UserProvider } from "./UserProvider";
import styles from "./dispatch.module.scss";

export function Dispatch({ area, type, interval, children }) {
  console.log(`URL params/area: ${area}, type: ${type}, interval: ${interval}`);
  return (
    <div className={styles.container}>
      <TweetsProvider>
        <UserProvider>{children}</UserProvider>
      </TweetsProvider>
    </div>
  );
}
