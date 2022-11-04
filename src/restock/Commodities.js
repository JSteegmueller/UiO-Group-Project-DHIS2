import React, { useState } from "react"
import SearchBar from "./SearchBar";
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
    return data.dataSets.dataSetElements.map(commodity => {
        let matchedValue = data.dataValueSets.dataValues.find(dataValues => {
            if(dataValues.dataElement == commodity.dataElement.id) {
                return true
            }
        })

        return {
            displayName: commodity.dataElement.displayName,
            id: commodity.dataElement.id,
            value: matchedValue.value,
        }
    })
}

export function Commodities({data}) {
    console.log(data)
    let mergedData = mergeData(data)
    const [tableData, setTableData] = useState(mergedData);
    const [value, setAmount] = useState(0);
    console.log(mergedData)
    return (
        <div>
            <h1>Restock commodities</h1>
            <SearchBar mergedData={mergedData} setTableData={setTableData} />
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Commodity</TableCellHead>
                        <TableCellHead>Current stock</TableCellHead>
                        <TableCellHead>Restock amount</TableCellHead>
                        <TableCellHead></TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {tableData.map((row) => {
                        return (
                            <TableRow key={row.id}>
                                <TableCell>{row.displayName.split(" - ")[1]}</TableCell>
                                <TableCell>{row.value}</TableCell>
                                <TableCell>
                                    <Insert />
                                </TableCell>
                                <TableCell>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
              </Table>
        </div>
    );
}