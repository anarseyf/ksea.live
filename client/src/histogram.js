import * as d3 from "d3";

export function histogram(tweets) {
    const extent = expandedExtent(tweets);

    const histogram = d3
        .histogram()
        .domain(extent)
        .value((d) => d.derived.timestamp)
        .thresholds(d3.timeHours(...extent, 1));

    return histogram(tweets);
}

function getExtent(tweets) {
    return d3.extent(tweets, (d) => d.derived.timestamp);
}

export function expandedExtent(tweets) {
    const extent = getExtent(tweets);
    return [
        d3.timeHour.offset(extent[0], -1),
        d3.timeHour.offset(extent[1], 1),
    ];
}
