import React, { useState, useRef } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import RequestCommodityTable from "./RequestCommodityTable";
import "./RequestCommodityStyle.css";

import {
  CircularLoader,
  DropdownButton,
  MenuItem,
  FlyoutMenu,
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

function RequestCommodity({ commodityValue }) {
  const ref = useRef();

  const { loading, error, data } = useDataQuery(organisationUnits);
  const [commodityValues, setCommodityValues] = useState([
    commodityValue[0],
    commodityValue[1],
  ]);

  const getCommodity = (values) => {
    ref.current.state.open = false;
    setCommodityValues([values[0], values[1]]);
  };

  const listItems = commodityValue[3].map((value, index) => {
    return (
      <MenuItem
        key={index}
        label={value[0]}
        onClick={() => {getCommodity([value[0], value[1].Id])}}
      />
    );
  });

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
        <div className="columns">
          <h3>Commodity: </h3>
          <DropdownButton
            component={<FlyoutMenu>{listItems}</FlyoutMenu>}
            primary
            small
            ref={ref}
            >
            {commodityValues[0]}
          </DropdownButton>
        </div>
        <RequestCommodityTable
          requestedCommodityId={commodityValues[1]}
          organisationIds={organisationIds}
          organisationData={organisationData}
          period={commodityValue[2]}
        />
      </div>
    );
  }
}

export default RequestCommodity;
