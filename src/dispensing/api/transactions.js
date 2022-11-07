const createTransactionKeyMutation = {
    resource: 'dataStore/IN5320-G3/transactions',
    type: "create",
    data: ({transaction}) => [transaction]
}

const deleteTransactionKeyMutation = {
    resource: "dataStore/IN5320-G3/transactions",
    type: "delete"
}

const updateTransactionsMutation = {
    resource: "dataStore/IN5320-G3/transactions",
    type: "update",
    data: ({transactions}) => transactions
}

const getTransactionsQuery = {
    transactions: {
        resource: "dataStore",
        id: "IN5320-G3/transactions"
    }
}

export {
    createTransactionKeyMutation,
    deleteTransactionKeyMutation,
    updateTransactionsMutation,
    getTransactionsQuery
}