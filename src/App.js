import React from "react";
import classes from "./App.module.css";
import { useState } from "react";

import { Navigation } from "./Navigation";
import  RequestCommodities  from "./requestCommodities/RequestCommodities";

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
        {activePage === "Browse"}
        {activePage === "Insert"}
        {activePage === "RequestCommodities" && <RequestCommodities />}
      </div>
    </div>
  );
}

export default MyApp;