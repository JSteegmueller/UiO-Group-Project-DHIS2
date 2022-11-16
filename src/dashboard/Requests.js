import { currentPeriod } from "../browse/helper/getDates";

export const period = currentPeriod;

export const requestSettings = {
    userSettings: {
        resource: "/dataStore/IN5320-G3/userSettings",
    },
};

export const mutateSettings = {
    resource: "/dataStore/IN5320-G3/userSettings",
    data: (userSettings) => userSettings,
    type: "update",
};

export const requestStock = {
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
};

export const requestUser = {
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
            fields: "id,name,introduction,nationality,employer,email,userCredentials[lastLogin],organisationUnits",
        },
    },
};

export const requestHistory = {
    transactions: {
        resource: "dataStore",
        id: "IN5320-G3/transactions",
    },
};

export const requestRestock = {
    transactions: {
        resource: "dataStore",
        id: "IN5320-G3/restocks",
    },
};

export const requestRecount = {
    transactions: {
        resource: "dataStore",
        id: "IN5320-G3/recounts",
    },
};
