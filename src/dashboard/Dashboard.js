import React from "react";
import "./Dashboard.css";
import User from "./cards/User";
import Clock from "./cards/Clock";
import Stock from "./cards/Stock";
import History from "./cards/History";
import Restock from "./cards/Restock";
import Recount from "./cards/Recount";
import CardSelect from "./CardSelect";
import { requestSettings, mutateSettings } from "./Requests";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import { CircularLoader, Box, Card, Button } from "@dhis2/ui";

function Dashboard({ activePageHandler, requestHandler }) {
    const { loading, error, data } = useDataQuery(requestSettings);
    const [saveSettings] = useDataMutation(mutateSettings);
    const components = { User, Clock, Stock, History, Restock, Recount };
    const redirect = {
        Stock: "Browse",
        History: "Dispensing",
        Restock: "Restock",
        Recount: "Recount",
    };

    if (error) return <span>ERROR: {error.message}</span>;

    if (loading) return <CircularLoader large />;

    if (data) {
        const settings = data.userSettings;
        const cards = settings.cardOrder;
        return (
            <div>
                <h1>Dashboard</h1>
                <div className="dashboard-select">
                    <CardSelect settings={settings} saveSettings={saveSettings} />
                </div>
                <div className="dashboard">
                    {cards.map((card) => {
                        const Component = components[card];
                        if (settings.activeCards[card]) {
                            return (
                                <Box key={card} className="card-box">
                                    <Card>
                                        <h3>{card}</h3>
                                        {redirect[card] && (
                                            <Button
                                                primary
                                                onClick={() => activePageHandler(redirect[card])}
                                            >
                                                {"->"}
                                            </Button>
                                        )}
                                        <Component
                                            settings={settings}
                                            saveSettings={saveSettings}
                                            requestHandler={requestHandler}
                                        />
                                    </Card>
                                </Box>
                            );
                        }
                    })}
                </div>
            </div>
        );
    }
}

export default Dashboard;
