import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";

function Navigation(props) {
    return (
        <Menu>
            <MenuItem
                label="Dashboard"
                active={props.activePage === "Dashboard"}
                onClick={() => props.activePageHandler("Dashboard")}
            />
            <MenuItem
                label="Dispensing"
                active={props.activePage === "Dispensing"}
                onClick={() => props.activePageHandler("Dispensing")}
            />
            <MenuItem
                label="History"
                active={props.activePage === "History"}
                onClick={() => props.activePageHandler("History")}
            />
            <MenuItem
                label="Browse"
                active={props.activePage === "Browse"}
                onClick={() => props.activePageHandler("Browse")}
            />
        </Menu>
    );
}

export default Navigation;
