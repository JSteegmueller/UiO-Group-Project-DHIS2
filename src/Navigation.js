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
                label="Stock"
                active={props.activePage === "Stock"}
                onClick={() => {
                    props.activeMobile();
                    props.activePageHandler("Stock");
                }}
            />
            <MenuItem
                label="Restock"
                active={props.activePage == "Restock"}
                onClick={() => {
                    props.activeMobile();
                    props.activePageHandler("Restock");
                }}
            />
            <MenuItem
                label="Recount"
                active={props.activePage === "Recount"}
                onClick={() => {                    
                    props.activeMobile();
                    props.activePageHandler("Recount")
                    }}
            />
        </Menu>
    );
}

export default Navigation;
