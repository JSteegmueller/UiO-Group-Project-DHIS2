import React, { useState } from "react";
import { SearchBar } from "./SearchBar";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
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

    return merged.reduce(function (r, a) {
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
}

export function StockTable({ data }) {
    const fullTable = mergeData(data);
    const [tableData, setTableData] = useState(fullTable);
    function handler() {
        console.log("Pressed the REQUEST COMMODITY button");
    }
    return (
        <div>
            <SearchBar fullTable={fullTable} setTableData={setTableData} />
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Commodity</TableCellHead>
                        <TableCellHead>Consumption</TableCellHead>
                        <TableCellHead>End balance</TableCellHead>
                        <TableCellHead>Quantity to be ordered</TableCellHead>
                        <TableCellHead></TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {Object.entries(tableData).map(([k, v]) => {
                        return (
                            <TableRow key={k}>
                                <TableCell>{k}</TableCell>
                                <TableCell>{v["Consumption"]}</TableCell>
                                <TableCell>{v["Balance"]}</TableCell>
                                <TableCell>{v["Order"]}</TableCell>
                                <TableCell>
                                    <Button primary small onClick={handler}>
                                        Request commodity
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
