import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import { CircularLoader, Button } from "@dhis2/ui";

const requestBalance = {
    previousValues: {
        resource: "/dataValueSets",
        params: ({ previousPeriod }) => ({
            orgUnit: process.env.REACT_APP_ORGUNIT,
            dataSet: "ULowA8V3ucd",
            period: previousPeriod,
            fields: "dataValues[dataElement,categoryOptionCombo,value]",
        }),
    },
};

const mutateLastUpdated = {
    resource: "/dataStore/IN5320-G3/lastUpdated",
    data: ({ currentPeriod }) => currentPeriod,
    type: "update",
};

const mutateBalance = {
    resource: "/dataValueSets",
    dataSet: "ULowA8V3ucd",
    data: ({ currentPeriod, updatedBalance }) => ({
        orgUnit: process.env.REACT_APP_ORGUNIT,
        period: currentPeriod,
        dataValues: updatedBalance,
    }),
    type: "create",
};

export const UpdateBalanceButton = ({
    refetch,
    currentPeriod,
    previousPeriod,
}) => {
    const { loading, error, data } = useDataQuery(requestBalance, {
        variables: {
            previousPeriod: previousPeriod,
        },
    });
    const [mutateB, { loading1 }] = useDataMutation(mutateBalance);
    const [mutateL, { loading2 }] = useDataMutation(mutateLastUpdated);

    if (error) {
        return <span>ERROR: {error.message}</span>;
    }

    if (loading) {
        return <CircularLoader small />;
    }

    if (data) {
        // Replace all balance values with values of the previous period.
        const updatedBalance = data.previousValues.dataValues
            .filter((i) => i.categoryOptionCombo == "rQLFnNXXIL0")
            .map((i) => ({
                dataElement: i.dataElement,
                categoryOptionCombo: i.categoryOptionCombo,
                value: i.value,
            }));

        const onClick = async () => {
            await mutateB({
                currentPeriod: currentPeriod,
                updatedBalance: updatedBalance,
            });
            await mutateL({
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
