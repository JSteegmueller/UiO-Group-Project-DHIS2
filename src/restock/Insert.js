import React from 'react'
import {
    ReactFinalForm,
    InputFieldFF,
    Button,
    integer,
    composeValidators,
} from '@dhis2/ui'

import { useDataMutation } from '@dhis2/app-runtime'

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
    data: ({ value, dataElement, period, orgUnit }) => ({
        dataValues: [
            {
                dataElement: dataElement,
                period: period,
                orgUnit: orgUnit,
                value: value,
            },
        ],
    }),
}

export function Insert() {
    const [mutate, { loading, error }] = useDataMutation(dataMutationQuery)

    function onSubmit(formInput) {
        console.log(formInput)
        mutate({
            value: formInput.value,
            dataElement: formInput.dataElement,
            period: currentPeriod,
            orgUnit: process.env.REACT_APP_ORGUNIT,
        })
    }

    return (
        <div>
            <ReactFinalForm.Form onSubmit={onSubmit}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <ReactFinalForm.Field
                            name="amount"
                            label="Amount"
                            placeholder="The number of packs to restock"
                            component={InputFieldFF}
                            validate={composeValidators(integer)}
                        />
                        <Button type="submit" primary>
                            Submit
                        </Button>
                    </form>
                )}
            </ReactFinalForm.Form>
        </div>
    )
}
