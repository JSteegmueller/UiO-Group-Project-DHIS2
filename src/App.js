import React from "react";
import classes from "./App.module.css";
import { useState } from "react";

import { Navigation } from "./Navigation";
import { Restock } from "./restock/Restock";

function MyApp() {
  const [activePage, setActivePage] = useState("Restock");

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
        {activePage === "Restock" && <Restock />}
        {activePage === "Browse"}
      </div>
    </div>
  );
}

export default MyApp;