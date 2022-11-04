import React, { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import RequestCommodityTable from "./RequestCommodityTable";
import { CircularLoader } from "@dhis2/ui";

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
    const { loading, error, data } = useDataQuery(organisationUnits);

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
                <h2>{commodityValue[0]}</h2>
                <RequestCommodityTable
                    requestedCommodityId={commodityValue[1]}
                    organisationIds={organisationIds}
                    organisationData={organisationData}
                    period={commodityValue[2]}
                />
            </div>
        );
    }
}

export default RequestCommodity;
