import React, { useState } from "react"
import {
    ReactFinalForm,
    InputFieldFF,
    Button,
    SingleSelectFieldFF,
    hasValue,
    number,
    composeValidators,
    Transfer
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

    function onSubmit(formInput) {
        console.log(formInput)
    }

    return (
        <div>
            <h1>Restock commodities</h1>
            <Transfer
                filterable
                height="400px"
                leftHeader={<h3>Select commodities to restock</h3>}
                rightHeader={<h3>Selected commoditites</h3>}
                filterPlaceholder="Search"
                addAllText="Select all"
                addIndividualText="Select individual"
                removeAllText="Deselect all"
                removeIndividualText="Deselect individual"
                onChange={({selected }) => setSelected(selected)}
                options={options}
                selected={selected}
                selectedEmptyComponent={<p style={{textAlign: 'center'}}>You have not selected anything yet<br /></p>}
            />
            <br></br>
            
            <Button name="confirm" primary value="default">
                Confirm
            </Button>
        </div>
    );
}