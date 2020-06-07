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
  const [_2, setSelection] = useContext(UserContext);
  const { groupedByArea } = useContext(TweetsContext);

  const [data, setData] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    if (!Object.keys(legends).length) {
      return;
    }

    const option = GroupByOptions.IncidentType;
    const data = Object.keys(legends).map((area) => ({
      area,
      total: d3.sum(legends[area][option].map(({ total }) => total)),
    }));
    setData(data.sort((a, b) => b.total - a.total));
  }, [legends]);

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
        <div>
          <MultiLine intervals={intervals} title={area} />
          {legends[area] && (
            <Link
              to={`${area}`}
              onMouseEnter={() => handleMouseEnter(area)}
              onMouseLeave={handleMouseLeave}
            >
              <TypeLegend
                legend={legends[area][GroupByOptions.IncidentType]}
                title={area}
              />
            </Link>
          )}
        </div>
      ))}

      {/* {data.map(({ area }) => (
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
      ))} */}
    </div>
  );
}
