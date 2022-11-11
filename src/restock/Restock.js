import React, { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";
import { Commodities } from "./Commodities";

const date = new Date();
const pDate = new Date(date);
pDate.setDate(0);

const currentPeriod = getPeriod(date);

function getPeriod(date) {
    return date.getFullYear().toString() + ("0" + (date.getMonth() + 1)).slice(-2);
}

const categoryOptionComboEndBalance = "J2Qf1jtZuj8";

const dataQuery = {
    dataSets: {
        resource: "dataSets/ULowA8V3ucd",
        params: {
            fields: [
                "dataSetElements[dataElement[id, displayName, categoryCombo[categoryOptionCombos[id, displayName]]]",
            ],
        },
    },
    dataValueSets: {
        resource: "dataValueSets",
        params: {
            orgUnit: process.env.REACT_APP_ORGUNIT,
            dataSet: "ULowA8V3ucd",
            period: currentPeriod,
            fields: "dataValues[dataElement, categoryOptionCombo, value]",
        },
    },
};

export function Restock() {
    const { loading, error, data, refetch } = useDataQuery(dataQuery);
    const [refresh, setRefresh] = useState(false);

    function refreshComponent() {
        setRefresh(!refresh);
    }

    if (error) {
        return <span>ERROR: {error.message}</span>;
    }

    if (loading) {
        return <CircularLoader large />;
    }

    if (data) {
        return (
            <div>
                <Commodities
                    key={refresh}
                    data={data}
                    refetch={refetch}
                    refreshComponent={refreshComponent}
                />
            </div>
        );
    }
}
