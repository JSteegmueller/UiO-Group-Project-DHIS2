import React from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import FetchStockValuesOrg from "./FetchStockValuesOrg";
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

const dataQuery = {
  organisationList: {
    resource: "organisationUnits",
    id: "BGGmAwx33dj", // parentID from parentorganisation
    params: {
      fields: ["name", "id", "children[name,id]"],
    },
  },
};


function ListOfOrganisations() {
  const { loading, error, data } = useDataQuery(dataQuery);

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (data) {
    const organisationChildren = data.organisationList.children;

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
          <TableBody>
            {organisationChildren.map((orgData, index) => {
              return <FetchStockValuesOrg orgData={orgData} index={index} />;
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default ListOfOrganisations;
