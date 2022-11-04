import { useDataQuery } from "@dhis2/app-runtime";
import {
  TableCell,
  TableRow,
} from "@dhis2/ui";

const commodityId = "W1XtQhP6BGd";
const period = 202110;
const co = "KPP63zJPkOu";

const dataQuery = {
  valueOfStock: {
    resource: "dataValues",
    params: ({orgId}) => ({
      de: commodityId,
      pe: period,
      ou: orgId,
      co: co,
    }),
  },
};

function FetchStockValuesOrg({ orgData, index }) {
  const { loading, error, data } = useDataQuery(dataQuery, {
    variables: {
      orgId: orgData.id,
    },
  });

  if (error) {
    return (
      <TableRow key={index}>
        <TableCell>Error</TableCell>
      </TableRow>
    );
  }

  if (loading) {
    return (
      <TableRow key={index}>
        <TableCell>"loading..."</TableCell>
      </TableRow>
    );
  }

  if (data) {
    return (
      <TableRow key={index}>
        <TableCell>{orgData.name}</TableCell>
        <TableCell>{data.valueOfStock}</TableCell>
      </TableRow>
    );
  }
}

export default FetchStockValuesOrg;
