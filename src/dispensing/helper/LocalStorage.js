export const writeTransactionsToLocal = (transactions) => {
    if (transactions) {
        localStorage.setItem("pendingTransactions", JSON.stringify(transactions))
    }
}

export const readTransactionsFromLocal = () => {
    let transactions = []
    let localStorageTransactions = localStorage.getItem("pendingTransactions")
    if (localStorageTransactions) {
        transactions = JSON.parse(localStorageTransactions)
    }
    return transactions
}