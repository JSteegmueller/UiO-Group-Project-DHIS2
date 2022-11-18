import React from "react";
import { requestRestock } from "../helper/requests";
import { getNextRestock } from "../helper/getDates";
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
                    Last restock: {date.toLocaleDateString("en-GB")}
                    {" - "}
                    {date.toLocaleTimeString(timeFormat, {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
                <p>Days until next restock: {getNextRestock()}</p>
                <DataTable scrollHeight="350px">
                    <TableHead>
                        <DataTableRow>
                            <DataTableColumnHeader fixed top="0">
                                Commodity
                            </DataTableColumnHeader>
                            <DataTableColumnHeader fixed top="0">
                                Amount restocked
                            </DataTableColumnHeader>
                        </DataTableRow>
                    </TableHead>
                    <TableBody>
                        {slicedTransactions.map(([id, value, _]) => {
                            return (
                                <DataTableRow key={id}>
                                    <DataTableCell dense>{id}</DataTableCell>
                                    <DataTableCell dense>{value}</DataTableCell>
                                </DataTableRow>
                            );
                        })}
                    </TableBody>
                </DataTable>
            </div>
        );
    }
}

export default Restock;
