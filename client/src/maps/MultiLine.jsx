import React, { useContext, useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { TweetsContext } from "./TweetsProvider";
import styles from "./chart.module.css";
import { histogram, expandedExtent } from "../histogram";
import { byZip } from "../groupby";

export function MultiLine() {
    const tweets = useContext(TweetsContext);

    const [svgData, setSvgData] = useState([]);

    const svgWidth = 200,
        svgHeight = 80,
        margin = { top: 10, right: 10, bottom: 20, left: 30 },
        width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.bottom - margin.top;

    const xAxisRef = useRef(null);
    const yAxisRef = useRef(null);

    useEffect(() => {
        if (!tweets.length) {
            return;
        }

        const tweetsByZip = byZip(tweets);
        console.log(">> tweetsByZip[0]:", tweetsByZip[0]);

        const extent = expandedExtent(tweets);
        const xScale = d3.scaleTime().domain(extent).range([0, width]);

        const withBins = tweetsByZip.map(({ values, ...rest }) => ({
            ...rest,
            bins: histogram(values),
        }));

        const max = d3.max(
            withBins
                .map((d) => d.bins)
                .map((bins) => d3.max(bins, (b) => b.length))
        );

        const yScale = d3.scaleLinear().domain([0, max]).range([height, 0]);

        const dateFormatter = d3.timeFormat("%H:%M"); // "(%b %d) %H:%M"

        console.log("WITH BINS", withBins);

        const xAxis = d3
            .axisBottom()
            .tickFormat(dateFormatter)
            .scale(xScale)
            .ticks(d3.timeHour.every(12));
        d3.select(xAxisRef.current).call(xAxis);

        const yAxis = d3.axisLeft().scale(yScale).ticks(2);
        d3.select(yAxisRef.current).call(yAxis);

        const line = d3
            .line()
            .x((d) => xScale(d.x0))
            .y((d) => yScale(d.length));

        const paths = withBins.map((d) => d.bins).map(line);
        console.log(">>> PATHS", paths);

        setSvgData(
            paths.map((path) => ({
                path,
            }))
        );
    }, [tweets]);

    console.log("RENDER", svgData);

    return (
        <svg className={styles.smallchart} width={svgWidth} height={svgHeight}>
            <g transform={`translate(${margin.left},${margin.top})`}>
                {svgData.map((d) => (
                    <path
                        d={d.path}
                        stroke="lightgreen"
                        strokeWidth={3}
                        fill="none"
                    ></path>
                ))}
            </g>
            <g
                ref={xAxisRef}
                transform={`translate(${margin.left},${margin.top + height})`}
            />
            <g
                ref={yAxisRef}
                transform={`translate(${margin.left},${margin.top})`}
            />
        </svg>
    );
}
