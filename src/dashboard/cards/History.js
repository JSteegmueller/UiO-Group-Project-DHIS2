import React from "react";
import { requestHistory } from "../Requests";
import { useDataQuery } from "@dhis2/app-runtime";
import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
    CircularLoader,
} from "@dhis2/ui";

function History({ settings }) {
    const { loading, error, data } = useDataQuery(requestHistory);
    const timeFormat = settings.timeFormat ? "en-GB" : "default";
    const pageSize = 4;
    const page = 1;

    if (error) return <span>ERROR: {error.message}</span>;

    if (loading) return <CircularLoader large />;

    if (data) {
        const transactions = data.transactions;
        const slicedTransactions = transactions
            ? transactions.slice((page - 1) * pageSize, pageSize * page)
            : [];
        return (
            <div>
                <div className="card-settings">
                    <p>Transaction History</p>
                </div>
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>Date</TableCellHead>
                            <TableCellHead>Commodity</TableCellHead>
                            <TableCellHead>Qt.</TableCellHead>
                            <TableCellHead>To</TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {slicedTransactions.map((transaction, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell dense>
                                        {new Date(transaction.date).toLocaleDateString("en-GB")}
                                        <br />
                                        {new Date(transaction.date).toLocaleTimeString(timeFormat, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </TableCell>
                                    <TableCell dense>{transaction.commodity.name}</TableCell>
                                    <TableCell dense>{transaction.amount}</TableCell>
                                    <TableCell dense>{transaction.dispensedTo}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default History;
