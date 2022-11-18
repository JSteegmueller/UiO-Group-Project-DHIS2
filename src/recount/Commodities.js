import React, { useState } from "react";
import { useDataMutation } from "@dhis2/app-runtime";
import {
    Table,
    TableRow,
    TableCell,
    TableRowHead,
    TableHead,
    TableCellHead,
    TableBody,
    InputField,
    Button,
    SingleSelect,
    SingleSelectOption,
    Modal,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Pagination,
} from "@dhis2/ui";

const date = new Date();
const pDate = new Date(date);
pDate.setDate(0);
const currentPeriod = getPeriod(date);

function getPeriod(date) {
    return date.getFullYear().toString() + ("0" + (date.getMonth() + 1)).slice(-2);
}

const dataMutationQuery = {
    resource: "dataValueSets",
    type: "create",
    dataSet: "ULowA8V3ucd",
    data: ({ value, dataElement }) => ({
        dataValues: [
            {
                dataElement: dataElement,
                period: currentPeriod,
                orgUnit: process.env.REACT_APP_ORGUNIT,
                value: value,
                categoryOptionCombo: "rQLFnNXXIL0",
            },
        ],
    }),
};

const updateTransactionsMutation = {
    resource: "dataStore/IN5320-G3/recounts",
    type: "update",
    data: ({ recount }) => recount,
};

function mergeData(data) {
    return data.dataSets.dataSetElements.map((commodity) => {
        let matchedValue = data.dataValueSets.dataValues.find((dataValues) => {
            if (
                dataValues.dataElement == commodity.dataElement.id &&
                dataValues.categoryOptionCombo === "rQLFnNXXIL0"
            ) {
                return true;
            }
        });
        return {
            displayName: commodity.dataElement.displayName.split(" - ")[1],
            id: commodity.dataElement.id,
            value: matchedValue.value,
        };
    });
}

export function Commodities({ data, refetch, refreshComponent }) {
    let mergedData = mergeData(data);
    let sortedData = mergedData.sort((a, b) => a.displayName.localeCompare(b.displayName));
    const [amount, setAmount] = useState({});
    const [allSelected, setAllSelected] = useState([]);
    const [mutate] = useDataMutation(dataMutationQuery);
    const [mutateRestocks] = useDataMutation(updateTransactionsMutation);
    const [hideModal, setHideModal] = useState(true);
    const [page, setPage] = useState(1);

    const handleConfirmClick = async () => {
        const storage = data.storage;
        const recount = [];

        if (Object.entries(amount).length !== 0) {
            Object.entries(amount).map((commodity) => {
                let match = sortedData.find((v) => v.displayName === commodity[0]);
                recount.push([commodity[0], match.value, commodity[1], date]);

                mutate({
                    value: Number(commodity[1]),
                    dataElement: match.id,
                });
            });
            storage.push(recount);
            await mutateRestocks({ recount: storage });
            refetch();
            refreshComponent();
        }
    };

    const handleSelect = (selected) => {
        let b = true;
        for (let i = 0; i < allSelected.length; i++) if (allSelected[i] === selected) b = false;

        if (b === true) setAllSelected((old) => [...old, selected]);
    };

    const handleDeselect = (commodity) => {
        setAllSelected((current) => current.filter((c) => c !== commodity.displayName));
        let newObject = Object.keys(amount)
            .filter((key) => key != commodity.displayName)
            .reduce((acc, key) => {
                acc[key] = amount[key];
                return acc;
            }, {});

        setAmount(newObject);
    };

    const removeAmount = (commodity) => {
        let newObject = Object.keys(amount)
            .filter((key) => key != commodity.displayName)
            .reduce((acc, key) => {
                acc[key] = amount[key];
                return acc;
            }, {});

        setAmount(newObject);
    };

    const addAll = () => {
        sortedData.map((commodity) => {
            if (!allSelected.includes(commodity.displayName)) {
                setAllSelected((old) => [...old, commodity.displayName]);
            }
        });
    };

    return (
        <div>
            <Modal small hide={hideModal} position="middle">
                <ModalContent>Are you sure you want to proceed?</ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={() => setHideModal(true)} Cancel>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmClick} Confirm primary value="default">
                            Confirm
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>

            <h1>Recount commodities</h1>
            <SingleSelect
                className="select"
                filterable
                filterPlaceholder="Search commodities"
                placeholder="Select commodities to recount"
                noMatchText="No match found"
                onChange={({ selected }) => {
                    handleSelect(selected);
                }}
            >
                {sortedData.map((commodity) => {
                    return (
                        <SingleSelectOption
                            key={commodity.displayName}
                            label={commodity.displayName}
                            value={commodity.displayName}
                        />
                    );
                })}
            </SingleSelect>
            <Table className={"tableStyleRestockRecount"}>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Commodity</TableCellHead>
                        <TableCellHead>Current stock</TableCellHead>
                        <TableCellHead>Counted stock</TableCellHead>
                        <TableCellHead></TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {sortedData.map((commodity) => {
                        if (allSelected.includes(commodity.displayName)) {
                            return (
                                <TableRow key={commodity.id}>
                                    <TableCell>{commodity.displayName}</TableCell>
                                    <TableCell>{commodity.value}</TableCell>
                                    <TableCell>
                                        <InputField
                                            onChange={(v) => {
                                                if (v.value === "") {
                                                    removeAmount(commodity);
                                                } else {
                                                    setAmount((old) => ({
                                                        ...old,
                                                        [commodity.displayName]: v.value,
                                                    }));
                                                }
                                            }}
                                            value={amount[commodity.displayName]}
                                            placeholder="Amount"
                                            type="number"
                                            min="1"
                                            inputWidth="100px"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            icon={
                                                <svg
                                                    height="24"
                                                    viewBox="0 0 320 512"
                                                    width="24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"
                                                        fill="#inherit"
                                                    />
                                                </svg>
                                            }
                                            name="Icon small button"
                                            onClick={() => handleDeselect(commodity)}
                                            destructive
                                            small
                                            value="default"
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        }
                    })}
                </TableBody>
            </Table>
            <div className={"mainButtonRecountRestock"}>
                <Button
                    name="confirm"
                    onClick={() => setHideModal(false)}
                    primary
                    value="default"
                    disabled={
                        allSelected.length === 0 ||
                        allSelected.length !== Object.keys(amount).length
                    }
                >
                    Confirm
                </Button>
                <Button
                    name="addAll"
                    onClick={() => addAll()}
                    primary
                    value="default"
                    disabled={allSelected.length === data.dataSets.dataSetElements.length}
                >
                    Select all
                </Button>
            </div>
            <h3>
                Last recounted commodities{" "}
                {new Date(data.storage[data.storage.length - page][0][3]).toLocaleDateString(
                    "en-GB"
                )}{" "}
                -{" "}
                {new Date(data.storage[data.storage.length - page][0][3]).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </h3>
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Commodity</TableCellHead>
                        <TableCellHead>Previous stock</TableCellHead>
                        <TableCellHead>Updated stock</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {data.storage[data.storage.length - page].map((commodity) => {
                        return (
                            <TableRow key={commodity}>
                                <TableCell>{commodity[0]}</TableCell>
                                <TableCell>{commodity[1]}</TableCell>
                                <TableCell>{commodity[2]}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <br />
            <Pagination
                hidePageSizeSelect
                onPageChange={setPage}
                page={page}
                pageCount={data.storage.length}
                pageSize={1}
                total={data.storage.length}
                pageSummaryText={"Transaction " + page + " of " + data.storage.length}
            />
        </div>
    );
}
