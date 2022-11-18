import React from "react";
import { requestStock, period } from "../helper/requests";
import { mergeData } from "../helper/mergeData";
import { useDataQuery } from "@dhis2/app-runtime";
import {
    DataTable,
    TableBody,
    DataTableCell,
    DataTableColumnHeader,
    TableHead,
    DataTableRow,
    Button,
    CircularLoader,
    Input,
} from "@dhis2/ui";

function Stock({ settings, saveSettings, requestHandler }) {
    const { loading, error, data } = useDataQuery(requestStock);

    function onChange(input) {
        settings.lowAmount = parseInt(input.value);
        saveSettings(settings);
    }

    if (error) return <span>ERROR: {error.message}</span>;

    if (loading) return <CircularLoader large />;

    if (data) {
        const fullTable = mergeData(data).sort();
        const commodities = fullTable
            .filter(([_, v]) => v["Balance"] <= settings.lowAmount)
            .sort((a, b) => {
                return a[1]["Balance"] - b[1]["Balance"];
            });
        return (
            <div>
                <div className="card-settings">
                    <p>Stock lower than: </p>
                    <Input
                        className="stock-lowamount"
                        min="0"
                        step="5"
                        type="number"
                        name="lowAmount"
                        value={settings.lowAmount.toString()}
                        onChange={onChange}
                    />
                </div>
                <div className="overflow-scroll-table">
                <DataTable scrollHeight="260px">
                    <TableHead>
                        <DataTableRow>
                            <DataTableColumnHeader fixed top="0">
                                Commodity
                            </DataTableColumnHeader>
                            <DataTableColumnHeader fixed top="0">
                                Stock
                            </DataTableColumnHeader>
                            <DataTableColumnHeader fixed top="0">
                                Request
                            </DataTableColumnHeader>
                        </DataTableRow>
                    </TableHead>
                    <TableBody>
                        {commodities.map(([k, v]) => {
                            return (
                                <DataTableRow key={k}>
                                    <DataTableCell>{k}</DataTableCell>
                                    <DataTableCell>{v["Balance"]}</DataTableCell>
                                    <DataTableCell>
                                        <Button
                                            destructive
                                            small
                                            onClick={() =>
                                                requestHandler("RequestCommodity", {
                                                    value: v.id,
                                                    label: k,
                                                    period: period,
                                                    commoditiesValueSet: fullTable,
                                                    sendBy: "Dashboard",
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
            </div>
        );
    }
}

export default Stock;
