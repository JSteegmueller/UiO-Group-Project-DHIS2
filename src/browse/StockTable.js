import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import {
    DataTable,
    TableBody,
    DataTableCell,
    DataTableColumnHeader,
    TableHead,
    DataTableRow,
    Button,
} from "@dhis2/ui";

function mergeData(data) {
    const categories = {
        J2Qf1jtZuj8: "Consumption",
        rQLFnNXXIL0: "Balance",
        KPP63zJPkOu: "Order",
    };

    const merged = data.commodities.dataSetElements.map((commodity) => {
        const match = data.values.dataValues.find((value) => {
            return commodity.dataElement.id == value.dataElement;
        });
        if (match) {
            return {
                name: commodity.dataElement.name.split(" - ")[1],
                id: commodity.dataElement.id,
                value: match.value,
                category: categories[match.categoryOptionCombo],
            };
        } else {
            return {
                name: commodity.dataElement.name.split(" - ")[1],
                id: commodity.dataElement.id,
            };
        }
    });

    const object = merged.reduce(function (r, a) {
        r[a.name] = r[a.name] || {
            Consumption: 0,
            Balance: 0,
            Order: 0,
        };
        if (a.category) {
            r[a.name][a.category] = a.value;
        }
        return r;
    }, Object.create(null));

    return Object.entries(object);
}

export function StockTable({ data }) {
    let fullTable = mergeData(data).sort();
    const [tableData, setTableData] = useState(fullTable);
    const [directionCommodity, setDirectionCommodity] = useState("default");
    const [directionConsumption, setDirectionConsumption] = useState("default");
    const [directionBalance, setDirectionBalance] = useState("default");
    const [directionOrder, setDirectionOrder] = useState("default");
    const headers = [
        ["Commodity", directionCommodity, setDirectionCommodity],
        ["Consumption", directionConsumption, setDirectionConsumption],
        ["End Balance", directionBalance, setDirectionBalance],
        ["Quantity to be ordered", directionOrder, setDirectionOrder],
    ];

    function sortHandler(e) {
        const column = headers.find((header) => header[0] === e.name);
        headers.map((header) => header[2]("default"));
        column[2](e.direction);

        if (e.name === "Consumption")
            fullTable.sort((a, b) => {
                return a[1]["Consumption"] - b[1]["Consumption"];
            });
        if (e.name === "End Balance")
            fullTable.sort((a, b) => {
                return a[1]["Balance"] - b[1]["Balance"];
            });
        if (e.name === "Quantity to be ordered")
            fullTable.sort((a, b) => {
                return a[1]["Order"] - b[1]["Order"];
            });
        if (e.name === "Commodity") fullTable.sort();
        if (e.direction === "desc") fullTable.reverse();
        if (e.direction === "default") fullTable.sort();
        setTableData(fullTable);
    }

    function requestHandler() {
        console.log("Pressed the REQUEST COMMODITY button");
    }

    return (
        <div>
            <SearchBar fullTable={fullTable} setTableData={setTableData} />
            <DataTable>
                <TableHead>
                    <DataTableRow>
                        {headers.map((header) => {
                            return (
                                <DataTableColumnHeader
                                    fixed
                                    top="0"
                                    key={header[0]}
                                    name={header[0]}
                                    sortDirection={header[1]}
                                    onSortIconClick={sortHandler}
                                >
                                    {header[0]}
                                </DataTableColumnHeader>
                            );
                        })}
                        <DataTableColumnHeader fixed top="0"></DataTableColumnHeader>
                    </DataTableRow>
                </TableHead>
                <TableBody>
                    {tableData.map(([k, v]) => {
                        return (
                            <DataTableRow key={k}>
                                <DataTableCell>{k}</DataTableCell>
                                <DataTableCell>{v["Consumption"]}</DataTableCell>
                                <DataTableCell>{v["Balance"]}</DataTableCell>
                                <DataTableCell>{v["Order"]}</DataTableCell>
                                <DataTableCell>
                                    <Button primary small onClick={requestHandler}>
                                        Request commodity
                                    </Button>
                                </DataTableCell>
                            </DataTableRow>
                        );
                    })}
                </TableBody>
            </DataTable>
        </div>
    );
}
