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

export const saveFormToLocal = (amount, dispenseTo, commodity) => {
    localStorage.setItem(LocalKeys.Amount, amount)
    localStorage.setItem(LocalKeys.DispenseTo, dispenseTo)
    localStorage.setItem(LocalKeys.Commodity, JSON.stringify(commodity))
}

export const getFromLocal = (key) => {
    let value = localStorage.getItem(key)
    if (value && key === LocalKeys.Commodity) value = JSON.parse(value)
    if (!value && key === LocalKeys.DispenseTo) value = ""
    if (value === "null" && key === LocalKeys.Amount) value = null
    return value
}


export const LocalKeys = {
    Amount: "amount",
    Commodity: "commodity",
    DispenseTo: "dispenseTo"
}

