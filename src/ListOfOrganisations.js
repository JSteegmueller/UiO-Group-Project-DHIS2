import React from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import FetchStockValuesOrg from "./FetchStockValuesOrg";
import { useState } from "react";
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
const test = {
  valueOfStock: {
    resource: "dataValues",
    params: ({ orgId }) => ({
      de: commodityId,
      pe: period,
      ou: orgId,
      co: co,
    }),
  },
};

function ListOfOrganisations() {
  const { loading, error, data } = useDataQuery(dataQuery);
  const [orgIdArray, setOrgIdArray] = useState([]);

  const orgId1 = "Tht0fnjagHi";
  // const orgIdArray = [];

  const valueOfStock = useDataQuery(test, {
    variables: {
      orgId: orgId1,
    },
  });

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (data) {
    const organisationChildren = data.organisationList.children;
    const zwischenspeicher = [];

    for (let org of organisationChildren) {
      valueOfStock.refetch({ orgId: org.id }).then((data, error) => {
        if (data) {
          zwischenspeicher.push({
            name: org.name,
            stock: data.valueOfStock,
          });
        }
      });
    }

    setOrgIdArray(zwischenspeicher);

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
            {orgIdArray.map(({ name, stock }, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{name} </TableCell>
                  <TableCell>{stock}</TableCell>
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
