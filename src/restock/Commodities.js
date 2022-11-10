import React, { useState, useEffect } from "react"
import { useDataMutation } from '@dhis2/app-runtime'
import {
    Table,
    TableRow,
    TableCell,
    TableRowHead,
    TableHead,
    TableCellHead,
    TableBody,
    InputField,
    Button,
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui'

const date = new Date();
const pDate = new Date(date);
pDate.setDate(0);

const currentPeriod = getPeriod(date);

function getPeriod(date) {
    return date.getFullYear().toString() + ("0" + (date.getMonth() + 1)).slice(-2);
}

const dataMutationQuery = {
    resource: 'dataValueSets',
    type: 'create',
    dataSet: 'ULowA8V3ucd',
    data: ({ value, dataElement }) => ({
        dataValues: [
            {
                dataElement: dataElement,
                period: currentPeriod,
                orgUnit: process.env.REACT_APP_ORGUNIT,
                value: value,
                categoryOptionCombo: "rQLFnNXXIL0",
            },
        ],
    }),
}

function mergeData(data) {
    return data.dataSets.dataSetElements.map(commodity => {
        let matchedValue = data.dataValueSets.dataValues.find(dataValues => {
            if(dataValues.dataElement == commodity.dataElement.id && dataValues.categoryOptionCombo === "rQLFnNXXIL0") {
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

export function Commodities({data, refetch}) {
    let mergedData = mergeData(data)
    let sortedData = mergedData.sort((a, b) => a.displayName.localeCompare(b.displayName))

    const [amount, setAmount] = useState({})
    const [selected, setSelected] = useState([])
    //console.log(mergedData)

    const [mutate, { loading, error }] = useDataMutation(dataMutationQuery)

    const handleConfirmClick = () => {
        Object.entries(amount).map(commodity => {
            //console.log(commodity)
            let match = sortedData.find(v => v.displayName === commodity[0])
            //console.log(match)
            mutate({
                value: Number(match.value) + Number(commodity[1]),
                dataElement: match.id,
            })
        })
        setAmount({})
        refetch()
    }

    return (
        <div>
            <h1>Restock commodities</h1>
            <SingleSelect 
                className="select" 
                filterable
                placeholder="Select commodities to restock"
                noMatchText="No match found"
                onChange={({selected}) => setSelected(old => [...old, selected])}
            >
                {sortedData.map(commodity => {
                    return (
                        <SingleSelectOption key={commodity.displayName}
                            label={commodity.displayName} 
                            value={commodity.displayName} />
                    )
                })}
            </SingleSelect>
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>
                            Commodity
                        </TableCellHead>
                        <TableCellHead>
                            Current stock
                        </TableCellHead>
                        <TableCellHead>
                            Restock amount
                        </TableCellHead>
                        <TableCellHead></TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {sortedData.map(commodity => {
                        if(selected.includes(commodity.displayName)) {
                            return (
                                <TableRow key={commodity.id}>
                                    <TableCell>
                                        {commodity.displayName}
                                    </TableCell>
                                    <TableCell>
                                        {commodity.value}
                                    </TableCell>
                                    <TableCell>
                                        <InputField 
                                            onChange={
                                                v => {
                                                    setAmount(old => (
                                                        {
                                                            ...old,
                                                            [commodity.displayName]:v.value
                                                        }
                                                    ))
                                                }
                                            }
                                            value={amount[commodity.displayName]}
                                            placeholder="Number of packs to restock"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                                icon={<svg height="24" viewBox="0 0 320 512" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" fill="#inherit"/></svg>}
                                                name="Icon small button"
                                                onClick={
                                                    () => setSelected((current) =>
                                                        current.filter((c) => c !== commodity.displayName))
                                                }
                                                destructive
                                                small
                                                value="default"
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    })}
                </TableBody>
            </Table>
            <br></br>
            <Button 
                name="confirm" 
                onClick={handleConfirmClick} 
                primary value="default"
            >
                Confirm
            </Button>
        </div>
    );
}