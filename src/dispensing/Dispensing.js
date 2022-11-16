import React, { useEffect, useState } from "react";
import TransactionForm from "./TransactionForm";
import { useDataMutation, useDataQuery } from "@dhis2/app-runtime";
import {
    createTransactionKeyMutation,
    getTransactionsQuery,
    updateTransactionsMutation,
} from "./api/transactions";
import {
    getConsumptionQuery,
    getEndBalanceQuery,
    setConsumptionMutation,
    setEndBalanceMutation,
} from "./api/dataValues";
import {getCurrentPeriod} from "./helper/HelperFunctions";
import PendingTransactionTable from "./PendingTransactionTable";
import {readTransactionsFromLocal, writeTransactionsToLocal} from "./helper/LocalStorage";
import {TransactionStatus} from "./helper/Transaction";
import TransactionTable from "./TransactionTable";
import {Button} from "@dhis2/ui";

function Dispensing({ requestHandler }) {
    const onConsumptionQueryError = (error) => {
        let { httpStatusCode } = error.details;
        if (httpStatusCode !== 409) {
            let message = `Error fetching consumption for commodity ${selectedCommodity.name} in period ${currentPeriod}`;
            alert(message);
            setSubmitDisabled(true);
        }
        setCommodityConsumption(0);
    };
    const onConsumptionQuerySuccess = (data) => {
        setCommodityConsumption(parseInt(data.consumption));
    };

    const onBalanceQueryError = (error) => {
        let { httpStatusCode } = error.details;
        if (httpStatusCode === 409) {
            let message = `No stock data for commodity ${selectedCommodity.name} in period ${currentPeriod}!`;
            alert(message);
        } else {
            let message = `Error fetching end balance for commodity ${selectedCommodity.name} in period ${currentPeriod}`;
            alert(message);
        }
        setSubmitDisabled(true);
    };
    const onBalanceQuerySuccess = (data) => {
        setCommodityEndBalance(parseInt(data.endBalance));
    };

    const transactionQuery = useDataQuery(getTransactionsQuery);
    const endBalanceQuery = useDataQuery(getEndBalanceQuery, {
        onComplete: onBalanceQuerySuccess,
        onError: onBalanceQueryError,
        lazy: true,
    });
    const consumptionQuery = useDataQuery(getConsumptionQuery, {
        onComplete: onConsumptionQuerySuccess,
        onError: onConsumptionQueryError,
        lazy: true,
    });

    const [createTransactionKey, {}] = useDataMutation(createTransactionKeyMutation);
    const [updateTransactions, {}] = useDataMutation(updateTransactionsMutation);
    const [setEndBalance, {}] = useDataMutation(setEndBalanceMutation);
    const [setConsumption, {}] = useDataMutation(setConsumptionMutation);

    const [commodityEndBalance, setCommodityEndBalance] = useState(null);
    const [commodityConsumption, setCommodityConsumption] = useState(null);
    const [selectedCommodity, setSelectedCommodity] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [pendingTransactions, setPendingTransactions] = useState(readTransactionsFromLocal());
    const currentPeriod = getCurrentPeriod();

    useEffect(() => {
        if (!selectedCommodity) return;
        endBalanceQuery.refetch({
            commodity: selectedCommodity.id,
            period: currentPeriod,
        });
        consumptionQuery.refetch({
            commodity: selectedCommodity.id,
            period: currentPeriod,
        });
        setSubmitDisabled(false);
    }, [selectedCommodity]);

    const submitTransaction = async (transaction) => {
        try {
            await submitToDataValueSet(transaction);
            await submitToDataStore(transaction);
        } catch (e) {
            setSubmitDisabled(false);
            throw e;
        }
    };

    const addTransactionToPending = (transaction) => {
        const pending = Array.from(pendingTransactions);
        const existingTransactionIndex = pending.findIndex(
            (t) => t.commodity.id === transaction.commodity.id
        );
        if (existingTransactionIndex > -1) {
            pending[existingTransactionIndex] = transaction;
        } else {
            pending.push(transaction);
        }
        writeTransactionsToLocal(pending);
        setPendingTransactions(pending);
    };

    const removeTransactionFromPending = (index) => {
        const pending = Array.from(pendingTransactions);
        pending.splice(index, 1);
        writeTransactionsToLocal(pending);
        setPendingTransactions(pending);
    };

    const checkAvailability = (transaction) => {
        let endBalance = transaction.endBalance;
        endBalance -= transaction.amount;
        if (endBalance < 0) {
            let message = `Not enough stock for ${transaction.commodity.name} in period ${currentPeriod}!`;
            throw new Error(message);
        }
    };

    const submitTransactions = async () => {
        setSubmitDisabled(true);
        let date = Date.now();
        for (const transaction of pendingTransactions) {
            transaction.date = date;
            transaction.status = TransactionStatus.submitting;
            await submitTransaction(transaction);
            transaction.status = TransactionStatus.submitted;
        }
        setTimeout(clearTransactions, 2000)
        refetchSelectedCommodity()
        await transactionQuery.refetch();
    };

    const clearTransactions = () => {
        setPendingTransactions([]);
        writeTransactionsToLocal([])
    }

    const refetchSelectedCommodity = () => {
        let selected = selectedCommodity;
        setSelectedCommodity(null);
        setSelectedCommodity(selected);
    }

    const addTransaction = async (transaction) => {
        setSubmitDisabled(true);
        transaction.endBalance = commodityEndBalance;
        transaction.consumption = commodityConsumption;
        checkAvailability(transaction);
        addTransactionToPending(transaction);
        refetchSelectedCommodity()
        setSubmitDisabled(false);
    }

    const submitToDataValueSet = async (transaction) => {
        await submitEndBalance(transaction);
        await submitConsumption(transaction);
    };

    const submitEndBalance = async (transaction) => {
        console.log("Submitting end balance");
        let endBalance = transaction.endBalance;
        endBalance -= transaction.amount;
        await setEndBalance({
            period: currentPeriod,
            commodity: transaction.commodity.id,
            value: endBalance,
        });
    };

    const submitConsumption = async (transaction) => {
        console.log("Submitting consumption");
        let consumption = transaction.consumption;
        consumption += transaction.amount;
        await setConsumption({
            period: currentPeriod,
            commodity: transaction.commodity.id,
            value: consumption,
        });
    };

    const submitToDataStore = async (transaction) => {
        if (transactionQuery.data) {
            let { transactions } = transactionQuery.data;
            transactions.unshift(transaction);
            await updateTransactions({ transactions });
        } else {
            await createTransactionKey({ transaction });
        }
    };

    return (
        <div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gridGap: 20,
                }}
            >
                <TransactionForm
                    addTransaction={addTransaction}
                    amountLeft={commodityEndBalance}
                    commodityChanged={setSelectedCommodity}
                    requestHandler={requestHandler}
                    transactionCount={pendingTransactions.length}
                />
                <div>
                    <PendingTransactionTable
                        pendingTransactions={pendingTransactions}
                        onDelete={removeTransactionFromPending}
                    />
                    {
                        pendingTransactions.length > 0 && <div>
                            <Button
                                disabled={submitDisabled}
                                type="button"
                                primary
                                onClick={submitTransactions}
                            >
                                Submit Transaction
                            </Button>
                            <Button
                                disabled={submitDisabled}
                                type="button"
                                primary
                                onClick={clearTransactions}
                            >
                                Cancel Transaction
                            </Button>
                        </div>}
                </div>
            </div>
            <br/>
            <div>
                <TransactionTable transactions={transactionQuery.data?.transactions}/>
            </div>
            <br/>
        </div>
    );
}

export default Dispensing;
