import * as d3 from "d3";

export function histogramify(tweets) {
    const data = tweets.map(({ created_at, derived: { lat } }) => ({
        timestamp: +new Date(created_at),
        value: lat,
    }));

    const actualTimeExtent = d3.extent(data, (d) => d.timestamp);
    const expandedTimeExtent = [
        d3.timeHour.offset(actualTimeExtent[0], -1),
        d3.timeHour.offset(actualTimeExtent[1], 1),
    ];

    const histogram = d3
        .histogram()
        .domain(expandedTimeExtent)
        .value((d) => d.timestamp)
        .thresholds(d3.timeHours(...expandedTimeExtent, 1));

    const bins = histogram(data);

    return [bins, expandedTimeExtent];
}
