import React, { useState } from "react";
import classes from "./App.module.css";
import Navigation from "./Navigation";
import Browse from "./browse/Browse";
import Dashboard from "./dashboard/Dashboard";
import Restock from "./restock/Restock";
import Dispensing from "./dispensing/Dispensing";
import { Recount } from "./recount/Recount";
import RequestCommodity from "./requestCommodity/RequestCommodity";
import { IconApps24 } from "@dhis2/ui";
import "./AppStyle.css";

function MyApp() {
    const [activePage, setActivePage] = useState("Dashboard");
    const [activeMobile, setActiveMobile] = useState(false);
    const [commodityValue, setCommodityValue] = useState([]);

    const mobileMenu = () => {
        setActiveMobile(activeMobile ? false : true);
    };

    function activePageHandler(page) {
        setActivePage(page);
    }

    function requestHandler(page, value) {
        setActivePage(page);
        setCommodityValue(value);
    }

    return (
        <div className={`${classes.container} ${activeMobile ? "showMenu" : ""}`}>
            <div className={`mobileMenu`} onClick={mobileMenu}>
                <IconApps24 color="rgb(44, 102, 147)" />
            </div>
            <div className={`leftAppContainer ${classes.left}`} onClick={mobileMenu}>
                <Navigation
                    activePage={activePage}
                    activePageHandler={activePageHandler}
                    activeMobile={mobileMenu}
                />
            </div>
            <div className={classes.right}>
                {activePage === "Dashboard" && (
                    <Dashboard
                        activePageHandler={activePageHandler}
                        requestHandler={requestHandler}
                    />
                )}
                {activePage === "Dispensing" && <Dispensing requestHandler={requestHandler} />}
                {activePage === "Browse" && <Browse requestHandler={requestHandler} />}
                {activePage === "Restock" && <Restock />}
                {activePage === "RequestCommodity" && (
                    <RequestCommodity
                        commodityValue={commodityValue}
                        activePageHandler={activePageHandler}
                    />
                )}
                {activePage === "Recount" && <Recount />}
            </div>
        </div>
    );
}

export default MyApp;
