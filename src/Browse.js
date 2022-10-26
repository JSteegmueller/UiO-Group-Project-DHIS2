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

let date = new Date();
let orgUnit = "Tht0fnjagHi";
let period = 202210;
// let period = date.getFullYear().toString() + (date.getMonth() + 1);

const request = {
  values: {
    resource: "/dataValueSets",
    params: {
      dataSet: "ULowA8V3ucd",
      orgUnit: orgUnit,
      period: period,
    },
  },
  commodities: {
    resource: "/dataSets/ULowA8V3ucd",
    params: {
      fields:
        "id,name,dataSetElements[dataElement[id,name,categoryCombo[id,name,categoryOptionCombos[id,name]]]",
    },
  },
  // organization: {
  //   resource: "/organisationUnits/".concat(orgUnit),
  //   params: {
  //     fields: "id,code,displayName,displayShortName,parent",
  //   },
  // },
  // user: {
  //   resource: "/me",
  //   params: {
  //     fields: "id,name,organisationUnits",
  //   },
  // },
};

function mergeData(data) {
  let categories = {
    J2Qf1jtZuj8: "Consumption",
    KPP63zJPkOu: "Order",
    rQLFnNXXIL0: "Balance",
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
    let empty = 0;
    r[a.name] = r[a.name] || {
      Consumption: empty,
      Order: empty,
      Balance: empty,
    };
    if (a.category) {
      r[a.name][a.category] = a.value;
    }
    return r;
  }, Object.create(null));
}

export function Browse() {
  const { loading, error, data } = useDataQuery(request);

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (data) {
    let mergedData = mergeData(data);
    return (
      <Table>
        <TableHead>
          <TableRowHead>
            <TableCellHead>Commodity</TableCellHead>
            <TableCellHead>Consumption</TableCellHead>
            <TableCellHead>End balance</TableCellHead>
            <TableCellHead>Quantity to be ordered</TableCellHead>
          </TableRowHead>
        </TableHead>
        <TableBody>
          {Object.entries(mergedData).map(([k, v]) => {
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
    );
  }
}
