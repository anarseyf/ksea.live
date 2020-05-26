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

        const histogram = d3
            .histogram()
            .domain(xScale.domain())
            .value((d) => d.timestamp)
            .thresholds(d3.timeHours(...xScale.domain(), 1));

        const bins = histogram(data);
        console.log("BINS", bins);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(bins, (b) => b.length)])
            .range([height, 0]);

        const binWidth = Math.floor(width / bins.length) - 2;

        const newSvgData = bins.map(({ x0, x1, length }) => ({
            x: xScale(x0),
            width: binWidth,
            y: yScale(length),
            height: yScale(0) - yScale(length),
            rx: binWidth / 4,
        }));

        console.log(newSvgData[0]);

        setSvgData(newSvgData);
    }, [tweets]);

    return (
        <svg className={styles.smallchart} width={width} height={height}>
            {svgData.map((d) => (
                <rect
                    x={d.x}
                    y={d.y}
                    width={d.width}
                    height={d.height}
                    rx={d.rx}
                    fill="green"
                ></rect>
            ))}
        </svg>
    );
}
