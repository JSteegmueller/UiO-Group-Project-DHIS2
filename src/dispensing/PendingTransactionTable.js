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
        <DataTable>
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
                    <DataTableColumnHeader>
                        Status
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
                            <DataTableCell>
                                {transaction.status}
                            </DataTableCell>
                        </DataTableRow>
                    })
                }
            </TableBody>
        </DataTable>
    </Box>
}

export default PendingTransactionTable