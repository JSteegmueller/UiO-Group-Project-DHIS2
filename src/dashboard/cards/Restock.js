import React from "react";
import { requestRestock } from "../Requests";
import { nextRestock } from "../../browse/helper/getDates";
import { useDataQuery } from "@dhis2/app-runtime";
import {
    CircularLoader,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
} from "@dhis2/ui";

function Restock({ settings }) {
    const { loading, error, data } = useDataQuery(requestRestock);
    const timeFormat = settings.timeFormat ? "en-GB" : "default";
    const page = 1;

    if (error) return <span>ERROR: {error.message}</span>;

    if (loading) return <CircularLoader large />;

    if (data) {
        const transactions = data.transactions;
        const length = transactions ? transactions.length : 0;
        const slicedTransactions = transactions ? transactions[length - page] : [];
        const date = new Date(transactions ? transactions[length - 1][0][3] : null);
        return (
            <div>
                <p>
                    Last restock: {date.toLocaleDateString("en-GB")}{" "}
                    {date.toLocaleTimeString(timeFormat, {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
                <p>Days until next restock: {nextRestock}</p>
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>Commodity</TableCellHead>
                            <TableCellHead>Amount restocked</TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {slicedTransactions.map(([id, value, _]) => {
                            return (
                                <TableRow key={id}>
                                    <TableCell dense>{id}</TableCell>
                                    <TableCell dense>{value}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default Restock;
