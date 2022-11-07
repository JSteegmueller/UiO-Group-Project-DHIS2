export const getAvailableCommoditiesQuery = {
    commodities: {
        resource: "dataSets",
        id: process.env.REACT_APP_LSCOMMODITIES_SET,
        params: {
            fields: [
                "dataSetElements[dataElement[name,id]]"
            ]
        }
    }
}