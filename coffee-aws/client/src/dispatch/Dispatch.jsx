import React from "react";
import { UserProvider } from "./UserProvider";
import styles from "./dispatch.module.scss";

export const Dispatch = ({ area, type, interval, children }) => {
  console.log(`URL params/area: ${area}, type: ${type}, interval: ${interval}`);
  return (
    <div className={styles.container}>
      <UserProvider>{children}</UserProvider>
    </div>
  );
}
