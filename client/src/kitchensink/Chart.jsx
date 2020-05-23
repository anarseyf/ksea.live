import React from "react";
import { VegaLite } from "react-vega";
import { dark } from "vega-themes";

const vegaSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    theme: "dark",
    width: 200,
    height: 50,
    mark: "circle",

    encoding: {
        x: { field: "a", type: "ordinal" },
        y: { field: "b", type: "quantitative" },
    },

    data: { name: "table" },
};

const vegaData = {
    table: [
        { a: "A", b: 28 },
        { a: "B", b: 55 },
        { a: "C", b: 43 },
        { a: "D", b: 91 },
        { a: "E", b: 81 },
        { a: "F", b: 53 },
        { a: "G", b: 19 },
        { a: "H", b: 87 },
        { a: "I", b: 52 },
    ],
};

export function Chart() {
    return <VegaLite spec={vegaSpec} data={vegaData}></VegaLite>;
}
