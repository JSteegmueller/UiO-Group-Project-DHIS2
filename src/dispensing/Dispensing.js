import React, {useEffect, useState} from "react";
import TransactionForm from "./TransactionForm";
import TransactionTable from "./TransactionTable";
import {useDataMutation, useDataQuery} from "@dhis2/app-runtime";
import {createTransactionKeyMutation, getTransactionsQuery, updateTransactionsMutation} from "./api/transactions";
import {getConsumptionQuery, getEndBalanceQuery, setConsumptionMutation, setEndBalanceMutation} from "./api/dataValues"
import {getCurrentPeriod} from "./helper/HelperFunctions";


function Dispensing() {
    const onConsumptionQueryError = (error) => {
        let {httpStatusCode} = error.details
        if (httpStatusCode !== 409) {
            let message = `Error fetching consumption for commodity ${selectedCommodity.name} in period ${currentPeriod}`
            alert(message)
            setSubmitDisabled(true)
        }
        setCommodityConsumption(0)
    }
    const onConsumptionQuerySuccess = (data) => {
        setCommodityConsumption(parseInt(data.consumption))
    }

    const onBalanceQueryError = (error) => {
        let {httpStatusCode} = error.details
        if (httpStatusCode === 409) {
            let message = `No stock data for commodity ${selectedCommodity.name} in period ${currentPeriod}!`
            alert(message)
        } else {
            let message = `Error fetching end balance for commodity ${selectedCommodity.name} in period ${currentPeriod}`
            alert(message)
        }
        setSubmitDisabled(true)
    }
    const onBalanceQuerySuccess = (data) => {
        setCommodityEndBalance(parseInt(data.endBalance))
    }


    const transactionQuery = useDataQuery(getTransactionsQuery)
    const endBalanceQuery = useDataQuery(getEndBalanceQuery,
        {
            onComplete: onBalanceQuerySuccess,
            onError: onBalanceQueryError,
            lazy: true
        })
    const consumptionQuery = useDataQuery(getConsumptionQuery,
        {
            onComplete: onConsumptionQuerySuccess,
            onError: onConsumptionQueryError,
            lazy: true
        })

    const [createTransactionKey, {}] = useDataMutation(createTransactionKeyMutation)
    const [updateTransactions, {}] = useDataMutation(updateTransactionsMutation)
    const [setEndBalance, {}] = useDataMutation(setEndBalanceMutation)
    const [setConsumption, {}] = useDataMutation(setConsumptionMutation)

    const [commodityEndBalance, setCommodityEndBalance] = useState(null)
    const [commodityConsumption, setCommodityConsumption] = useState(null)
    const [selectedCommodity, setSelectedCommodity] = useState(null)
    const [submitDisabled, setSubmitDisabled] = useState(false)
    const [currentPeriod, setCurrentPeriod] = useState(getCurrentPeriod())

    useEffect(() => {
        if (!selectedCommodity) return
        endBalanceQuery.refetch({commodity: selectedCommodity.id, period: currentPeriod})
        consumptionQuery.refetch({commodity: selectedCommodity.id, period: currentPeriod})
        setSubmitDisabled(false)
    }, [selectedCommodity])


    const submitTransaction = async (transaction) => {
        setSubmitDisabled(true)
        try {
            await submitToDataValueSet(transaction)
            await submitToDataStore(transaction);
            await transactionQuery.refetch()
        } catch (e) {
            setSubmitDisabled(false)
            throw e
        }
        let selected = selectedCommodity
        setSelectedCommodity(null)
        setSelectedCommodity(selected)
        setSubmitDisabled(false)
    }

    const submitToDataValueSet = async (transaction) => {
        let {commodity, amount} = transaction
        await submitEndBalance(commodity, amount)
        await submitConsumption(commodity, amount)
    }

    const submitEndBalance = async (commodity, amount) => {
        console.log("Submitting end balance")
        let endBalance = commodityEndBalance
        endBalance -= amount
        if (endBalance < 0) {
            let message = `Not enough stock for ${commodity.name} in period ${currentPeriod}!`
            alert(message)
            throw new Error(message)
        }
        await setEndBalance({period: currentPeriod, commodity: commodity.id, value: endBalance})
    }

    const submitConsumption = async (commodity, amount) => {
        console.log("Submitting consumption")
        let consumption = commodityConsumption
        consumption += amount
        await setConsumption({period: currentPeriod, commodity: commodity.id, value: consumption})
    }
    
    const submitToDataStore = async (transaction) => {
        if (transactionQuery.data) {
            let {transactions} = transactionQuery.data
            transactions.unshift(transaction)
            await updateTransactions({transactions})
        } else {
            await createTransactionKey({transaction})
        }
    }

    return (
        <div>
            <TransactionForm submit={submitTransaction}
                             amountLeft={commodityEndBalance}
                             commodityChanged={setSelectedCommodity}
                             disabled={submitDisabled}/>
            <br/>
            <TransactionTable
                transactions={transactionQuery.data?.transactions}/>
            <br/>
        </div>

    );

}

export default Dispensing;