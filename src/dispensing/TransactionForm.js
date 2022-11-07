import React from "react";
import {Button, composeValidators, hasValue, InputFieldFF, ReactFinalForm} from '@dhis2/ui'
import {useDataQuery} from "@dhis2/app-runtime";
import {getAvailableCommoditiesQuery} from "./api/commodities";
import {remapCommoditiesForTransactionForm} from "./helper/HelperFunctions";
import {getMeQuery} from "./api/me";
import ReactSelectAdapter from "./helper/ReactSelectAdapter";
import Transaction, {TransactionType} from "./helper/Transaction";


function TransactionForm(props) {
    const commoditiesRequest = useDataQuery(getAvailableCommoditiesQuery)
    const meQuery = useDataQuery(getMeQuery)

    const submit = (formInput) => {
        let commodity = {name: formInput.commodity.label, id: formInput.commodity.value}
        let transaction = new Transaction(
            Date.now(),
            commodity,
            parseInt(formInput.amount),
            formInput.dispensedBy,
            formInput.dispensedTo,
            TransactionType.dispense
        )
        props.submit(transaction)
    }

    return <ReactFinalForm.Form onSubmit={submit}>
        {({handleSubmit}) => (
            <form onSubmit={handleSubmit} autoComplete="off">
                <ReactFinalForm.Field
                    name="commodity"
                    component={ReactSelectAdapter}
                    validate={composeValidators(hasValue)}
                    options={remapCommoditiesForTransactionForm(commoditiesRequest.data?.commodities)}
                    inputOnChange={(e) => props.commodityChanged({name: e.label, id: e.value})}>
                </ReactFinalForm.Field>
                <ReactFinalForm.Field
                    name="amount"
                    label={"Amount/" + (props.amountLeft != null ? `In stock: ${props.amountLeft}` : "")}
                    type="number"
                    placeholder="The amount you want to dispense"
                    component={InputFieldFF}
                    validate={composeValidators(hasValue)}
                />
                <ReactFinalForm.Field
                    disabled
                    name="dispensedBy"
                    label="Dispensed By"
                    placeholder="Your name"
                    component={InputFieldFF}
                    validate={composeValidators(hasValue)}

                    initialValue={meQuery.data?.me?.name}
                />
                <ReactFinalForm.Field
                    name="dispensedTo"
                    label="Dispensed To"
                    placeholder="Name of whom you dispensed the commodity"
                    component={InputFieldFF}
                    validate={composeValidators(hasValue)}

                    initialValue="Alfred"
                />
                <br/>
                <Button type="submit" primary disabled={props.disabled}>
                    Submit
                </Button>
            </form>
        )}
    </ReactFinalForm.Form>
}

export default TransactionForm