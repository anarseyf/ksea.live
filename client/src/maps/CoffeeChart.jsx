import React, { useContext, useEffect, useState } from "react";
import * as d3 from "d3";
import { TweetsContext } from "./TweetsProvider";
import styles from "./chart.module.css";

export function CoffeeChart() {
    const tweets = useContext(TweetsContext);

    const [svgData, setSvgData] = useState([]);

    const width = 500,
        height = 80;

    useEffect(() => {
        const data = tweets.map(({ created_at, derived: { lat } }) => ({
            timestamp: +new Date(created_at),
            value: lat,
        }));

        const xScale = d3
            .scaleTime()
            .domain(d3.extent(data, (d) => d.timestamp))
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain(d3.extent(data, (d) => d.value))
            .range([height, 0]);

        const histogram = d3
            .histogram()
            .domain(xScale.domain())
            .value((d) => d.timestamp)
            .thresholds(xScale.ticks(10));

        const bins = histogram(data);

        console.log("BINS", bins);

        const newSvgData = data.map((d) => ({
            x: xScale(d.timestamp),
            y: yScale(d.value),
        }));

        setSvgData(newSvgData);
    }, [tweets]);

    return (
        <svg className={styles.smallchart} width={width} height={height}>
            {svgData.map((d) => (
                <rect x={d.x} y={d.y} height={5} width={2} fill="green"></rect>
            ))}
        </svg>
    );
}
