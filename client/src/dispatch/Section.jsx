import React from "react";
import styles from "./section.module.scss";
import classnames from "classnames";
import { isPhone } from "../clientUtils";

export const Section = ({ children, styleOption = 0, edgeToEdge = false }) => {
  const style = styleOption ? styles[`style${styleOption}`] : styles.styleDefault;
    
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
