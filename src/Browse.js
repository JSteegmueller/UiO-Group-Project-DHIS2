import React from "react";
import { UpdateBalanceButton } from "./UpdateBalanceButton";
import { useDataQuery } from "@dhis2/app-runtime";
import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
    CircularLoader,
} from "@dhis2/ui";

let orgUnit = "Tht0fnjagHi";
let dataSet = "ULowA8V3ucd";
let date = new Date();
let currentPeriod =
    date.getFullYear().toString() + ("0" + (date.getMonth() + 1)).slice(-2);

const request = {
    values: {
        resource: "/dataValueSets",
        params: {
            orgUnit: orgUnit,
            dataSet: dataSet,
            period: currentPeriod,
            fields: "dataValues[dataElement,categoryOptionCombo,value]",
        },
    },
    commodities: {
        resource: "/dataSets",
        id: dataSet,
        params: {
            fields: "dataSetElements[dataElement[id,name]",
        },
    },
    lastUpdated: {
        resource: "/dataStore/IN5320-G3/lastUpdated",
    },
    organization: {
        resource: "/organisationUnits",
        id: orgUnit,
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

function mergeData(data) {
    let categories = {
        J2Qf1jtZuj8: "Consumption",
        rQLFnNXXIL0: "Balance",
        KPP63zJPkOu: "Order",
    };

    let merged = data.commodities.dataSetElements.map((commodity) => {
        let match = data.values.dataValues.find((value) => {
            return commodity.dataElement.id == value.dataElement;
        });
        if (match) {
            return {
                name: commodity.dataElement.name.split(" - ")[1],
                id: commodity.dataElement.id,
                value: match.value,
                category: categories[match.categoryOptionCombo],
            };
        } else {
            return {
                name: commodity.dataElement.name.split(" - ")[1],
                id: commodity.dataElement.id,
            };
        }
    });

    return merged.reduce(function (r, a) {
        r[a.name] = r[a.name] || {
            Consumption: 0,
            Balance: 0,
            Order: 0,
        };
        if (a.category) {
            r[a.name][a.category] = a.value;
        }
        return r;
    }, Object.create(null));
}

export function Browse() {
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
                {data.lastUpdated != currentPeriod && (
                    <UpdateBalanceButton
                        refetch={refetch}
                        currentPeriod={currentPeriod}
                    />
                )}
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>Commodity</TableCellHead>
                            <TableCellHead>Consumption</TableCellHead>
                            <TableCellHead>End balance</TableCellHead>
                            <TableCellHead>
                                Quantity to be ordered
                            </TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {Object.entries(mergeData(data)).map(([k, v]) => {
                            return (
                                <TableRow key={k}>
                                    <TableCell>{k}</TableCell>
                                    <TableCell>{v["Consumption"]}</TableCell>
                                    <TableCell>{v["Balance"]}</TableCell>
                                    <TableCell>{v["Order"]}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    }
}
