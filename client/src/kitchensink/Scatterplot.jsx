import React from "react";
import { XYFrame } from "semiotic";
import styles from "./visual.css";

const frameProps = {
    /* --- Data --- */
    points: [
        { theaterCount: 4, rank: 18, grossWeekly: 327616, title: "Ex Machina" },
        {
            theaterCount: 39,
            rank: 15,
            grossWeekly: 1150814,
            title: "Far from the Madding Crowd",
        },
    ],

    /* --- Size --- */
    size: [400, 200],
    margin: { left: 10, bottom: 10, right: 10, top: 10 },

    /* --- Process --- */
    xAccessor: "theaterCount",
    yAccessor: "rank",
    yExtent: [0],
    xExtent: [0],

    /* --- Customize --- */
    pointStyle: (d) => {
        return {
            r: 5,
            fill:
                d.title === "Ex Machina"
                    ? "#ac58e5"
                    : d.title === "Far from the Madding Crowd"
                    ? "#E0488B"
                    : "#9fd0cb",
        };
    },
    axes: [
        { orient: "left", label: "Rank" },
        { orient: "bottom", label: { name: "Theaters" } },
    ],
};

export default () => {
    return <XYFrame styles={styles.semiotic} {...frameProps} />;
};
