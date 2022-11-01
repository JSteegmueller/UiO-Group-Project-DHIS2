import React, { useState } from "react";
import {
    Button,
    InputField,
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

function StockTable({ data }) {
    const fullTable = mergeData(data);
    const [tableData, setTableData] = useState(fullTable);
    const [inputText, setInputText] = useState("");
    function enterKeyHandler(e) {
        if (e.key === "Enter") searchHandler();
    }
    function deleteHandler() {
        setInputText("");
        setTableData(fullTable);
    }
    function searchHandler() {
        setTableData(
            Object.fromEntries(
                Object.entries(fullTable).filter(([k, _]) =>
                    k.toLowerCase().includes(inputText.toLowerCase())
                )
            )
        );
    }
    function tempHandler() {
        console.log("Pressed TEMP button");
    }
    return (
        <div onKeyUp={enterKeyHandler}>
            <InputField
                name="searchInput"
                placeholder="Search commodities"
                value={inputText}
                onChange={(input) => setInputText(input.value)}
            />
            <Button primary small onClick={searchHandler}>
                Search
            </Button>
            <Button destructive small onClick={deleteHandler}>
                Delete
            </Button>
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
                                    <Button primary small onClick={tempHandler}>
                                        temp
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

export default StockTable;
