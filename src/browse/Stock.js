import React, { useState } from "react";
import StockTable from "./StockTable";
import { date, nextRestock, currentPeriod } from "./helper/getDates";
import { request, mutateBalance, mutateLastUpdated } from "./helper/requests";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import { CircularLoader, AlertBar } from "@dhis2/ui";
import "./StockStyle.css";

function Stock({ requestHandler }) {
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
        await mutateB(updatedBalance);
        await mutateL();
        refetch();
    };

    if (error) return <span>ERROR: {error.message}</span>;

    if (loading) return <CircularLoader large />;

    if (data) {
        if (!lock && data.lastUpdated != currentPeriod) {
            updateBalance(data);
            setLock(true);
        }
        return (
            <div className="outerContainer">
                <h1>Stock</h1>
                <div className="userCards">
                    <div className="userCard">
                        <p>
                            User: <span className="colorsText">{data.user.name}</span>
                        </p>
                        <p>Organization: {data.organization.displayName}</p>
                    </div>
                    <div className="userCard">
                        <p>Days until next restock: {nextRestock}</p>
                        <p>Current Date: {date.toLocaleDateString("en-GB")}</p>
                    </div>
                </div>
                {lock && <AlertBar permanent>Balance updated for the new month!</AlertBar>}
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

export default Stock;
