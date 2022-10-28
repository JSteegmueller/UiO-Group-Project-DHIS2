import React, {useState} from "react";
import classes from "./App.module.css";

import {Navigation} from "./Navigation";
import Dispensing from "./dispensing/Dispensing";

function MyApp() {
    const [activePage, setActivePage] = useState("Browse");

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
                {activePage === "Dispensing" && <Dispensing/>}
                {activePage === "Browse"}
            </div>
        </div>
    );
}

export default MyApp;