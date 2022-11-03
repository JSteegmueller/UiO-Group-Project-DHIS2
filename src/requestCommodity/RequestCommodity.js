import React, { useState } from "react";
import RequestCommodityTable from "./RequestCommodityTable";
import RequestCommoditySearchbar from "./RequestCommoditySearchbar";

import {
  TableHead,
  DataTableRow,
  DataTableColumnHeader,
  DataTable,
} from "@dhis2/ui";

function RequestCommodity(/*requestedCommodityId, requestedCommodityName*/) {
  
  // Delete this 2 lines after call was setup
  const requestedCommodityId = "W1XtQhP6BGd";
  const requestedCommodityName = "Commodities - Resuscitation Equipment";
  const [searchQuery, setSearchQuery] = useState(); // Default = No search query

  const [sortResult, setSortResult] = useState({ sort: "stock", sortDirection: true });

  // Setup recall function for searchqueries
  function receiveSearchQuery(newSearchQuery) {
    setSearchQuery(newSearchQuery);
  }

  // Sort table on click according to ASC or DESC
  function onClickSorting(event) {
    if (sortResult.sort === event.name) {
      setSortResult({ sort: event.name, sortDirection: !sortResult.sortDirection });
    } else if (sortResult.sort !== event.name) {
      if (sortResult.sortDirection) {
        setSortResult({ sort: event.name, sortDirection: !sortResult.sortDirection });
      } else if (!sortResult.sortDirection) {
        setSortResult({ sort: event.name, sortDirection: sortResult.sortDirection });
      }
    }
  }

  return (
    <div>
      <h1>List of available stock in other organisations</h1>
      <h2>{requestedCommodityName}</h2>
      <RequestCommoditySearchbar receiveSearchQuery={receiveSearchQuery} />
      <DataTable>
        <TableHead>
          <DataTableRow>
            <DataTableColumnHeader name="organisation" onSortIconClick={onClickSorting} sortDirection="default" sortIconTitle="Sort by organisation">
                Organisation
            </DataTableColumnHeader>
            <DataTableColumnHeader name="stock" onSortIconClick={onClickSorting} sortDirection="default" sortIconTitle="Sort by stock">
              Amount of avialable stock
            </DataTableColumnHeader>
          </DataTableRow>
        </TableHead>
        <RequestCommodityTable requestedCommodityId={requestedCommodityId} sortResult={sortResult} />
      </DataTable>
    </div>
  );
}

export default RequestCommodity;
