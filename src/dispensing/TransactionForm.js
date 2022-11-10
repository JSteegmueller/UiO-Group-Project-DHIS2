import React, {useEffect, useState} from "react";
import {Button, composeValidators, hasValue, InputFieldFF, NoticeBox, ReactFinalForm,} from "@dhis2/ui";
import {useDataQuery} from "@dhis2/app-runtime";
import {getAvailableCommoditiesQuery} from "./api/commodities";
import {remapCommoditiesForTransactionForm} from "./helper/HelperFunctions";
import {getMeQuery} from "./api/me";
import ReactSelectAdapter from "./helper/ReactSelectAdapter";
import Transaction, {TransactionType} from "./helper/Transaction";
import {FormAction, FormState} from "./helper/FormAction";

function TransactionForm(props) {
    const commoditiesRequest = useDataQuery(getAvailableCommoditiesQuery);
    const meQuery = useDataQuery(getMeQuery);
    const [formState, setFormState] = useState(FormState.initial);


    useEffect(() => {
        props.setCommodities(commoditiesRequest.data?.commodities)
    }, [commoditiesRequest.data])
    
    const submit = (formInput) => {
        if (formInput.action === FormAction.submit) props.onFormAction({action: formInput.action})

        let commodity = {
            name: formInput.commodity.label,
            id: formInput.commodity.value,
        };
        let amount = parseInt(formInput.action !== FormAction.add ?
            props.amountLeft : formInput.amount)
        let transaction = new Transaction(
            "",
            commodity,
            amount,
            meQuery.data?.me?.name,
            formInput.dispensedTo,
            TransactionType.dispense
        );
        props.onFormAction({transaction, action: formInput.action});
        if (formInput.action === FormAction.submit) setFormState(FormState.initial);
        else setFormState(FormState.commodityPending);
    };

    return (
        <ReactFinalForm.Form onSubmit={submit}>
            {({handleSubmit, form}) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    <ReactFinalForm.Field
                        name="commodity"
                        component={ReactSelectAdapter}
                        validate={composeValidators(hasValue)}
                        options={remapCommoditiesForTransactionForm(
                            commoditiesRequest.data?.commodities
                        )}
                        inputOnChange={(e) =>
                            props.commodityChanged({name: e.label, id: e.value})
                        }
                    ></ReactFinalForm.Field>
                    <ReactFinalForm.Field
                        name="amount"
                        label={
                            "Amount/" +
                            (props.amountLeft != null ? `In stock: ${props.amountLeft}` : "")
                        }
                        type="number"
                        placeholder="The amount you want to dispense"
                        component={InputFieldFF}
                        validate={composeValidators(hasValue)}
                    />
                    <ReactFinalForm.Field
                        name="dispensedTo"
                        label="Dispensed To"
                        placeholder="Name of whom you dispensed the commodity"
                        component={InputFieldFF}
                        validate={composeValidators(hasValue)}
                        disabled={formState === FormState.commodityPending}
                        initialValue="Alfred"
                    />
                    <br/>
                    <Button
                        type="submit"
                        primary
                        disabled={props.disabled}
                        onClick={() => {
                            form.change("action", FormAction.add);
                        }}
                    >
                        Add to Transaction
                    </Button>
                    <Button
                        type="submit"
                        primary
                        disabled={props.disabled || formState === FormState.initial}
                        onClick={() => {
                            form.change("action", FormAction.submit);
                        }}
                    >
                        Submit Transaction
                    </Button>
                    <Button
                        type="button"
                        primary
                        disabled={props.disabled || formState === FormState.initial}
                        onClick={() => {
                            props.reset();
                            setFormState(FormState.initial);
                        }}
                    >
                        Cancel Transaction
                    </Button>
                    {props.showCommodityRequest && (
                        <NoticeBox>
                            Not enough stock for {form?.getFieldState("commodity")?.value?.label}!
                            <br/>
                            <Button
                                type="submit"
                                onClick={() => {
                                    form.change("action", FormAction.check);
                                }}
                                primary
                                small
                            >
                                Submission & Commodity check
                            </Button>
                            <Button
                                type="submit"
                                onClick={() => {
                                    form.change("action", FormAction.addAmountLeft);
                                }}
                                secondary
                                small
                            >
                                Submission only
                            </Button>
                        </NoticeBox>
                    )}
                </form>
            )}
        </ReactFinalForm.Form>
    );
}

export default TransactionForm;
