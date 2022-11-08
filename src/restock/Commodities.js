import React, { useState } from "react"
import SearchBar from "./SearchBar";
import {Transfer, MenuItem } from "@dhis2/ui"
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
            displayName: commodity.dataElement.displayName.split(" - ")[1],
            id: commodity.dataElement.id,
            value: matchedValue.value,
        }
    })
}

export function Commodities({data}) {
    let mergedData = mergeData(data)

    const [options] = useState(mergedData.map(x => ({label: x.displayName, value: x.displayName})))
    const [selected, setSelected] = useState([])

    
    console.log(selected)

    return (
        <div>
            <h1>Restock commodities</h1>
            <Transfer
                filterable
                initialSearchTerm=""
                onChange={({selected }) => setSelected(selected)}
                options={options}
                selected={selected}
            />
        </div>
    );
}