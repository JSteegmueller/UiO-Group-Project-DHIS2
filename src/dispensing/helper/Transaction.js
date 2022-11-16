class Transaction {
    constructor(date, commodity, amount, dispensedBy, dispensedTo, transactionType) {
        this.date = date
        this.commodity = commodity
        this.amount = amount
        this.dispensedBy = dispensedBy
        this.dispensedTo = dispensedTo
        this.transactionType = transactionType
        this.endBalance = 0
        this.consumption = 0
        this.status = TransactionStatus.pending
    }
}

export const TransactionType = {
    dispense: "dispense"
}

export const TransactionStatus = {
    pending: "pending",
    submitting: "submitting",
    submitted: "submitted"
}

export default Transaction