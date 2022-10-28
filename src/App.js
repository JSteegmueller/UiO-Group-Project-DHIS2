import React, { useState } from "react";
import classes from "./App.module.css";
import { Browse } from "./browse/Browse";
import { Navigation } from "./Navigation";
import Dispensing from "./dispensing/Dispensing";

function MyApp() {
    const [activePage, setActivePage] = useState("Dispensing");

    function activePageHandler(page) {
        setActivePage(page);
    }

    return (
        <div className={classes.container}>
            <div className={classes.left}>
                <Navigation
                    activePage={activePage}
                    activePageHandler={activePageHandler}
                />
            </div>
            <div className={classes.right}>
                {activePage === "Dispensing" && <Dispensing />}
                {activePage === "Browse" && <Browse />}
            </div>
        </div>
    );
}

export default MyApp;
