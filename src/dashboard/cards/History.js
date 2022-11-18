import React from "react";
import { requestHistory } from "../helper/requests";
import { useDataQuery } from "@dhis2/app-runtime";
import {
    DataTable,
    TableBody,
    DataTableCell,
    DataTableColumnHeader,
    TableHead,
    DataTableRow,
    CircularLoader,
} from "@dhis2/ui";

function History({ settings }) {
    const { loading, error, data } = useDataQuery(requestHistory);
    const timeFormat = settings.timeFormat ? "en-GB" : "default";
    const pageSize = 10;
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
                <DataTable scrollHeight="350px">
                    <TableHead>
                        <DataTableRow>
                            <DataTableColumnHeader fixed top="0">
                                Date
                            </DataTableColumnHeader>
                            <DataTableColumnHeader fixed top="0">
                                Commodity
                            </DataTableColumnHeader>
                            <DataTableColumnHeader fixed top="0">
                                Qt.
                            </DataTableColumnHeader>
                            <DataTableColumnHeader fixed top="0">
                                To
                            </DataTableColumnHeader>
                        </DataTableRow>
                    </TableHead>
                    <TableBody>
                        {slicedTransactions.map((transaction, index) => {
                            return (
                                <DataTableRow key={index}>
                                    <DataTableCell dense>
                                        {new Date(transaction.date).toLocaleDateString("en-GB")}
                                        <br />
                                        {new Date(transaction.date).toLocaleTimeString(timeFormat, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </DataTableCell>
                                    <DataTableCell dense>
                                        {transaction.commodity.name}
                                    </DataTableCell>
                                    <DataTableCell dense>{transaction.amount}</DataTableCell>
                                    <DataTableCell dense>{transaction.dispensedTo}</DataTableCell>
                                </DataTableRow>
                            );
                        })}
                    </TableBody>
                </DataTable>
            </div>
        );
    }
}

export default History;
