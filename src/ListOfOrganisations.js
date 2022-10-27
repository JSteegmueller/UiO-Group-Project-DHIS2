import React from "react";
import { useState } from "react";
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

// Data query set
const dataQuery = {
  //data
};
/* Queries
Get dataset based on Commodity which is send with request
{
    "": {
        "resource": "dataSets",
        "id": "ULowA8V3ucd",
        "params": {
            "fields": [
                "dataSetElements[dataElement[id, name,categoryCombo[categoryOptionCombos[id]]]"
            ]
        }
    }
}
Get organisations and save in list
{
    "": {
        "resource": "organisationUnits",
        "id": "BGGmAwx33dj", // Our organisation
        "params": {
            "fields": [
                "id",
                "name",
                "children[name,id]"
            ]
        }
    }
}
// Get values -- end balance etc
{
    "": {
        "resource": "dataValues",
        "id": "BGGmAwx33dj",
        "params": {
            "de": "W1XtQhP6BGd",
            "ou": "Tht0fnjagHi",
            "pe": "202110",
            "co": "KPP63zJPkOu"
        }
    }
}
*/

function mergeData(data) {
  return data.dataSets.dataSetElements.map((d) => {
    let matchedValue = data.dataValueSets.dataValues.find((dataValues) => {
      if (dataValues.dataElement == d.dataElement.id) {
        return true;
      }
    });

    return {
      displayName: d.dataElement.displayName,
      id: d.dataElement.id,
      value: matchedValue.value,
    };
  });
}

function ListOfOrganisations() {
  const { loading, error, data } = useDataQuery(dataQuery);
  const [requestDataItem, setRequestDataItem] = useState(); // Requested data item
  const [activePage, setActivePage] = useState(); // set active state to active table

  // On click changes request data based on id
  const onClick = function (item) {
    setRequestDataItem(item);
    setActivePage(item.displayName);
  };

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (data) {
    console.log(mergeData(data));
    return (
      <div>
        <h1>List of available commodity stock in other organisations</h1>
        <Table>
          <TableHead>
            <TableRowHead>
              <TableCellHead>Organisation</TableCellHead>
              <TableCellHead>Amount of avialable stock</TableCellHead>
              <TableCellHead>Distance/Place(?)</TableCellHead>
              <TableCellHead>Phone(?)</TableCellHead>
            </TableRowHead>
          </TableHead>
          <TableBody>
            <TableRow /*key={props.values.id}*/>
              <TableCell>Dummy 1</TableCell>
              <TableCell>Dummy 2</TableCell>
              <TableCell>Dummy 3</TableCell>
              <TableCell>Dummy 4</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default ListOfOrganisations;
