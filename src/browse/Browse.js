import React from "react";
import { StockTable } from "./StockTable";
import { UpdateBalanceButton } from "./UpdateBalanceButton";
import { useDataQuery } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";

const date = new Date();
const pDate = new Date(date);
pDate.setDate(0);
const nextRestock = getTimeDiff(date);
const currentPeriod = getPeriod(date);
const previousPeriod = getPeriod(pDate);

const request = {
    values: {
        resource: "/dataValueSets",
        params: {
            orgUnit: process.env.REACT_APP_ORGUNIT,
            dataSet: "ULowA8V3ucd",
            period: currentPeriod,
            fields: "dataValues[dataElement,categoryOptionCombo,value]",
        },
    },
    commodities: {
        resource: "/dataSets",
        id: "ULowA8V3ucd",
        params: {
            fields: "dataSetElements[dataElement[id,name]",
        },
    },
    lastUpdated: {
        resource: "/dataStore/IN5320-G3/lastUpdated",
    },
    organization: {
        resource: "/organisationUnits",
        id: process.env.REACT_APP_ORGUNIT,
        params: {
            fields: "id,displayName",
        },
    },
    user: {
        resource: "/me",
        params: {
            fields: "id,name,organisationUnits",
        },
    },
};

function getPeriod(date) {
    return date.getFullYear().toString() + ("0" + (date.getMonth() + 1)).slice(-2);
}

function getTimeDiff(date) {
    const cDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nDate = new Date(date.getFullYear(), date.getMonth() + (date.getDate() < 15 ? 0 : 1), 14);
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((cDate - nDate) / oneDay));
}

export function Browse({ activePageHandler }) {
    const { loading, error, data, refetch } = useDataQuery(request);

    if (error) {
        return <span>ERROR: {error.message}</span>;
    }

    if (loading) {
        return <CircularLoader large />;
    }

    if (data) {
        return (
            <div>
                <p>User: {data.user.name}</p>
                <p>Organization: {data.organization.displayName}</p>
                <p>Table Month: {data.lastUpdated}</p>
                <p>Current Month: {currentPeriod}</p>
                <p>Current Date: {date.toJSON().split("T")[0]}</p>
                <p>Days until next restock: {nextRestock}</p>
                {data.lastUpdated != currentPeriod && (
                    <UpdateBalanceButton
                        refetch={refetch}
                        currentPeriod={currentPeriod}
                        previousPeriod={previousPeriod}
                    />
                )}
                <StockTable
                    data={data}
                    period={currentPeriod}
                    activePageHandler={activePageHandler}
                />
            </div>
        );
    }
}
