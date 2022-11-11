import { currentPeriod } from "../../browse/helper/getDates";

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
    commodities: {
        resource: "/dataSets",
        id: "ULowA8V3ucd",
        params: {
            fields: "dataSetElements[dataElement[id,name]",
        },
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
