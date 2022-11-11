import { currentPeriod, previousPeriod } from "./getDates";

export const request = {
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

export const mutateLastUpdated = {
    resource: "/dataStore/IN5320-G3/lastUpdated",
    data: currentPeriod,
    type: "update",
};

export const mutateBalance = {
    resource: "/dataValueSets",
    dataSet: "ULowA8V3ucd",
    data: ({ updatedBalance }) => ({
        orgUnit: process.env.REACT_APP_ORGUNIT,
        period: currentPeriod,
        dataValues: updatedBalance,
    }),
    type: "create",
};
