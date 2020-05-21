import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { Chart } from "./Chart";
import { DataTable } from "./DataTable";
import Scatterplot from "./Scatterplot";
import { getEnv, getSeattle911 } from "./logic";
import styles from "./kitchensink.module.css";

export function KitchenSink() {
    const initialData = [
        {
            address: "15TH AV E / E REPUBLICAN ST",
            type: "Aid Response",
            datetime: "2019-11-23T15:41:00.000",
            latitude: "47.623102",
            longitude: "-122.312631",
            incident_number: "F0001",
        },
    ];

    const [data, setData] = useState(initialData);

    function updateEnv() {
        getEnv()
            .then((data) =>
                setData([
                    {
                        NODE_ENV: data.NODE_ENV,
                    },
                ])
            )
            .catch((error) => setData([{ error }]));
    }

    function updateData() {
        getSeattle911()
            .then((data) => {
                console.log("Data from API: ", data);
                setData(data);
            })
            .catch((error) => setData([{ error }]));
    }

    return (
        <>
            <Chart></Chart>
            <Scatterplot></Scatterplot>
            <Button
                variant="danger"
                className={`${styles.button} m-2`}
                onClick={updateEnv}
            >
                Get env
            </Button>
            <Button
                className={`${styles.button} m-2`}
                variant="danger"
                onClick={updateData}
            >
                Get data
            </Button>
            <DataTable data={data}></DataTable>
        </>
    );
}
