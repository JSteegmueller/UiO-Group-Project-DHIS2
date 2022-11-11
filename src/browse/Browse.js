import React, { useState } from "react";
import StockTable from "./StockTable";
import { date, nextRestock, currentPeriod, previousPeriod } from "./helper/getDates";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";

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
    previousValues: {
        resource: "/dataValueSets",
        params: {
            orgUnit: process.env.REACT_APP_ORGUNIT,
            dataSet: "ULowA8V3ucd",
            period: previousPeriod,
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

const mutateLastUpdated = {
    resource: "/dataStore/IN5320-G3/lastUpdated",
    data: currentPeriod,
    type: "update",
};

const mutateBalance = {
    resource: "/dataValueSets",
    dataSet: "ULowA8V3ucd",
    data: ({ updatedBalance }) => ({
        orgUnit: process.env.REACT_APP_ORGUNIT,
        period: currentPeriod,
        dataValues: updatedBalance,
    }),
    type: "create",
};

function Browse({ requestHandler }) {
    const { loading, error, data, refetch } = useDataQuery(request);
    const [mutateB, { loading1, error1 }] = useDataMutation(mutateBalance);
    const [mutateL, { loading2, error2 }] = useDataMutation(mutateLastUpdated);
    const [lock, setLock] = useState(false);

    const updateBalance = async (data) => {
        const updatedBalance = data.previousValues.dataValues
            .filter((i) => i.categoryOptionCombo == "rQLFnNXXIL0")
            .map((i) => ({
                dataElement: i.dataElement,
                categoryOptionCombo: i.categoryOptionCombo,
                value: i.value,
            }));
        await mutateB({
            currentPeriod: currentPeriod,
            updatedBalance: updatedBalance,
        });
        await mutateL({
            currentPeriod: currentPeriod,
        });
        refetch();
    };

    if (error) {
        return <span>ERROR: {error.message}</span>;
    }

    if (loading) {
        return <CircularLoader large />;
    }

    if (data) {
        if (!lock && data.lastUpdated != currentPeriod) {
            updateBalance(data);
            setLock(true);
        }
        return (
            <div>
                <p>User: {data.user.name}</p>
                <p>Organization: {data.organization.displayName}</p>
                <p>Table Month: {data.lastUpdated}</p>
                <p>Current Month: {currentPeriod}</p>
                <p>Current Date: {date.toJSON().split("T")[0]}</p>
                <p>Days until next restock: {nextRestock}</p>
                {lock && <p>Balance updated for the new month!</p>}
                <StockTable
                    key={data.lastUpdated}
                    data={data}
                    period={currentPeriod}
                    requestHandler={requestHandler}
                />
            </div>
        );
    }
}

export default Browse;
