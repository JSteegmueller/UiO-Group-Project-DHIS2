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

const organisationUnits = {
  organisationList: {
    resource: "organisationUnits",
    id: "BGGmAwx33dj", // parentID from parentorganisation
    params: {
      fields: ["name", "id", "children[name,id]"],
    },
  },
};

const organisationUnitsValues = {
  valueList: {
    resource: "dataValueSets",
    params: ({orgId}) => ({
      dataSet: "ULowA8V3ucd",
      period: "202110",
      orgUnit: orgId
    }),
  },
};

function fetchingValueIdHelper(data) {
  if (data) {
    let organisationChildren = [];
    for (let item of data.organisationList.children)
      organisationChildren.push(item.id);

    return organisationChildren;
  }
  return;
}

function ListOfOrganisations() {
  const { loading, error, data } = useDataQuery(organisationUnits);
  let organisationChildren = fetchingValueIdHelper(data);

  const valueOfStock = useDataQuery(organisationUnitsValues, {
    variables: {
      orgId: organisationChildren,
    },
  });

  console.log(valueOfStock);

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (data) {
    return (
      <div>
        <h1>List of available commodity stock in other organisations</h1>
        <Table>
          <TableHead>
            <TableRowHead>
              <TableCellHead>Organisation</TableCellHead>
              <TableCellHead>Amount of avialable stock</TableCellHead>
            </TableRowHead>
          </TableHead>
          <TableBody></TableBody>
        </Table>
      </div>
    );
  }
}
/*
           {orgIdArray.map(({ name, stock }, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{name} </TableCell>
                  <TableCell>{stock}</TableCell>
                </TableRow>
              );
            })}*/

export default ListOfOrganisations;
