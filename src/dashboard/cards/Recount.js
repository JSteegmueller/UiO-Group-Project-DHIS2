import React from "react";
import { requestRecount } from "../Requests";
import { getLastRecount } from "../../browse/helper/getDates";
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

function Recount({ settings }) {
    const { loading, error, data } = useDataQuery(requestRecount);
    const timeFormat = settings.timeFormat ? "en-GB" : "default";
    const page = 1;

    if (error) return <span>ERROR: {error.message}</span>;

    if (loading) return <CircularLoader large />;

    if (data) {
        const transactions = data.transactions;
        const length = transactions ? transactions.length : 0;
        const slicedTransactions = transactions ? transactions[length - page] : [];
        const date = new Date(transactions ? transactions[length - 1][0][2] : null);
        return (
            <div>
                <p>
                    Last recount: {date.toLocaleDateString("en-GB")}{" "}
                    {date.toLocaleTimeString(timeFormat, {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
                <p>Days from last recount: {getLastRecount(date)}</p>
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>Commodity</TableCellHead>
                            <TableCellHead>Original balance</TableCellHead>
                            <TableCellHead>After recount</TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {slicedTransactions.map(([id, value, _]) => {
                            return (
                                <TableRow key={id}>
                                    <TableCell dense>{id}</TableCell>
                                    <TableCell dense>???</TableCell>
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

export default Recount;
