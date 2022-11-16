import React, { useState, useRef } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import RequestCommodityTable from "./RequestCommodityTable";
import "./RequestCommodityStyle.css";

import {
  CircularLoader,
  DropdownButton,
  Button,
  FlyoutMenu,
  MenuItem
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
  }
  return { organisationIds, organisationData };
}

// Organize Data from browse
function collectingOrgDataHelperBrowse(data) {
  let dropdownList = [];
  if (data) {
    for (let item of data) {
      dropdownList.push({
        value: item[1].id,
        label: item[0],
      });
    }
  }
  return { dropdownList };
}

function RequestCommodity(props) {
  const commoditiesList =
    props.commodityValue.sendBy === "Browse"
      ? collectingOrgDataHelperBrowse(props.commodityValue.commoditiesValueSet)
          .dropdownList
      : props.commodityValue.commoditiesValueSet;

  const ref = useRef();
  const { loading, error, data } = useDataQuery(organisationUnits);
  const [reqCommodityValue, setReqCommodityValue] = useState({
    value: props.commodityValue.value,
    label: props.commodityValue.label,
  });

  const listItems = commoditiesList.map((commodity, index) => {
    return (
      <MenuItem
        key={index}
        label={commodity.label}
        onClick={() => {
          ref.current.state.open = false;
          setReqCommodityValue({
            value: commodity.value,
            label: commodity.label,
          });
        }}
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
        <Button
          name="BackButton"
          onClick={() =>
            props.activePageHandler(
              props.commodityValue.sendBy === "Browse" ? "Browse" : "Dispensing"
            )
          }
        >
          Back
        </Button>

        <h1>Request Commodity</h1>
        <div className="columns">
          <h3>Commodity: </h3>
          <DropdownButton
            component={<FlyoutMenu>{listItems}</FlyoutMenu>}
            primary
            small
            ref={ref}
          >
            {reqCommodityValue.label}
          </DropdownButton>
        </div>
        <RequestCommodityTable
          requestedCommodityId={reqCommodityValue.value}
          organisationIds={organisationIds}
          organisationData={organisationData}
          period={props.commodityValue.period}
        />
      </div>
    );
  }
}

export default RequestCommodity;
