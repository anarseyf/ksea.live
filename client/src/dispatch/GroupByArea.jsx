import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "@reach/router";
import { GroupByOptions } from "../groupingOptions";
import styles from "./chart.module.scss";
import { TypeLegend } from "./TypeLegend";
import { UserContext, UserContextKeys } from "./UserProvider";
import { useLegend } from "./useLegend";
import * as d3 from "d3";

export function GroupByArea() {
  const [_, legendsByArea] = useLegend();
  const [_2, setSelection] = useContext(UserContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("GROUP AREA/legends", legendsByArea);

    if (!Object.keys(legendsByArea).length) {
      return;
    }

    const option = GroupByOptions.IncidentType;
    const data = Object.keys(legendsByArea).map((area) => ({
      area,
      total: d3.sum(legendsByArea[area][option].map(({ total }) => total)),
    }));
    setData(data.sort((a, b) => b.total - a.total));
  }, [legendsByArea]);

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
      {data.map(({ area }) => (
        <Link
          to={`${area}`}
          onMouseEnter={() => handleMouseEnter(area)}
          onMouseLeave={handleMouseLeave}
        >
          <TypeLegend
            legend={legendsByArea[area][GroupByOptions.IncidentType]}
            title={area}
          />
        </Link>
      ))}
    </div>
  );
}
