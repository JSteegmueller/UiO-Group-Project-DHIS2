import React from "react";
import { requestUser } from "../Requests";
import { useDataQuery } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";

function User({ settings }) {
  const { loading, error, data } = useDataQuery(requestUser);
  const timeFormat = settings.timeFormat ? "en-GB" : "default";

  if (error) return <span>ERROR: {error.message}</span>;

  if (loading) return <CircularLoader large />;

  if (data) {
    const date = new Date(data.user.userCredentials.lastLogin);
    return (
      <div>
        <p>Organization: {data.organization.displayName}</p>
        <p>Name: {data.user.name}</p>
        <p>Introduction: {data.user.introduction}</p>
        <p>Nationality: {data.user.nationality}</p>
        <p>Employer: {data.user.employer}</p>
        <p>Email: {data.user.email}</p>
        <p>
          Last login:{" "}
          {date.toLocaleDateString("en-GB") +
            " - " +
            date.toLocaleTimeString(timeFormat, {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </p>
      </div>
    );
  }
}
export default User;
