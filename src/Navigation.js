import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";

export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        label="Restock"
        active={props.activePage == "Restock"}
        onClick={() => props.activePageHandler("Restock")}
      />
      <MenuItem
        label="Browse"
        active={props.activePage == "Browse"}
        onClick={() => props.activePageHandler("Browse")}
      />
    </Menu>
  );
}