import React from "react";
import styles from "./units.module.scss";
import { Paragraph } from "./Paragraph";

export const Units = () => {
  const legend = [
    { key: "A", value: "Aid Unit" },
    { key: "AIR", value: "Air Unit" },
    { key: "B", value: "Battalion Chief" },
    { key: "E", value: "Engine" },
    { key: "L", value: "Ladder" },
    { key: "M", value: "Medic Unit" },
  ];

  const units = (
    <>
      <p>
        Fire Department units are stationed at{" "}
        <a href="https://www.seattle.gov/fire/about-us/fire-stations">
          33 locations
        </a>
        . Unit key:
      </p>
      <p>
        {legend.map(({ key, value }) => (
          <span key={key}>
            <span className={styles.unitKey}>{key}</span>
            <span className={styles.unitValue}>{value}</span>
          </span>
        ))}
      </p>
    </>
  );

  return <Paragraph title={"Units"} content={units} />;
};
