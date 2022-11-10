import React, {useEffect, useState} from "react";
import {Pagination, Table, TableBody, TableCell, TableCellHead, TableHead, TableRow, TableRowHead} from "@dhis2/ui";
import {useDataQuery} from "@dhis2/app-runtime";
import {getTransactionsQuery} from "../dispensing/api/transactions";

function TransactionTable() {
    const {data} = useDataQuery(getTransactionsQuery);
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [slicedTransactions, setSlicedTransactions] = useState([])

    if (!data.transactions) return null
    const transactions = data.transactions
    useEffect(() => {
        setSlicedTransactions(transactions.slice((page - 1) * pageSize, pageSize * page))
    }, [page, pageSize, transactions])

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
        <br/>
        <Pagination
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            page={page}
            pageCount={Math.ceil(transactions.length / pageSize)}
            pageSize={pageSize}
            total={transactions.length}/>
        <br/>
    </div>

}

export default TransactionTable