import React from "react";
import {
    Box,
    Button,
    CircularLoader,
    DataTable,
    DataTableCell,
    DataTableColumnHeader,
    DataTableRow,
    TableBody,
    TableHead
} from "@dhis2/ui";
import {TransactionStatus} from "./helper/Transaction";

const statusToIcon = (status) => {
    let html = ""
    switch (status) {
        case TransactionStatus.pending:
            break
        case TransactionStatus.submitting:
            html = <CircularLoader small/>
            break
        case TransactionStatus.submitted:
            html = "✅"
            break
    }
    return html
}

function PendingTransactionTable({pendingTransactions, onDelete}) {
    if (!pendingTransactions) {
        return null
    }
    return <Box>
        <DataTable layout="fixed"
                   scrollHeight="300px">
            <TableHead>
                <DataTableRow>
                    <DataTableColumnHeader>
                        Commodity
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        Amount
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        Status
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
                                {statusToIcon(transaction.status)}
                            </DataTableCell>
                            <DataTableCell>
                                <Button
                                    primary
                                    small
                                    disabled={transaction.status !== TransactionStatus.pending}
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