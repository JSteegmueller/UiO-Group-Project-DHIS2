import React from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import {
  TableBody,
  CircularLoader,
  DataTableCell,
  DataTableRow,
} from "@dhis2/ui";

const orgUnitId = "Tht0fnjagHi";
const lifeCommodities = "ULowA8V3ucd";
const period = "202110";
const categoryOptionComboEndBalance = "J2Qf1jtZuj8";

// Fetching organisation unit ID's
const organisationUnits = {
  organisationList: {
    resource: "organisationUnits",
    id: "BGGmAwx33dj", // parentID from parentorganisation
    params: {
      fields: ["name", "id", "children[name,id]"],
    },
  },
};

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

// Collects all the necessary data about organisations based on the organisationId
function collectingOrgDataHelper(data) {
  let organisationIds = [];
  let organisationData = [];
  if (data) {
    for (let item of data.organisationList.children)
      if (orgUnitId !== item.id) {
        organisationIds.push(item.id);
        organisationData.push({
          orgUnitName: item.name,
          orgUnitId: item.id,
        });
      }
    return { organisationIds, organisationData };
  }
  return { organisationIds, organisationData };
}

// Collect all the necessary data from the commodity and collect it in one result list including organisation name and commodity
function collectingDataHelper(
  valueOfStock,
  requestedCommodityId,
  organisationData
) {
  let result = [];
  if (valueOfStock.data) {
    let dataValues = valueOfStock.data.valueList.dataValues;
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

function RequestCommodityTable({ requestedCommodityId, sortResult }) {
  const { loading, error, data } = useDataQuery(organisationUnits);
  let organisationIds = collectingOrgDataHelper(data).organisationIds;

  // ToDo: refetch this part in the first place
  const valueOfStock = useDataQuery(organisationUnitsValues, {
    variables: {
      orgId: organisationIds,
    },
  });

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (data) {
    const result = collectingDataHelper(
      valueOfStock,
      requestedCommodityId,
      collectingOrgDataHelper(data).organisationData
    );

    const sortedResult = sort(result, sortResult);

    return (
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
    );
  }
}

export default RequestCommodityTable;
