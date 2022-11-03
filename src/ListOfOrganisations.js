import React from "react";
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

// Fetches all the necessary data from the organisation
function fetchingOrgDataHelper(data) {
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

// Fetches all the necessary data from the value and collect it in one result list
function fetchingValueDataHelper(
  valueOfStock,
  requestedCommodity,
  organisationData
) {
  let result = [];
  if (valueOfStock.data) {
    let dataValues = valueOfStock.data.valueList.dataValues;
    let collectValues = [];

    for (let item of dataValues) {
      if (
        item.categoryOptionCombo === categoryOptionComboEndBalance &&
        item.dataElement === requestedCommodity
      ) {
        collectValues.push({
          orgUnitId: item.orgUnit,
          value: item.value,
        });
      }
    }

    result = collectValues.map((values) => ({
      ...values,
      ...organisationData.find(
        (organisationName) => organisationName.orgUnitId === values.orgUnitId
      ),
    }));

    return result;
  }
  return result;
}

// Later call function via requestedCommodity
function ListOfOrganisations(/*requestedCommodityId, requestedCommodityName*/) {
  const { loading, error, data } = useDataQuery(organisationUnits);
  let organisationIds = fetchingOrgDataHelper(data).organisationIds;

  // Delete this 2 lines after call was setup
  const requestedCommodity = "W1XtQhP6BGd";
  const requestedCommodityName = "Commodities - Resuscitation Equipment";

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
    let organisationData = fetchingOrgDataHelper(data).organisationData;
    const result = fetchingValueDataHelper(
      valueOfStock,
      requestedCommodity,
      organisationData
    );

    return (
      <div>
        <h1>List of available stock in other organisations</h1>
        <h2>{requestedCommodityName}</h2>
        <Table>
          <TableHead>
            <TableRowHead>
              <TableCellHead>Organisation</TableCellHead>
              <TableCellHead>Amount of avialable stock</TableCellHead>
            </TableRowHead>
          </TableHead>
          <TableBody>
            {result.map(({ orgUnitName, value }, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{orgUnitName} </TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default ListOfOrganisations;
