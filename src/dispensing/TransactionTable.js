import React from "react";
import {Table, TableBody, TableCell, TableCellHead, TableHead, TableRow, TableRowHead} from "@dhis2/ui";

function TransactionTable({transactions}) {
    if (!transactions) {
        return null
    }
    let slicedTransactions = transactions.slice(0, 10)
    return <div>
        <Table>
            <TableHead>
                <TableRowHead>
                    <TableCellHead>Date of Transaction</TableCellHead>
                    <TableCellHead>Time of Transaction</TableCellHead>
                    <TableCellHead>Commodity</TableCellHead>
                    <TableCellHead>Amount of Commodity</TableCellHead>
                    <TableCellHead>Dispensed By</TableCellHead>
                    <TableCellHead>Dispensed To</TableCellHead>
                </TableRowHead>
            </TableHead>
            <TableBody>
                {
                    slicedTransactions.map((transaction, index) => {
                        return <TableRow key={index}>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(transaction.date).toLocaleTimeString()}</TableCell>
                            <TableCell>{transaction.commodity.name}</TableCell>
                            <TableCell>{transaction.amount}</TableCell>
                            <TableCell>{transaction.dispensedBy}</TableCell>
                            <TableCell>{transaction.dispensedTo}</TableCell>
                        </TableRow>
                    })
                }
            </TableBody>
        </Table>
    </div>
}

export default TransactionTable