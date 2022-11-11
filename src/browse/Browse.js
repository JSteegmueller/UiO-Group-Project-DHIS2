import React, { useState } from "react";
import StockTable from "./StockTable";
import { date, nextRestock, currentPeriod } from "./helper/getDates";
import { request, mutateBalance, mutateLastUpdated } from "./helper/requests";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";

function Browse({ requestHandler }) {
    const { loading, error, data, refetch } = useDataQuery(request);
    const [mutateB] = useDataMutation(mutateBalance);
    const [mutateL] = useDataMutation(mutateLastUpdated);
    const [lock, setLock] = useState(false);

    const updateBalance = async (data) => {
        const updatedBalance = data.previousValues.dataValues
            .filter((i) => i.categoryOptionCombo == "rQLFnNXXIL0")
            .map((i) => ({
                dataElement: i.dataElement,
                categoryOptionCombo: i.categoryOptionCombo,
                value: i.value,
            }));
        await mutateB({ updatedBalance: updatedBalance });
        await mutateL();
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
