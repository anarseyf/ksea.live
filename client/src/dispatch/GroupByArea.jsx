import React, { useContext, useEffect, useState } from "react";
import { Link } from "@reach/router";
import * as d3 from "d3";
import { TweetsContext } from "./TweetsProvider";
import { UserContext, UserContextKeys } from "./UserProvider";
import { GroupByOptions } from "../groupingOptions";
import { TypeLegend } from "./TypeLegend";
import { MultiLine } from "./MultiLine";
import { useLegend } from "./useLegend";
import styles from "./group.module.scss";

export function GroupByArea() {
  const [_, legends] = useLegend();
  const { setSelection } = useContext(UserContext);
  const { groupedByArea } = useContext(TweetsContext);

  if (!groupedByArea || !legends) {
    return null;
  }

  const handleMouseEnter = (zipcode) => {
    setSelection(UserContextKeys.HoverArea, zipcode);
  };

  const handleMouseLeave = () => {
    setSelection(UserContextKeys.HoverArea, null);
  };

  const groupTitle = `> Group by Area`;

  return (
    <div className={styles.container}>
      <div>{groupTitle}</div>
      {groupedByArea.map(({ key: area, intervals }) => (
        <div className={styles.item}>
          <Link
            to={`${area}`}
            onMouseEnter={() => handleMouseEnter(area)}
            onMouseLeave={handleMouseLeave}
          >
            <MultiLine intervals={intervals} title={area} />
            {legends[area] && (
              <TypeLegend
                legend={legends[area][GroupByOptions.IncidentType]}
                title={area}
              />
            )}
          </Link>
        </div>
      ))}
    </div>
  );
}
