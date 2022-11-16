import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";

function Navigation(props) {
  return (
    <Menu className="menu" display="none">
      <MenuItem
        label="Dashboard"
        active={props.activePage === "Dashboard"}
        onClick={() => {
          props.activeMobile();
          props.activePageHandler("Dashboard");
        }}
      />
      <MenuItem
        label="Dispensing"
        active={props.activePage === "Dispensing"}
        onClick={() => {
          props.activeMobile();
          props.activePageHandler("Dispensing");
        }}
      />
      <MenuItem
        label="History"
        active={props.activePage === "History"}
        onClick={() => {
          props.activeMobile();
          props.activePageHandler("History");
        }}
      />
      <MenuItem
        label="Browse"
        active={props.activePage === "Browse"}
        onClick={() => {
          props.activeMobile();
          props.activePageHandler("Browse");
        }}
      />
    </Menu>
  );
}

export default Navigation;
