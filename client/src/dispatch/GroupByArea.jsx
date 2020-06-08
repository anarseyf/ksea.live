import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "@reach/router";
import { TweetsContext } from "./TweetsProvider";
import { UserContext, UserContextKeys } from "./UserProvider";
import { GroupByOptions } from "../groupingOptions";
import { TypeLegend } from "./TypeLegend";
import { MultiLine } from "./MultiLine";
import { useLegend } from "./useLegend";
import styles from "./group.module.scss";
import { AreaShape } from "./AreaShape";
import { featuresForArea } from "./geojson";

export function GroupByArea() {
  const [_, legends] = useLegend();
  const { setSelection } = useContext(UserContext);
  const { groupedByArea } = useContext(TweetsContext);

  if (!groupedByArea.length || !legends) {
    return null;
  }

  const handleMouseEnter = (area) => {
    setSelection(UserContextKeys.HoverArea, area);
  };

  const handleMouseLeave = () => {
    setSelection(UserContextKeys.HoverArea, null);
  };

  const groupTitle = `> Group by Area`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>{groupTitle}</div>

      {groupedByArea.map(({ key: area, intervals }) => (
        <div
          className={styles.itemContainer}
          onMouseEnter={() => handleMouseEnter(area)}
          onMouseLeave={handleMouseLeave}
        >
          <div className={styles.itemHeader}>{area}</div>
          <Link to={`${area}`}>
            <div className={styles.item}>
              <AreaShape area={area} />

              <MultiLine intervals={intervals} />
              {legends[area] && (
                <TypeLegend
                  legend={legends[area][GroupByOptions.IncidentType]}
                  showTotal={true}
                />
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
