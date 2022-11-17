import React, {useEffect, useState} from "react";
import {Pagination, Table, TableBody, TableCell, TableCellHead, TableHead, TableRow, TableRowHead} from "@dhis2/ui";

function TransactionTable({transactions}) {
    if (!transactions) {
        return null
    }

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [slicedTransactions, setSlicedTransactions] = useState([])
    useEffect(() => {
        setSlicedTransactions(transactions.slice((page - 1) * pageSize, pageSize * page))
    }, [page, pageSize, transactions])

    return <div className="tableDispensing">
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
        <br/>
        <Pagination
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            page={page}
            pageCount={Math.ceil(transactions.length / pageSize)}
            pageSize={pageSize}
            total={transactions.length}/>
    </div>

}

export default TransactionTable