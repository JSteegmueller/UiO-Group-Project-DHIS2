import React from "react";
import "./DashboardStyle.css";
import User from "./cards/User";
import Clock from "./cards/Clock";
import Stock from "./cards/Stock";
import History from "./cards/History";
import Restock from "./cards/Restock";
import Recount from "./cards/Recount";
import CardSelect from "./CardSelect";
import { requestSettings, mutateSettings } from "./helper/requests";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import {
  CircularLoader,
  Box,
  Card,
  Button,
  IconChevronRight24,
} from "@dhis2/ui";

function Dashboard({ activePageHandler, requestHandler }) {
  const { loading, error, data } = useDataQuery(requestSettings);
  const [saveSettings] = useDataMutation(mutateSettings);
  const components = { User, Clock, Stock, History, Restock, Recount };
  const redirect = {
    Stock: "Stock",
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
        <div className="dashboard-selection-outer">
          <h1 className="dashboard-outer-h1">Dashboard</h1>
          <div className="dashboard-select">
            <p className="dashboard-select-description">Panel selection: </p>
            <CardSelect settings={settings} saveSettings={saveSettings} />
          </div>
        </div>
        <div className="dashboard">
          {cards.map((card) => {
            const Component = components[card];
            if (settings.activeCards[card]) {
              return (
                <Box key={card} className="card-box">
                  <Card className="card-box-inner">
                    <div className="headline-section">
                      <h3>{card}</h3>
                      {redirect[card] && (
                        <Button
                          primary
                          onClick={() => activePageHandler(redirect[card])}
                        >
                          {<IconChevronRight24 />}
                        </Button>
                      )}
                    </div>

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
