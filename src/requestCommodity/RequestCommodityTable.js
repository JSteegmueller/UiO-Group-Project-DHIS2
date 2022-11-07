import React, { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import {
    TableHead,
    DataTableRow,
    TableBody,
    CircularLoader,
    DataTableCell,
    DataTableColumnHeader,
    DataTable
} from "@dhis2/ui";

const lifeCommodities = "ULowA8V3ucd";
const categoryOptionComboEndBalance = "rQLFnNXXIL0";

// Fetching values based on organisation ID's
const organisationUnitsValues = {
    valueList: {
        resource: "/dataValueSets",
        params: ({ orgId, period }) => ({
            dataSet: lifeCommodities,
            period: period,
            orgUnit: orgId,
            fields: "dataValues[dataElement,categoryOptionCombo,value]",
        }),
    },
};

// Collect all the necessary data from the commodity and collect it in one result list including organisation name and commodity
function collectingDataHelper(valueOfStock, requestedCommodityId, organisationData) {
    let result = [];
    if (valueOfStock) {
        let dataValues = valueOfStock.valueList.dataValues;
        let collectValues = [];

        for (let item of dataValues) {
            if (
                item.categoryOptionCombo === categoryOptionComboEndBalance &&
                item.dataElement === requestedCommodityId
            ) {
                collectValues.push({
                    orgUnitId: item.orgUnit,
                    stock: item.value,
                });
            }
        }

        // Map amount of stock and ogansiation name based on Organisation Id
        result = collectValues.map((stocks) => ({
            ...stocks,
            ...organisationData.find(
                (organisationName) => organisationName.orgUnitId === stocks.orgUnitId
            ),
        }));

        return result;
    }
    return result;
}

// Sort data result and change sorting on click
function sort(result, sortResult) {
    const sortedResult = result;
    if (sortResult.sort === "stock") {
        sortedResult.sort((a, b) => b.stock - a.stock);
    }
    if (sortResult.sort === "organisation") {
        sortedResult.sort((a, b) => a.orgUnitName.localeCompare(b.orgUnitName));
    }
    if (!sortResult.sortDirection) {
        sortedResult.reverse();
    }
    return sortedResult;
}

function RequestCommodityTable({
    requestedCommodityId,
    organisationIds,
    organisationData,
    period}) {
    const { loading, error, data } = useDataQuery(organisationUnitsValues, {
        variables: {
            orgId: organisationIds,
            period: period,
        },
    });

    const [directionOrg, setDirectionOrg] = useState("default");
    const [directionStock, setDirectionStock] = useState("asc");
    const [sortResult, setSortResult] = useState({
        sort: "stock",
        sortDirection: true,
    });

    // Sort table on click according to ASC or DESC
    function onClickSorting(event) {
        const direction = sortResult.sort === event.name ? !sortResult.sortDirection : true;
        setSortResult({
            sort: event.name,
            sortDirection: direction,
        });
        event.name === "stock"
            ? setDirectionStock(direction ? "asc" : "desc")
            : setDirectionStock("default");
        event.name === "organisation"
            ? setDirectionOrg(direction ? "asc" : "desc")
            : setDirectionOrg("default");
    }

    if (error) {
        return <span>ERROR: {error.message}</span>;
    }

    if (loading) {
        return <CircularLoader large />;
    }

    if (data) {
        if (data.valueList.dataValues.length === 0) {
            return <p>Dataset in other organizations for this period is still empty</p>;
        }
        const result = collectingDataHelper(data, requestedCommodityId, organisationData);

        const sortedResult = sort(result, sortResult);

        return (
            <div>
                <DataTable>
                    <TableHead>
                        <DataTableRow>
                            <DataTableColumnHeader
                                name="organisation"
                                onSortIconClick={onClickSorting}
                                sortDirection={directionOrg}
                                sortIconTitle="Sort by organisation"
                            >
                                Organisation
                            </DataTableColumnHeader>
                            <DataTableColumnHeader
                                name="stock"
                                onSortIconClick={onClickSorting}
                                sortDirection={directionStock}
                                sortIconTitle="Sort by stock"
                            >
                                Amount of avialable stock
                            </DataTableColumnHeader>
                        </DataTableRow>
                    </TableHead>
                    <TableBody>
                        {sortedResult.map(({ orgUnitName, stock }, index) => {
                            return (
                                <DataTableRow key={index}>
                                    <DataTableCell>{orgUnitName}</DataTableCell>
                                    <DataTableCell>{stock}</DataTableCell>
                                </DataTableRow>
                            );
                        })}
                    </TableBody>
                </DataTable>
            </div>
        );
    }
}

export default RequestCommodityTable;
