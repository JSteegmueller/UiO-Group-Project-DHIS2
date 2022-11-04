import React, { useState } from "react";
import classes from "./App.module.css";
import { Browse } from "./browse/Browse";
import { Navigation } from "./Navigation";
import Dispensing from "./dispensing/Dispensing";
import RequestCommodity from "./requestCommodity/RequestCommodity";

function MyApp() {
    const [activePage, setActivePage] = useState("Dispensing");
    const [commodityValue, setCommodityValue] = useState([]);

    function activePageHandler(page) {
        setActivePage(page);
    }

    function requestHandler(page, value) {
        setActivePage(page);
        setCommodityValue(value);
    }

    return (
        <div className={classes.container}>
            <div className={classes.left}>
                <Navigation activePage={activePage} activePageHandler={activePageHandler} />
            </div>
            <div className={classes.right}>
                {activePage === "Dispensing" && <Dispensing />}
                {activePage === "Browse" && <Browse requestHandler={requestHandler} />}
                {activePage === "RequestCommodity" && (
                    <RequestCommodity commodityValue={commodityValue} />
                )}
            </div>
        </div>
    );
}

export default MyApp;
