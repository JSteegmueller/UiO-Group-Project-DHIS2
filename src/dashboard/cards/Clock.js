import React, { useState, useEffect } from "react";
import { Center, Switch } from "@dhis2/ui";

function Clock({ settings, saveSettings }) {
    const [date, setDate] = useState(new Date());
    const [timeFormat, setTimeFormat] = useState("default");

    useEffect(() => {
        const timerId = setInterval(() => setDate(new Date()), 1000);
        return function cleanup() {
            clearInterval(timerId);
        };
    }, []);

    function onChange(input) {
        settings.timeFormat = input.checked;
        saveSettings(settings);
        setTimeFormat(input.checked ? "en-GB" : "default");
    }

    return (
        <div>
            <Switch label="24h" checked={settings.timeFormat} onChange={onChange} />
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
