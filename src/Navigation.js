import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";

export function Navigation(props) {
    return (
        <Menu>
            <MenuItem
                label="Dispensing"
                active={props.activePage === "Dispensing"}
                onClick={() => props.activePageHandler("Dispensing")}
            />
            <MenuItem
                label="Browse"
                active={props.activePage == "Browse"}
                onClick={() => props.activePageHandler("Browse")}
            />
            <MenuItem
                // Only for now! This menu point is going to delete late
                label="Request Commodity"
                active={props.activePage == "RequestCommodity"}
                onClick={() => props.activePageHandler("RequestCommodity")}
            />
        </Menu>
    );
}
