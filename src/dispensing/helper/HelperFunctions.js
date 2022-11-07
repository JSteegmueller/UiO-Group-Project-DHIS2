export const remapCommoditiesForTransactionForm = (commodities) => {
    if (!commodities) return []

    let options = []
    let {dataSetElements} = commodities
    if (dataSetElements) {
        for (let {dataElement} of dataSetElements) {
            let name = dataElement.name.replace("Commodities - ", "")
            options.push({value: dataElement.id, label: name})
        }
    }
    options.sort((a, b) => a.label.localeCompare(b.label))
    return options
}

export const getCurrentPeriod = () => {
    let now = new Date()
    return now.toISOString().slice(0, 8).replace(/-/g, "")
}