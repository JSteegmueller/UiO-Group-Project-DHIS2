import React, { useState } from "react";
import { request } from "./helper/requests";
import { mergeData } from "../browse/helper/mergeData";
import { useDataQuery } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";

function Dashboard() {
    const { loading, error, data, refetch } = useDataQuery(request);
    if (error) {
        return <span>ERROR: {error.message}</span>;
    }

    if (loading) {
        return <CircularLoader large />;
    }
    if (data) {
        const merged = mergeData(data);
        console.log(merged);
        return <p>Dashboard</p>;
    }
}

export default Dashboard;
