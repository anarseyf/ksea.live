import React from "react";
import styles from "./section.module.scss";
import classnames from "classnames";
import { isPhone } from "../clientUtils";

export const Section = ({ children, styleOption = 0, edgeToEdge = false }) => {
  const style =
    styleOption === 1
      ? styles.style1
      : styleOption === 2
      ? styles.style2
      : styleOption === 3
      ? styles.styleMap
      : styles.styleDefault;
  return (
    <section className={classnames(styles.section, style)}>
      <div
        className={classnames(styles.content, {
          [styles.phone]: isPhone(),
        })}
      >
        <div
          className={classnames(styles.subcontent, {
            [styles.edgeToEdge]: edgeToEdge,
          })}
        >
          {children}
        </div>
      </div>
    </section>
  );
};
