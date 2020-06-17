import React from "react";
import Table from "react-bootstrap/Table";

type Props = {
    data: any[];
};

export const DataTable = (props: Props) => {
    return (
        <Table size="sm" bordered hover variant="dark">
            <tbody>
                {props.data.map((d) => (
                    <tr key={d.incident_number}>
                        <td align="left" color="white">
                            <pre>{JSON.stringify(d, null, 2)}</pre>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
