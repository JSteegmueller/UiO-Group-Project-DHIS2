import React, { useState } from "react"
import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import { Commodities } from "./Commodities";

const date = new Date();
const pDate = new Date(date);
pDate.setDate(0);

const currentPeriod = getPeriod(date);

function getPeriod(date) {
    return date.getFullYear().toString() + ("0" + (date.getMonth() + 1)).slice(-2);
}

const dataQuery = {
    dataSets: {
        resource: 'dataSets/ULowA8V3ucd',
        params: {
            fields: [
                'name',
                'id',
                'dataSetElements[dataElement[id, displayName]',
            ],
        },
    },
    dataValueSets: {
        resource: 'dataValueSets',
        params: {
            orgUnit: process.env.REACT_APP_ORGUNIT,
            dataSet: 'ULowA8V3ucd',
            period: currentPeriod,
        },
    },
}

export function Restock() {
    const { loading, error, data } = useDataQuery(dataQuery)
    
    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large />
    }

    if (data) {
        return (
            <div>
                <Commodities data={data} />
            </div>
        )  
    }
}
