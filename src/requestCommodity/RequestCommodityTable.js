import React, { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import RequestCommoditySearchbar from "./RequestCommoditySearchbar";
import {
  TableHead,
  DataTableRow,
  TableBody,
  CircularLoader,
  DataTableCell,
  DataTableColumnHeader,
  DataTable,
} from "@dhis2/ui";

const lifeCommodities = "ULowA8V3ucd";
const period = "202110";
const categoryOptionComboEndBalance = "J2Qf1jtZuj8";

// Fetching values based on organisation ID's
const organisationUnitsValues = {
  valueList: {
    resource: "/dataValueSets",
    params: ({ orgId }) => ({
      dataSet: lifeCommodities,
      period: period,
      orgUnit: orgId,
      fields: "dataValues[dataElement,categoryOptionCombo,value]",
    }),
  },
};

// Collect all the necessary data from the commodity and collect it in one result list including organisation name and commodity
function collectingDataHelper(
  valueOfStock,
  requestedCommodityId,
  organisationData
) {
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
  if (sortResult.sort === "stock" && sortResult.sortDirection) {
    sortedResult.sort((a, b) => b.stock - a.stock);
  } else if (sortResult.sort === "stock" && !sortResult.sortDirection) {
    sortedResult.sort((a, b) => a.stock - b.stock);
  } else if (sortResult.sort === "organisation" && sortResult.sortDirection) {
    sortedResult.sort((a, b) => a.orgUnitName.localeCompare(b.orgUnitName));
  } else if (sortResult.sort === "organisation" && !sortResult.sortDirection) {
    sortedResult.sort((a, b) => b.orgUnitName.localeCompare(a.orgUnitName));
  }
  return sortedResult;
}

function RequestCommodityTable({
  requestedCommodityId,
  organisationIds,
  organisationData,
}) {
  const { loading, error, data } = useDataQuery(organisationUnitsValues, {
    variables: {
      orgId: organisationIds,
    },
  });

  const [sortResult, setSortResult] = useState({
    sort: "stock",
    sortDirection: true,
  });

  // Sort table on click according to ASC or DESC
  function onClickSorting(event) {
    if (sortResult.sort === event.name) {
      setSortResult({
        sort: event.name,
        sortDirection: !sortResult.sortDirection,
      });
    } else if (sortResult.sort !== event.name) {
      if (sortResult.sortDirection) {
        setSortResult({
          sort: event.name,
          sortDirection: !sortResult.sortDirection,
        });
      } else if (!sortResult.sortDirection) {
        setSortResult({
          sort: event.name,
          sortDirection: sortResult.sortDirection,
        });
      }
    }
  }

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (data) {
    const result = collectingDataHelper(
      data,
      requestedCommodityId,
      organisationData
    );

    const sortedResult = sort(result, sortResult);

    return (
      <div>
        <RequestCommoditySearchbar receiveSearchQuery={"receiveSearchQuery"} />
        <DataTable>
          <TableHead>
            <DataTableRow>
              <DataTableColumnHeader
                name="organisation"
                onSortIconClick={onClickSorting}
                sortDirection="default"
                sortIconTitle="Sort by organisation"
              >
                Organisation
              </DataTableColumnHeader>
              <DataTableColumnHeader
                name="stock"
                onSortIconClick={onClickSorting}
                sortDirection="default"
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
