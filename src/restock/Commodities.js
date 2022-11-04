import React, { useState } from "react"
import SearchBar from "./SearchBar";
import AmountToRestock from "./AmountToRestock";
import { Insert } from "./Insert";
import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
} from '@dhis2/ui'

function mergeData(data) {
    return data.dataSets.dataSetElements.map(d => {
        return {
            displayName: d.dataElement.displayName.split(" - ")[1],
            id: d.dataElement.id,
        }
    })
}

export function Commodities({data}) {
    let fullTable = mergeData(data)
    const [tableData, setTableData] = useState(fullTable);
    const [amount, setAmount] = useState(0);
    console.log(fullTable)
    return (
        <div>
            <h1>Restock commodities</h1>
            <SearchBar fullTable={fullTable} setTableData={setTableData} />
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Commodity</TableCellHead>
                        <TableCellHead>Restock amount</TableCellHead>
                        <TableCellHead></TableCellHead>
                        <TableCellHead></TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {tableData.map((row) => {
                        return (
                            <TableRow key={row.id}>
                                <TableCell>{row.displayName}</TableCell>
                                <TableCell>
                                    <Insert amount={amount} />
                                </TableCell>
                                <TableCell>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
              </Table>
        </div>
    );
}