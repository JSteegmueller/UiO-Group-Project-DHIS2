class Transaction {
    constructor(date, commodity, amount, dispensedBy, dispensedTo, transactionType) {
        this.date = date
        this.commodity = commodity
        this.amount = amount
        this.dispensedBy = dispensedBy
        this.dispensedTo = dispensedTo
        this.transactionType = transactionType
    }
}

export const TransactionType = {
    dispense: "dispense"
}

export default Transaction