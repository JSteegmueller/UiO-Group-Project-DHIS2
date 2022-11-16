import React, { useState } from "react";
import SearchBar from "./SearchBar";
import { mergeData } from "./helper/mergeData";
import {
    DataTable,
    TableBody,
    DataTableCell,
    DataTableColumnHeader,
    TableHead,
    DataTableRow,
    Button,
} from "@dhis2/ui";

function StockTable({ data, period, requestHandler }) {
    let fullTable = mergeData(data).sort();
    const [tableData, setTableData] = useState(fullTable);
    const [directionCommodity, setDirectionCommodity] = useState("asc");
    const [directionConsumption, setDirectionConsumption] = useState("default");
    const [directionBalance, setDirectionBalance] = useState("default");
    const [sortResult, setSortResult] = useState({
        name: "Commodity",
        direction: true,
    });

    const headers = [
        ["Commodity", directionCommodity, setDirectionCommodity],
        ["Consumption", directionConsumption, setDirectionConsumption],
        ["End Balance", directionBalance, setDirectionBalance],
    ];

    function sortHandler(event) {
        const direction = sortResult.name === event.name ? !sortResult.direction : true;
        const header = headers.find((header) => header[0] === event.name);
        headers.map((header) => header[2]("default"));
        header[2](direction ? "asc" : "desc");
        setSortResult({
            name: event.name,
            direction: direction,
        });
        if (event.name === "Commodity") fullTable.sort();
        if (event.name === "Consumption")
            fullTable.sort((a, b) => {
                return b[1]["Consumption"] - a[1]["Consumption"];
            });
        if (event.name === "End Balance")
            fullTable.sort((a, b) => {
                return b[1]["Balance"] - a[1]["Balance"];
            });
        if (!direction) fullTable.reverse();
        setTableData(fullTable);
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
                        <DataTableColumnHeader fixed top="0">
                            Check stock from other organizations
                        </DataTableColumnHeader>
                    </DataTableRow>
                </TableHead>
                <TableBody>
                    {tableData.map(([k, v]) => {
                        return (
                            <DataTableRow key={k}>
                                <DataTableCell>{k}</DataTableCell>
                                <DataTableCell>{v["Consumption"]}</DataTableCell>
                                <DataTableCell>{v["Balance"]}</DataTableCell>
                                <DataTableCell>
                                    <Button
                                        primary={v["Balance"] > 0}
                                        destructive={v["Balance"] == 0}
                                        small
                                        onClick={() =>
                                            requestHandler("RequestCommodity", {
                                                value: v.id,
                                                label: k,
                                                period: period,
                                                commoditiesValueSet: fullTable,
                                                sendBy: "Browse",
                                            })
                                        }
                                    >
                                        {String.fromCharCode(10132)}
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

export default StockTable;
