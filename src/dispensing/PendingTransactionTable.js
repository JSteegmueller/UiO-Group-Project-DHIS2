import React from "react";
import {
    Box,
    Button,
    DataTable,
    DataTableCell,
    DataTableColumnHeader,
    DataTableRow,
    TableBody,
    TableHead
} from "@dhis2/ui";

function PendingTransactionTable({pendingTransactions, onDelete}) {
    if (!pendingTransactions) {
        return null
    }
    return <Box>
        <DataTable
            layout="fixed"
            scrollHeight="400px"
            scrollWidth="500px">
            <TableHead>
                <DataTableRow>
                    <DataTableColumnHeader>
                        Commodity
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        Amount
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        Delete
                    </DataTableColumnHeader>
                </DataTableRow>
            </TableHead>
            <TableBody>
                {
                    pendingTransactions.map((transaction, index) => {
                        return <DataTableRow key={index}>
                            <DataTableCell>{transaction.commodity.name}</DataTableCell>
                            <DataTableCell>{transaction.amount}</DataTableCell>
                            <DataTableCell>
                                <Button
                                    primary
                                    small
                                    onClick={() => onDelete(index)}>
                                    {String.fromCharCode(0x274C)}
                                </Button>
                            </DataTableCell>
                        </DataTableRow>
                    })
                }
            </TableBody>
        </DataTable>
    </Box>
}

export default PendingTransactionTable