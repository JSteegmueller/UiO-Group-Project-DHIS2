import React, { useState } from "react";
import classes from "./App.module.css";
import Navigation from "./Navigation";
import Browse from "./browse/Browse";
import Dashboard from "./dashboard/Dashboard";
import Dispensing from "./dispensing/Dispensing";
import { Recount } from "./recount/Recount";
import RequestCommodity from "./requestCommodity/RequestCommodity";
import TransactionTable from "./transactionHistory/TransactionTable";

function MyApp() {
    const [activePage, setActivePage] = useState("Dashboard");
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
                {activePage === "Dashboard" && <Dashboard />}
                {activePage === "Dispensing" && <Dispensing requestHandler={requestHandler} />}
                {activePage === "History" && <TransactionTable />}
                {activePage === "Browse" && <Browse requestHandler={requestHandler} />}
                {activePage === "RequestCommodity" && (
                    <RequestCommodity commodityValue={commodityValue} activePageHandler={activePageHandler}/>
                )}
                {activePage === "Recount" && <Recount />}
            </div>
        </div>
    );
}

export default MyApp;
