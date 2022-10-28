import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import { CircularLoader, Button } from "@dhis2/ui";

let orgUnit = "Tht0fnjagHi";
let dataSet = "ULowA8V3ucd";
let date = new Date();
date.setDate(0);
let previousPeriod =
    date.getFullYear().toString() + ("0" + (date.getMonth() + 1)).slice(-2);

const updateLastUpdated = {
    resource: "/dataStore/IN5320-G3/lastUpdated",
    data: ({ currentPeriod }) => currentPeriod,
    type: "update",
};

const requestBalance = {
    previousValues: {
        resource: "/dataValueSets",
        params: {
            orgUnit: orgUnit,
            dataSet: dataSet,
            period: previousPeriod,
            fields: "dataValues[dataElement,categoryOptionCombo,value]",
        },
    },
};

const updateBalance = {
    resource: "/dataValueSets",
    dataSet: dataSet,
    data: ({ currentPeriod, updatedBalance }) => ({
        orgUnit: orgUnit,
        period: currentPeriod,
        dataValues: updatedBalance,
    }),
    type: "create",
};

export const UpdateBalanceButton = ({ refetch, currentPeriod }) => {
    const { loading, error, data } = useDataQuery(requestBalance);
    const [mutateBalance, { loading1 }] = useDataMutation(updateBalance);
    const [mutateLastUpdated, { loading2 }] =
        useDataMutation(updateLastUpdated);

    if (error) {
        return <span>ERROR: {error.message}</span>;
    }

    if (loading) {
        return <CircularLoader small />;
    }

    if (data) {
        let updatedBalance = data.previousValues.dataValues
            .filter((i) => i.categoryOptionCombo == "rQLFnNXXIL0")
            .map((i) => ({
                dataElement: i.dataElement,
                categoryOptionCombo: i.categoryOptionCombo,
                value: i.value,
            }));

        const onClick = async () => {
            await mutateBalance({
                currentPeriod: currentPeriod,
                updatedBalance: updatedBalance,
            });
            await mutateLastUpdated({
                currentPeriod: currentPeriod,
            });
            refetch();
        };

        return (
            <Button
                primary
                small
                disabled={loading || loading1 || loading2}
                onClick={onClick}
            >
                + New
            </Button>
        );
    }
};
