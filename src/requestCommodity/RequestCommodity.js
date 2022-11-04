import React, { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import RequestCommodityTable from "./RequestCommodityTable";
import RequestCommoditySearchbar from "./RequestCommoditySearchbar";

import {
  TableHead,
  DataTableRow,
  CircularLoader,
  DataTableColumnHeader,
  DataTable,
} from "@dhis2/ui";

const orgUnitId = "Tht0fnjagHi";

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

function RequestCommodity(/*requestedCommodityId, requestedCommodityName*/) {
  const { loading, error, data } = useDataQuery(organisationUnits);

  // Delete this 2 lines after call was setup
  const requestedCommodityId = "W1XtQhP6BGd";
  const requestedCommodityName = "Commodities - Resuscitation Equipment";
  const [searchQuery, setSearchQuery] = useState(); // Default = No search query

  const [sortResult, setSortResult] = useState({
    sort: "stock",
    sortDirection: true,
  });

  // Setup recall function for searchqueries
  function receiveSearchQuery(newSearchQuery) {
    setSearchQuery(newSearchQuery);
  }

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
    let organisationIds = collectingOrgDataHelper(data).organisationIds;
    let organisationData = collectingOrgDataHelper(data).organisationData;

    return (
      <div>
        <h1>List of available stock in other organisations</h1>
        <h2>{requestedCommodityName}</h2>
        <RequestCommoditySearchbar receiveSearchQuery={receiveSearchQuery} />
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
          <RequestCommodityTable
            requestedCommodityId={requestedCommodityId}
            sortResult={sortResult}
            organisationIds={organisationIds}
            organisationData={organisationData}
          />
        </DataTable>
      </div>
    );
  }
}

export default RequestCommodity;
