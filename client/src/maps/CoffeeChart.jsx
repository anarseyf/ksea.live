import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { TweetsContext } from "./TweetsProvider";
import styles from "./chart.module.css";

export function CoffeeChart() {
    const tweets = useContext(TweetsContext);

    const [svgData, setSvgData] = useState([]);

    const svgWidth = 500,
        svgHeight = 80,
        margin = { bottom: 20, left: 30 },
        width = svgWidth - margin.left,
        height = svgHeight - margin.bottom;

    const xAxisRef = useRef(null);

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

        const xAxis = d3
            .axisBottom()
            .tickFormat(d3.timeFormat("%H:%M"))
            .scale(xScale);
        d3.select(xAxisRef.current).call(xAxis);

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
        <svg className={styles.smallchart} width={svgWidth} height={svgHeight}>
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
            <g
                ref={xAxisRef}
                transform={`translate(${margin.left}, ${height})`}
            />
            {/* <g ref="yAxis" transform={`translate(${margin.left}, 0)`} /> */}
        </svg>
    );
}
