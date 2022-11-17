import React, { useEffect, useState } from "react";
import { Button, InputField, NoticeBox } from "@dhis2/ui";
import { useDataQuery } from "@dhis2/app-runtime";
import { getAvailableCommoditiesQuery } from "./api/commodities";
import { getCurrentPeriod, remapCommoditiesForTransactionForm } from "./helper/HelperFunctions";
import { getMeQuery } from "./api/me";
import Transaction, { TransactionType } from "./helper/Transaction";
import { getFromLocal, LocalKeys, saveFormToLocal } from "./helper/LocalStorage";
import Select from "react-select";

function TransactionForm(props) {
    const commoditiesRequest = useDataQuery(getAvailableCommoditiesQuery);
    const meQuery = useDataQuery(getMeQuery);
    const [dispenseTo, setDispenseTo] = useState(getFromLocal(LocalKeys.DispenseTo));
    const [amount, setAmount] = useState(getFromLocal(LocalKeys.Amount));
    const [commodity, setCommodity] = useState(getFromLocal(LocalKeys.Commodity));
    const [commodityList, setCommodityList] = useState([]);

    const [amountValid, setAmountValid] = useState(null);
    const [dispenseToValid, setDispenseToValid] = useState(null);

    useEffect(() => {
        amount > 0 ? setAmountValid(true) : setAmountValid(false);
        dispenseTo && dispenseTo !== "" ? setDispenseToValid(true) : setDispenseToValid(false);
        if (amount === "" || amount === null) setAmountValid(null);
        if (dispenseTo === "" || dispenseTo === null) setDispenseToValid(null);
        saveFormToLocal(amount, dispenseTo, commodity);
    }, [amount, dispenseTo, commodity]);

    useEffect(() => {
        props.commodityChanged(commodity);
    }, [commodity]);

    useEffect(() => {
        if (commoditiesRequest.data?.commodities) {
            setCommodityList(
                remapCommoditiesForTransactionForm(commoditiesRequest.data?.commodities)
            );
        }
    }, [commoditiesRequest.data]);

    const reset = () => {
        setAmount(null);
    };
    const addTransaction = (amountLeft) => {
        let transaction = new Transaction(
            "",
            commodity,
            parseInt(amountLeft ? props.amountLeft : amount),
            meQuery.data?.me?.name,
            dispenseTo,
            TransactionType.dispense
        );
        props.addTransaction(transaction);
    };

    const openRequestCommodity = () => {
        props.requestHandler("RequestCommodity", {
            value: commodity.id,
            label: commodity.name,
            period: getCurrentPeriod(),
            commoditiesValueSet: commodityList,
            sendBy: "Dispensing",
        });
    };

    return (
        <div>
            <label>Commodity</label>
            <Select
                options={commodityList}
                searchable
                value={commodityList.find((c) => c.value === commodity?.id)}
                onChange={({ label, value }) => {
                    setCommodity({ name: label, id: value });
                }}
            />
            <InputField
                label={
                    "Amount " + (props.amountLeft != null ? `/ In stock: ${props.amountLeft}` : "")
                }
                type="number"
                placeholder="The amount you want to dispense"
                value={amount}
                onChange={({ value }) => {
                    setAmount(value);
                }}
                valid={amountValid && amount <= props.amountLeft}
                error={amountValid === false || amount > props.amountLeft}
            />
            <InputField
                label="Dispense To"
                type="text"
                placeholder="Name of whom you dispensed the commodity"
                disabled={props.transactionCount > 0}
                value={dispenseTo}
                onChange={({ value }) => setDispenseTo(value)}
                valid={dispenseToValid}
                error={dispenseToValid === false}
            />
            <br />
            <Button
                type="button"
                primary
                disabled={
                    !amountValid ||
                    commodity === null ||
                    !dispenseToValid ||
                    props.amountLeft < amount
                }
                onClick={() => {
                    addTransaction(false);
                }}
            >
                Add to Transaction
            </Button>
            {props.amountLeft != null && (props.amountLeft < amount || props.amountLeft <= 0) && (
                <NoticeBox className={"infobox-dispense"}>
                    Not enough stock for {commodity?.name}!
                    <br />
                    <Button type="button" primary small onClick={openRequestCommodity}>
                        Request Commodities
                    </Button>
                    <Button
                        type="submit"
                        secondary
                        small
                        disabled={
                            !amountValid ||
                            commodity === null ||
                            !dispenseToValid ||
                            props.amountLeft <= 0
                        }
                        onClick={() => {
                            addTransaction(true);
                        }}
                    >
                        Add only available stock
                    </Button>
                    <Button
                        type="button"
                        secondary
                        small
                        disabled={props.amountLeft <= 0}
                        onClick={() => {
                            reset();
                        }}
                    >
                        Cancel
                    </Button>
                </NoticeBox>
            )}
        </div>
    );
}

export default TransactionForm;
