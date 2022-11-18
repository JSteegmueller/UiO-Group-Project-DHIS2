import React, { useState, useEffect } from "react";
import { Center, Switch } from "@dhis2/ui";
import "../DashboardStyle.css";

function Clock({ settings }) {
    const [date, setDate] = useState(new Date());
    const timeFormat = settings.timeFormat ? "en-GB" : "default";

    useEffect(() => {
        const timerId = setInterval(() => setDate(new Date()), 1000);
        return function cleanup() {
            clearInterval(timerId);
        };
    }, []);

    return (
        <div className="card-clock">
            <Center>
                <h1>
                    {date.toLocaleTimeString(timeFormat, {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </h1>
                <h4>{date.toLocaleString([], { weekday: "long" })}</h4>
                <h4>{date.toLocaleDateString("en-GB")}</h4>
            </Center>
        </div>
    );
}

export default Clock;
