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
    AlertBar,
} from "@dhis2/ui";

const date = new Date();
const pDate = new Date(date);
pDate.setDate(0);
const currentPeriod = getPeriod(date);

function getPeriod(date) {
    return date.getFullYear().toString() + ("0" + (date.getMonth() + 1)).slice(-2)
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
    resource: "dataStore/IN5320-G3/restocks",
    type: "update",
    data: ({ restock }) => restock,
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
    const [hideAlert, setHideAlert] = useState(true);

    const handleConfirmClick = async () => {
        const storage = data.storage;
        const restock = [];

        if(Object.entries(amount).length !== 0) {
            Object.entries(amount).map((commodity) => {
                restock.push([commodity[0], commodity[1], currentPeriod]);
                let match = sortedData.find((v) => v.displayName === commodity[0]);
                mutate({
                    value: Number(match.value) + Number(commodity[1]),
                    dataElement: match.id,
                });
            });
            storage.push(restock);
            setHideAlert(false)
            await mutateRestocks({ restock: storage });
            refetch();
            refreshComponent();
        }
    }

    const handleSelect = (selected) => {
        let b = true        
        for(let i = 0; i < allSelected.length; i++)
            if (allSelected[i] === selected) b = false
        
        if(b === true) 
            setAllSelected((old) => [...old, selected]) 
    }

    const handleDeselect = (commodity) => {
        setAllSelected((current) =>
            current.filter(
                (c) => c !== commodity.displayName
            )
        )
        let newObject = Object.keys(amount)
        .filter(key => key != commodity.displayName)
        .reduce((acc, key) => {
            acc[key] = amount[key];
            return acc;
        }, {});

        setAmount(newObject)
    }

    const removeAmount = (commodity) => {
        let newObject = Object.keys(amount)
        .filter(key => key != commodity.displayName)
        .reduce((acc, key) => {
            acc[key] = amount[key];
            return acc;
        }, {});   

        setAmount(newObject)
    }

    return (
        <div>
            <Modal 
                small
                hide = {hideModal} 
                position="middle"
            >
                <ModalContent>
                    Are you sure you want to proceed?
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={() => setHideModal(true)} Cancel>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleConfirmClick} Confirm
                                primary value="default">
                            Confirm
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>

            <h1>Restock commodities</h1>
            <SingleSelect
                className="select"
                filterable
                filterPlaceholder="Search commodities"
                placeholder="Select commodities to restock"
                noMatchText="No match found"
                onChange={({selected}) => {
                    handleSelect(selected)}
                }
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
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Commodity</TableCellHead>
                        <TableCellHead>Current stock</TableCellHead>
                        <TableCellHead>Restock amount</TableCellHead>
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
                                                if (v.value === '') {
                                                    removeAmount(commodity)
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
            <Button 
                name="confirm" 
                onClick={() => setHideModal(false)}
                primary value="default"
                disabled={allSelected.length === 0 || allSelected.length !== Object.keys(amount).length}
            >
                Confirm
            </Button>

            <h3>Last restocked commodities</h3>
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Commodity</TableCellHead>
                        <TableCellHead>Restock amount</TableCellHead>
                        <TableCellHead>Updated stock</TableCellHead>
                        <TableCellHead>Date</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {                        
                        data.storage[data.storage.length-1].map((commodity) => {
                            let match = sortedData.find((v) => v.displayName === commodity[0]);
                            return (
                                <TableRow key={commodity}>
                                    <TableCell>{commodity[0]}</TableCell>
                                    <TableCell>{commodity[1]}</TableCell>
                                    <TableCell>{match.value}</TableCell>
                                    <TableCell>{commodity[2].slice(4) + "/" + commodity[2].slice(0,4)}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>

            <AlertBar 
                success
                hidden = {hideAlert}
                duration = {8000}
            >
                Successfully restocked commodities.
            </AlertBar>
        </div>
    );
}